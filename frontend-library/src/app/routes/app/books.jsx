import { useMutation, useQuery } from "@apollo/client";
import {
  GET_BOOKS,
  GET_GENRE_LIST,
  SET_FAVORITE_GENRE,
} from "../../../gql/queries";
import { Head } from "../../../components/seo/head";
import { useEffect, useState } from "react";
import { BookList } from "../../../components/ui/book-list";
import { useNotificationDispatch } from "../../../contexts/notification";
import { default as Select, components } from "react-select";

export const booksLoader = (apolloClient) => async () => {
  const booksQueryOptions = {
    query: GET_BOOKS,
  };

  const genreListQueryOptions = {
    query: GET_GENRE_LIST,
  };

  const promises = [
    apolloClient.readQuery(booksQueryOptions) ??
      apolloClient.query(booksQueryOptions),
    apolloClient.readQuery(genreListQueryOptions) ??
      apolloClient.query(genreListQueryOptions),
  ];

  const [booksData, genreListData] = await Promise.all(promises);

  return {
    booksData,
    genreListData,
  };
};

const FavoriteGenreSelect = () => {
  const notify = useNotificationDispatch();
  const [setFavoriteGenre] = useMutation(SET_FAVORITE_GENRE);
  const { data, loading } = useQuery(GET_GENRE_LIST);
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    if (selectedGenre) {
      setFavoriteGenre({
        variables: selectedGenre ? { genre: selectedGenre } : null,
        update: (
          cache,
          {
            data: {
              setFavoriteGenre: { favoriteGenre },
            },
          }
        ) => {
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
            message: `Successfully set '${favoriteGenre}' as favorite genre`,
          });
        },
      });
    }
  }, [selectedGenre]);

  if (loading) return <div>loading...</div>;

  const handleChange = (e) => {
    const genre = e.target.value;

    setSelectedGenre(genre);
  };

  const genres = data.genreList;

  return (
    <div style={{ marginTop: 25 }}>
      <h3>Set favorite genre</h3>
      <select value={selectedGenre} onChange={handleChange}>
        <option disabled></option>
        {genres.map((genre) => (
          <option value={genre} key={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
};

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          style={{ accentColor: "#121212" }}
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

export const Books = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [genreFilter, setGenreFilter] = useState([]);

  const { data: booksData, loading: booksLoading } = useQuery(GET_BOOKS, {
    variables: genreFilter.length > 0 ? { genres: genreFilter } : null,
  });
  const { data: genreListData, loading: genreListLoading } =
    useQuery(GET_GENRE_LIST);

  if (booksLoading || genreListLoading) return <div>loading..</div>;

  const books = booksData.allBooks;
  const genres = genreListData.genreList;

  const optionsValues = genres.map((genre) => ({
    value: genre,
    label: genre.charAt(0).toUpperCase() + genre.slice(1),
  }));

  const handleChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  const handleSetFilter = () => {
    if (selectedOptions.length === 0) {
      setGenreFilter([]);
      return;
    }

    const genres = selectedOptions.map((option) => option.value);
    setGenreFilter(genres);
  };

  const handleClearFilter = () => {
    setSelectedOptions([]);
    setGenreFilter([]);
  };

  return (
    <>
      <Head title="Books" />
      <div>
        <div>
          <button onClick={handleSetFilter}>Set filter</button>
          <button onClick={handleClearFilter}>Quick clear</button>
          <Select
            value={selectedOptions}
            onChange={handleChange}
            components={{
              Option,
            }}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            options={optionsValues}
            styles={{
              control: (baseStyles) => {
                return {
                  ...baseStyles,
                  maxWidth: 400,
                };
              },
              menu: (baseStyles) => {
                return {
                  ...baseStyles,
                  width: 400,
                };
              },
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                neutral0: "#121212",
                neutral30: "white",
                primary25: "grey",
                primary: "grey",
                primary50: "grey",
              },
            })}
          />
        </div>
        <h2>Books</h2>
        <BookList books={books} />
        <FavoriteGenreSelect />
      </div>
    </>
  );
};
