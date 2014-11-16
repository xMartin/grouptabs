define([
  'react',
  './participantstatusinput'
],

function (React, ParticipantStatusInputClass) {
  'use strict';

  var ParticipantStatusInput = React.createFactory(ParticipantStatusInputClass);

  return React.createClass({

    // status:
    //   0: none
    //   1: joined
    //   2: paid

    getInitialState: function () {
      return {
        status: 1
      };
    },

    render: function () {
      return (
        React.createElement('div', {className: 'newParticipantInput' + (this.state.status > 0 ? ' selected' : '')},
          React.createElement('span', {className: 'participant'},
            React.createElement('input', {type: 'text', placeholder: 'Name …', ref: 'participant'})
          ),
          new ParticipantStatusInput({
            status: this.state.status,
            handleJoinedChange: this.handleJoinedChange,
            handlePaidChange: this.handlePaidChange,
            ref: 'status'
          })
        )
      );
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
      var participant = this.refs.participant.getDOMNode().value.trim();
      if (!participant) {
        return null;
      }
      return {
        participant: participant,
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
