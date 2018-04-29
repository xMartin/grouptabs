define([
  'react',
  'create-react-class',
  'pure-render-mixin',
  'prop-types',
  './tablistbutton',
  './createform',
  './importform'
],

function (React, createReactClass, PureRenderMixin, PropTypes, TabListButton, CreateForm, ImportForm) {
  'use strict';

  var el = React.createElement;

  return createReactClass({
    mixins: [PureRenderMixin],

    displayName: 'Tabs',

    propTypes: {
      data: PropTypes.arrayOf(PropTypes.object).isRequired,
      visible: PropTypes.bool,
      checkingRemoteTab: PropTypes.bool,
      remoteTabError: PropTypes.string,
      onTabClick: PropTypes.func.isRequired,
      onCreateNewTab: PropTypes.func.isRequired,
      onImportTab: PropTypes.func.isRequired
    },

    getInitialState: function () {
      return {
        hideImportForm: true
      };
    },

    componentWillReceiveProps: function (nextProps) {
      if (!nextProps.visible && this.props.visible) {
        this.setState({
          hideImportForm: true
        });
      }
    },

    handleShowImportFormClick: function () {
      this.setState({
        hideImportForm: false
      });
    },

    render: function () {
      return (
        el('div', {className: 'scene tabsScene' + (this.props.visible ? '' : ' hidden')},
          el('div', {className: 'header'},
            el('img', {id: 'logo', src: 'images/favicon-touch.png'}),
            el('h2', null, 'Grouptabs')
          ),
          (
            this.props.data.length
            ?
            el('div', {className: 'row tabs'},
              this.props.data.map(function (tab) {
                return el(TabListButton, {key: tab.id, data: tab, onClick: this.props.onTabClick});
              }.bind(this))
            )
            :
            el('div', {className: 'empty-info'},
              el('p', null,
                'Track shared expenses in a group of people.'
                + ' Every group has its own tab like "Summer roadtrip" or "Badminton".'
              ),
              el('p', null,
                'Start by creating your first tab:'
              )
            )
          ),
          el('div', {className: 'row'},
            el(CreateForm, {onSubmit: this.props.onCreateNewTab})
          ),
          el('div', {className: 'row'},
            this.state.hideImportForm
            ? el('p', {className: 'fake-link', onClick: this.handleShowImportFormClick}, 'Open shared tab')
            : el(ImportForm, {
                checkingRemoteTab: this.props.checkingRemoteTab,
                remoteTabError: this.props.remoteTabError,
                onSubmit: this.props.onImportTab
              })
          )
        )
      );
    }

  });

});
