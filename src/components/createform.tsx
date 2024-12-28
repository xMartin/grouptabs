import { memo, FunctionComponent, ChangeEvent, FormEventHandler } from "react";
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
  const handleSubmit: FormEventHandler = (event) => {
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
        placeholder="Group title …"
        value={control(tabName)}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onTabNameChange(event.currentTarget.value)
        }
      />
      <button className="create">Create</button>
    </form>
  );
};

export default memo(CreateForm);
