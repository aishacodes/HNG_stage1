const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", (request, response) => {
  response.send(
    "<h1>Welcome to my server (HNG stage1)</h1> <p>Follow this format: <a href='https://hng-stage1-ox5d.vercel.app/api/hello?visitor_name=Aishat'>https://hng-stage1-ox5d.vercel.app/api/hello?visitor_name=Aishat</a> </p>"
  );
});

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name || "Visitor";
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

    const city = ipInfoResponse.data.city || "New York";

    const weatherApiKey =
      process.env.OPENWEATHERMAP_API_KEY || "22099c06bc58a459767695dcfa973e1f";

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
    );
    const temperature = weatherResponse.data.main.temp;

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

app.use((req, res, next) => {
  res
    .status(404)
    .send(
      "<h1>Welcome to my server (HNG stage1)</h1> <p>Follow this format: <a href='https://hng-stage1-ox5d.vercel.app/api/hello?visitor_name=Aishat'>https://hng-stage1-ox5d.vercel.app/api/hello?visitor_name=Aishat</a> </p>"
    );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
