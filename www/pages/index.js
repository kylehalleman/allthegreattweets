import React from "react";
import { withRouter } from "next/router";
import "../style.styl";

function Home({ router }) {
  function handleSubmit(e) {
    e.preventDefault();
    router.push(`/user?name=${e.target.elements.username.value}`);
  }

  return (
    <div id="home">
      <h1>all the great tweets</h1>
      <h2>🦉</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="twitter user" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
export default withRouter(Home);
