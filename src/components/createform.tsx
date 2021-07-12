import React, { SyntheticEvent, memo, FunctionComponent } from "react";
import { control } from "../util/form";

interface Props {
  tabName?: string;
  onTabNameChange: (tabName: string) => void;
  onSubmit: (tabName: string) => void;
}

const CreateForm: FunctionComponent<Props> = ({
  tabName,
  onTabNameChange,
  onSubmit,
}) => {
  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = tabName?.trim();
    if (name) {
      onSubmit(name);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-form">
      <input
        type="text"
        className="full-width"
        placeholder="Create new tab"
        value={control(tabName)}
        onChange={(event: SyntheticEvent<HTMLInputElement>) =>
          onTabNameChange(event.currentTarget.value)
        }
        onFocus={(e) => (e.target.placeholder = "Tab name …")}
        onBlur={(e) => (e.target.placeholder = "Create new tab")}
      />
      <button className="create-tab">Create</button>
    </form>
  );
};

export default memo(CreateForm);
