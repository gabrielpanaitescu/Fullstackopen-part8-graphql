import { useQuery } from "@apollo/client";
import { CURRENT_USER, GET_BOOKS } from "../../../gql/queries";
import { Head } from "../../../components/seo/head";
import { BookList } from "../../../components/ui/book-list";

export const recommendedLoader = (apolloClient) => async () => {
  const cachedUser = apolloClient.readQuery({
    query: CURRENT_USER,
  });

  if (cachedUser) {
    const favoriteGenre = cachedUser.me.favoriteGenre;

    const cachedBooks = apolloClient.readQuery({
      query: GET_BOOKS,
      variables: favoriteGenre && { genre: favoriteGenre },
    });

    return (
      cachedBooks ??
      (await apolloClient.query({
        query: GET_BOOKS,
        variables: favoriteGenre && { genre: favoriteGenre },
      }))
    );
  }

  const fetchedUser = await apolloClient.query({
    query: CURRENT_USER,
    fetchPolicy: "network-only",
  });

  const favoriteGenre = fetchedUser.data.me.favoriteGenre;

  return await apolloClient.query({
    query: GET_BOOKS,
    variables: favoriteGenre && { genre: favoriteGenre },
  });
};

export const Recommended = () => {
  const { data: userData, loading: userLoading } = useQuery(CURRENT_USER, {
    fetchPolicy: "cache-first",
  });

  const favoriteGenre = userData.me.favoriteGenre;

  const { data: booksData, loading: booksLoading } = useQuery(GET_BOOKS, {
    variables: favoriteGenre && { genre: favoriteGenre },
  });

  if (userLoading || booksLoading) return <div>loading...</div>;

  let books;
  if (booksData.allBooks) books = booksData.allBooks;

  return (
    <>
      <Head title="Recommended" />
      <h2>Book Recommendations</h2>
      {favoriteGenre ? (
        <>
          <p>
            Your favorite genre is: <em>{favoriteGenre}</em>
          </p>
          <BookList books={books} />
        </>
      ) : (
        <p>No favorite genre selected yet!</p>
      )}
    </>
  );
};
