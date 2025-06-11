import express from "express";
import { config } from "dotenv";
config();
const app = express();
const PORT: number = parseInt(process.env.PORT || "5000", 10);

app.listen(PORT, () => {
  console.log(`Server is running successfully at PORT ${PORT}`);
});
