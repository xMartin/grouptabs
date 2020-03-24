import React, { PureComponent } from 'react';

var el = React.createElement;

interface Props {
  status: 0 | 1 | 2;
  amount?: number;
  onJoinedChange: () => void;
  onPaidChange: () => void;
  onAmountChange: (amount: number) => void;
}

export default class ParticipationStatusInput extends PureComponent<Props> {

  getAmount() {
    return parseFloat((this.refs.amount as HTMLInputElement).value || '0');
  }

  focusAmount() {
    (this.refs.amount as HTMLInputElement).focus();
  }

  render() {
    return (
      el('span', {className: 'participationStatus'},
        el('span', {className: 'joinedButtonWrapper' + (this.props.status === 2 ? ' hidden' : '')},
          el('button', {
            type: 'button',
            className: this.props.status > 0 ? ' selected' : '',
            ref: 'joined',
            onClick: this.props.onJoinedChange
          }, 'joined')
        ),
        el('button', {
          type: 'button',
          className: 'paid-button' + (this.props.status === 2 ? ' selected' : ''),
          ref: 'paid',
          onClick: this.props.onPaidChange
        }, 'paid'),
        el('span', {className: 'amountInput' + (this.props.status < 2 ? ' hidden' : '')},
          el('input', {
            type: 'number',
            step: 'any',
            disabled: this.props.status !== 2 ? 'disabled' : '',
            placeholder: 0,
            defaultValue: this.props.amount,
            ref: 'amount'
          })
        )
      )
    );
  }

}
