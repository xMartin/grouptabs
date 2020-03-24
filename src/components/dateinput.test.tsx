import React from 'react';
import renderer from 'react-test-renderer';
import DateInput from './dateinput';

it('renders prefilled input', () => {
  const tree = renderer
    .create(
      <DateInput
        date='2020-03-22'
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
