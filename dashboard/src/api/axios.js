  import axios from "axios";

  export default axios.create({
    //baseURL: "http://localhost:5000/api", // change later
  baseURL: import.meta.env.VITE_API_BASE_URL
  });