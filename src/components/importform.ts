import React, { PureComponent } from 'react';

interface Props {
  checkingRemoteTab?: boolean;
  remoteTabError?: string;
  onSubmit: (tabId: string) => void;
}

var el = React.createElement;

export default class ImportForm extends PureComponent<Props> {

  componentDidMount() {
    (this.refs.input as HTMLInputElement).focus();
  }

  componentDidUpdate (prevProps: Props) {
    if (!this.props.checkingRemoteTab && prevProps.checkingRemoteTab && !this.props.remoteTabError) {
      (this.refs.input as HTMLInputElement).value = '';
    }
  }

  handleSubmit = (event: Event) => {
    event.preventDefault();
    var input = this.refs.input as HTMLInputElement;
    var tabId = input.value.trim();
    if (tabId) {
      this.props.onSubmit(tabId);
    }
  }

  render() {
    return (
      el('form', {onSubmit: this.handleSubmit, className: 'import-form'},
        el('div', {className: 'row-label'}, 'Open shared tab:'),
        el('input', {type: 'text', className: 'full-width', placeholder: 'Tab ID …', disabled: this.props.checkingRemoteTab, ref: 'input'}),
        el('button', {disabled: this.props.checkingRemoteTab}, this.props.checkingRemoteTab ? 'Checking…' : 'Open'),
        el('div', {className: 'error-message'}, this.props.remoteTabError)
      )
    );
  }

}
