const express = require("express");
const cors = require("cors");
const coockieParser = require("cookie-parser");
require("dotenv").config();
const db = require("./lib/db");
const { createTables } = require("./models/createTables");

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));


app.use(express.json());
app.use(coockieParser());

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/password", require("./routes/passwordRoute"));

app.listen(process.env.PORT || 5000, async () => {
    console.log(`Auth Service running on port ${process.env.PORT || 5000}`);
    // Initialize database tables
    try {
        await createTables();
        console.log("Database tables initialized");
    } catch (err) {
        console.error("Error initializing database tables:", err);
    }
});