import React from 'react';
import { Header, Statistic, Grid, Button, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as incubatorActions from './incubatorActions';
import GoalDetailModal from './GoalDetailModal';

class UserGoal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      activityName: props.goal.goal_name.split(' ').pop(),
    };

    this.makeDeadLineMessage = this.makeDeadLineMessage.bind(this);
    this.goalStatus = this.goalStatus.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  adjustForCentralTime(endDate) {
    let deadline = moment(endDate);
    let adjustedDeadline = deadline.subtract(5, 'hours');

    if(adjustedDeadline < 0) {
      return deadline;
    } else {
      return adjustedDeadline;
    }
  }

  makeDeadLineMessage() {
    const { goal } = this.props;
    if (goal.user_goal_end_date && !goal.user_goal_concluded) {
      const now = moment();
      const deadline = this.adjustForCentralTime(goal.user_goal_end_date);
      const days = deadline.diff(now, 'days');
      if (days >= 1) {
        return `${(days + 1)} days left!`; // plus 1 because diff uses 'floor'
      }
      const hours = deadline.diff(now, 'hours');
      if (hours >= 1) {
        return `${(hours + 1)} hours left!`;
      }
      return `${deadline.diff(now, 'minutes') + 1} minutes left!`;
    }
    return '';
  }

  goalStatus() {
    const { goal } = this.props;
    if (goal.user_goal_concluded) {
      if (goal.user_goal_success) {
        return (
          <Button
            basic
            color="green"
            onClick={() => {
              this.props.incubatorActions.markGoalSuccess(goal.user_goal_id);
            }}
          >
            Goal Success! Click to activate.
          </Button>
        );
      }
      return (
        <Button
          basic
          color="red"
          onClick={() => { this.props.incubatorActions.markGoalFailure(goal.user_goal_id); }}
        >
          Goal Failed :(
        </Button>);
    }

    return ( // goal has neither been completed nor expired
      <Statistic
        floated="right"
        size="mini"
      >
        <Statistic.Value>
          {goal.user_goal_target - goal.user_goal_current}
          <br />
          {this.state.activityName}
        </Statistic.Value>
        <Statistic.Label>
          to go!
        </Statistic.Label>
      </Statistic>
    );
  }

  close() {
    this.setState({ open: false });
  }

  open() {
    if (!this.props.goal.user_goal_concluded) {
      this.setState({ open: true });
    }
  }

  render() {
    const { open, dimmer, size } = this.state;
    const { goal } = this.props;
    return (
      <div>
        <Grid onClick={this.open}>
          <Grid.Row columns={3}>
            <Grid.Column width={9}>
              <Header as="h4">{goal.goal_name}</Header>
              {/* generate time until expiration or '' if no deadline */}
              {this.makeDeadLineMessage()}
            </Grid.Column>
            <Grid.Column width={5}>
              {/* show amount of activity left or button to close out old goal */}
              {this.goalStatus()}
            </Grid.Column>
            <Grid.Column width={2} floated="right" verticalAlign="middle">
              <Icon name="chevron right" fitted />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <GoalDetailModal
          size={size}
          dimmer={dimmer}
          open={open}
          goal={goal}
          goalProgress={goal.user_goal_target - goal.user_goal_current}
          className="fadeIn"
          close={this.close}
        />
      </div>
    );
  }
}

UserGoal.propTypes = {
  // state: PropTypes.shape({
  //   user: PropTypes.object,
  // }).isRequired,
  goal: PropTypes.shape({
    goal_id: PropTypes.number,
    user_goal_id: PropTypes.number,
    goal_name: PropTypes.string,
    goal_difficulty: PropTypes.string,
    goal_points: PropTypes.string,
    goal_timedivisor: PropTypes.number,
    goal_activity: PropTypes.string,
    user_goal_concluded: PropTypes.number, // really bool 0/1
  }).isRequired,
  incubatorActions: PropTypes.objectOf(PropTypes.func).isRequired,
};

const mapStateToProps = state => (
  { state: state.main }
);

const mapDispatchToProps = dispatch => (
  { incubatorActions: bindActionCreators(incubatorActions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(UserGoal);
