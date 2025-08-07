const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": [
        "'self'",
        "https://whitelisted-domain.com",
      ],
      "img-src": [
        "'self'",
        "https:",
        "data:",
        "maps.gstatic.com",
        "*.googleapis.com",
        "*.ggpht.com",
        "blob:",
      ],
      "connect-src": [
        "'self'",
        "https://seduction-station.onrender.com",
        "https://maps.googleapis.com",
        "https://firebasestorage.googleapis.com",
        "https://identitytoolkit.googleapis.com",
        "https://api-m.sandbox.paypal.com",
        "https://api-m.paypal.com",

      ],
      "media-src": [
        "'self'",
        "blob:",
        "https://firebasestorage.googleapis.com"
      ],
      "frame-ancestors": ["'self'"],
    },
  })
);
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname + "/public")));
const errormiddleware = require("./middlewares/errors");
const user = require("./routes/user");
const chats = require("./routes/chats");
const payments = require("./routes/payment");
app.use("/api/v1", user);
app.use("/api/v1", chats);
app.use("/api/v1", payments);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(errormiddleware);
module.exports = app;