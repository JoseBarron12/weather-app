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

    const upcomingForecast = (arrayOfDays) => {
      const forecast = document.querySelector(".day-data");

      for(let i = 0; i <  arrayOfDays.length; i++)
      {
          const forecastDiv = document.createElement("div");
          forecastDiv.classList.add("forecast-day");
          forecast.appendChild(forecastDiv);

          const time = document.createElement("div");
          time.classList.add("forecast-day-time");

          const timeText = (i == 0) ? "Today" : format(arrayOfDays[i].date,"E");
          time.textContent = timeText;
          
          forecastDiv.appendChild(time);

          const icon = document.createElement("div");
          icon.classList.add("forecast-day-icon");

          const iconSVG = createIconSvg(arrayOfDays[i].icon);
          icon.appendChild(iconSVG);

          forecastDiv.appendChild(icon);

          const tempDiv = document.createElement("div");
          tempDiv.classList.add("forecast-day-temps");

          forecastDiv.appendChild(tempDiv);

          const tempMin = document.createElement("div");
          tempMin.textContent = arrayOfDays[i].tempMin + "\u00B0";

          tempDiv.appendChild(tempMin);

          const tempSlider = document.createElement("div");
          tempSlider.classList.add("temp-slider");

          const slider = document.createElement("input");
          slider.setAttribute("type", "range");
          slider.setAttribute("disabled", "");
          slider.setAttribute("min", `${arrayOfDays[i].tempMin}`);
          slider.setAttribute("max", `${arrayOfDays[i].tempMax}`);
          slider.setAttribute("value", `${arrayOfDays[i].temp}`);
          
          tempSlider.appendChild(slider);

          tempDiv.appendChild(tempSlider);

          const tempMax = document.createElement("div");
          tempMax.textContent = arrayOfDays[i].tempMax + "\u00B0";

          tempDiv.appendChild(tempMax);
      }
    }

    return {header, description, twentyFourHourForecast, upcomingForecast}
})();