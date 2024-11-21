import { useMutation, useQuery } from "@apollo/client";
import { GET_BOOKS, SET_FAVORITE_GENRE } from "../../../gql/queries";
import { Head } from "../../../components/seo/head";
import { useState } from "react";
import { BookList } from "../../../components/ui/book-list";
import { useNotificationDispatch } from "../../../contexts/notification";

export const booksLoader = (apolloClient) => async () => {
  const cachedData = apolloClient.readQuery({
    query: GET_BOOKS,
  });

  return (
    cachedData ??
    (await apolloClient.query({
      query: GET_BOOKS,
      fetchPolicy: "network-first",
    }))
  );
};

export const Books = () => {
  const notify = useNotificationDispatch();
  const [genreFilter, setGenreFilter] = useState(null);
  const { data, loading } = useQuery(GET_BOOKS, {
    variables: genreFilter ? { genre: genreFilter } : null,
  });
  const [setFavoriteGenre] = useMutation(SET_FAVORITE_GENRE);

  if (loading) return <div>loading..</div>;

  const books = data.allBooks;

  const genres = [...new Set(books.map((book) => book.genres).flat())];

  const handleGenreFilter = (e) => {
    setGenreFilter(e.target.textContent);
  };

  const handleFavorite = () => {
    setFavoriteGenre({
      variables: genreFilter && { genre: genreFilter },
      update: (
        cache,
        {
          data: {
            setFavoriteGenre: { favoriteGenre },
          },
        }
      ) => {
        console.log("setFavoriteGenre", favoriteGenre);
        cache.modify({
          fields: {
            me: (oldMe) => {
              return {
                ...oldMe,
                favoriteGenre,
              };
            },
          },
        });
      },
      onCompleted: ({ setFavoriteGenre: { favoriteGenre } }) => {
        notify({
          message: `Successfully added '${favoriteGenre}' as favorite genre`,
        });
      },
    });
  };

  return (
    <>
      <Head title="Books" />

      <div>
        <h2>Books</h2>
        <BookList books={books} />
        <div>
          {genreFilter ? (
            <>
              <p style={{ marginRight: 5 }}>Genre: {genreFilter}</p>
              <button
                onClick={handleFavorite}
                style={{ marginRight: 5, backgroundColor: "gold" }}
              >
                add to favorite
              </button>
              <button
                onClick={() => setGenreFilter(null)}
                style={{
                  backgroundColor: "darkred",
                  color: "#f0f0f0",
                }}
              >
                remove filter
              </button>
            </>
          ) : (
            <div style={{ marginTop: 30 }}>
              filter by genre:
              {genres.map((genre) => {
                return (
                  <button
                    style={{ marginRight: 5 }}
                    key={genre}
                    onClick={handleGenreFilter}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
