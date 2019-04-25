import React from "react";
import { withRouter } from "next/router";
import "../style.styl";
import Head from "../components/head";

function Home({ router }) {
  function handleSubmit(e) {
    e.preventDefault();
    router.push(`/user?name=${e.target.elements.username.value}`);
  }

  return (
    <div id="home">
      <Head />

      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="twitter user" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
export default withRouter(Home);
