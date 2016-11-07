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
      tabId: PropTypes.string,
      tabName: PropTypes.string,
      tabs: PropTypes.arrayOf(PropTypes.object),
      transactions: PropTypes.arrayOf(PropTypes.object),
      accounts: PropTypes.arrayOf(PropTypes.object),
      participants: PropTypes.arrayOf(PropTypes.string),
      handleCreateNewTab: PropTypes.func.isRequired,
      handleTabChange: PropTypes.func.isRequired,
      handleImportTab: PropTypes.func.isRequired,
      handleChangeTabClick: PropTypes.func.isRequired,
      addTransaction: PropTypes.func.isRequired,
      updateTransaction: PropTypes.func.isRequired,
      removeTransaction: PropTypes.func.isRequired
    },

    homeView: 'main',

    getInitialState: function () {
      return {
        scene: this.props.tabId ? 'main' : 'tabs'
      };
    },

    getDefaultProps: function () {
      return {
        tabs: [],
        transactions: [],
        accounts: [],
        participants: []
      };
    },

    handleCreateNewTab: function (name) {
      this.props.handleCreateNewTab(name);
      this.homeView = 'main';
      this.setState({
        scene: 'main'
      });
    },

    handleTabClick: function (id) {
      this.props.handleTabChange(id);
      this.homeView = 'main';
      this.setState({
        scene: 'main'
      });
    },

    handleChangeTabClick: function () {
      this.props.handleChangeTabClick();
      this.homeView = 'tabs';
      this.setState({
        scene: 'tabs'
      });
    },

    handleImportTab: function (id) {
      this.props.handleImportTab(id);
      this.homeView = 'main';
      this.setState({
        scene: 'main'
      });
    },

    handleListClick: function () {
      this.homeView = 'list';
      this.setState({
        scene: 'list'
      });
    },

    handlePeopleClick: function () {
      this.homeView = 'main';
      this.setState({
        scene: 'main'
      });
    },

    handleNewEntryClick: function () {
      delete this._detailsData;
      this.setState({
        scene: 'newEntry'
      });
    },

    handleDetailsClick: function (data) {
      this._detailsData = data;
      this.setState({
        scene: 'newEntry'
      });
    },

    handleCloseEntry: function () {
      this.setState({
        scene: this.homeView
      });
    },

    handleCreateEntry: function (data) {
      this.props.addTransaction(data);
      this.setState({
        scene: this.homeView
      });
    },

    handleUpdateEntry: function (data) {
      this.props.updateTransaction(data);
      this.setState({
        scene: this.homeView
      });
    },

    handleDeleteEntry: function (data) {
      this.props.removeTransaction(data);
      this.setState({
        scene: this.homeView
      });
    },

    render: function () {
      return (
        el('div', {id: 'scenes'},
          el(Tabs, {
            data: this.props.tabs,
            visible: this.state.scene === 'tabs',
            handleTabClick: this.handleTabClick,
            handleCreateNewTab: this.handleCreateNewTab,
            handleImportTab: this.handleImportTab
          }),
          el(Main, {
            tabName: this.props.tabName,
            tabId: this.props.tabId,
            data: this.props.accounts,
            visible: this.state.scene === 'main',
            handleChangeTabClick: this.handleChangeTabClick,
            handleNewEntryClick: this.handleNewEntryClick,
            handleListClick: this.handleListClick
          }),
          el(List, {
            tabName: this.props.tabName,
            tabId: this.props.tabId,
            data: this.props.transactions,
            visible: this.state.scene === 'list',
            handleChangeTabClick: this.handleChangeTabClick,
            handleNewEntryClick: this.handleNewEntryClick,
            handlePeopleClick: this.handlePeopleClick,
            handleDetailsClick: this.handleDetailsClick
          }),
          (this.state.scene === 'newEntry') ?
            el(EditEntry, {
              mode: this._detailsData ? 'edit' : 'new',
              data: this._detailsData,
              participants: this.props.participants,
              handleCloseClick: this.handleCloseEntry,
              handleCreate: this.handleCreateEntry,
              handleUpdate: this.handleUpdateEntry,
              handleDelete: this.handleDeleteEntry
            })
          : null
        )
      );
    }

  });

});
