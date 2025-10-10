import { WeatherData } from "./data";

const toUpperCaseFirstChar = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const display = (function() {
    const header = (weatherDataObj) => {
        const locationName = document.querySelector(".location-name>p");
        locationName.textContent = toUpperCaseFirstChar(weatherDataObj.getLocationName());

        const currentTemp = document.querySelector(".current-temp");
        currentTemp.textContent = weatherDataObj.getCurrentTemp() + "\u00B0";

        const currentCondition = document.querySelector("p.current-condition");
        currentCondition.textContent = weatherDataObj.getCurrentCondition();

        const maxTemp = document.querySelector(".max-temp");
        maxTemp.textContent = `H:${weatherDataObj.getMaxTemp()}\u00B0`;

        const minTemp = document.querySelector(".min-temp");
        minTemp.textContent = `H:${weatherDataObj.getMinTemp()}\u00B0`;

    };

    return {header}
})();