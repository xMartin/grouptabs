import { act } from "react";
import renderer from "react-test-renderer";
import ImportForm from "./importform";

it("renders form", () => {
  let tree;
  act(() => {
    tree = renderer.create(
      <ImportForm tabId="xy123hq" onTabIdChange={vi.fn()} onSubmit={vi.fn()} />,
    );
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  expect(tree.toJSON()).toMatchSnapshot();
});
