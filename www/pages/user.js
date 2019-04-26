import React, { useReducer } from 'react';
import fetch from 'isomorphic-unfetch';
import json from '../static/following.json';
import './users.styl';
import Head from '../components/head.js';

function reducer(state, action) {
  switch (action.type) {
    case 'ascending':
      return {
        sort: 'ascending',
        list: sortAscending(state.list)
      };
    case 'descending':
      return {
        sort: 'descending',
        list: sortDescending(state.list)
      };
    default:
      return state;
  }
}

function sortAscending(list) {
  return list.slice(0).sort((a, b) => a.tweets - b.tweets);
}

function sortDescending(list) {
  return list.slice(0).sort((a, b) => b.tweets - a.tweets);
}

function User({ url, user }) {
  console.log(user.following);
  const days = 30;
  const [{ list, sort }, dispatch] = useReducer(reducer, {
    sort: 'descending',
    list: sortDescending(user.following)
  });

  function sortColumn() {
    dispatch({
      type: sort === 'descending' ? 'ascending' : 'descending'
    });
  }

  return (
    <>
      <Head />
      <h1 className="heading">Who “{url.query.name}” follows</h1>
      <table className="users-table">
        <thead className="users-table__header">
          <tr>
            <th className="users-table__cell users-table__cell--column users-table__cell--user">
              Username
            </th>
            <th
              className="users-table__cell users-table__cell--column users-table__cell--numeric"
              aria-sort={sort}
            >
              <button className="users-table__sort" onClick={sortColumn}>
                <span aria-hidden="true">
                  {sort === 'descending' ? '👇' : '👆'}
                </span>
                Tweets Per Day <span className="sr-only">click to sort</span>
              </button>
            </th>
            <th className="users-table__cell users-table__cell--column users-table__cell--numeric users-table__cell--user">
              (total)
            </th>
          </tr>
        </thead>
        <tbody className="users-table__body">
          {list.map(({ username, tweets }) => {
            return (
              <tr key={username} className="users-table__row">
                <td className="users-table__cell users-table__cell--user">
                  <a href={`https://twitter.com/${username}`}>@{username}</a>
                </td>
                <td className="users-table__cell users-table__cell--numeric">
                  {Math.round((tweets / days) * 100) / 100}{' '}
                </td>
                <td className="users-table__cell users-table__cell--numeric">
                  <small>({tweets})</small>
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
  const url = req
    ? `https://${req.headers.host}/api/py?name=${query.name}`
    : `${window.location.origin}/api/py?name=${query.name}`;
  const user = await fetch(url);
  const json = await user.json();
  return { user: json };
};

export default User;
