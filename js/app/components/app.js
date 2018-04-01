define([
  'react',
  'create-react-class',
  'prop-types',
  './tabs',
  './main',
  './editentry',
  './error'
],

function (React, createReactClass, PropTypes, Tabs, Main, EditEntry, ErrorView) {
  'use strict';

  var el = React.createElement;

  var titleBase = 'Grouptabs';

  function setTitle (input) {
    var documentTitle = document.title;
    var result = input ? titleBase + ' – ' + input : titleBase;

    if (result !== documentTitle) {
      document.title = result;
    }
  }

  return createReactClass({

    displayName: 'App',

    propTypes: {
      location: PropTypes.shape({
        type: PropTypes.string.isRequired,
        payload: PropTypes.object.isRequired
      }).isRequired,
      initialLoadingDone: PropTypes.bool,
      tabName: PropTypes.string,
      transaction: PropTypes.object,
      tabs: PropTypes.arrayOf(PropTypes.object),
      checkingRemoteTab: PropTypes.bool,
      remoteTabError: PropTypes.string,
      importingTab: PropTypes.bool,
      transactions: PropTypes.arrayOf(PropTypes.object),
      accounts: PropTypes.arrayOf(PropTypes.object),
      participants: PropTypes.arrayOf(PropTypes.string),
      error: PropTypes.shape({
        error: PropTypes.object,
        info: PropTypes.object
      }),
      onNavigateToTabs: PropTypes.func.isRequired,
      onCreateTab: PropTypes.func.isRequired,
      onImportTab: PropTypes.func.isRequired,
      onSelectTab: PropTypes.func.isRequired,
      onNavigateToAddTransaction: PropTypes.func.isRequired,
      onNavigateToUpdateTransaction: PropTypes.func.isRequired,
      onCloseTransaction: PropTypes.func.isRequired,
      onAddTransaction: PropTypes.func.isRequired,
      onUpdateTransaction: PropTypes.func.isRequired,
      onRemoveTransaction: PropTypes.func.isRequired,
      onError: PropTypes.func.isRequired
    },

    componentDidCatch: function (error, info) {
      this.props.onError(error, info);
    },

    componentWillReceiveProps: function (nextProps) {
      if (nextProps.location.type !== this.props.location.type) {
        window.scrollTo({top: 0});
      }

      this.setPageTitle(nextProps);
    },

    setPageTitle: function (nextProps) {
      var tabName = nextProps.tabName;

      switch (nextProps.location.type) {
        case 'ROUTE_TAB':
          setTitle(tabName);
          break;
        case 'ROUTE_NEW_TRANSACTION':
          setTitle(tabName ? tabName + ': New' : '');
          break;
        case 'ROUTE_TRANSACTION':
          var transaction = nextProps.transaction;
          setTitle(transaction ? tabName + ': ' + transaction.description : '');
          break;
        default:
          setTitle();
      }
    },

    render: function () {
      if (this.props.error) {
        return (
          el('div', {id: 'scenes'},
            el(ErrorView, {error: this.props.error})
          )
        );
      }

      return (
        el('div', {id: 'scenes'},
          el(Tabs, {
            data: this.props.tabs,
            visible: this.props.location.type === 'ROUTE_TABS',
            checkingRemoteTab: this.props.checkingRemoteTab,
            remoteTabError: this.props.remoteTabError,
            handleTabClick: this.props.onSelectTab,
            handleCreateNewTab: this.props.onCreateTab,
            handleImportTab: this.props.onImportTab
          }),
          el(Main, {
            tabName: this.props.tabName,
            tabId: this.props.location.payload.tabId,
            accounts: this.props.accounts,
            transactions: this.props.transactions,
            visible: this.props.location.type === 'ROUTE_TAB',
            checkingRemoteTab: this.props.checkingRemoteTab,
            remoteTabError: this.props.remoteTabError,
            importingTab: this.props.importingTab,
            handleChangeTabClick: this.props.onNavigateToTabs,
            onNavigateToAddTransaction: this.props.onNavigateToAddTransaction,
            handleDetailsClick: this.props.onNavigateToUpdateTransaction
          }),
          (
            !!this.props.initialLoadingDone
            && (
              this.props.location.type === 'ROUTE_NEW_TRANSACTION'
              || this.props.location.type === 'ROUTE_TRANSACTION'
            )
          ) &&
            el(EditEntry, {
              mode: this.props.transaction ? 'edit' : 'new',
              data: this.props.transaction,
              participants: this.props.participants,
              checkingRemoteTab: this.props.checkingRemoteTab,
              remoteTabError: this.props.remoteTabError,
              importingTab: this.props.importingTab,
              handleChangeTabClick: this.props.onNavigateToTabs,
              handleCloseClick: this.props.onCloseTransaction,
              handleCreate: this.props.onAddTransaction,
              handleUpdate: this.props.onUpdateTransaction,
              handleDelete: this.props.onRemoveTransaction
            })
        )
      );
    }

  });

});
