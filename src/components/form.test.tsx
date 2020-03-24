import React from 'react';
import renderer from 'react-test-renderer';
import Form from './form';
import { TransactionType, DocumentType } from '../types';

it('renders empty form', () => {
  const tree = renderer
    .create(
      <Form
        mode='new'
        accounts={[]}
        onSubmit={jest.fn()}
        onDelete={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders prefilled form', () => {
  const tree = renderer
    .create(
      <Form
        mode='edit'
        data={{
          id: '123',
          type: DocumentType.TRANSACTION,
          tabId: '321',
          description: 'DESCRIPTION',
          transactionType: TransactionType.SHARED,
          date: '2020-03-24',
          timestamp: '2020-03-24T20:23:21z',
          participants: [
            {
              participant: 'Martin',
              amount: 5,
            },
            {
              participant: 'Jan',
              amount: 0,
            },
          ]
        }}
        accounts={[]}
        onSubmit={jest.fn()}
        onDelete={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
