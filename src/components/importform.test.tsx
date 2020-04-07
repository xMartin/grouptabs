import React from "react";
import renderer from "react-test-renderer";
import ImportForm from "./importform";

it("renders form", () => {
  const tree = renderer
    .create(
      <ImportForm
        tabId="xy123hq"
        onTabIdChange={jest.fn()}
        onSubmit={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
