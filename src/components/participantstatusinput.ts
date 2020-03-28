import React, { PureComponent, SyntheticEvent } from 'react';
import { TransactionFormParticipantStatus as Status } from '../types';
import { control } from '../util/form';

var el = React.createElement;

interface Props {
  status: Status;
  amount?: number;
  onJoinedChange: () => void;
  onPaidChange: () => void;
  onAmountChange: (amount?: number) => void;
}

export default class ParticipationStatusInput extends PureComponent<Props> {
  
  private amountInput: React.RefObject<HTMLInputElement>;
  
  constructor(props: Props) {
    super(props);
    this.amountInput = React.createRef();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status !== Status.PAID && this.props.status === Status.PAID) {
      this.amountInput.current?.focus();
    }
  }
  
  render() {
    const { status, amount } = this.props;

    return (
      el('span', {className: 'participationStatus'},
        el('span', {className: 'joinedButtonWrapper' + (this.props.status === 2 ? ' hidden' : '')},
          el('button', {
            type: 'button',
            className: status > Status.NONE ? ' selected' : '',
            onClick: this.props.onJoinedChange
          }, 'joined')
        ),
        el('button', {
          type: 'button',
          className: 'paid-button' + (status === Status.PAID ? ' selected' : ''),
          onClick: this.props.onPaidChange
        }, 'paid'),
        el('span', {className: 'amountInput' + (status < Status.PAID ? ' hidden' : '')},
          el('input', {
            ref: this.amountInput,
            type: 'number',
            step: 'any',
            disabled: status !== Status.PAID ? 'disabled' : '',
            placeholder: 0,
            value: control(amount),
            onChange: (event: SyntheticEvent<HTMLInputElement>) => this.props.onAmountChange(event.currentTarget.value ? parseFloat(event.currentTarget.value) : undefined)
          })
        )
      )
    );
  }

}
