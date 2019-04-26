import React from 'react';
import { withRouter } from 'next/router';
import Head from '../components/head';
import Main from '../components/main';

function Home({ router }) {
  function handleSubmit(e) {
    e.preventDefault();
    router.push(`/user?name=${e.target.elements.username.value}`);
  }

  return (
    <>
      <Head>
        <title>All the Great Tweets 🦉</title>
      </Head>
      <Main>
        <h1>all the great tweets 🦉</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">enter a Twitter handle</label>
          <div className="input-wrapper">
            <input
              id="username"
              type="text"
              name="username"
              placeholder="nihilist_arbys"
            />
          </div>

          <button className="submit-button" type="submit">
            Submit
          </button>
        </form>
      </Main>
    </>
  );
}
export default withRouter(Home);
