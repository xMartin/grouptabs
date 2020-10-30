import React from "react";
import { render } from "@testing-library/react";
import Tabs from "./tabs";
import { DocumentType } from "../types";

it("renders tab view", () => {
  const { container } = render(
    <Tabs
      data={[
        {
          id: "123",
          info: {
            id: "123",
            type: DocumentType.INFO,
            tabId: "567",
            name: "TAB NAME",
          },
        },
      ]}
      onTabClick={jest.fn()}
      onCreateTabInputChange={jest.fn()}
      onCreateNewTab={jest.fn()}
      onImportTabInputChange={jest.fn()}
      onImportTab={jest.fn()}
    />
  );
  expect(container.firstChild).toMatchSnapshot();
});

it("renders empty tab view", () => {
  const { container } = render(
    <Tabs
      data={[]}
      onTabClick={jest.fn()}
      onCreateTabInputChange={jest.fn()}
      onCreateNewTab={jest.fn()}
      onImportTabInputChange={jest.fn()}
      onImportTab={jest.fn()}
    />
  );
  expect(container.firstChild).toMatchSnapshot();
});
