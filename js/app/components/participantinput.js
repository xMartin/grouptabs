define([
  'react',
  './participantstatusinput'
],

function (React, ParticipantStatusInput) {
  'use strict';

  var el = React.createElement;

  return React.createClass({

    // status:
    //   0: none
    //   1: joined
    //   2: paid

    getInitialState: function () {
      return {
        status: 0
      };
    },

    render: function () {
      return (
        React.createElement('div', {className: 'participantInput' + (this.state.status > 0 ? ' selected' : '')},
          React.createElement('span', {className: 'participant'},
            this.props.participant
          ),
          el(ParticipantStatusInput, {
            status: this.state.status,
            amount: this.props.value && this.props.value.amount || '',
            handleJoinedChange: this.handleJoinedChange,
            handlePaidChange: this.handlePaidChange,
            ref: 'status'
          })
        )
      );
    },

    componentWillMount: function () {
      if (this.props.value) {
        if (this.props.value.amount) {
          this.setState({status: 2});
        } else {
          this.setState({status: 1});
        }
      }
    },

    handleJoinedChange: function () {
      if (this.state.status === 0) {
        this.setState({status: 1});
      } else {
        this.setState({status: 0});
      }
    },

    handlePaidChange: function () {
      if (this.state.status < 2) {
        this.setState({status: 2});
        setTimeout(function(){
          this.refs.status.focusAmount();
        }.bind(this));
      } else {
        this.setState({status: 1});
      }
    },

    getValue: function () {
      if (this.state.status === 0) {
        return null;
      }
      return {
        participant: this.props.participant,
        amount: this.state.status === 2 ? this.refs.status.getAmount() : 0
      };
    },

    setJoined: function () {
      if (this.state.status === 0) {
        this.setState({status: 1});
      }
    }

  });

});
