const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_LOCAL_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(
        `Mongo DB Database connected with Host:${con.connection.host}`
      );
    })
    .catch((error) => console.log(`${error} did not connect`));
};

module.exports = connectDatabase;