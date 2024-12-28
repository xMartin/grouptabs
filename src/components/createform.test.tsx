import { act } from "react";
import renderer from "react-test-renderer";
import CreateForm from "./createform";

it("renders form", () => {
  let tree;
  act(() => {
    tree = renderer.create(
      <CreateForm
        tabName="Badminton"
        onTabNameChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  expect(tree.toJSON()).toMatchSnapshot();
});
