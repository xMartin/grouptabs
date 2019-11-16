import React, { useEffect } from 'react';

interface Props {
  checkingRemoteTab?: boolean;
  remoteTabError?: string;
  onSubmit: (tabId: string) => void;
}

var el = React.createElement;

const ImportForm: React.FC<Props> = ({ checkingRemoteTab, remoteTabError, onSubmit }) => {
  const inputEl = React.useRef<HTMLInputElement>(null);

  // Empty input after import
  useEffect(() => {
    if (inputEl.current && !checkingRemoteTab && !remoteTabError) {
      inputEl.current.value = '';
    }
  // we only care about the error prop if the checking prop changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkingRemoteTab]);

  // Focus input on mount
  useEffect(() => {
    inputEl.current && inputEl.current.focus();
  }, []);

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    const tabId = inputEl.current && inputEl.current.value.trim();
    if (tabId) {
      onSubmit(tabId);
    }
  };

  return (
    el('form', {onSubmit: handleSubmit, className: 'import-form'},
      el('div', {className: 'row-label'}, 'Open shared tab:'),
      el('input', {type: 'text', className: 'full-width', placeholder: 'Tab ID …', disabled: checkingRemoteTab, ref: inputEl}),
      el('button', {disabled: checkingRemoteTab}, checkingRemoteTab ? 'Checking…' : 'Open'),
      el('div', {className: 'error-message'}, remoteTabError)
    )
  );
}

export default ImportForm;
