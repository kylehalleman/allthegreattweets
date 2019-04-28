import React, { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';
import { withRouter } from 'next/router';
import Link from 'next/link';
import './users.styl';
import Head from '../components/head.js';
import Main from '../components/main';
import Image from '../components/image';

const MONTHS = [1, 3, 6];

function fetchData(url, name, fromServer) {
  return fetch(url)
    .then(res => res.json())
    .then(json => ({ fromServer, name, list: json.following }))
    .catch(res => {
      if (res.status === 429) {
        // rate limit
        return {
          error: 'Rate limit exceeded. Damnit, Twitter!',
          name
        };
      } else {
        return { error: 'Unknown error', name };
      }
    });
}

function User({
  fromServer,
  apiLang,
  error,
  name,
  list = [],
  router: { pathname, query }
}) {
  // @todo useEffect here to do the fetch for client-rendering
  // remove from getInitialProps
  // animate the background
  const [userList, setUserList] = useState(list);

  useEffect(() => {
    // @todo don't fetch on server render, do fetch on query change
    if (!fromServer) {
      document.body.classList.add('is-loading');
      fetchData(
        `${window.location.origin}/api/${apiLang}?name=${name}&months=${
          query.months
        }`,
        name
      ).then(({ list }) => {
        document.body.classList.remove('is-loading');
        setUserList(list);
      });
    }

    return () => document.body.classList.remove('is-loading');
  }, [apiLang, fromServer, name, query.months]);

  const days = 30;
  const total = userList
    ? userList.reduce((acc, { tweets }) => acc + tweets, 0)
    : 0;
  const currentRange =
    typeof query.months === 'undefined' ? 1 : parseInt(query.months);

  function handleClick() {
    setUserList([]);
  }

  return (
    <>
      <Head title={`Who @${name} follows | All the Great Tweets 🦉`} />
      <Main>
        <h1 className="heading">
          Who <span className="username">@{name}</span> follows
        </h1>
        {error ? (
          <span>{error}</span>
        ) : !userList.length ? (
          <div className="loading-box-container">
            <div className="loading-box">Fetching your tweets...</div>
          </div>
        ) : (
          <>
            <div className="button-group">
              <span id="set-range" className="time-range">
                Set time range
              </span>
              {MONTHS.map(months => (
                <Link
                  href={{
                    pathname,
                    query: Object.assign({}, query, {
                      months
                    })
                  }}
                >
                  <a
                    className="range-link"
                    aria-current={currentRange === months ? 'page' : false}
                    aria-describedby="set-range"
                    onClick={handleClick}
                  >
                    {months} {months === 1 ? 'month' : 'months'}
                  </a>
                </Link>
              ))}
            </div>
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
                {userList.map(({ username, tweets, image }, i) => {
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
                        <Image src={image} username={username} />
                        <a href={`https://twitter.com/${username}`}>
                          @{username}
                        </a>
                      </div>
                      <div
                        role="cell"
                        className="users-table__cell users-table__cell--numeric"
                      >
                        <span className="small-only" aria-hidden="true">
                          Tweets Per Day:{' '}
                        </span>
                        <span>{Math.round((tweets / days) * 100) / 100}</span>
                      </div>
                      <div
                        role="cell"
                        className="users-table__cell users-table__cell--numeric"
                      >
                        <span className="small-only" aria-hidden="true">
                          Total:{' '}
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
                      Tweets Per Day:{' '}
                    </span>
                    <span>{Math.round((total / 30) * 100) / 100}</span>
                  </div>
                  <div
                    role="cell"
                    className="users-table__cell users-table__cell--numeric"
                  >
                    <span className="small-only" aria-hidden="true">
                      Total:{' '}
                    </span>
                    <span>{total}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Main>
    </>
  );
}

User.getInitialProps = async ({ req, query }) => {
  const lang = process.env.API_LANG || 'node';
  if (req) {
    return fetchData(
      `https://${req.headers.host}/api/${lang}?name=${query.name}&months=${
        query.months
      }`,
      query.name,
      true
    );
  } else {
    return { apiLang: lang, name: query.name };
  }
};

export default withRouter(User);
