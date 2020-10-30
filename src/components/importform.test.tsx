import React from "react";
import { render } from "@testing-library/react";
import ImportForm from "./importform";

it("renders form", () => {
  const { container } = render(
    <ImportForm
      tabId="xy123hq"
      onTabIdChange={jest.fn()}
      onSubmit={jest.fn()}
    />
  );
  expect(container.firstChild).toMatchSnapshot();
});
