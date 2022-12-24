import axios from "axios";

export default async function getWeatherData({ apiKey, lat, lon }) {
  const link = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  const response = await axios.get(link);

  return response;
}
