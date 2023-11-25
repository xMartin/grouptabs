import renderer from "react-test-renderer";
import Tabs from "./tabs";
import { DocumentType } from "../types";

it("renders tab view", () => {
  const tree = renderer
    .create(
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
        onTabClick={vi.fn()}
        onCreateTabInputChange={vi.fn()}
        onCreateNewTab={vi.fn()}
        onImportTabInputChange={vi.fn()}
        onImportTab={vi.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders empty tab view", () => {
  const tree = renderer
    .create(
      <Tabs
        data={[]}
        onTabClick={vi.fn()}
        onCreateTabInputChange={vi.fn()}
        onCreateNewTab={vi.fn()}
        onImportTabInputChange={vi.fn()}
        onImportTab={vi.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
