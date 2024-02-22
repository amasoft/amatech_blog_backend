import { mongoose } from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 5001;
const dbURI = process.env.URL;

export const app = express();
app.use(cors());

export const connection = mongoose
  .connect(dbURI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then((result) =>
    app.listen(PORT, function () {
      console.log(`connection succesful ${PORT}`);
    })
  )
  .catch((err) => console.log(err));
// export default connection;
