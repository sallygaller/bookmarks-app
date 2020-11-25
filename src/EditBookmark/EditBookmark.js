import React from "react";
import BookmarksContext from "../BookmarksContext";
import config from "../config";

class EditBookmark extends React.Component {
  static contextType = BookmarksContext;

  state = {
    error: null,
    id: "",
    title: "",
    url: "",
    description: "",
    rating: 1,
  };

  componentDidMount() {
    const bookmarkId = this.props.match.params.bookmarkId;
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.API_TOKEN}`,
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
      .then((responseData) => {
        this.setState({
          id: bookmarkId,
          title: responseData.title,
          url: responseData.url,
          description: responseData.description,
          rating: responseData.rating,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error });
      });
  }

  handleChangeTitle = (e) => {
    this.setState({ title: e.target.value });
  };

  handleChangeUrl = (e) => {
    this.setState({ url: e.target.value });
  };

  handleChangeDescription = (e) => {
    this.setState({ description: e.target.value });
  };

  handleChangeRating = (e) => {
    this.setState({ rating: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { bookmarkId } = this.props.match.params;
    const { id, title, url, description, rating } = this.state;
    const newBookmark = { id, title, url, description, rating };

    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: "PATCH",
      body: JSON.stringify(newBookmark),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${config.API_TOKEN}`,
      },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((error) => Promise.reject(error));
      })
      .then(() => {
        this.resetFields(newBookmark);
        this.context.updateBookmark(newBookmark);
        this.props.history.push("/");
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  };

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || "",
      title: newFields.title || "",
      url: newFields.url || "",
      description: newFields.description || "",
      rating: newFields.rating || "",
    });
  };

  handleClickCancel = () => {
    this.props.history.push("/");
  };

  render() {
    const { error, title, url, description, rating } = this.state;
    return (
      <section className="EditBookmarkForm">
        <h2>Edit bookmark</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="EditBookmark__error" role="alert">
            {error && <p>{error.message}</p>}
          </div>
          <input
            id="title"
            type="text"
            name="title"
            placeholder={this.state.title}
            required
            value={title}
            onChange={this.handleChangeTitle}
          />
          <br />
          <input
            id="url"
            type="text"
            name="url"
            placeholder={this.state.url}
            required
            value={url}
            onChange={this.handleChangeUrl}
          />
          <br />
          <input
            id="description"
            type="text"
            name="description"
            placeholder={this.state.description}
            value={description}
            onChange={this.handleChangeDescription}
          />
          <br />
          <input
            id="rating"
            type="integer"
            name="rating"
            placeholder={this.state.rating}
            required
            value={rating}
            onChange={this.handleChangeRating}
          />
          <br />
          <button type="button" onClick={this.handleClickCancel}>
            Cancel
          </button>
          <button type="submit" onClick={this.handleSubmit}>
            Submit
          </button>
        </form>
      </section>
    );
  }
}

export default EditBookmark;
