import React from 'react';
import { Button, Card, Confirm, Divider, Grid, Header, Icon, Image, Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Scrollbars } from 'react-custom-scrollbars';
import PropTypes from 'prop-types';
import UserGoalsList from './UserGoalsList';
import ProgressBar from './ProgressBar';
import MainMenu from './MainMenu';
import * as homePageActions from '../actions/homePageActions';
import * as incubatorActions from '../actions/incubatorActions';
import * as squaddieActions from '../actions/squaddieActions';
import * as yardActions from '../actions/yardActions';
import firebase from '../firebase/index';

class IncubatorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      count: 3,
      firstTime: true,
      glowingEgg: false,
      notifiedOfPushNotifications: false,

    };
    this.subtractFromCount = this.subtractFromCount.bind(this);
    this.getGoals = this.getGoals.bind(this);
    this.show = this.show.bind(this);
    this.handlePushNotificationCancel = this.handlePushNotificationCancel.bind(this);
    this.handlePushNotificationConfirm = this.handlePushNotificationConfirm.bind(this);
  }

  componentDidMount() {
    if (this.props.state.user) {
      this.props.homePageActions.attemptLogin();
    }
    // get goals if user is logged in and there are no goals or is flagged for update
    if (this.props.state.user &&
      (!this.props.incubatorState.userGoals || this.props.incubatorState.needsUpdate)) {
      this.props.incubatorActions.getUserGoals();
      this.props.incubatorActions.fetchEggStatus();
    }
    console.log('state', this.props.state)
  }

  getGoals() {
    return (
      <Grid
        textAlign="center"
        verticalAlign="middle"
        style={{ height: '100%' }}
      >
        <Grid.Column computer={8} mobile={16}>
          <Grid.Row>
            <Header size="large" className="white">Oh no!</Header>
            <Divider hidden />
          </Grid.Row>
          <Grid.Row>
            <Image size="small" src="./assets/squaddies/scuttlebutt.png" centered />
            <Divider hidden />
          </Grid.Row>
          <Grid.Row>
            <Header size="medium" className="white">
                You need some goals! Let's add some.
            </Header>
            <Divider hidden />
          </Grid.Row>
          <Grid.Row>
            <Button basic inverted onClick={() => { this.props.history.push('/goals'); }}>
              <Button.Content visible>Add goals</Button.Content>
            </Button>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }

  glowingEggActivated() {
    return this.state.glowingEgg ? 'glowingEgg' : '';
  }

  subtractFromCount() {
    if (this.state.count === 0) {
      this.setState({ count: 3, firstTime: true, newSquaddie: true });
      // setTimeout(() => {
      //   this.props.incubatorActions.fetchEggStatus()
      // }, 2000);
    }
    this.setState(prevState => ({ count: prevState.count - 1, glowingEgg: false }));
  }

  hatchTheEggDrWu() {
    const { incubatorState } = this.props;
    this.props.incubatorActions.hatchEgg(incubatorState.egg.user_egg_id, incubatorState.egg.egg_xp - 100);
    setTimeout(() => {
      this.props.yardActions.fetchSquaddies();
    }, 2000);
    setTimeout(() => {
      this.props.squaddieActions.toggleYardStatus(this.props.yardState.newSquaddie.monster_id);
    }, 2000);
    this.setState({ firstTime: false, glowingEgg: true });
  }

  openEggModal() {
    if (this.props.incubatorState.egg.egg_xp >= 100 && this.state.firstTime) this.hatchTheEggDrWu();
    const classByCount = {
      1: 'eggClass1',
      2: 'eggClass2',
      3: 'eggClass3',
    };
    const pictureByCount = {
      1: './assets/icons/egg_stage_3.png',
      2: './assets/icons/egg_stage_2.png',
      3: './assets/icons/egg_stage_1.png',
    };
    const squaddie = this.props.yardState.newSquaddie;
    return (
      this.props.incubatorState.egg.egg_xp >= 100
        ?
          <Modal
            trigger={<a><Image className={this.glowingEggActivated()} src="./assets/icons/egg_stage_1.png" /></a>}
          >
            <Modal.Content style={{ background: 'transparent' }}>
              <Card centered>
                {this.state.count === 0 ? <Image src={squaddie.monster_pic} /> : <a><Image size="medium" className={classByCount[this.state.count]} onClick={this.subtractFromCount} src={pictureByCount[this.state.count]} centered /></a>}
                <Card.Content>
                  <Card.Header>
                    {this.state.count === 0 ? <p>Your new squaddie is {squaddie.monster_name}!</p> : <p>Tap {this.state.count} {this.state.count === 1 ? 'more time' : 'more times'} to reveal your new squaddie!</p> }
                  </Card.Header>
                  <Card.Description>
                    { this.state.count === 0 ? <p>Head over to  <a onClick={() => { this.props.history.push('/yard'); }}>your yard</a> for some well-deserved play time</p> : null }
                  </Card.Description>
                </Card.Content>
              </Card>
            </Modal.Content>
          </Modal>
        :
          <Image src="./assets/icons/egg_stage_1.png" centered />
    );
  }

  handlePushNotificationCancel() {
    // set push message notification  preference to false (and notification status to true) in DB
    this.props.homePageActions.updatePushNotificationsToFalse(this.props.state.user.id);
    // temporarily set push notification to true to remove button
    this.setState({ open: false, notifiedOfPushNotifications: true });
  }

  handlePushNotificationConfirm() {
    // set push notification preference and notification status to true in DB
    this.props.homePageActions.updatePushNotificationsToTrue(this.props.state.user.id);
    // temporarily set push notification to true to remove button
    this.setState({ open: false, notifiedOfPushNotifications: true });
    let messaging = firebase.messaging();
    messaging.getToken()
      .then((token) => {
        console.log('token', token)
      })
  }

  show() {
    this.setState({ open: true })
  }

  showPushNotificationButton() {
    return (
      this.props.state.user.notified_of_push_notifications
      ? null
      : <div>
          <Button onClick={this.show}>Enable Push Notifications</Button>
          <Confirm
            open={this.state.open}
            content='Would you like to receive occassional but super helpful push notifcations?'
            onCancel={this.handlePushNotificationCancel}
            onConfirm={this.handlePushNotificationConfirm}
          />
        </div>
    )
  }

  render() {
    return (
      <div className="incubatorpage">
        {this.state.notifiedOfPushNotifications
          ? null
          : this.showPushNotificationButton()
        }
        <Header as="h1" className="white" textAlign="right">Your Goals</Header>
        <Divider hidden />
        <Grid centered>
          <Grid.Column computer={8} mobile={16}>
            <Scrollbars autoHide style={{ height: '75vh' }}>
              {Object.keys(this.props.incubatorState.userGoals).length > 0
                ? Object.keys(this.props.incubatorState.userGoals).map(activity => (
                  <UserGoalsList
                    key={activity}
                    activityType={activity}
                    goals={this.props.incubatorState.userGoals[activity]}
                  />
              ))
                : this.getGoals()
              } {/* renders list of goals for each activity type */}
            </Scrollbars>
          </Grid.Column>
          <Grid.Row
            columns={2}
            verticalAlign="top"
            style={{ position: 'fixed', bottom: 0, padding: 1 }}
          >
            <Grid.Column width={3}>
              {this.openEggModal()}
            </Grid.Column>
            <Grid.Column width={13}>
              <ProgressBar
                history={this.props.history}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <MainMenu history={this.props.history} />
      </div>
    );
  }
}

IncubatorPage.propTypes = {
  state: PropTypes.shape({
    needsUpdate: PropTypes.bool, // really bool 0/1
    user: PropTypes.object,
  }).isRequired,
  incubatorState: PropTypes.shape({
    userGoals: PropTypes.object,
    needsUpdate: PropTypes.bool,
    egg: PropTypes.object,
  }).isRequired,
  yardState: PropTypes.objectOf({
    yardSquaddies: PropTypes.object,
  }).isRequired,
  incubatorActions: PropTypes.objectOf(PropTypes.func).isRequired,
  homePageActions: PropTypes.objectOf(PropTypes.func).isRequired,
  yardActions: PropTypes.objectOf(PropTypes.func).isRequired,
  squaddieActions: PropTypes.objectOf(PropTypes.func).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

const mapDispatchToProps = dispatch => (
  {
    homePageActions: bindActionCreators(homePageActions, dispatch),
    incubatorActions: bindActionCreators(incubatorActions, dispatch),
    squaddieActions: bindActionCreators(squaddieActions, dispatch),
    yardActions: bindActionCreators(yardActions, dispatch),
  }
);

const mapStateToProps = state => (
  {
    state: state.main,
    yardState: state.yard,
    incubatorState: state.incubator,
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(IncubatorPage);

