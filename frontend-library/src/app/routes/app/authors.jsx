import { useQuery } from "@apollo/client";
import { GET_AUTHORS } from "../../../gql/queries";
import { Head } from "../../../components/seo/head";
import { UpdateAuthor } from "../../../components/ui/update-author";

export const authorsLoader = (apolloClient) => async () => {
  const cachedData = apolloClient.readQuery({ query: GET_AUTHORS });

  return (
    cachedData ??
    (await apolloClient.query({
      query: GET_AUTHORS,
      fetchPolicy: "cache-first",
    }))
  );
};

export const Authors = () => {
  const { data, loading } = useQuery(GET_AUTHORS);

  if (loading) return <div>loading...</div>;

  return (
    <>
      <Head title="Authors"></Head>
      <h2>Authors</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Born</th>
            <th>Books</th>
          </tr>
        </thead>
        <tbody>
          {data.allAuthors.map((author) => {
            return (
              <tr key={author.id}>
                <td>{author.name}</td>
                {author.born ? <td>{author.born}</td> : <td></td>}
                <td>{author.bookCount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <UpdateAuthor authors={data.allAuthors} />
    </>
  );
};
