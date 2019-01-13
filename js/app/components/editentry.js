define([
  'react',
  'create-react-class',
  'pure-render-mixin',
  'prop-types',
  '../lang/iobject',
  './loader',
  './form',
  './loaderror'
],

function (React, createReactClass, PureRenderMixin, PropTypes, iobject, Loader, Form, LoadError) {
  'use strict';

  var el = React.createElement;

  return createReactClass({
    mixins: [PureRenderMixin],

    displayName: 'EditEntry',

    propTypes: {
      mode: PropTypes.oneOf(['new', 'edit']).isRequired,
      data: PropTypes.object,
      participants: PropTypes.arrayOf(PropTypes.string).isRequired,
      checkingRemoteTab: PropTypes.bool,
      remoteTabError: PropTypes.string,
      importingTab: PropTypes.bool,
      onCloseClick: PropTypes.func.isRequired,
      onCreate: PropTypes.func.isRequired,
      onUpdate: PropTypes.func.isRequired,
      onDelete: PropTypes.func.isRequired,
      onChangeTabClick: PropTypes.func.isRequired
    },

    getValues: function () {
      return this.refs.form.getValues();
    },

    handleSubmit: function (event) {
      event.preventDefault();

      var data = this.getValues();

      if (!this.validate(data)) {
        alert('Please fill in all fields and have at least two participants and one person who paid.');
        return;
      }

      data.participants = this.normalizeParticipants(data.participants);

      data.transactionType = 'SHARED';
      data.timestamp = new Date().toJSON();
      if (this.props.data) {
        this.props.onUpdate(iobject.merge(this.props.data, data));
      } else {
        this.props.onCreate(data);
      }
    },

    normalizeParticipants: function (rawParticipants) {
      return (
        rawParticipants
        .filter(function (participant) {
          return participant.status > 0;
        })
        .map(function (participant) {
          return {
            participant: participant.participant,
            amount: participant.amount
          };
        })
      );
    },

    validate: function (data) {
      if (!data.description) {
        return false;
      }

      if (!data.date) {
        return false;
      }

      var joinedParticipants = data.participants.filter(function (participant) {
        return participant.status > 0;
      });

      if (joinedParticipants.length < 2) {
        return false;
      }

      // every joined participant needs a name
      for (var i = 0; i < joinedParticipants.length; i++) {
        if (!joinedParticipants[i].participant) {
          return false;
        }
      }

      var payingParticipants = joinedParticipants.filter(function (participant) {
        return participant.amount;
      });
      if (!payingParticipants.length) {
        return false;
      }

      return true;
    },

    handleDelete: function () {
      this.props.onDelete(this.props.data);
    },

    renderHeader: function (showSaveButton) {
      return (
        el('div', {className: 'header'},
          el('button', {className: 'left', onClick: this.props.onCloseClick},
            el('svg', {height: 16, width: 16},
              el('path', {d: 'm7.4983 0.5c0.8974 0 1.3404 1.0909 0.6973 1.7168l-4.7837 4.7832h11.573c1.3523-0.019125 1.3523 2.0191 0 2h-11.572l4.7832 4.7832c0.98163 0.94251-0.47155 2.3957-1.4141 1.4141l-6.4911-6.49c-0.387-0.3878-0.391-1.0228 0-1.414l6.4905-6.49c0.1883-0.1935 0.4468-0.30268 0.7168-0.3027z'})
            )
          ),
          el('h2', null, this.props.mode === 'new' ? 'New transaction' : 'Edit transaction'),
          (
            showSaveButton &&
            el('button', {className: 'right create', form: 'edit-entry-form'},
              el('svg', {height: 16, width: 16},
                el('path', {d: 'm13.631 3.9906a1.0001 1.0001 0 0 0-0.6875 0.30273l-6.5937 6.5938-3.293-3.293a1.0001 1.0001 0 1 0-1.4141 1.4141l4 4a1.0001 1.0001 0 0 0 1.4141 0l7.3008-7.3008a1.0001 1.0001 0 0 0-0.72656-1.7168z', fill: '#fff'})
              )
            )
          )
        )
      );
    },

    renderContent: function () {
      if (this.props.remoteTabError) {
        return el(LoadError, {message: this.props.remoteTabError, onOkClick: this.props.onChangeTabClick});
      }

      if (this.props.mode === 'edit' && !this.props.data) {
        var message = 'Could not find transaction.';
        return el(LoadError, {message: message, onOkClick: this.props.onCloseClick});
      }

      return (
        el(Form, {
          mode: this.props.mode,
          data: this.props.data,
          participants: this.props.participants,
          onSubmit: this.handleSubmit,
          onDelete: this.handleDelete,
          ref: 'form'
        })
      );
    },

    render: function () {
      var isLoading = this.props.checkingRemoteTab || this.props.importingTab;

      return (
        el('div', {className: 'scene editEntryScene'},
          this.renderHeader(!isLoading && !(this.props.remoteTabError || (this.props.mode === 'edit' && !this.props.data))),
          el(Loader, {show: isLoading},
            this.renderContent()
          )
        )
      );
    }

  });

});
