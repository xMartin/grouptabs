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

    displayName: 'ParticipantInput',

    propTypes: {
      participant: PropTypes.string.isRequired,
      value: PropTypes.object
    },

    // status:
    //   0: none
    //   1: joined
    //   2: paid

    getInitialState: function () {
      return {
        status: 0
      };
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
        this.setState({status: 2}, this.refs.status.focusAmount);
      } else {
        this.setState({status: 1});
      }
    },

    getValue: function () {
      var amount = this.state.status === 2 ? this.refs.status.getAmount() : 0;

      return {
        participant: this.props.participant,
        status: this.state.status,
        amount: amount
      };
    },

    setJoined: function () {
      if (this.state.status === 0) {
        this.setState({status: 1});
      }
    },

    render: function () {
      return (
        React.createElement('div', {className: 'participantInput' + (this.state.status > 0 ? ' selected' : '')},
          React.createElement('span', {className: 'participant'},
            this.props.participant
          ),
          el(ParticipantStatusInput, {
            status: this.state.status,
            amount: this.props.value && this.props.value.amount || undefined,
            handleJoinedChange: this.handleJoinedChange,
            handlePaidChange: this.handlePaidChange,
            ref: 'status'
          })
        )
      );
    }

  });

});
