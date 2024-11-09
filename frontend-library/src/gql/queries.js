import { gql } from "@apollo/client";

export const UPDATE_AUTHOR = gql`
  mutation UpdateAuthor($name: String!, $year: Int!) {
    updateAuthor(name: $name, year: $year) {
      name
      id
      born
      bookCount
    }
  }
`;

export const GET_AUTHOR = gql`
  query GetAuthor($name: String!) {
    getAuthor(name: $name) {
      name
      id
      born
      bookCount
    }
  }
`;

export const GET_AUTHORS = gql`
  query GetAuthors {
    allAuthors {
      name
      id
      born
      bookCount
    }
  }
`;

export const GET_BOOKS = gql`
  query GetBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      title
      published
      author {
        name
        id
      }
      id
    }
  }
`;

export const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $author: String!
    $published: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      id
      title
      author {
        name
        id
      }
      published
      genres
    }
  }
`;
