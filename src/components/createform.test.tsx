import React from "react";
import { render } from "@testing-library/react";
import CreateForm from "./createform";

it("renders form", () => {
  const { container } = render(
    <CreateForm
      tabName="Badminton"
      onTabNameChange={jest.fn()}
      onSubmit={jest.fn()}
    />
  );
  expect(container.firstChild).toMatchSnapshot();
});
