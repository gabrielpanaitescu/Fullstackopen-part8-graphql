import { useMutation } from "@apollo/client";
import { useState } from "react";
import { UPDATE_AUTHOR } from "../../gql/queries";
import Select from "react-select";

export const UpdateAuthor = ({ authors }) => {
  const [name, setName] = useState(null);
  const [year, setYear] = useState("");
  const [updateAuthor, result] = useMutation(UPDATE_AUTHOR);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(name);

    updateAuthor({
      variables: {
        name: name.value,
        year,
      },
    });

    setName("");
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
      <form onSubmit={handleSubmit}>
        <Select
          defaultValue={name}
          onChange={setName}
          options={options}
          placeholder="Choose author"
          required
        />

        {/* <div>
          <label>
            name
            <select
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            >
              <option disabled value="">
                Choose author
              </option>
              {authors.map((author) => (
                <option key={author.id} value={author.name}>
                  {author.name}
                </option>
              ))}
            </select>
          </label>
        </div> */}
        <div>
          <label>
            born
            <input
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
