import { useState } from "react";
import { Head } from "../../../components/seo/head";
import { gql, useMutation } from "@apollo/client";
import { ADD_BOOK } from "../../../gql/queries";
import { useNotificationDispatch } from "../../../contexts/notification";
import { createErrorOptions } from "../../../utils/notify-options-creator";

export const AddBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const notify = useNotificationDispatch();

  const [addBook, { loading }] = useMutation(ADD_BOOK, {
    update: (cache, { data: { addBook: returnedBook } }) => {
      cache.modify({
        fields: {
          allBooks: (cachedData = []) => {
            const bookRef = cache.writeFragment({
              data: returnedBook,
              fragment: gql`
                fragment NewBook on Book {
                  id
                  __typename
                }
              `,
            });
            return [...cachedData, bookRef];
          },
          allAuthors: (cachedData = []) => {
            const authorRef = cache.writeFragment({
              data: returnedBook.author,
              fragment: gql`
                fragment NewAuthor on Author {
                  id
                  __typename
                }
              `,
            });
            return [...cachedData, authorRef];
          },
        },
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (genres.length < 1) {
      alert("Please fill out at least one genre");
      return;
    }

    addBook({
      variables: {
        title,
        author,
        published,
        genres,
      },
      onCompleted: (result) => {
        notify({ message: `Successfully added book ${result.addBook.title}` });
      },
      onError: (error) => {
        notify(createErrorOptions(error));
      },
    });

    setTitle("");
    setAuthor("");
    setPublished("");
    setGenre("");
    setGenres([]);
  };

  return (
    <>
      <Head title="Add Book" />
      <div>
        <h2>Add book</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              title
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              author
              <input
                required
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              published
              <input
                required
                value={published}
                type="number"
                onChange={(e) => setPublished(Number(e.target.value))}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
              <button
                type="button"
                onClick={() =>
                  setGenres((prevState) => prevState.concat(genre))
                }
              >
                add genre
              </button>
              <p>genre list: {genres.join(", ")}</p>
            </label>
          </div>
          {loading ? (
            <button disabled>saving...</button>
          ) : (
            <button>submit</button>
          )}
        </form>
      </div>
    </>
  );
};
