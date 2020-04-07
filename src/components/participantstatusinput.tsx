import React, { PureComponent, SyntheticEvent } from 'react';
import { TransactionFormParticipantStatus as Status } from '../types';
import { control } from '../util/form';

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
      <span className='participationStatus'>
        <span className={'joinedButtonWrapper' + (this.props.status === 2 ? ' hidden' : '')}>
          <button
            type='button'
            className={status > Status.NONE ? ' selected' : ''}
            onClick={this.props.onJoinedChange}
          >
            joined
          </button>
        </span>
        <button
          type='button'
          className={'paid-button' + (status === Status.PAID ? ' selected' : '')}
          onClick={this.props.onPaidChange}
        >
          paid
        </button>
        <span className={'amountInput' + (status < Status.PAID ? ' hidden' : '')}>
          <input
            ref={this.amountInput}
            type='number'
            step='any'
            disabled={status !== Status.PAID}
            placeholder='0'
            value={control(amount)}
            onChange={(event: SyntheticEvent<HTMLInputElement>) => this.props.onAmountChange(event.currentTarget.value ? parseFloat(event.currentTarget.value) : undefined)}
          />
        </span>
      </span>
    );
  }

}
