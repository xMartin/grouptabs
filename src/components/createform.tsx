import React, { PureComponent, SyntheticEvent } from "react";
import { control } from "../util/form";

interface Props {
  tabName?: string;
  onTabNameChange: (tabName: string) => void;
  onSubmit: (tabName: string) => void;
}

export default class CreateForm extends PureComponent<Props> {
  handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    var name = this.props.tabName?.trim();
    if (name) {
      this.props.onSubmit(name);
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="create-form">
        <input
          type="text"
          className="full-width"
          placeholder="Tab name …"
          value={control(this.props.tabName)}
          onChange={(event: SyntheticEvent<HTMLInputElement>) =>
            this.props.onTabNameChange(event.currentTarget.value)
          }
        />
        <button className="create">Create</button>
      </form>
    );
  }
}
