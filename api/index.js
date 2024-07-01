const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", (request, response) => {
  response.send("<h1>Welcome to my server (HNG stage1)</h1>");
});

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name || "Guest";
  const ipAddress = req.ip;

  let clientIp =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress;

  try {
    const ipInfoResponse = await axios.get(
      `https://ipinfo.io/${clientIp}?token=52c9f45f031858`
    );
    console.log(ipInfoResponse.city, "here");
    const city = ipInfoResponse.data.city || "New York";
    const region = ipInfoResponse.data.region || "";
    const country = ipInfoResponse.data.country || "";

    const weatherApiKey =
      process.env.OPENWEATHERMAP_API_KEY || "22099c06bc58a459767695dcfa973e1f";

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
    );
    const temperature = weatherResponse.data.main.temp;

    res.json({
      client_ip: clientIp,
      location: `${city}, ${region && region} ${country && country}`,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
