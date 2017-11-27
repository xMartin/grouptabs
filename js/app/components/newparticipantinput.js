define([
  'react',
  'create-react-class',
  'pure-render-mixin',
  'prop-types',
  './participantstatusinput'
],

function (React, createReactClass, PureRenderMixin, PropTypes, ParticipantStatusInput) {
  'use strict';

  var el = React.createElement;

  return createReactClass({
    mixins: [PureRenderMixin],

    displayName: 'NewParticipantInput',

    // status:
    //   0: none
    //   1: joined
    //   2: paid

    getInitialState: function () {
      return {
        status: 1
      };
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
      var participant = this.refs.participant.value.trim();
      var amount = this.state.status === 2 ? this.refs.status.getAmount() : 0;

      return {
        participant: participant,
        status: this.state.status,
        amount: amount
      };
    },

    setJoined: function () {
      if (this.state.status === 0) {
        this.setState({status: 1});
      }
    },

    focusParticipantInput: function () {
      this.refs.participant.focus();
    },

    render: function () {
      return (
        el('div', {className: 'newParticipantInput' + (this.state.status > 0 ? ' selected' : '')},
          el('span', {className: 'participant'},
            el('input', {type: 'text', placeholder: 'Name …', ref: 'participant'})
          ),
          el(ParticipantStatusInput, {
            status: this.state.status,
            handleJoinedChange: this.handleJoinedChange,
            handlePaidChange: this.handlePaidChange,
            ref: 'status'
          })
        )
      );
    }

  });

});
