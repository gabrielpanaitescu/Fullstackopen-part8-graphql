import { gql } from "@apollo/client";

export const GET_GENRE_LIST = gql`
  query GetGenreList {
    genreList
  }
`;

export const SET_FAVORITE_GENRE = gql`
  mutation SetFavoriteGenre($genre: String!) {
    setFavoriteGenre(genre: $genre) {
      username
      favoriteGenre
    }
  }
`;

export const CURRENT_USER = gql`
  query Me {
    me {
      username
      favoriteGenre
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      username
    }
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

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
  query GetBooks($author: String, $genres: [String!]) {
    allBooks(author: $author, genres: $genres) {
      genres
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
    $published: Int!
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
