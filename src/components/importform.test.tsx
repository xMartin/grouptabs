import renderer from "react-test-renderer";
import ImportForm from "./importform";

it("renders form", () => {
  const tree = renderer
    .create(
      <ImportForm tabId="xy123hq" onTabIdChange={vi.fn()} onSubmit={vi.fn()} />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
