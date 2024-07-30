import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Houserouter from "./routes/HouseRoute.js";
import Authrouter from "./routes/authRoute.js";
import Testrouter from "./routes/testRoute.js";
import UserRouter from "./routes/userRoute.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/houses", Houserouter);
app.use("/api/auth", Authrouter);
app.use("/api/test", Testrouter);
app.use("/api/users", UserRouter);

app.listen(8800, () => {
  console.log("server is running");
});
