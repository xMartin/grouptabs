define([
  'react',
  './tabs',
  './landing',
  './main',
  './list',
  './editentry'
],

function (React, TabsClass, LandingClass, MainClass, ListClass, EditEntryClass) {
  'use strict';

  var Tabs = React.createFactory(TabsClass);
  var Landing = React.createFactory(LandingClass);
  var Main = React.createFactory(MainClass);
  var List = React.createFactory(ListClass);
  var EditEntry = React.createFactory(EditEntryClass);

  return React.createClass({

    homeView: 'main',

    getInitialState: function () {
      return {
        scene: this.props.tabName ? 'main' : this.props.tabs.length ? 'tabs' : 'landing'
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

    render: function () {
      return (
        React.createElement('div', {id: 'scenes'},
          new Tabs({
            data: this.props.tabs,
            visible: this.state.scene === 'tabs',
            handleTabClick: this.handleTabClick,
            handleCreateNewTab: this.handleCreateNewTab
          }),
          new Landing({
            visible: this.state.scene === 'landing',
            handleNewEntryClick: this.handleNewEntryClick,
            handleImportSubmit: this.handleTabClick
          }),
          new Main({
            tabName: this.props.tabName,
            data: this.props.accounts,
            visible: this.state.scene === 'main',
            handleChangeTabClick: this.handleChangeTabClick,
            handleNewEntryClick: this.handleNewEntryClick,
            handleListClick: this.handleListClick
          }),
          new List({
            tabName: this.props.tabName,
            data: this.props.transactions,
            visible: this.state.scene === 'list',
            handleChangeTabClick: this.handleChangeTabClick,
            handleNewEntryClick: this.handleNewEntryClick,
            handlePeopleClick: this.handlePeopleClick,
            handleDetailsClick: this.handleDetailsClick
          }),
          (this.state.scene === 'newEntry') ?
            new EditEntry({
              mode: this._detailsData ? 'edit' : 'new',
              data: this._detailsData,
              participants: this.props.participants,
              handleCloseClick: this.handleCloseEntry,
              handleSubmit: this.handleSubmitEntry,
              handleDelete: this.handleDeleteEntry
            })
          : null
        )
      );
    },

    handleCreateNewTab: function () {
      this.props.handleCreateNewTab();
      this.homeView = 'main';
      this.setState({
        scene: 'main'
      });
    },

    handleTabClick: function (tab) {
      this.props.handleTabChange(tab);
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

    handleSubmitEntry: function (data) {
      this.props.saveTransaction(data);
      this.setState({
        scene: this.homeView
      });
    },

    handleDeleteEntry: function (data) {
      this.props.removeTransaction(data);
      this.setState({
        scene: this.homeView
      });
    }

  });

});
