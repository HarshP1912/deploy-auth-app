const express = require("express");
const app = express();
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter");
const ProductRouter = require("./Routes/ProductRouter");

require("dotenv").config();
require("./Models/db");

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use("/auth", AuthRouter);
app.use("/products", ProductRouter);

app.get("/", (req, res) => {
    res.send("SERVER RUNNING");
});

app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
});
