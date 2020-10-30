import React from "react";
import { render } from "@testing-library/react";
import DateInput from "./dateinput";

it("renders prefilled input", () => {
  const { container } = render(
    <DateInput date="2020-03-22" onChange={jest.fn()} />
  );
  expect(container.firstChild).toMatchSnapshot();
});
