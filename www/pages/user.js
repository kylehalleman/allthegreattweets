import React from 'react';
import fetch from 'isomorphic-unfetch';
import './users.styl';
import Head from '../components/head.js';
import Main from '../components/main';
import Image from '../components/image';

function User({ url, list }) {
  const days = 30;
  const total = list.reduce((acc, { tweets }) => acc + tweets, 0);

  return (
    <>
      <Head />
      <Main>
        <h1 className="heading">Who @{url.query.name} follows</h1>

        <div role="table" className="users-table">
          <div role="rowgroup" className="users-table__header">
            <div
              role="row"
              className="users-table__row users-table__row--header"
            >
              <div
                role="columnheader"
                className="users-table__cell users-table__cell--column users-table__cell--column--user users-table__cell--user"
              >
                Username
              </div>
              <div
                role="columnheader"
                className="users-table__cell users-table__cell--column users-table__cell--numeric"
              >
                Tweets Per Day
              </div>
              <div
                role="columnheader"
                className="users-table__cell users-table__cell--column users-table__cell--numeric"
              >
                Total
              </div>
            </div>
          </div>
          <div role="rowgroup" className="users-table__body">
            {list.map(({ username, tweets, image }, i) => {
              return (
                <div
                  key={username}
                  role="row"
                  className="users-table__row users-table__row--body"
                >
                  <div
                    role="cell"
                    className="users-table__cell users-table__cell--user"
                  >
                    <Image src={image} />
                    <a href={`https://twitter.com/${username}`}>@{username}</a>
                  </div>
                  <div
                    role="cell"
                    className="users-table__cell users-table__cell--numeric"
                  >
                    {Math.round((tweets / days) * 100) / 100}{' '}
                  </div>
                  <div
                    role="cell"
                    className="users-table__cell users-table__cell--numeric"
                  >
                    {tweets}
                  </div>
                </div>
              );
            })}
          </div>
          <div role="rowgroup" className="users-table__footer">
            <div
              role="row"
              className="users-table__row users-table__row--footer"
            >
              <div role="rowheader" className="users-table__cell">
                Totals
              </div>
              <div role="cell" className="users-table__cell">
                {total}
              </div>
              <div role="cell" className="users-table__cell">
                {Math.round((total / 30) * 100) / 100}
              </div>
            </div>
          </div>
        </div>
      </Main>
    </>
  );
}

User.getInitialProps = async ({ req, query }) => {
  const lang = process.env.API_LANG || 'node';
  const url = req
    ? `http://${req.headers.host}/api/${lang}?name=${query.name}`
    : `${window.location.origin}/api/${lang}?name=${query.name}`;
  const user = await fetch(url);
  const json = await user.json();
  return { list: json.following };
};

export default User;
