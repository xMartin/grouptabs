import React from 'react';
import renderer from 'react-test-renderer';
import Tabs from './tabs';
import { DocumentType } from '../types';

it('renders tab view', () => {
  const tree = renderer
    .create(
      <Tabs
        data={[
          {
            id: '123',
            info: {
              id: '123',
              type: DocumentType.INFO,
              tabId: '567',
              name: 'TAB NAME',
            }
          }
        ]}
        onTabClick={jest.fn()}
        onCreateTabInputChange={jest.fn()}
        onCreateNewTab={jest.fn()}
        onImportTabInputChange={jest.fn()}
        onImportTab={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders empty tab view', () => {
  const tree = renderer
    .create(
      <Tabs
        data={[]}
        onTabClick={jest.fn()}
        onCreateTabInputChange={jest.fn()}
        onCreateNewTab={jest.fn()}
        onImportTabInputChange={jest.fn()}
        onImportTab={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
