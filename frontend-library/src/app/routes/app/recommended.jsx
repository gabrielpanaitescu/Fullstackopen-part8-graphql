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
      variables: favoriteGenre ? { genres: [favoriteGenre] } : null,
    });

    return (
      cachedBooks ??
      (await apolloClient.query({
        query: GET_BOOKS,
        variables: favoriteGenre ? { genres: [favoriteGenre] } : null,
      }))
    );
  }

  const fetchedUser = await apolloClient.query({
    query: CURRENT_USER,
    fetchPolicy: "network-only",
  });

  if (!fetchedUser.data) return null;

  const favoriteGenre = fetchedUser.data.me.favoriteGenre;

  return await apolloClient.query({
    query: GET_BOOKS,
    variables: favoriteGenre && { genres: [favoriteGenre] },
  });
};

export const Recommended = () => {
  const { data: userData, loading: userLoading } = useQuery(CURRENT_USER);

  const favoriteGenre = userData.me ? userData.me.favoriteGenre : null;

  const { data: booksData, loading: booksLoading } = useQuery(GET_BOOKS, {
    variables: favoriteGenre ? { genres: [favoriteGenre] } : null,
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
