import { act } from "react";
import renderer from "react-test-renderer";
import DateInput from "./dateinput";

it("renders prefilled input", () => {
  let tree;
  act(() => {
    tree = renderer.create(<DateInput date="2020-03-22" onChange={vi.fn()} />);
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  expect(tree.toJSON()).toMatchSnapshot();
});
