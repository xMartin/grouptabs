define([
  'react',
  './tabs',
  './main',
  './list',
  './editentry'
],

function (React, Tabs, Main, List, EditEntry) {
  'use strict';

  var el = React.createElement;
  var PropTypes = React.PropTypes;

  return React.createClass({

    displayName: 'App',

    propTypes: {
      scene: PropTypes.string.isRequired,
      tabId: PropTypes.string,
      tabName: PropTypes.string,
      transaction: PropTypes.object,
      tabs: PropTypes.arrayOf(PropTypes.object),
      transactions: PropTypes.arrayOf(PropTypes.object),
      accounts: PropTypes.arrayOf(PropTypes.object),
      participants: PropTypes.arrayOf(PropTypes.string),
      onNavigateToTabs: PropTypes.func.isRequired,
      onCreateTab: PropTypes.func.isRequired,
      onImportTab: PropTypes.func.isRequired,
      onSelectTab: PropTypes.func.isRequired,
      onNavigateToAddTransaction: PropTypes.func.isRequired,
      onNavigateToUpdateTransaction: PropTypes.func.isRequired,
      onNavigateToList: PropTypes.func.isRequired,
      onNavigateToMain: PropTypes.func.isRequired,
      onCloseTransaction: PropTypes.func.isRequired,
      onAddTransaction: PropTypes.func.isRequired,
      onUpdateTransaction: PropTypes.func.isRequired,
      onRemoveTransaction: PropTypes.func.isRequired
    },

    getDefaultProps: function () {
      return {
        tabs: [],
        transactions: [],
        accounts: [],
        participants: []
      };
    },

    render: function () {
      return (
        el('div', {id: 'scenes'},
          el(Tabs, {
            data: this.props.tabs,
            visible: this.props.scene === 'tabs',
            handleTabClick: this.props.onSelectTab,
            handleCreateNewTab: this.props.onCreateTab,
            handleImportTab: this.props.onImportTab
          }),
          el(Main, {
            tabName: this.props.tabName,
            tabId: this.props.tabId,
            data: this.props.accounts,
            visible: this.props.scene === 'main',
            handleChangeTabClick: this.props.onNavigateToTabs,
            handleNewEntryClick: this.props.onNavigateToAddTransaction,
            handleListClick: this.props.onNavigateToList
          }),
          el(List, {
            tabName: this.props.tabName,
            tabId: this.props.tabId,
            data: this.props.transactions,
            visible: this.props.scene === 'list',
            handleChangeTabClick: this.props.onNavigateToTabs,
            handleNewEntryClick: this.props.onNavigateToAddTransaction,
            handlePeopleClick: this.props.onNavigateToMain,
            handleDetailsClick: this.props.onNavigateToUpdateTransaction
          }),
          (this.props.scene === 'details') ?
            el(EditEntry, {
              mode: this.props.transaction ? 'edit' : 'new',
              data: this.props.transaction,
              participants: this.props.participants,
              handleCloseClick: this.props.onCloseTransaction,
              handleCreate: this.props.onAddTransaction,
              handleUpdate: this.props.onUpdateTransaction,
              handleDelete: this.props.onRemoveTransaction
            })
          : null
        )
      );
    }

  });

});
