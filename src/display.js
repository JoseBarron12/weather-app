import { te } from "date-fns/locale";
import { WeatherData } from "./data";
import { createIconSvg } from "./icon";
import { format } from "date-fns";

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

    const description = (desc) => {
      const descriptionDiv = document.querySelector(".description");
      descriptionDiv.textContent = desc;
    };

    const twentyFourHourForecast = (desc, arrayOfHours) => {
      display.description(desc);

      const forecast = document.querySelector(".hour-data");
      for(let i = 0; i < arrayOfHours.length; i++)
      {
          const forecastDiv = document.createElement("div");
          forecastDiv.classList.add("forecast-hour");
          forecast.appendChild(forecastDiv);
        
          const time = document.createElement("div");
          time.classList.add("forecast-hour-time");

          const timeText = (i == 0) ? "Now" : format(arrayOfHours[i].date,"h a");
          time.textContent = timeText;
          
          forecastDiv.appendChild(time);

          const icon = document.createElement("div");
          icon.classList.add("forecast-hour-icon");

          const iconSVG = createIconSvg(arrayOfHours[i].icon);
          icon.appendChild(iconSVG);

          forecastDiv.appendChild(icon);

          const temp = document.createElement("div");
          temp.classList.add("forecast-hour-temp");

          const tempText = arrayOfHours[i].temp + "\u00B0";
          temp.textContent = tempText;

          forecastDiv.appendChild(temp);

      }
    };

    return {header, description, twentyFourHourForecast}
})();