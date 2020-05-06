const dotenv = require('dotenv')
// index.js, line 1:
dotenv.config();
const express = require("express");
const cors = require("cors");
const graphqlHTTP = require("express-graphql");
const { graphqlUploadExpress } = require("graphql-upload");

const schema = require('./graphql');

const app = express();
const { setupDB } = require("./config/db");
app.use(express.static(__dirname + "/public"));


setupDB();
app.use(express.json());
app.use(cors());
app.use(
  "/graphql",
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  graphqlHTTP({
    schema,
    graphiql: true,
    pretty: true,
    introspection: true
  })
);
app.get("/", async function (req, res) {
  const projects = await require("./models/Projects").find
  res.json({ projects });
});
// use routes

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
