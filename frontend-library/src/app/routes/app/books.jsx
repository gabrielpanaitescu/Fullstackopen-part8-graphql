import { useQuery } from "@apollo/client";
import { GET_BOOKS } from "../../../gql/queries";
import { Head } from "../../../components/seo/head";

export const Books = () => {
  const { data, loading, error } = useQuery(GET_BOOKS);

  if (loading) return <div>loading...</div>;

  return (
    <>
      <Head title="Books" />
      <div>
        <h2>Books</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
          </thead>
          <tbody>
            {data.allBooks.map((book) => {
              return (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author.name}</td>
                  <td>{book.published}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
