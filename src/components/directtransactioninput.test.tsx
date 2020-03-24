import React from 'react';
import renderer from 'react-test-renderer';
import DirectTransactionInput from './directtransactioninput';

it('renders empty', () => {
  const tree = renderer
    .create(
      <DirectTransactionInput
        accounts={[]}
        participants={[]}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders prefilled', () => {
  const tree = renderer
    .create(
      <DirectTransactionInput
        accounts={[
          {
            participant: 'Martin',
            amount: 2.5,
          },
          {
            participant: 'Jan',
            amount: -2.5,
          },
        ]}
        participants={[
          {
            participant: 'Martin',
            amount: 1,
          },
          {
            participant: 'Jan',
            amount: 0,
          },
        ]}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
