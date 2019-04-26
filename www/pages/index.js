import React from 'react';
import { withRouter } from 'next/router';
import '../style.styl';
import Head from '../components/head';

function Home({ router }) {
  function handleSubmit(e) {
    e.preventDefault();
    router.push(`/user?name=${e.target.elements.username.value}`);
  }

  return (
    <div id="home">
      <Head />
      <h1>all the great tweets</h1>
      <h2>🦉</h2>
      <form onSubmit={handleSubmit}>
        <label for="username">enter a Twitter handle</label>
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
    </div>
  );
}
export default withRouter(Home);
