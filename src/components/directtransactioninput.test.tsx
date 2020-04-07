import React from "react";
import renderer from "react-test-renderer";
import DirectTransactionInput from "./directtransactioninput";
import { NEW_PARTICIPANT_OPTION } from "../util/transactionform";

it("renders empty", () => {
  const tree = renderer
    .create(
      <DirectTransactionInput
        data={{
          options: ["Jan", "Martin", NEW_PARTICIPANT_OPTION],
        }}
        onChange={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders prefilled", () => {
  const tree = renderer
    .create(
      <DirectTransactionInput
        data={{
          from: "Martin",
          to: "Jan",
          amount: 11,
          options: ["Jan", "Martin", NEW_PARTICIPANT_OPTION],
        }}
        onChange={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
