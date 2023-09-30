import axios from "axios";

const Base_URL = "http://localhost:5000/api";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0Zjk1YjkyNmVlNWU2MzRlMzQxYzEzNyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY5NDQ1MzAzNCwiZXhwIjoxNjk0NzEyMjM0fQ.w10Lx9dizCWWctN2QYwtdIYUJhb0zu_wjilov059K3o";

export const publicRequest = axios.create({ baseURL: Base_URL, });

export const userRequest = axios.create({
  baseURL: Base_URL,
  headers: { token: `Bearer ${TOKEN}` },
});
