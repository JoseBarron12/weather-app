import "./styles.css";
import { WeatherData } from "./data";
import { display } from "./display";

const getWeather = async () => {
    const response = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/palatine?key=58BNGSSDKDUY7PYBE3E3WZ3TV");
    const weatherData = await response.json();
    const weatherClass = new WeatherData(weatherData);
    return weatherClass;
}
const weather = await getWeather();

display.header(weather);

console.log(weather.data);

console.log(weather.getLocationName());

console.log(weather.getCurrentTemp());

console.log(weather.getCurrentCondition());

console.log(weather.getMaxTemp());

console.log(weather.getMinTemp());

