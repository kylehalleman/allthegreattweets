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
          <div role="rowgroup" className="users-table__header large-only">
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
                    <span className="small-only" aria-hidden="true">
                      Tweets per day
                    </span>
                    <span>{Math.round((tweets / days) * 100) / 100}</span>
                  </div>
                  <div
                    role="cell"
                    className="users-table__cell users-table__cell--numeric"
                  >
                    <span className="small-only" aria-hidden="true">
                      Total
                    </span>
                    <span>{tweets}</span>
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
              <div
                role="rowheader"
                className="users-table__cell users-table__cell--column--user users-table__cell--user"
              >
                Totals
              </div>
              <div
                role="cell"
                className="users-table__cell users-table__cell--numeric"
              >
                <span className="small-only" aria-hidden="true">
                  Tweets per day
                </span>
                <span>{Math.round((total / 30) * 100) / 100}</span>
              </div>
              <div
                role="cell"
                className="users-table__cell users-table__cell--numeric"
              >
                <span className="small-only" aria-hidden="true">
                  Total
                </span>
                <span>{total}</span>
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
