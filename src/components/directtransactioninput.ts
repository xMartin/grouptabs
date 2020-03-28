import React, { PureComponent, SyntheticEvent } from 'react';
import { TransactionFormState } from '../types';
import { NEW_PARTICIPANT_OPTION } from '../util/transactionform';
import { control } from '../util/form';

var el = React.createElement;

var newParticipantOptionLabel = 'New participant…';

interface Props {
  data: TransactionFormState['direct'];
  onChange: <K extends keyof TransactionFormState['direct']>(key: K, value: TransactionFormState['direct'][K]) => void;
}

export default class DirectTransactionInput extends PureComponent<Props> {

  handleChangeFrom = (event: SyntheticEvent<HTMLInputElement>) => {
    const from = event.currentTarget.value;
    this.props.onChange('from', from);
  }

  handleChangeTo = (event: SyntheticEvent<HTMLInputElement>) => {
    const to = event.currentTarget.value;
    this.props.onChange('to', to);
  }

  renderOptions() {
    return this.props.data.options.map((participant) => {
      let label = participant;
      let value;
      if (participant === NEW_PARTICIPANT_OPTION) {
        label = newParticipantOptionLabel;
        value = NEW_PARTICIPANT_OPTION;
      }
      return el('option', {key: participant, value}, label);
    });
  }

  render() {
    const { to, toNew, from, fromNew, amount, options } = this.props.data;
    const { onChange } = this.props;

    return (
      el('div', {className: 'direct-transaction'},
        el('div', {className: 'form-row', style: options.length > 1 ? null : {display: 'none'}},
          el('div', {className: 'form-row-input'},
            el('select',
              {
                className: 'full-width',
                value: control(from),
                onChange: this.handleChangeFrom
              },
              this.renderOptions()
            )
          )
        ),
        el('div', {className: 'form-row', style: from === NEW_PARTICIPANT_OPTION ? null : {display: 'none'}},
          el('div', {className: 'form-row-input'},
            el('input', {
              type: 'text',
              placeholder: 'Name …',
              value: control(fromNew),
              onChange: (event: SyntheticEvent<HTMLInputElement>) => onChange('fromNew', event.currentTarget.value)
            })
          )
        ),
        el('div', {className: 'direct-transaction-amount'},
          el('svg', {height: 16, width: 16},
            el('path', {d: 'm15.511 8.5129c0-0.8974-1.0909-1.3404-1.7168-0.6973l-4.7832 4.7837v-11.573c0.019125-1.3523-2.0191-1.3523-2 0v11.572l-4.7832-4.7832c-0.94251-0.98163-2.3957 0.47155-1.4141 1.4141l6.49 6.4911c0.3878 0.387 1.0228 0.391 1.414 0l6.4903-6.4906c0.1935-0.1883 0.30268-0.4468 0.3027-0.7168z'})
          ),
          el('input', {
            type: 'number',
            step: 'any',
            placeholder: 0,
            value: control(amount),
            onChange: (event: SyntheticEvent<HTMLInputElement>) => onChange('amount', event.currentTarget.value ? parseFloat(event.currentTarget.value) : undefined)
          })
        ),
        el('div', {className: 'form-row', style: options.length > 1 ? null : {display: 'none'}},
          el('div', {className: 'form-row-input'},
            el('select',
              {
                className: 'full-width',
                value: control(to),
                onChange: this.handleChangeTo
              },
              this.renderOptions()
            )
          )
        ),
        el('div', {className: 'form-row', style: to === NEW_PARTICIPANT_OPTION ? null : {display: 'none'}},
          el('div', {className: 'form-row-input'},
            el('input', {
              type: 'text',
              placeholder: 'Name …',
              value: control(toNew),
              onChange: (event: SyntheticEvent<HTMLInputElement>) => onChange('toNew', event.currentTarget.value)
            })
          )
        )
      )
    );
  }

}
