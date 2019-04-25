import React, { useReducer } from "react";
import fetch from "isomorphic-unfetch";
import json from "../static/following.json";
import "./users.styl";
import Head from "../components/head.js";

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
      <Head />
      <h1>Who {url.query.name} follows</h1>
      <table className="users-table">
        <thead className="users-table__header">
          <tr>
            <th className="users-table__column users-table__column--user">
              Username
            </th>
            <th
              className="users-table__column users-table__column--count"
              aria-sort={sort}
            >
              <button className="users-table__sort" onClick={sortColumn}>
                Tweet Count <span className="sr-only">click to sort</span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="users-table__body">
          {list.map(({ username, tweets }) => {
            return (
              <tr key={username} className="users-table__row">
                <td className="users-table__cell users-table__cell--user">
                  {username}
                </td>
                <td className="users-table__cell users-table__cell--count">
                  {tweets}
                </td>
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
