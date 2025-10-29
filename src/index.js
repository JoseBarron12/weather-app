import { display } from "./display";
import "./styles.css";
import { currentUserLocations, getWeatherData } from "./default";

let weatherClassData = [];

getWeatherData(currentUserLocations).then((result) => {
  weatherClassData = result.slice(0);
  display.initialPage();
});

export { weatherClassData };
