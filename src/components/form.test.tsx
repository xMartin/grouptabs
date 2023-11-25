import renderer from "react-test-renderer";
import { render, screen } from "@testing-library/react";
import Form from "./form";
import {
  TransactionType,
  DocumentType,
  TransactionFormParticipantStatus as Status,
  TransactionFormParticipantInputType as InputType,
} from "../types";
import { createFormData } from "../util/transactionform";

let realDate: any;

beforeAll(() => {
  const currentDate = new Date("2020-02-20T20:20:20.202Z");
  realDate = Date;
  global.Date = class extends Date {
    constructor(date: any, ...args: any[]) {
      if (date) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

it("renders empty form", () => {
  const tree = renderer
    .create(
      <Form
        mode="new"
        data={createFormData([])}
        onUpdateForm={vi.fn()}
        onUpdateSharedForm={vi.fn()}
        onUpdateDirectForm={vi.fn()}
        onUpdateParticipant={vi.fn()}
        onAddParticipant={vi.fn()}
        onSetAllJoined={vi.fn()}
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders prefilled form", () => {
  const tree = renderer
    .create(
      <Form
        mode="edit"
        data={createFormData(
          [
            {
              participant: "Martin",
              amount: -21,
            },
            {
              participant: "Jan",
              amount: 21,
            },
          ],
          {
            id: "123",
            type: DocumentType.TRANSACTION,
            tabId: "321",
            description: "DESCRIPTION",
            transactionType: TransactionType.SHARED,
            date: "2020-03-24",
            timestamp: "2020-03-24T20:23:21z",
            participants: [
              {
                participant: "Martin",
                amount: 5,
              },
              {
                participant: "Jan",
                amount: 0,
              },
            ],
          }
        )}
        onUpdateForm={vi.fn()}
        onUpdateSharedForm={vi.fn()}
        onUpdateDirectForm={vi.fn()}
        onUpdateParticipant={vi.fn()}
        onAddParticipant={vi.fn()}
        onSetAllJoined={vi.fn()}
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

describe('"all joined" button', () => {
  it("shows button for 2 unjoined participants", () => {
    render(
      <Form
        mode="new"
        data={{
          transactionType: TransactionType.SHARED,
          date: "2011-11-11",
          direct: {
            options: [],
          },
          shared: [
            {
              id: "1",
              inputType: InputType.NEW,
              status: Status.NONE,
            },
            {
              id: "2",
              inputType: InputType.NEW,
              status: Status.NONE,
            },
          ],
        }}
        onUpdateForm={vi.fn()}
        onUpdateSharedForm={vi.fn()}
        onUpdateDirectForm={vi.fn()}
        onUpdateParticipant={vi.fn()}
        onAddParticipant={vi.fn()}
        onSetAllJoined={vi.fn()}
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText("all joined")).toBeInTheDocument();
  });

  it("shows no button for 2 joined and 1 unjoined participant", () => {
    render(
      <Form
        mode="new"
        data={{
          transactionType: TransactionType.SHARED,
          date: "2011-11-11",
          direct: {
            options: [],
          },
          shared: [
            {
              id: "1",
              inputType: InputType.NEW,
              status: Status.PAID,
            },
            {
              id: "2",
              inputType: InputType.NEW,
              status: Status.JOINED,
            },
            {
              id: "3",
              inputType: InputType.NEW,
              status: Status.NONE,
            },
          ],
        }}
        onUpdateForm={vi.fn()}
        onUpdateSharedForm={vi.fn()}
        onUpdateDirectForm={vi.fn()}
        onUpdateParticipant={vi.fn()}
        onAddParticipant={vi.fn()}
        onSetAllJoined={vi.fn()}
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.queryByText("all joined")).not.toBeInTheDocument();
  });
});
