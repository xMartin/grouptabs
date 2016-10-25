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
        tabId: localStorage.getItem('tabId') || '',
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

        this.state.tabId && this.initTab({id: this.state.tabId});
      }.bind(this));
    },

    initTab: function (tab) {
      var tabDb = new TabDb(tab.id);
      this.tabStore = new TabStore(tabDb, this.refreshUi);

      this.tabStore.init()
      .then(this.refreshUi)
      .then(function () {
        if (tab.name) {
          this.tabStore.saveInfo({name: tab.name});
        }
      }.bind(this))
      .catch(console.error.bind(console));
    },

    refreshUi: function () {
      this.setState({
        transactions: this.tabStore.getTransactions(),
        accounts: this.tabStore.getAccounts(),
        participants: this.tabStore.getParticipants()
      });
    },

    handleCreateNewTab: function (name) {
      var id = generateTabId();
      var tab = {id: id, name: name};

      this.setState({
        tabs: this.state.tabs.concat(tab)
      });

      this.setTab(id);
      this.initTab(tab);
    },

    handleSaveTransaction: function (data) {
      this.tabStore.saveTransaction(data)
      .catch(console.error.bind(console));
    },

    handleRemoveTransaction: function (data) {
      this.tabStore.removeTransaction(data)
      .catch(console.error.bind(console));
    },

    handleChangeTabClick: function () {
      this.getTabs()
      .then(function (tabs) {
        this.setState({
          tabs: tabs
        });
      }.bind(this))
      .catch(console.error.bind(console));

      this.setTab('');
    },

    handleTabChange: function (tab) {
      this.setTab(tab.id);
      this.tabStore && this.tabStore.destroy();
      this.initTab({id: tab.id});
    },

    getTabs: function () {
      return (
        PouchDB.allDbs()
        .then(function (dbNames) {
          var tabDbNames = dbNames.filter(function (dbName) {
            return dbName.indexOf('tab/') === 0;
          });

          return Promise.all(
            tabDbNames.map(function (tabDbName) {
              var pouch = new PouchDB(tabDbName);
              return (
                pouch.get('info')
                .then(function (doc) {
                  return {
                    id: tabDbName.substring(4),  // remove 'tab/' prefix
                    name: doc.name
                  };
                })
              );
            })
          );
        })
      );
    },

    setTab: function (tabId) {
      localStorage.setItem('tabId', tabId);

      this.setState({
        tabId: tabId
      });
    },

    getTabName: function (tabId) {
      var tab = this.state.tabs.find(function (tab) {
        return tab.id === tabId;
      });

      if (tab) {
        return tab.name;
      }
    },

    render: function () {
      return React.createElement(App, {
        tabId: this.state.tabId,
        tabName: this.getTabName(this.state.tabId),
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
