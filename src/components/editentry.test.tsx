import React from 'react';
import renderer from 'react-test-renderer';
import EditEntry from './editentry';
import { TransactionType, DocumentType } from '../types';

it('renders loader when checking remote tab', () => {
  const tree = renderer
    .create(
      <EditEntry
        mode='new'
        accounts={[]}
        checkingRemoteTab={true}
        onChangeTabClick={jest.fn()}
        onCloseClick={jest.fn()}
        onCreate={jest.fn()}
        onUpdate={jest.fn()}
        onDelete={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders empty form', () => {
  const tree = renderer
    .create(
      <EditEntry
        mode='new'
        accounts={[]}
        onChangeTabClick={jest.fn()}
        onCloseClick={jest.fn()}
        onCreate={jest.fn()}
        onUpdate={jest.fn()}
        onDelete={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders loader in edit mode with no data', () => {
  const tree = renderer
    .create(
      <EditEntry
        mode='edit'
        accounts={[]}
        onChangeTabClick={jest.fn()}
        onCloseClick={jest.fn()}
        onCreate={jest.fn()}
        onUpdate={jest.fn()}
        onDelete={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders prefilled form', () => {
  const tree = renderer
    .create(
      <EditEntry
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
        onChangeTabClick={jest.fn()}
        onCloseClick={jest.fn()}
        onCreate={jest.fn()}
        onUpdate={jest.fn()}
        onDelete={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
