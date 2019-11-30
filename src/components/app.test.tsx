import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const emptyFn = () => {};
  const props = {
    location: {
      type: '',
      payload: {}
    },
    tabs: [],
    accounts: [],
    transactions: [],
    total: 0,
    onNavigateToTabs: emptyFn,
    onCreateTab: emptyFn,
    onImportTab: emptyFn,
    onSelectTab: emptyFn,
    onNavigateToAddTransaction: emptyFn,
    onNavigateToUpdateTransaction: emptyFn,
    onCloseTransaction: emptyFn,
    onAddTransaction: emptyFn,
    onUpdateTransaction: emptyFn,
    onRemoveTransaction: emptyFn,
    onError: emptyFn
  };
  ReactDOM.render(<App {...props}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
