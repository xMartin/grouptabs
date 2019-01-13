define([
  'react',
  'create-react-class',
  'pure-render-mixin',
  'prop-types',
  '../util/date',
  './directtransactioninput',
  './participantsinputlist'
],

function (React, createReactClass, PureRenderMixin, PropTypes, dateUtils, DirectTransactionInput, ParticipantsInputList) {
  'use strict';

  var el = React.createElement;

  return createReactClass({
    mixins: [PureRenderMixin],

    displayName: 'Form',

    propTypes: {
      mode: PropTypes.oneOf(['new', 'edit']).isRequired,
      data: PropTypes.object,
      participants: PropTypes.arrayOf(PropTypes.string).isRequired,
      onSubmit: PropTypes.func.isRequired,
      onDelete: PropTypes.func.isRequired
    },

    getInitialState: function () {
      var newParticipantsIds = [];
      if (this.props.participants.length < 2) {
        newParticipantsIds.push(this.createUniqueId());
        newParticipantsIds.push(this.createUniqueId());
      }
      return {
        transactionType: this.props.mode === 'edit' ? this.props.data.transactionType : 'SHARED',
        newParticipantsIds: newParticipantsIds
      };
    },

    componentDidMount: function () {
      if (this.props.mode === 'new') {
        this.refs.description.focus();
      }
    },

    createUniqueId: function () {
      return '' + Math.round(Math.random() * 100000000);
    },

    formatDate: function (date) {
      date = date || new Date();
      var month = date.getMonth() + 1;
      month = month < 10 ? '0' + month : month;
      var day = date.getDate();
      day = day < 10 ? '0' + day : day;
      return '' + date.getFullYear() + '-' + month + '-' + day;
    },

    getValues: function () {
      return {
        date: this.refs.date.value,
        description: this.refs.description.value,
        transactionType: this.state.transactionType,
        participants: this.refs.participantsInputList.getValues(),
        direct: this.refs.directTransactionInput.getValues()
      };
    },

    handleAddParticipant: function () {
      this.setState({
        newParticipantsIds: this.state.newParticipantsIds.concat(this.createUniqueId())
      }, function () {
        this.refs.participantsInputList.focusLastInput();
      }.bind(this));
    },

    handleAllJoined: function () {
      this.refs.participantsInputList.setAllJoined();
    },

    handleDelete: function () {
      if (confirm('Do you really want to delete the transaction?')) {
        this.props.onDelete();
      }
    },

    handleSelectTransactionType: function (event) {
      var transactionType = event.currentTarget.value;
      this.setState({
        transactionType: transactionType
      });
    },

    render: function () {
      var mode = this.props.mode;

      return (
        el('form', {id: 'edit-entry-form', onSubmit: this.props.onSubmit},
          el('div', {className: 'form'},
            el('div', {className: 'form-row'},
              el('div', {className: 'form-row-input description'},
                el('input', {
                  type: 'text',
                  placeholder: 'Description',
                  defaultValue: mode === 'edit' ? this.props.data.description : '',
                  ref: 'description'
                })
              ),
              el('div', {className: 'form-row-input transaction-type'},
                el('select', {onChange: this.handleSelectTransactionType, defaultValue: this.state.transactionType},
                  el('option', {value: 'SHARED'}, 'Shared'),
                  el('option', {value: 'DIRECT'}, 'Direct')
                )
              )
            ),
            el('div', {className: 'form-row'},
              el('div', {className: 'form-row-input'},
                el('input', {
                  type: 'date',
                  defaultValue: this.formatDate(mode === 'edit' ? dateUtils.parseDate(this.props.data.date) : new Date()),
                  ref: 'date'
                })
              )
            ),
            el('div', {
              style: {display: this.state.transactionType === 'SHARED' ? 'none' : ''},
              className: 'form-row'
            },
              el(DirectTransactionInput, {
                ref: 'directTransactionInput',
                tabParticipants: this.props.participants,
                participants: mode === 'edit' ? this.props.data.participants : []
              })
            ),
            el('div', {
              style: {display: this.state.transactionType === 'DIRECT' ? 'none' : ''}
            },
              el(ParticipantsInputList, {
                ref: 'participantsInputList',
                mode: mode,
                tabParticipants: this.props.participants,
                participants: mode === 'edit' ? this.props.data.participants : [],
                newParticipantsIds: this.state.newParticipantsIds
              }),
              el('div', {className: 'form-row'},
                el('div', {className: 'form-row-input'},
                  el('button', {type: 'button', onClick: this.handleAddParticipant}, '+ new participant'),
                  el('button', {type: 'button', className: 'all-joined', onClick: this.handleAllJoined}, '✓ all joined')
                )
              )
            )
          ),
          el('div', {className: 'row' + (mode === 'edit' ? ' button-row' : '')},
            mode === 'edit' ?
              el('span', {className: 'fake-link delete', onClick: this.handleDelete}, 'Delete transaction')
              : null
          )
        )
      );
    }
  });

});
