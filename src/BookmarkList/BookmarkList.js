import React, { Component } from "react";
import { Link } from "react-router-dom";
import BookmarksContext from "../BookmarksContext";
import BookmarkItem from "../BookmarkItem/BookmarkItem";
import PropTypes from "prop-types";
import "./BookmarkList.css";

class BookmarkList extends Component {
  static defaultProps = {
    bookmarks: [],
  };

  static contextType = BookmarksContext;

  render() {
    const { bookmarks } = this.context;
    return (
      <section className="BookmarkList">
        <h2>Your bookmarks</h2>
        <ul className="BookmarkList__list" aria-live="polite">
          {bookmarks.map((bookmark) => (
            <div>
              <BookmarkItem key={bookmark.id} {...bookmark} />
            </div>
          ))}
        </ul>
      </section>
    );
  }
}

BookmarkList.propTypes = {
  bookmarks: PropTypes.array,
};

export default BookmarkList;
