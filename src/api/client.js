import axios from "axios";

const client = axios.create({
  baseURL: "https://rakhita-music-app.herokuapp.com/api",
}); //"http://yor_machine_ip:database_allow_port/api"

export default client;
