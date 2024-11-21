import { useMutation } from "@apollo/client";
import { useState } from "react";
import { UPDATE_AUTHOR } from "../../gql/queries";
import Select from "react-select";
import { useNotificationDispatch } from "../../contexts/notification";
import { createErrorOptions } from "../../utils/notify-options-creator";

export const UpdateAuthor = ({ authors }) => {
  const [name, setName] = useState(null);
  const [year, setYear] = useState("");
  const [updateAuthor] = useMutation(UPDATE_AUTHOR);
  const notify = useNotificationDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    updateAuthor({
      variables: {
        name: name.value,
        year,
      },
      onError: (error) => {
        notify(createErrorOptions(error));
      },
    });

    setYear("");
  };

  const options = authors.map((author) => {
    return {
      value: author.name,
      label: author.name,
    };
  });

  return (
    <div>
      <h3>Set Birth Year</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: "300px" }}>
        <Select
          onChange={setName}
          options={options}
          placeholder="Choose author"
          required
          styles={{
            control: (baseStyles) => {
              return {
                ...baseStyles,
                backgroundColor: "#121212",
              };
            },
            option: (baseStyles, state) => {
              return {
                ...baseStyles,
                backgroundColor: state.isFocused ? "#f0f0f0" : "#121212",
                color: state.isFocused ? "#121212" : "#f0f0f0",
              };
            },
          }}
        />
        <div>
          <label>
            born
            <input
              required
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              type="number"
            />
          </label>
        </div>
        <button>update</button>
      </form>
    </div>
  );
};
