
require("dotenv").config();

const express = require("express");
const connectdb = require("./Config/db.js");
const router = require("./Routes/userroutes.js");
const userrouter = require("./Routes/User.Routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const geminiResponse=require("./gemini.js")

const app = express();


app.use(cors({
  origin: "https://virtual-assistant-major-project.vercel.app",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/auth", router);
app.use("/api/user", userrouter);
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});


// app.get("/" , async(req,res) =>{
//   let prompt=req.query.prompt
//   let data = await geminiResponse(prompt)
//   res.json(data)
// })
const port = process.env.PORT || 5000;
app.listen(port, () => {
  connectdb();
  console.log(` Server started on http://localhost:${port}`);
});
