import { callAPI } from "./async";
import { WeatherData } from "./data";
import { display } from "./display";
import { addHours, isDate } from "date-fns";
import "./styles.css";
import { functionality } from "./functionality";
import { currentUserLocations, currentWeatherPage, getWeatherData } from "./default";

let weatherClassData = [];


getWeatherData(currentUserLocations).then(result => {
  weatherClassData = result.slice(0);
  display.initialPage();
})




export {weatherClassData};