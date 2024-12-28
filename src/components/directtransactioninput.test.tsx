import { act } from "react";
import renderer from "react-test-renderer";
import DirectTransactionInput from "./directtransactioninput";
import { NEW_PARTICIPANT_OPTION } from "../util/transactionform";

it("renders empty", () => {
  let tree;
  act(() => {
    tree = renderer.create(
      <DirectTransactionInput
        data={{
          options: ["Jan", "Martin", NEW_PARTICIPANT_OPTION],
        }}
        onChange={vi.fn()}
      />,
    );
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  expect(tree.toJSON()).toMatchSnapshot();
});

it("renders prefilled", () => {
  let tree;
  act(() => {
    tree = renderer.create(
      <DirectTransactionInput
        data={{
          from: "Martin",
          to: "Jan",
          amount: 11,
          options: ["Jan", "Martin", NEW_PARTICIPANT_OPTION],
        }}
        onChange={vi.fn()}
      />,
    );
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  expect(tree.toJSON()).toMatchSnapshot();
});
