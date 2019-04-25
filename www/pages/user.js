import React, { useReducer } from "react";
import fetch from "isomorphic-unfetch";
import json from "../static/following.json";
import "./users.styl";

function reducer(state, action) {
  switch (action.type) {
    case "ascending":
      return {
        sort: "ascending",
        list: sortAscending(state.list)
      };
    case "descending":
      return {
        sort: "descending",
        list: sortDescending(state.list)
      };
    default:
      return state;
  }
}

function sortAscending(list) {
  return list.slice(0).sort((a, b) => b.tweets - a.tweets);
}

function sortDescending(list) {
  return list.slice(0).sort((a, b) => a.tweets - b.tweets);
}

function User({ url, user }) {
  const [{ list, sort }, dispatch] = useReducer(reducer, {
    sort: "descending",
    list: sortAscending(json.following)
  });

  function sortColumn() {
    dispatch({
      type: sort === "descending" ? "ascending" : "descending"
    });
  }

  return (
    <>
      <h1>Who {url.query.name} follows</h1>
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th aria-sort={sort}>
              <button onClick={sortColumn}>
                Tweet Count <span className="sr-only">click to sort</span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {list.map(({ username, tweets }) => {
            return (
              <tr key={username}>
                <td>{username}</td>
                <td>{tweets}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

User.getInitialProps = async ({ req, query }) => {
  return {};
  const url = req
    ? `https://${req.headers.host}/api/py/user.py?name=${query.name}`
    : `${window.location.origin}/api/py/user.py?name=${query.name}`;
  const user = await fetch(url);
  return { user };
};

export default User;
