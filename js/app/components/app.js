define([
  'react',
  './main',
  './list',
  './editentry'
],

function (React, MainClass, ListClass, EditEntryClass) {
  'use strict';

  var Main = React.createFactory(MainClass);
  var List = React.createFactory(ListClass);
  var EditEntry = React.createFactory(EditEntryClass);

  return React.createClass({

    homeView: 'main',

    getInitialState: function () {
      return {
        scene: this.props.tabName ? 'main' : 'tabs'
      };
    },

    getDefaultProps: function () {
      return {
        transactions: [],
        accounts: [],
        participants: []
      };
    },

    render: function () {
      var editEntry;
      if (this.state.scene === 'newEntry') {
        editEntry = new EditEntry({
          mode: this._detailsData ? 'edit' : 'new',
          data: this._detailsData,
          participants: this.props.participants,
          handleCloseClick: this.handleCloseEntry,
          handleSubmit: this.handleSubmitEntry,
          handleDelete: this.handleDeleteEntry
        });
      }
      return (
        React.createElement('div', {id: 'scenes'},
          new Main({
            tabName: this.props.tabName,
            data: this.props.accounts,
            visible: this.state.scene === 'main',
            // handleChangeTabClick: this.handleChangeTabClick,
            handleNewEntryClick: this.handleNewEntryClick,
            handleListClick: this.handleListClick
          }),
          new List({
            tabName: this.props.tabName,
            data: this.props.transactions,
            visible: this.state.scene === 'list',
            // handleChangeTabClick: this.handleChangeTabClick,
            handleNewEntryClick: this.handleNewEntryClick,
            handlePeopleClick: this.handlePeopleClick,
            handleDetailsClick: this.handleDetailsClick
          }),
          editEntry
        )
      );
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
