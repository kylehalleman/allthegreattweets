import React from 'react';
import fetch from 'isomorphic-unfetch';
import './users.styl';
import Head from '../components/head.js';
import Main from '../components/main';

function User({ url, list }) {
  const days = 30;
  const total = list.reduce((acc, { tweets }) => acc + tweets, 0);

  return (
    <>
      <Head />
      <Main>
        <h1 className="heading">Who “{url.query.name}” follows</h1>
        <span>Total tweets: {total}</span>
        <span>Total tweets per day: {total / 30}</span>
        <table className="users-table">
          <thead className="users-table__header">
            <tr className="users-table__row users-table__row--header">
              <th className="users-table__cell users-table__cell--column users-table__cell--user">
                Username
              </th>
              <th className="users-table__cell users-table__cell--column users-table__cell--numeric">
                Tweets Per Day
              </th>
              <th className="users-table__cell users-table__cell--column users-table__cell--numeric users-table__cell--user">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="users-table__body">
            {list.map(({ username, tweets }) => {
              return (
                <tr
                  key={username}
                  className="users-table__row users-table__row--body"
                >
                  <td className="users-table__cell users-table__cell--user">
                    <a href={`https://twitter.com/${username}`}>@{username}</a>
                  </td>
                  <td className="users-table__cell users-table__cell--numeric">
                    {Math.round((tweets / days) * 100) / 100}{' '}
                  </td>
                  <td className="users-table__cell users-table__cell--numeric">
                    <small>{tweets}</small>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Main>
    </>
  );
}

User.getInitialProps = async ({ req, query }) => {
  const lang = process.env.API_LANG || 'py';
  const url = req
    ? `http://${req.headers.host}/api/${lang}?name=${query.name}`
    : `${window.location.origin}/api/${lang}?name=${query.name}`;
  const user = await fetch(url);
  const json = await user.json();
  return { list: json.following };
};

export default User;
