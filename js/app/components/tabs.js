define([
  'react',
  './tablistbutton',
  './createform',
  './importform',
  './collapsiblerow'
],

function (React, TabListButton, CreateForm, ImportForm, CollapsibleRow) {
  'use strict';

  var el = React.createElement;
  var PropTypes = React.PropTypes;

  return React.createClass({

    displayName: 'Tabs',

    propTypes: {
      data: PropTypes.arrayOf(PropTypes.object).isRequired,
      visible: PropTypes.bool,
      checkingRemoteTab: PropTypes.bool,
      remoteTabError: PropTypes.string,
      handleTabClick: PropTypes.func.isRequired,
      handleCreateNewTab: PropTypes.func.isRequired,
      handleImportTab: PropTypes.func.isRequired
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
        hideImportForm: !this.state.hideImportForm
      });
    },

    handleImportTab: function (tabId) {
      this.setState({
        hideImportForm: true
      });

      this.props.handleImportTab(tabId);
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
                return el(TabListButton, {key: tab.id, data: tab, onClick: this.props.handleTabClick});
              }.bind(this))
            )
            :
            el('div', {className: 'empty-info'},
              el('p', null,
                'Track shared expenses in a group of people.'
                + ' Every group has its own tab like "Roadtrip 2016" or "Badminton".'
              ),
              el('p', null,
                'Start by creating your first tab:'
              )
            )
          ),
          el('div', {className: 'row'},
            el(CreateForm, {handleSubmit: this.props.handleCreateNewTab})
          ),
          el(CollapsibleRow, {
            label: 'Open shared tab',
            collapsed: this.state.hideImportForm,
            handleCollapseButtonClick: this.handleShowImportFormClick
          },
            el(ImportForm, {
                checkingRemoteTab: this.props.checkingRemoteTab,
                remoteTabError: this.props.remoteTabError,
                handleSubmit: this.props.handleImportTab
            })
          )
        )
      );
    }

  });

});
