const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");
const multer = require("multer");
const path = require("path");
const cors = require('cors');

// app
const app = express();
app.use(cors());
dotenv.config();

// database
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
    console.log("Database connected");
});

app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use('/public', express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, '../build')))
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../build'))
// })

// middleware
app.use(express.json());
app.use(helmet());
// app.use(
//   helmet.referrerPolicy({
//     policy: "no-referrer",
//   })
// );
app.use(morgan("common"));


// upload file post
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploaded");
    } catch (err) {
        console.log(err);
    }
});

// routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

// ... other app.use middleware 
// app.use(express.static(path.join(__dirname, "client", "build")))

// ...
// Right before your app.listen(), add this:
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client", "build", "index.html"));
// });

app.listen(process.env.PORT || 8800, () => {
    console.log("Backend is running");
});
