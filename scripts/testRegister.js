import axios from "axios";

(async () => {
  try {
    const res = await axios.post("http://localhost:5001/api/auth/register", {
      name: "Test User",
      email: "test123@example.com",
      password: "secret123"
    });
    console.log("Response:", res.data);
  } catch (err) {
    if (err.response) {
      console.error("Error response:", err.response.status, err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
})();
