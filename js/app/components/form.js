define([
  'react',
  'create-react-class',
  'pure-render-mixin',
  'prop-types',
  './participantsinputlist'
],

function (React, createReactClass, PureRenderMixin, PropTypes, ParticipantsInputList) {
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
        participants: this.refs.participantsInputList.getValues()
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
                  defaultValue: this.formatDate(mode === 'edit' ? new Date(this.props.data.date) : new Date()),
                  ref: 'date'
                })
              )
            ),
            el('div', {
              style: {display: this.state.transactionType === 'SHARED' ? 'none' : ''},
              className: 'form-row direct-transaction'
            },
              el('select', null,
                el('option', null, 'Martin'),
                el('option', null, 'Jan'),
                el('option', null, 'Giorgia'),
                el('option', null, 'Regina'),
                el('option', null, 'Tobi'),
                el('option', null, 'Vicy'),
                el('option', null, '+ New participant')
              ),
              el('div', {className: ''},
                el('svg', {height: 16, width: 16},
                  el('path', {d: 'm8.5 0.5c-0.8974 0-1.3404 1.0909-0.6973 1.7168l4.7837 4.7832h-11.573c-1.3523-0.019125-1.3523 2.0191 0 2h11.572l-4.7832 4.7832c-0.98163 0.94251 0.47155 2.3957 1.4141 1.4141l6.4911-6.49c0.387-0.3878 0.391-1.0228 0-1.414l-6.4906-6.4903c-0.1883-0.1935-0.4468-0.30268-0.7168-0.3027z'})
                ),
                el('input', {
                  type: 'number',
                  placeholder: '0'
                })
              ),
              el('select', null,
                el('option', null, 'Martin'),
                el('option', null, 'Jan'),
                el('option', null, 'Giorgia'),
                el('option', null, 'Regina'),
                el('option', null, 'Tobi'),
                el('option', null, 'Vicy'),
                el('option', null, '+ New participant')
              )
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
