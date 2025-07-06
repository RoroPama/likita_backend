import app from "./app";
import db from "./db";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  db.connectDB();
  console.log(`Server is running on port ${PORT}`);
});
