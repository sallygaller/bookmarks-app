import React from "react";
import { Link } from "react-router-dom";
import Rating from "../Rating/Rating";
import BookmarksContext from "../BookmarksContext";
import config from "../config";
import "./BookmarkItem.css";
import PropTypes from "prop-types";

function deleteBookmarkRequest(bookmarkId, cb) {
  fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        // get the error message from the response,
        return res.json().then((error) => {
          // then throw it
          throw error;
        });
      }
      return res.json();
    })
    .then((data) => {
      console.log({ data });
      cb(bookmarkId);
    })
    .catch((error) => {
      console.log(error);
    });
}

export default function BookmarkItem(props) {
  return (
    <BookmarksContext.Consumer>
      {(context) => (
        <li className="BookmarkItem">
          <div className="BookmarkItem__row">
            <h3 className="BookmarkItem__title">
              <a href={props.url} target="_blank" rel="noopener noreferrer">
                {props.title}
              </a>
            </h3>
            <Rating value={props.rating} />
          </div>
          <p className="BookmarkItem__description">{props.description}</p>
          <div className="BookmarkItem__buttons">
            <button>
              <Link to={`/edit/${props.id}`}>Edit Bookmark</Link>
            </button>
            <button
              className="BookmarkItem__description"
              onClick={() => {
                deleteBookmarkRequest(props.id, context.deleteBookmark);
              }}
            >
              Delete
            </button>
          </div>
        </li>
      )}
    </BookmarksContext.Consumer>
  );
}

BookmarkItem.defaultProps = {
  onClickDelete: () => {},
};

BookmarkItem.propTypes = {
  title: PropTypes.string.isRequired,
  url: (props, propName, componentName) => {
    //get the value of the prop
    const prop = props[propName];
    //do the isRequired check
    if (!prop) {
      return new Error(
        `${propName} is required in ${componentName}. Validation failed.`
      );
    }
    //check the type
    if (typeof prop != "string") {
      return new Error(
        `Invalid prop, ${propName} is expecting a string in ${componentName}. ${typeof prop} found.`
      );
    }
    //do the custom check here
    //using a simple regex
    if (prop.length < 5 || !prop.match(new RegExp(/^https?:\/\//))) {
      return new Error(
        `Invalid prop, ${propName} must be min length 5 and begin http(s)://. Validation failed.`
      );
    }
  },
  rating: PropTypes.number,
  description: PropTypes.string,
};
