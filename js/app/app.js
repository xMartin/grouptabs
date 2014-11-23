/* globals config:false, Hoodie:false */
define([
  'pouchdb',
  'pouchdb-all-dbs',
  'react',
  './components/app',
  './db/tab',
  './stores/tab'
],

function (PouchDB, allDbs, React, AppComponentClass, TabDb, TabStore) {
  'use strict';

  allDbs(PouchDB);

  var AppComponent = React.createFactory(AppComponentClass);

  function generateTabId() {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = 0; i < 7; ++i) {
      result += chars.substr(Math.floor(Math.random() * chars.length), 1);
    }
    return result;
  }

  return {

    tab: localStorage.getItem('box') || '',

    init: function () {
      this.hoodie = new Hoodie(config.backendUrl);
      this.getTabs().then(function (tabs) {
        if (!tabs.length) {
          this.noTabYet = true;
        }
        this.component = React.render(new AppComponent({
          tabName: this.tab,
          tabs: tabs,
          saveTransaction: this.handleSaveTransaction.bind(this),
          removeTransaction: this.handleRemoveTransaction.bind(this),
          handleTabChange: this.handleTabChange.bind(this),
          handleChangeTabClick: this.handleChangeTabClick.bind(this),
          handleCreateNewTab: this.handleCreateNewTab.bind(this)
        }), document.body);
        this.tab && this.initTab(this.tab);
      }.bind(this));
    },

    initTab: function (tab) {
      var tabDb = new TabDb(tab, this.hoodie);
      this.tabStore = new TabStore(tabDb, this.refreshUi.bind(this));
      this.tabStore.init().then(this.refreshUi.bind(this));
    },

    refreshUi: function () {
      this.component.setProps({
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
    }
  };

});
