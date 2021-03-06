import React from 'react';
import {connect} from 'react-redux'
import * as actions from '../actions';

class AuthContainer extends React.Component {

  componentDidMount() {
    if (!this.props.user || !this.props.user.isAuthenticated) {
      this.props.getUser();
    }
  }

  render() {
    return this.props.children;
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, actions)(AuthContainer);
