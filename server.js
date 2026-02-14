const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 3000;

app.post("/create", (req, res) => {
    const { message, openDate } = req.body;

    const newMessage = {
        id: Date.now(),
        message: message,
        openDate: openDate
    };

    const data = JSON.parse(fs.readFileSync("messages.json"));
    data.push(newMessage);
    fs.writeFileSync("messages.json", JSON.stringify(data));

    res.json({ success: true, id: newMessage.id });
});

app.get("/open/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const data = JSON.parse(fs.readFileSync("messages.json"));

    const found = data.find(msg => msg.id === id);

    if (!found) {
        return res.status(404).json({ error: "Message not found" });
    }

    const now = new Date();
    const openTime = new Date(found.openDate);

    if (now < openTime) {
        return res.status(403).json({ error: "Too early! You cannot open this yet." });
    }

    res.json({ message: found.message });
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
