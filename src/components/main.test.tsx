import React from "react";
import renderer from "react-test-renderer";
import Main from "./main";

it("renders empty view with no tab selected", () => {
  const tree = renderer
    .create(
      <Main
        accounts={[]}
        transactions={[]}
        total={0}
        onChangeTabClick={jest.fn()}
        onNavigateToAddTransaction={jest.fn()}
        onDetailsClick={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders missing tab info error", () => {
  const tree = renderer
    .create(
      <Main
        tabId="1"
        accounts={[]}
        transactions={[]}
        total={0}
        onChangeTabClick={jest.fn()}
        onNavigateToAddTransaction={jest.fn()}
        onDetailsClick={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
