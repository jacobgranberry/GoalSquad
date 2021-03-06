import React from 'react';
import { Accordion, Icon, Segment, Grid, Header, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Scrollbars } from 'react-custom-scrollbars';
import PropTypes from 'prop-types';
import { getDefaultGoals } from './createGoalActions';
import Goal from './Goal';
import CustomGoal from './CustomGoal';
import MainMenu from '../MainMenu';

class GoalsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: -1,
    };
    this.handleClick = this.handleClick.bind(this);

    // goals only need to be fetched on first pageload
    if (!props.goalsState.standardGoals.length) {
      props.getDefaultGoals();
    }
  }

  handleClick(e, titleProps) {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state;
    const goalsList = this.props.goalsState.standardGoals;
    // show default goals for categories you don't have already have 2 active of
    const listItems = Object.keys(goalsList).map((category, categoryIndex) => {
      if (!this.props.userGoals[category] ||
        this.props.userGoals[category].length < 2) {
        return (
          <Accordion key={category} styled fluid>
            <Accordion.Title
              active={activeIndex === categoryIndex}
              index={categoryIndex}
              onClick={this.handleClick}
            >
              <Icon name="dropdown" />
              {category}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === categoryIndex}>
              <Segment.Group raised>
                {goalsList[category].map(singleGoal => (
                  <Goal
                    goal={singleGoal}
                    history={this.props.history}
                    key={singleGoal.goal_id}
                  />
                ))}
              </Segment.Group>
            </Accordion.Content>
          </Accordion>
        );
      }
      return (<div key={category} />);
    });

    return (
      <div className="goalspage">
        <Grid centered>
          <Grid.Row verticalAlign="bottom" columns={2}>
            <Grid.Column mobile={8} tablet={7} computer={4}>
              <MainMenu history={this.props.history} />
            </Grid.Column>
            <Grid.Column mobile={8} tablet={7} computer={4}>
              <Header as="h1" className="white" textAlign="right">Add A Goal</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Column computer={8} tablet={10} mobile={16}>
            <Scrollbars autoHide style={{ height: '85vh' }}>
              <Header as="h3" className="white" textAlign="center">Available Categories</Header>
              {this.props.goalsState.isLoading ? <Loader active size="medium" inline="centered" /> : listItems }
              <Header as="h4" className="white" textAlign="center">
                To free up categories, complete existing goals!
              </Header>
              <CustomGoal history={this.props.history} />
            </Scrollbars>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

GoalsPage.propTypes = {
  userGoals: PropTypes.objectOf(PropTypes.array).isRequired,
  goalsState: PropTypes.shape({
    isLoading: PropTypes.bool,
    standardGoals: PropTypes.object,
  }).isRequired,
  getDefaultGoals: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

const mapDispatchToProps = dispatch => (
  {
    getDefaultGoals: bindActionCreators(getDefaultGoals, dispatch),
  }
);

const mapStateToProps = state => (
  {
    goalsState: state.goals,
    userGoals: state.incubator.userGoals,
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(GoalsPage);
