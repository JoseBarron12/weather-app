import "./styles.css";
import { WeatherData } from "./data";
import { display } from "./display";
import { createIconSvg } from "./icon";
/*
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
const savedWeatherData = JSON.stringify(weatherData);

localStorage.setItem("currentWeather", savedWeatherData);*/


/*
const getWeather = async () => {
    const response = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/palatine?key=58BNGSSDKDUY7PYBE3E3WZ3TV");
    const weatherData = await response.json();
    const savedWeatherData = JSON.stringify(weatherData);

    localStorage.setItem("currentWeather", savedWeatherData);
}

getWeather();

 */

const weatherSavedData = JSON.parse(localStorage.getItem("currentWeather"));

const weather = new WeatherData(weatherSavedData);

console.log(weather.data);

display.header(weather);

console.log(weather.getLocationName());

console.log(weather.getCurrentTemp());

console.log(weather.getCurrentCondition());

console.log(weather.getMaxTemp());

console.log(weather.getMinTemp());

console.log(weather.getDescription());

console.log(weather.getCurrentDateTime());

console.log(weather.getSunrise());

console.log(weather.getSunset());

console.log(weather.getFeelsLikeTemp());

console.log(weather.getUVIndex());

console.log(weather.getWindSpeed());

console.log(weather.getWindDirection());

console.log(weather.getWindGust());

console.log(weather.getAmountOfPrecipitation());

console.log(weather.getChanceOfPrecipitation());

console.log(weather.getTypeOfPrecipitation());

console.log(weather.getVisibility());

console.log(weather.getHumidity());

console.log(weather.getDewPt());

console.log(weather.getPressure());

console.log(weather.upcomingForecast);

console.log(weather.todayForecast);

display.twentyFourHourForecast(weather.getDescription(), weather.todayForecast);

display.upcomingForecast(weather.upcomingForecast);

display.feelsLike(weather);