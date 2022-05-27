import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

const header = {
  header: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

const post = (url, body) => {
  return axios.post(url, body, header).then((response) => {
    if (response) {
      return response;
    }
    return null;
  });
};

class HttpService {
  getProjectedValues = (data) => {
    let url = `${API_URL}/api/calculate`;
    return post(url, data);
  };
}

export default new HttpService();
