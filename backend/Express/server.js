const express = require("express");
const cors = require("cors");

const connectDB = require("./db/db_connection");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/items", require("./Routes/itemAPI"));
app.use("/api/customers", require("./Routes/customerAPI"));
app.use("/api/orders", require("./Routes/orderAPI"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
