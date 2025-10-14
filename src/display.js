import { hu, te } from "date-fns/locale";
import { WeatherData } from "./data";
import { createIconSvg } from "./icon";
import { compareAsc, format, getHours } from "date-fns";

const toUpperCaseFirstChar = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getWindDirection = (dir) => {
  if(dir > 337.5 || dir <= 22.5)
  {
    return "N";
  }
  else if(dir > 22.5 && dir <= 67.5)
  {
    return "NE";
  }
  else if(dir > 67.5 && dir <= 112.5)
  {
    return "E";
  }
  else if(dir > 112.5 && dir <= 157.5)
  {
    return "SE";
  }
  else if(dir > 157.5 && dir <= 202.5)
  {
    return "S";
  }
  else if(dir > 202.5 && dir <= 247.5)
  {
    return "SW";
  }
  else if(dir > 247.5 && dir <= 292.5)
  {
    return "W";
  }
  else if(dir > 292.5 && dir <= 337.5)
  {
    return "W";
  }
}


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

    const twentyFourHourForecast = (desc, arrayOfHours, weatherDataObj) => {
      display.description(desc);

      let currentTime = weatherDataObj.getCurrentDateTime();
      let sunset = weatherDataObj.getSunset();
      let sunrise = weatherDataObj.getSunrise();
      
      if(compareAsc(currentTime, sunrise) == 1) // IF TIME IS PAST SUNRISE
      {
        sunrise = weatherDataObj.fifteenDayForecast[1].sunrise;
      }

      console.log(getHours(sunrise));

      let displayedSunset = false;
      let displaySunrise = false;

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

          const tempText = (i == 0) ? weatherDataObj.getCurrentTemp() + "\u00B0" : arrayOfHours[i].temp + "\u00B0";
          temp.textContent = tempText;

          forecastDiv.appendChild(temp);

          if(getHours(sunrise) === getHours(arrayOfHours[i].date) && !displaySunrise)
          {
            const forecastDiv = document.createElement("div");
            forecastDiv.classList.add("forecast-hour");
            forecast.appendChild(forecastDiv);

            const time = document.createElement("div");
            time.classList.add("forecast-hour-time");

            const timeText = format(sunrise,"h:mm a");
            time.textContent = timeText;

            forecastDiv.appendChild(time);

            const icon = document.createElement("div");
            icon.classList.add("forecast-hour-icon");

            const iconSVG = createIconSvg("sun-rise-temp");
            icon.appendChild(iconSVG);

            forecastDiv.appendChild(icon);

            const temp = document.createElement("div");
            temp.classList.add("forecast-hour-temp");

            temp.textContent = "Sunrise";

            forecastDiv.appendChild(temp);
          }
          if(getHours(sunset) === getHours(arrayOfHours[i].date) && !displayedSunset)
          {
            const forecastDiv = document.createElement("div");
            forecastDiv.classList.add("forecast-hour");
            forecast.appendChild(forecastDiv);

            const time = document.createElement("div");
            time.classList.add("forecast-hour-time");

            const timeText = format(sunset,"h:mm a");
            time.textContent = timeText;

            forecastDiv.appendChild(time);

            const icon = document.createElement("div");
            icon.classList.add("forecast-hour-icon");

            const iconSVG = createIconSvg("sun-set-temp");
            icon.appendChild(iconSVG);

            forecastDiv.appendChild(icon);

            const temp = document.createElement("div");
            temp.classList.add("forecast-hour-temp");

            temp.textContent = "Sunset";

            forecastDiv.appendChild(temp);

            displayedSunset = true;
          }
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
    };

    const feelsLike = (weatherDataObj) => {
      const feelsLikeTemp = document.querySelector(".feels-like-temp");
      feelsLikeTemp.textContent = weatherDataObj.getFeelsLikeTemp() + "\u00B0";

      const feelsLikeDesc = document.querySelector(".feels-like-desc");

      if(weatherDataObj.getFeelsLikeTemp() < weatherDataObj.getCurrentTemp())
      {
        feelsLikeDesc.textContent = "Wind is making it cooler.";
      }
      else if(weatherDataObj.getFeelsLikeTemp() > weatherDataObj.getCurrentTemp())
      {
        feelsLikeDesc.textContent = "Humidity is making it hotter.";
      }
      else
      {
        feelsLikeDesc.textContent = "Weather feels like expected.";
      }

    };

    const uvIndex = (weatherDataObj) => {
      const uvIndexData = weatherDataObj.getUVIndex();;
     
      const uvIndexValue = document.querySelector(".uv-value");
      uvIndexValue.textContent = uvIndexData;

      const uvIndexDesc = document.querySelector(".uv-desc");
      const uvIndexWarning = document.querySelector(".uv-warning");

      if(uvIndexData >= 0 && uvIndexData <= 2)
      {
        uvIndexDesc.textContent = "Low";
        uvIndexWarning.textContent = "Minimal risk — safe to be outside.";
      }
      else if(uvIndexData >= 3 && uvIndexData <= 5)
      {
        uvIndexDesc.textContent = "Moderate";
        uvIndexWarning.textContent = "Some risk — Use sun protection.";
      }
      else if(uvIndexData >= 6 && uvIndexData <= 7)
      {
        uvIndexDesc.textContent = "High";
        uvIndexWarning.textContent = "High risk — Sun protection required.";
      }
      else
      {
        uvIndexDesc.textContent = "Extreme";
        uvIndexWarning.textContent = "Extreme risk — Avoid sunlight.";
      }

      const uvIndexSlider = document.querySelector(".uv-slider>input");
      uvIndexSlider.setAttribute("value", `${uvIndexData}`);

    };

    const wind = (weatherDataObj) => {
      const windSpeed = document.querySelector(".wind-speed>.text");
      windSpeed.textContent = weatherDataObj.getWindSpeed() + " mph";

      const windGust= document.querySelector(".wind-gust>.text");
      windGust.textContent = weatherDataObj.getWindGust() + " mph";

      const windDir= document.querySelector(".wind-direction>.text");
      windDir.textContent = weatherDataObj.getWindDirection() +  "\u00B0 " + getWindDirection(weatherDataObj.getWindDirection());
    };

    const sun = (weatherDataObj) => {
      const title = document.querySelector(".sun-title");
      const currentSun = title.querySelector(".current-sun");
      
      const currentSunValue = document.querySelector(".sun-value");
      const pastSun = document.querySelector(".sun-title-desc");

      const currentTime = weatherDataObj.getCurrentDateTime();
      const sunset = weatherDataObj.getSunset();
      
      if(compareAsc(currentTime, sunset) == 1) // time is past sunset
      {
        title.insertBefore(createIconSvg("sun-rise"),currentSun);
        
        const sunrise = weatherDataObj.this.fifteenDayForecast[1].sunrise;
        
        currentSun.textContent = "SUNRISE";
        currentSunValue.textContent = format(sunrise,"h:mm a");

        pastSun.textContent = "Sunset: " + format(sunset,"h:mm a");

      }
      else // time is not past sunset
      {
        title.insertBefore(createIconSvg("sun-set"), currentSun);
        
        const sunrise = weatherDataObj.getSunrise();
        
        currentSun.textContent = "SUNSET";
        currentSunValue.textContent = format(sunset,"h:mm a");

        pastSun.textContent = "Sunrise: " + format(sunrise,"h:mm a");
      }
    };

    const precipitation =(weatherDataObj) => {
        const precipitationValue = document.querySelector(".precipitation-value");
        precipitationValue.textContent = weatherDataObj.getAmountOfPrecipitation() + '"';

        const precipitationDesc = document.querySelector(".precipitation-warning");
        precipitationDesc.textContent = "The chance of precipitation is " + weatherDataObj.getChanceOfPrecipitation() + "%.";
    };

    const visibility = (weatherDataObj) => {
      const visibilityData =  weatherDataObj.getVisibility();
      
      const visibilityValue = document.querySelector(".visibility-value");
      visibilityValue.textContent = visibilityData + " mi";

      const visibilityDesc = document.querySelector(".visibility-desc");
    
      if(visibilityData < 4)
      {
        visibilityDesc.textContent = "Limited Visibility — caution advised.";
      }
      else if(visibilityData >= 4 && visibilityData < 6)
      {
        visibilityDesc.textContent = "Reduced Visibility — Objects are visible but not far.";
      }
      else if(visibilityData >= 6 && visibilityData < 10)
      {
        visibilityDesc.textContent = "Good view.";
      }
      else
      {
        visibilityDesc.textContent = "Perfectly clear view.";
      }

    };

    const humidity = (weatherDataObj) => {
      const humidityValue = document.querySelector(".humidity-value");
      humidityValue.textContent = weatherDataObj.getHumidity() + "%";

      const humidityDesc = document.querySelector(".humidity-desc>span");
      humidityDesc.textContent = weatherDataObj.getDewPt() + "\u00B0";
    };

    const pressure = (weatherDataObj) => {
      const pressureData = weatherDataObj.getPressure();
      
      const pressureValue = document.querySelector(".pressure-value");
      pressureValue.textContent = pressureData + " mb"

      const pressureDesc = document.querySelector(".pressure-desc>span");

      if(pressureData < 1010)
      {
        pressureDesc.textContent = "lower than normal"
      }
      else if(pressureData >= 1010 && pressureData < 1025)
      {
        pressureDesc.textContent = "normal"
      }
      else
      {
        pressureDesc.textContent = "higher than normal"
      }

    };

    const average = (weatherDataObj) => {
      const highTdy = document.querySelector(".average-today>.text");
      highTdy.textContent = `H:${weatherDataObj.getMaxTemp()}` + "\u00B0";

      const highAvg = document.querySelector(".average-overall>.text");
      highAvg.textContent = `H:${weatherDataObj.averageHighTemp}` + "\u00B0";

      const difference = document.querySelector(".average-value");
      difference.textContent = weatherDataObj.getMaxTemp() - weatherDataObj.averageHighTemp + "\u00B0";

    };

    const airQuality = (weatherDataObj) => {
      const airData = weatherDataObj.airQuality;

      const airValue = document.querySelector(".air-value");
      airValue.textContent = airData;

      const airSlider = document.querySelector(".air-slider>input");
      airSlider.setAttribute("value",airData);

      const airDesc = document.querySelector(".air-desc");

      if(airData >= 0 && airData <= 50)
      {
        airDesc.textContent = "Good";
      }
      else if(airData >= 51 && airData <= 100)
      {
        airDesc.textContent = "Moderate";
      }
      else if(airData >= 101 && airData <= 150)
      {
        airDesc.textContent = "Unhealthy for Sensitive Groups";
      }
      else if(airData >= 151 && airData <= 200)
      {
        airDesc.textContent = "Unhealthy";
      }
      else {
        airDesc.textContent = "Very Unhealthy";
      }

    }

    const moon =(weatherDataObj) => {
      const moonPhase = weatherDataObj.moonPhase;

      const title = document.querySelector(".moon-title");
      const currentMoon = title.querySelector(".moon-phase");

      if(moonPhase == 0)
      {
        title.insertBefore(createIconSvg("new-moon"),currentMoon);
        currentMoon.textContent = "NEW MOON";
      }
      else if(moonPhase > 0 && moonPhase < 0.25)
      {
        title.insertBefore(createIconSvg("waxing-crescent"),currentMoon);
        currentMoon.textContent = "WAXING CRESCENT";
      }
      else if(moonPhase == 0.25)
      {
        title.insertBefore(createIconSvg("first-quarter"),currentMoon);
        currentMoon.textContent = "FIRST QUARTER";
      }
      else if(moonPhase > 0.25 && moonPhase < 0.5)
      {
        title.insertBefore(createIconSvg("waxing-gibbous"),currentMoon);
        currentMoon.textContent = "WAXING GIBBOUS";
      }
      else if(moonPhase == 0.50)
      {
        title.insertBefore(createIconSvg("full-moon"),currentMoon);
        currentMoon.textContent = "FULL MOON";
      }
      else if(moonPhase > 0.5 && moonPhase < 0.75)
      {
        title.insertBefore(createIconSvg("waning-gibbous"),currentMoon);
        currentMoon.textContent = "WANING GIBBOUS";
      }
      else if(moonPhase == 0.75)
      {
        title.insertBefore(createIconSvg("last-quarter"),currentMoon);
        currentMoon.textContent = "LAST QUARTER";
      }
      else if(moonPhase > 0.75 && moonPhase <= 1)
      {
        title.insertBefore(createIconSvg("waning-crescent"),currentMoon);
        currentMoon.textContent = "WANING CRESCENT";
      }
      
      const moonRise = document.querySelector(".moon-rise>.text");
      moonRise.textContent = format(weatherDataObj.moonRise,"h:mm a");

      const moonSet = document.querySelector(".moon-set>.text");
      moonSet.textContent = format(weatherDataObj.moonSet,"h:mm a");

      const moonDuration = document.querySelector(".moon-duration>.text");
      moonDuration.textContent = weatherDataObj.moonDuration  + " hours" 

    }

    

    return {header, description, twentyFourHourForecast, upcomingForecast, feelsLike, uvIndex, wind, sun, precipitation, visibility, humidity, pressure, average, airQuality, moon}
})();