import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { getBookQuery } from "../queries/queries";

const BookDetails = ({ id }) => {
  const { loading, error, data } = useQuery(getBookQuery, {
    variables: { id }
  });

  const { book } = data || {};

  const renderContent = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :( {error.message} </p>;
    return renderChildren();
  };

  const renderChildren = () => {
    if (!book) return <p>No book selected</p>;
    return (
      <div>
        <p>Output book details here</p>
        <h2>{book.name}</h2>
        <p>{book.genre}</p>
        <p>{book.author.name}</p>
        <p>All books by this author</p>
        <ul>
          {(book.author.books || []).map(b => (
            <li key={b.id}>{b.name}</li>
          ))}
        </ul>
      </div>
    );
  };

  return <div id="book-details">{renderContent()}</div>;
};

export default BookDetails;
