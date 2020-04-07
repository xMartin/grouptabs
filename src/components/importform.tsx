import React, { SyntheticEvent } from 'react';
import { control } from '../util/form';

interface Props {
  checkingRemoteTab?: boolean;
  remoteTabError?: string;
  tabId?: string;
  onTabIdChange: (tabId: string) => void;
  onSubmit: (tabId: string) => void;
}

const ImportForm: React.FC<Props> = ({ checkingRemoteTab, remoteTabError, tabId, onTabIdChange, onSubmit }) => {
  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (tabId) {
      onSubmit(tabId);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='import-form'>
      <div className='row-label'>Open shared tab:</div>
      <input
        type='text'
        className='full-width'
        placeholder='Tab ID …'
        disabled={checkingRemoteTab}
        autoFocus={true}
        value={control(tabId)}
        onChange={(event: SyntheticEvent<HTMLInputElement>) => onTabIdChange(event.currentTarget.value)}
      />
      <button disabled={checkingRemoteTab}>{checkingRemoteTab ? 'Checking…' : 'Open'}</button>
      <div className='error-message'>{remoteTabError}</div>
    </form>
  );
}

export default ImportForm;
