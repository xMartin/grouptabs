import React, { SyntheticEvent } from 'react';
import { control } from '../util/form';

interface Props {
  checkingRemoteTab?: boolean;
  remoteTabError?: string;
  tabId?: string;
  onTabIdChange: (tabId: string) => void;
  onSubmit: (tabId: string) => void;
}

var el = React.createElement;

const ImportForm: React.FC<Props> = ({ checkingRemoteTab, remoteTabError, tabId, onTabIdChange, onSubmit }) => {
  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (tabId) {
      onSubmit(tabId);
    }
  };

  return (
    el('form', {onSubmit: handleSubmit, className: 'import-form'},
      el('div', {className: 'row-label'}, 'Open shared tab:'),
      el('input', {
        type: 'text',
        className: 'full-width',
        placeholder: 'Tab ID …',
        disabled: checkingRemoteTab,
        autoFocus: true,
        value: control(tabId),
        onChange: (event: SyntheticEvent<HTMLInputElement>) => onTabIdChange(event.currentTarget.value),
      }),
      el('button', {disabled: checkingRemoteTab}, checkingRemoteTab ? 'Checking…' : 'Open'),
      el('div', {className: 'error-message'}, remoteTabError)
    )
  );
}

export default ImportForm;
