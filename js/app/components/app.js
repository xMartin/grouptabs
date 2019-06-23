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
    var result = input ? input + ' – ' + titleBase : titleBase;

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
      total: PropTypes.number.isRequired,
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
          setTitle(tabName ? 'New transaction (' + tabName + ')' : '');
          break;
        case 'ROUTE_TRANSACTION':
          var transaction = nextProps.transaction;
          setTitle(transaction ? transaction.description + ' (' + tabName + ')' : '');
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
            onTabClick: this.props.onSelectTab,
            onCreateNewTab: this.props.onCreateTab,
            onImportTab: this.props.onImportTab
          }),
          el(Main, {
            tabName: this.props.tabName,
            tabId: this.props.location.payload.tabId,
            accounts: this.props.accounts,
            transactions: this.props.transactions,
            total: this.props.total,
            visible: this.props.location.type === 'ROUTE_TAB',
            checkingRemoteTab: this.props.checkingRemoteTab,
            remoteTabError: this.props.remoteTabError,
            importingTab: this.props.importingTab,
            onChangeTabClick: this.props.onNavigateToTabs,
            onNavigateToAddTransaction: this.props.onNavigateToAddTransaction,
            onDetailsClick: this.props.onNavigateToUpdateTransaction
          }),
          (
            !!this.props.initialLoadingDone
            && (
              this.props.location.type === 'ROUTE_NEW_TRANSACTION'
              || this.props.location.type === 'ROUTE_TRANSACTION'
            )
          ) &&
            el(EditEntry, {
              mode: this.props.location.type === 'ROUTE_NEW_TRANSACTION' ? 'new' : 'edit',
              data: this.props.transaction,
              participants: this.props.participants,
              checkingRemoteTab: this.props.checkingRemoteTab,
              remoteTabError: this.props.remoteTabError,
              importingTab: this.props.importingTab,
              onChangeTabClick: this.props.onNavigateToTabs,
              onCloseClick: this.props.onCloseTransaction,
              onCreate: this.props.onAddTransaction,
              onUpdate: this.props.onUpdateTransaction,
              onDelete: this.props.onRemoveTransaction
            })
        )
      );
    }

  });

});
