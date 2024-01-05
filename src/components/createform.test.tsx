import renderer from "react-test-renderer";
import CreateForm from "./createform";

it("renders form", () => {
  const tree = renderer
    .create(
      <CreateForm
        tabName="Badminton"
        onTabNameChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
