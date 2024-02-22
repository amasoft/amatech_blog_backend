//import modules
import express from "express";
// import router from "./src/Routes/AuthorsRoutes.js";
import router from "./src/Routes/index.js";
import { connection, app } from "./config/Connection.js";
//initialize middlewares
// const app = express();
app.use(express.static("public"));
app.use(express.json());
const baseurl = "/api/v1";
app.use(baseurl, router);

app.get("/", (req, res) => {
  console.log("amadhffv");
  res.send("welcome");
});
