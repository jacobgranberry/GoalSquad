import React from 'react';
import { Grid, Button, Image, Modal, Input, Divider, Segment, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as homePageActions from './homePageActions';
import * as actions from '../actions';
import FitbitWarning from './FitbitWarning';

const buttonstyles = {
  backgroundImage: 'linear-gradient(to right, #d95a37, #df663e, #e67146, #ec7d4e, #f28857)',
  marginTop: 20,
  borderRadius: '2rem',
};

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      username: '',
      password: '',
      type: '',
      errorMessage: '',
      fitbit: false,
    };
    this.close = this.close.bind(this);
    this.openSignUp = this.openSignUp.bind(this);
    this.openLogin = this.openLogin.bind(this);
    this.submit = this.submit.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.closeFitbit = this.closeFitbit.bind(this);
  }

  componentWillMount() {
    if (!this.props.state.user.user_id) {
      this.props.homePageActions.attemptLogin();
    }
  }

  componentDidUpdate() {
    if (this.props.state.user.user_id) {
      this.props.history.push('/incubator');
    }
  }

  close() { this.setState({ open: false }); }

  openLogin() {
    this.setState({
      open: true, type: 'Log In', fitbit: false, errorMessage: '',
    });
  }

  openSignUp() {
    console.log('open signup');
    this.setState({
      open: true, type: 'Sign Up', fitbit: false, errorMessage: '',
    });
  }

  closeFitbit() {
    this.setState({
      fitbit: false,
    });
  }

  updatePassword(event) { this.setState({ password: event.target.value }); }

  updateUsername(event) { this.setState({ username: event.target.value }); }

  submit(e) {
    e.preventDefault();
    if (this.state.type === 'Sign Up') {
      if (this.state.username.length > 4) {
        if (this.state.password.length > 3) {
          this.props.homePageActions.localSignup(this.state.username, this.state.password);
        } else {
          this.setState({ errorMessage: 'password must be at least 4 characters!' });
        }
      } else {
        this.setState({ errorMessage: 'username must be at least 5 characters!' });
      }
    } else if (this.state.username.length > 0 && this.state.password.length > 0) {
      this.props.homePageActions.localLogin(this.state.username, this.state.password);
    }
  }

  render() {
    const {
      open, dimmer, size,
    } = this.state;

    return (
      <div className="homepage">
        <Grid
          textAlign="center"
          verticalAlign="middle"
          style={{ height: '100%' }}
        >
        <Grid.Row columns={1} only="computer">
        {/* <Grid.Column>
          <Segment
            style={{ height: 400, width: 360, marginLeft: 150, backgroundImage: buttonstyles.backgroundImage }}
          >
          <Header as="h2" className="white">Best viewed on mobile!</Header>
          </Segment>
        </Grid.Column> */}
        <Grid.Column width={5}>
            <iframe
              style={{height: '90% !important'}}
              src="https://www.goalsquadgame.com"
            />
        </Grid.Column>
        {/* <Grid.Column/> */}
        </Grid.Row>
          <Grid.Column width={12} style={{ maxWidth: 450 }} only="tablet" only="mobile">
            <Image src="./assets/misc/logo.png" style={{ marginTop: 25 }} size="large" />
            <Button
              onClick={() => { this.setState({ fitbit: true }); }}
              fluid
              color="orange"
              size="large"
              style={buttonstyles}
            >CONNECT WITH FITBIT
            </Button>
            <Button
              onClick={this.openLogin}
              fluid
              color="orange"
              size="large"
              style={buttonstyles}
            >SIGN IN
            </Button>
            <Divider horizontal inverted>OR</Divider>
            <Button
              onClick={this.openSignUp}
              fluid
              color="orange"
              size="large"
              style={buttonstyles}
            >CREATE ACCOUNT
            </Button>
          </Grid.Column>
        </Grid>
        
        <FitbitWarning
          open={this.state.fitbit}
          close={this.closeFitbit}
          openSignUp={this.openSignUp}
        />
        <Modal
          size={size}
          dimmer={dimmer}
          open={open}
          onClose={this.close}
        >
          <Modal.Header>{this.state.type}</Modal.Header>
          <Modal.Content >
            <Modal.Description>
              <Grid relaxed>
                <Grid.Row centered>
                  <Input
                    value={this.state.username}
                    onChange={this.updateUsername}
                    style={{ width: '75%' }}
                    label={{ basic: true, content: 'username' }}
                    labelPosition="left"
                    type="text"
                  />
                </Grid.Row>
                <Grid.Row centered>
                  <Input
                    value={this.state.password}
                    onChange={this.updatePassword}
                    style={{ width: '75%' }}
                    label={{ basic: true, content: 'password' }}
                    labelPosition="left"
                    type="password"
                  />
                </Grid.Row>
              </Grid>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            {this.state.errorMessage} <br /> {this.props.state.user.loginErr}
            <Button color="grey" onClick={this.close}>
              Cancel
            </Button>
            <Button
              color="orange"
              icon="checkmark"
              labelPosition="right"
              content={this.state.type}
              onClick={this.submit}
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

HomePage.propTypes = {
  state: PropTypes.shape({
    user: PropTypes.object,
  }).isRequired,
  homePageActions: PropTypes.objectOf(PropTypes.func).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

const mapDispatchToProps = dispatch => ({
  homePageActions: bindActionCreators(homePageActions, dispatch),
  actions: bindActionCreators(actions, dispatch),
});

const mapStateToProps = state => ({ state: state.main });

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
