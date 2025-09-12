import axios from "axios";

const NODE_ENV = "production";

const baseURL =
  NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://seduction-station.onrender.com";

const instance = axios.create({
  baseURL,
});

export default instance;
