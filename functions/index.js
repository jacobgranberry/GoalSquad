const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotifications = functions.database.ref('/notifications/{notificationId}').onWrite((event) => {

  if (event.data.previous.val()) {
    return;
  }

  if (!event.data.exists()) {
    return;
  }

  // Setup notification
  const NOTIFICATION_SNAPSHOT = event.data;
  const payload = {
    notification: {
      title: 'You have a new message from Goal Squad!',
      /*body: NOTIFICATION_SNAPSHOT.val().message,*/
      body: 'This is a test message',
      icon: '../react-client/dist/assets/misc/logo.png',
      click_action: `https://${functions.config().firebase.authDomain}`
    }
  }

  function cleanInvalidTokens(tokensWithKey, results) {

    const invalidTokens = [];

    results.forEach((result, i) => {
      if ( !result.error ) return;

      console.error('Failure sending notification to', tokensWithKey[i].token, result.error);
      
      switch(result.error.code) {
        case "messaging/invalid-registration-token":
        case "messaging/registration-token-not-registered":
          invalidTokens.push( admin.database().ref('/tokens').child(tokensWithKey[i].key).remove() );
          break;
        default:
          break;
      }
    });

    return Promise.all(invalidTokens);
  }


  return admin.database().ref('/tokens').once('value').then((data) => {
    
    if ( !data.val() ) return;

    const snapshot = data.val();
    const tokensWithKey = [];
    const tokens = [];

    for (let key in snapshot) {
      tokens.push( snapshot[key].token );
      tokensWithKey.push({
        token: snapshot[key].token,
        key: key
      });
    }

    return admin.messaging().sendToDevice(tokens, payload)
      .then((response) => cleanInvalidTokens(tokensWithKey, response.results))
      .then(() => admin.database().ref('/notifications').child(NOTIFICATION_SNAPSHOT.key).remove())
  });
});