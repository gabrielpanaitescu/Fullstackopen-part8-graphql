import { gql } from "@apollo/client";

export const updateAllBooksCache = (cache, newBook) => {
  const isUnique = (array) => {
    const seen = new Set();

    return array.filter((elem) => {
      const ref = elem.__ref;
      return seen.has(ref) ? false : seen.add(ref);
    });
  };

  const newBookGenres = newBook.genres;

  cache.modify({
    fields: {
      genreList: (existingCachedGenres = []) => {
        const cachedGenresSet = new Set(existingCachedGenres);

        const newGenres = newBookGenres.filter((genre) => {
          return !cachedGenresSet.has(genre);
        });

        return existingCachedGenres.concat(newGenres).sort();
      },
      allBooks: (existingCachedBooks = [], options) => {
        const [fieldName, serializedArgs] = options.storeFieldName.split("(");

        if (fieldName !== "allBooks") return existingCachedBooks;

        let args;

        if (serializedArgs) {
          try {
            args = JSON.parse(serializedArgs.slice(0, -1));
          } catch (e) {
            console.error("Error parsing storeFieldName arguments:", e);
          }
        }

        const newBookRef = cache.writeFragment({
          data: newBook,
          fragment: gql`
            fragment NewBook on Book {
              id
            }
          `,
        });

        if (!args.genres)
          return isUnique(existingCachedBooks.concat(newBookRef));

        const newBookGenresSet = new Set(newBookGenres);
        const shouldUpdateCache = args.genres.every((genre) => {
          return newBookGenresSet.has(genre);
        });

        if (!shouldUpdateCache) return existingCachedBooks;

        return isUnique(existingCachedBooks.concat(newBookRef));
      },
    },
  });
};
