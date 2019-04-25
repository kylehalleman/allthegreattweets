import React, { useEffect } from "react";
import fetch from "isomorphic-unfetch";

function User({ url }) {
  useEffect(() => {
    fetch(`${window.location.origin}/api/py/request?user=${url.query.name}`);
  }, [url.query.name]);
  return <>User: {url.query.name}</>;
}

User.getInitialProps = async ({ req, query }) => {
  // console.log(req.headers);
  // const user = await fetch(
  //   `https://${req.headers.host}/api/get-follow-count?user=${query.name}`
  // );
  // console.log(user);
  // return {
  //   user
  // };
  return {};
};

export default User;
