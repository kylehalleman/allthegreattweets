import React from 'react';
import { withRouter } from 'next/router';
import Head from '../components/head';
import Main from '../components/main';

function Home({ router }) {
  function handleSubmit(e) {
    e.preventDefault();
    router.push(
      `/user?name=${e.target.elements.username.value}&months=${
        e.target.elements.months.value
      }`
    );
  }

  return (
    <>
      <Head title="Search | All the Great Tweets 🦉" />
      <Main>
        <h1>all the great tweets 🦉</h1>
        <form onSubmit={handleSubmit} action="/user">
          <input type="hidden" name="months" value="1" />
          <label htmlFor="username">enter a Twitter handle</label>
          <div className="input-wrapper">
            <input
              id="username"
              type="text"
              name="name"
              placeholder="nihilist_arbys"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
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
