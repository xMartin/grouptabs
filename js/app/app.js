define([
  'pouchdb',
  'pouchdb-all-dbs',
  'react',
  './components/app',
  './db/tab',
  './stores/tab'
],

function (PouchDB, allDbs, React, App, TabDb, TabStore) {
  'use strict';

  allDbs(PouchDB);

  function generateTabId() {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = 0; i < 7; ++i) {
      result += chars.substr(Math.floor(Math.random() * chars.length), 1);
    }
    return result;
  }

  return React.createClass({

    displayName: 'AppContainer',

    getInitialState: function () {
      return {
        tabName: localStorage.getItem('box') || '',
        tabs: [],
        transactions: [],
        accounts: [],
        participants: []
      };
    },

    componentDidMount: function () {
      this.getTabs().then(function (tabs) {
        this.setState({
          tabs: tabs
        });

        this.state.tabName && this.initTab(this.state.tabName);
      }.bind(this));
    },

    initTab: function (tab) {
      var tabDb = new TabDb(tab);
      this.tabStore = new TabStore(tabDb, this.refreshUi);
      this.tabStore.init().then(this.refreshUi);
    },

    refreshUi: function () {
      this.setState({
        transactions: this.tabStore.getTransactions(),
        accounts: this.tabStore.getAccounts(),
        participants: this.tabStore.getParticipants()
      });
    },

    handleCreateNewTab: function () {
      var tab = generateTabId();
      this.setTab(tab);
      this.initTab(tab);
    },

    handleSaveTransaction: function (data) {
      this.tabStore.saveTransaction(data);
    },

    handleRemoveTransaction: function (data) {
      this.tabStore.removeTransaction(data);
    },

    handleChangeTabClick: function () {
      this.getTabs().then(function (tabs) {
        this.setState({
          tabs: tabs
        });
      }.bind(this));
      this.setTab('');
    },

    handleTabChange: function (tab) {
      this.setTab(tab);
      this.tabStore && this.tabStore.destroy();
      this.initTab(tab);
    },

    getTabs: function () {
      return PouchDB.allDbs().then(function (dbs) {
        return dbs
          .filter(function (db) {
            return db.indexOf('tab/') === 0;
          })
          .map(function (db) {
            // remove 'tab/' prefix
            return db.substring(4);
          });
      });
    },

    setTab: function (tabName) {
      localStorage.setItem('box', tabName);

      this.setState({
        tabName: tabName
      });
    },

    render: function () {
      return React.createElement(App, {
        tabName: this.state.tabName,
        tabs: this.state.tabs,
        transactions: this.state.transactions,
        accounts: this.state.accounts,
        participants: this.state.participants,
        saveTransaction: this.handleSaveTransaction,
        removeTransaction: this.handleRemoveTransaction,
        handleTabChange: this.handleTabChange,
        handleChangeTabClick: this.handleChangeTabClick,
        handleCreateNewTab: this.handleCreateNewTab
      });
    }

  });

});
