module.exports = (req, res) => {
  // do something
  // https://zeit.co/docs/v2/deployments/concepts/lambdas/
  console.log("you called the api");
  res.send("you called the api");
};
