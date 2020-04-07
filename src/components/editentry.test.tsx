import React from "react";
import renderer from "react-test-renderer";
import EditEntry from "./editentry";
import {
  TransactionType,
  TransactionFormParticipantStatus,
  TransactionFormParticipantInputType,
} from "../types";
import { createFormData } from "../util/transactionform";

let realDate: any;

beforeAll(() => {
  const currentDate = new Date("2020-02-20T20:20:20.202Z");
  realDate = Date;
  global.Date = class extends Date {
    constructor(date: any, ...args: any[]) {
      if (date) {
        // @ts-ignore
        return super(date, ...args);
      }

      return currentDate;
    }
  } as any;
});

afterAll(() => {
  global.Date = realDate;
});

it("renders loader when checking remote tab", () => {
  const tree = renderer
    .create(
      <EditEntry
        mode="new"
        checkingRemoteTab={true}
        onInitForm={jest.fn()}
        onUpdateForm={jest.fn()}
        onUpdateSharedForm={jest.fn()}
        onUpdateDirectForm={jest.fn()}
        onUpdateParticipant={jest.fn()}
        onAddParticipant={jest.fn()}
        onSetAllJoined={jest.fn()}
        onChangeTabClick={jest.fn()}
        onCloseClick={jest.fn()}
        onSave={jest.fn()}
        onDelete={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders empty form", () => {
  const tree = renderer
    .create(
      <EditEntry
        mode="new"
        formState={createFormData([])}
        onInitForm={jest.fn()}
        onUpdateForm={jest.fn()}
        onUpdateSharedForm={jest.fn()}
        onUpdateDirectForm={jest.fn()}
        onUpdateParticipant={jest.fn()}
        onAddParticipant={jest.fn()}
        onSetAllJoined={jest.fn()}
        onChangeTabClick={jest.fn()}
        onCloseClick={jest.fn()}
        onSave={jest.fn()}
        onDelete={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders loader in edit mode with no data", () => {
  const tree = renderer
    .create(
      <EditEntry
        mode="edit"
        onInitForm={jest.fn()}
        onUpdateForm={jest.fn()}
        onUpdateSharedForm={jest.fn()}
        onUpdateDirectForm={jest.fn()}
        onUpdateParticipant={jest.fn()}
        onAddParticipant={jest.fn()}
        onSetAllJoined={jest.fn()}
        onChangeTabClick={jest.fn()}
        onCloseClick={jest.fn()}
        onSave={jest.fn()}
        onDelete={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders prefilled form", () => {
  const tree = renderer
    .create(
      <EditEntry
        mode="edit"
        formState={{
          description: "DESCRIPTION",
          transactionType: TransactionType.SHARED,
          date: "2020-03-24",
          shared: [
            {
              id: "1",
              inputType: TransactionFormParticipantInputType.EXISTING,
              participant: "Martin",
              status: TransactionFormParticipantStatus.JOINED,
              amount: 5,
            },
            {
              id: "2",
              inputType: TransactionFormParticipantInputType.EXISTING,
              participant: "Jan",
              status: TransactionFormParticipantStatus.JOINED,
              amount: 0,
            },
          ],
          direct: {
            options: [],
          },
        }}
        onInitForm={jest.fn()}
        onUpdateForm={jest.fn()}
        onUpdateSharedForm={jest.fn()}
        onUpdateDirectForm={jest.fn()}
        onUpdateParticipant={jest.fn()}
        onAddParticipant={jest.fn()}
        onSetAllJoined={jest.fn()}
        onChangeTabClick={jest.fn()}
        onCloseClick={jest.fn()}
        onSave={jest.fn()}
        onDelete={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
