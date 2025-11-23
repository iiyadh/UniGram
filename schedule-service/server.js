const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { createTables } = require("./models/createTables");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use("/api/schedule", require("./routes/allroutes"));

app.listen(process.env.PORT || 7000, async () => {
    console.log(`Schedule Service running on port ${process.env.PORT || 7000}`);
    try {
        await createTables();
        console.log("Database tables initialized");
    } catch (err) {
        console.error("Error initializing database tables:", err);
    }
});