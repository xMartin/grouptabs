import React from "react";
import { render } from "@testing-library/react";
import DirectTransactionInput from "./directtransactioninput";
import { NEW_PARTICIPANT_OPTION } from "../util/transactionform";

it("renders empty", () => {
  const { container } = render(
    <DirectTransactionInput
      data={{
        options: ["Jan", "Martin", NEW_PARTICIPANT_OPTION],
      }}
      onChange={jest.fn()}
    />
  );
  expect(container.firstChild).toMatchSnapshot();
});

it("renders prefilled", () => {
  const { container } = render(
    <DirectTransactionInput
      data={{
        from: "Martin",
        to: "Jan",
        amount: 11,
        options: ["Jan", "Martin", NEW_PARTICIPANT_OPTION],
      }}
      onChange={jest.fn()}
    />
  );
  expect(container.firstChild).toMatchSnapshot();
});
