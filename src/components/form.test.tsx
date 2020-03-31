import React from 'react';
import renderer from 'react-test-renderer';
import Form from './form';
import { TransactionType, DocumentType } from '../types';
import { createFormData } from '../util/transactionform';

let realDate: any;

beforeAll(() => {
  const currentDate = new Date('2020-02-20T20:20:20.202Z');
  realDate = Date;
  global.Date = class extends Date {
    constructor(date: any, ...args: any[]) {
      if (date) {
        // @ts-ignore
        return super(date, ...args);
      }

      return currentDate;
    }
  } as any;
});

afterAll(() => {
  global.Date = realDate;
});

it('renders empty form', () => {
  const tree = renderer
    .create(
      <Form
        mode='new'
        data={createFormData([])}
        onUpdateForm={jest.fn()}
        onUpdateSharedForm={jest.fn()}
        onUpdateDirectForm={jest.fn()}
        onUpdateParticipant={jest.fn()}
        onAddParticipant={jest.fn()}
        onSetAllJoined={jest.fn()}
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
        data={createFormData(
          [
            {
              participant: 'Martin',
              amount: -21,
            },
            {
              participant: 'Jan',
              amount: 21,
            }
          ],
          {
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
          }
        )}
        onUpdateForm={jest.fn()}
        onUpdateSharedForm={jest.fn()}
        onUpdateDirectForm={jest.fn()}
        onUpdateParticipant={jest.fn()}
        onAddParticipant={jest.fn()}
        onSetAllJoined={jest.fn()}
        onSubmit={jest.fn()}
        onDelete={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
