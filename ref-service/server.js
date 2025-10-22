const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./lib/db");
const { createTables } = require("./models/createTables");

const app = express();

app.use(cors({
    origin: "http://localhost:4000",
    credentials: true
}));


app.use(express.json());


app.use("/api/ref/editprofile", require("./routes/editprofileRoute"));
app.use("/api/ref/coreacademy", require("./routes/coreacademyRoute"));

app.get("/", (req, res) => {
    res.send("Ref Service is running");
});

app.listen(process.env.PORT || 6000, async () => {
    console.log(`Ref Service running on port ${process.env.PORT || 6000}`);
    try {
        await createTables();
        console.log("Database tables initialized");
    } catch (err) {
        console.error("Error initializing database tables:", err);
    }
});