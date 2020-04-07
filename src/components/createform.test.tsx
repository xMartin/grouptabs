import React from "react";
import renderer from "react-test-renderer";
import CreateForm from "./createform";

it("renders form", () => {
  const tree = renderer
    .create(
      <CreateForm
        tabName="Badminton"
        onTabNameChange={jest.fn()}
        onSubmit={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
