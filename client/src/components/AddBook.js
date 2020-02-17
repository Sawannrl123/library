import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  getAuthorsQuery,
  addBookMutation,
  getBooksQuery
} from "../queries/queries";

const AddBook = () => {
  const [addBook, setAddBook] = useState({
    name: "",
    genre: "",
    authorId: ""
  });

  const { loading, error, data } = useQuery(getAuthorsQuery);

  const [insertBook] = useMutation(addBookMutation);

  if (error) return <p> Error: {error.message} </p>;

  const handleOnChange = e => {
    setAddBook({
      ...addBook,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    insertBook({
      variables: {
        name: addBook.name,
        genre: addBook.genre,
        authorId: addBook.authorId
      },
      refetchQueries: [{ query: getBooksQuery }]
    });

    setAddBook({
      name: "",
      genre: "",
      authorId: ""
    });
  };

  return (
    <form id="add-book" onSubmit={handleSubmit}>
      <h1>Add New Book</h1>
      <div className="field">
        <label> Book Name: </label>
        <input
          value={addBook.name}
          type="text"
          name="name"
          onChange={handleOnChange}
          required
        />
      </div>
      <div className="field">
        <label> Genre: </label>
        <input
          type="text"
          value={addBook.genre}
          name="genre"
          onChange={handleOnChange}
          required
        />
      </div>
      <div className="field">
        <label> Author: </label>
        {error ? (
          error.message
        ) : (
          <select
            name="authorId"
            onChange={handleOnChange}
            value={addBook.authorId}
            required
          >
            <option value="">
              {" "}
              {loading ? "Loading..." : "Select author"}{" "}
            </option>{" "}
            {(data?.authors || []).map(author => (
              <option value={author.id} key={author.id}>
                {" "}
                {author.name}{" "}
              </option>
            ))}{" "}
          </select>
        )}
      </div>
      <button type="submit">+</button>
    </form>
  );
};

export default AddBook;
