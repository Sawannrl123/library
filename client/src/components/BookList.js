import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { getBooksQuery } from "../queries/queries";
import BookDetails from "./BookDetails";

const BookList = () => {
  const { loading, error, data } = useQuery(getBooksQuery);
  const [bookId, setBookId] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error.message} </p>;

  return (
    <div>
      <ul id="book-list">
        {(data?.books || []).map(book => (
          <li key={book.id} onClick={() => setBookId(book.id)}>
            {book.name}
          </li>
        ))}
      </ul>
      <BookDetails id={bookId} />
    </div>
  );
};

export default BookList;
