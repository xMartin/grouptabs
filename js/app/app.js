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

    tab: localStorage.getItem('box') || '',

    getInitialState: function () {
      return {
        tabs: [],
        transactions: [],
        accounts: [],
        participants: []
      };
    },

    componentDidMount: function () {
      this.getTabs().then(function (tabs) {
        if (!tabs.length) {
          this.noTabYet = true;
        }

        this.setState({
          tabs: tabs
        });

        this.tab && this.initTab(this.tab);
      }.bind(this));
    },

    initTab: function (tab) {
      var tabDb = new TabDb(tab);
      this.tabStore = new TabStore(tabDb, this.refreshUi);
      this.tabStore.init().then(this.refreshUi);
    },

    refreshUi: function () {
      this.setState({
        tabName: this.tab,
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
      if (this.noTabYet) {
        var tab = generateTabId();
        this.setTab(tab);
        this.initTab(tab);
        delete this.noTabYet;
      }
      this.tabStore.saveTransaction(data);
    },

    handleRemoveTransaction: function (data) {
      this.tabStore.removeTransaction(data);
    },

    handleChangeTabClick: function () {
      this.getTabs().then(function (tabs) {
        this.component.setProps({
          tabs: tabs
        });
      }.bind(this));
      this.setTab('');
    },

    handleTabChange: function (tab) {
      this.setTab(tab);
      this.tabStore && this.tabStore.destroy();
      this.initTab(tab);

      // in case this is called for importing existing tab reset noTabYet
      delete this.noTabYet;
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
      this.tab = tabName;
      localStorage.setItem('box', tabName);
    },

    render: function () {
      return React.createElement(App, {
        tabName: this.tab,
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
