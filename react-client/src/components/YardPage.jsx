import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Scrollbars } from 'react-custom-scrollbars';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import * as actions from '../actions/actions';
import * as squaddieActions from '../actions/squaddieActions';
import * as yardActions from '../actions/yardActions';
import MainMenu from './MainMenu';
import YardSquaddie from './YardSquaddie';

const background = {
  width: 900,
  height: '100%',
  backgroundImage: 'url(./assets/backgrounds/yard_mobile_background.png)',
  backgroundSize: 'cover',
};


class YardPage extends React.Component {
  componentDidMount() {
    this.props.squaddieActions.getYardSquaddies();
  }

  render() {
    return (
      <div className="yardpage">
        <Scrollbars>
          <div
            style={background}
          >
            {this.props.squadState.yardSquaddies.map(squaddie => (
              <YardSquaddie
                key={squaddie.monster_name}
                squaddie={squaddie}
              />))};
          </div>
        </Scrollbars>
        <MainMenu history={this.props.history} />
        {/* <Button
          style={{ top: 20, right: 20, position: 'fixed' }}
          content="Save"
          size="large"
          color="orange"
        /> */}
      </div>
    );
  }
}

YardPage.propTypes = {
  squadState: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  squaddieActions: PropTypes.objectOf(PropTypes.func).isRequired,
  yardActions: PropTypes.objectOf(PropTypes.func).isRequired,
  history: PropTypes.shape({
    action: PropTypes.string,
    block: PropTypes.func,
    createHref: PropTypes.func,
    go: PropTypes.func,
    goBack: PropTypes.func,
    goForward: PropTypes.func,
    length: PropTypes.number,
    listen: PropTypes.func,
    location: PropTypes.object,
    push: PropTypes.func,
    replace: PropTypes.func,
  }).isRequired,
};

const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators(actions, dispatch),
    squaddieActions: bindActionCreators(squaddieActions, dispatch),
    yardActions: bindActionCreators(yardActions, dispatch),
  }
);

const mapStateToProps = state => (
  {
    state: state.main,
    squadState: state.squad,
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(YardPage);
