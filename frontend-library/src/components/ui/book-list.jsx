export const BookList = ({ books }) => (
  <table>
    <thead>
      <tr>
        <th></th>
        <th>author</th>
        <th>published</th>
        <th>genres</th>
      </tr>
    </thead>
    <tbody>
      {books.map((book) => {
        return (
          <tr key={book.id}>
            <td>{book.title}</td>
            <td>{book.author.name}</td>
            <td>{book.published}</td>
            <td>{book.genres.join(", ")}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
);
