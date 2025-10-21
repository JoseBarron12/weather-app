import { he, hu, te } from "date-fns/locale";
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

function getSkyGradient(time, sunrise = 6, sunset = 18, isClear = true) {
  const hour = typeof time === "number" ? time : new Date(time).getHours() + new Date(time).getMinutes() / 60;

  const gradients = {
    night: isClear
      ? ["#0B132B", "#1C2541"]
      : ["#1F2937", "#374151"],
    dawn: isClear
      ? ["#D2691E", "#FFD580"]
      : ["#4A4A4A", "#A0A0A0"],
    day: isClear
      ? ["#0077BE", "#B0E0E6"]
      : ["#64748B", "#A8A8A8"],
    sunset: isClear
      ? ["#8B0000", "#FFB347"]
      : ["#5A5A5A", "#A9A9A9"]
  };

  let topColor, bottomColor;

  // Determine which time segment we're in
  if (hour < sunrise - 0.5) {
    // Before dawn
    [topColor, bottomColor] = gradients.night;
  } else if (hour < sunrise + 1) {
    // Dawn blend
    const t = (hour - (sunrise - 0.5)) / 1.5;
    [topColor, bottomColor] = blendGradients(gradients.night, gradients.dawn, t);
  } else if (hour < (sunrise + sunset) / 2) {
    // Morning/day transition
    const t = (hour - (sunrise + 1)) / ((sunset - sunrise) / 2 - 1);
    [topColor, bottomColor] = blendGradients(gradients.dawn, gradients.day, t);
  } else if (hour < sunset - 0.5) {
    // Afternoon
    const t = (hour - (sunrise + sunset) / 2) / ((sunset - sunrise) / 2 - 0.5);
    [topColor, bottomColor] = blendGradients(gradients.day, gradients.sunset, t);
  } else if (hour < sunset + 1) {
    // Sunset blend
    const t = (hour - (sunset - 0.5)) / 1.5;
    [topColor, bottomColor] = blendGradients(gradients.sunset, gradients.night, t);
  } else {
    // After dark
    [topColor, bottomColor] = gradients.night;
  }

  return `linear-gradient(to bottom, ${topColor}, ${bottomColor})`;
}

function blendGradients([c1Top, c1Bottom], [c2Top, c2Bottom], t) {
  const mix = (a, b, t) => {
    const ar = parseInt(a.slice(1, 3), 16),
      ag = parseInt(a.slice(3, 5), 16),
      ab = parseInt(a.slice(5, 7), 16);
    const br = parseInt(b.slice(1, 3), 16),
      bg = parseInt(b.slice(3, 5), 16),
      bb = parseInt(b.slice(5, 7), 16);
    const r = Math.round(ar + (br - ar) * t).toString(16).padStart(2, "0");
    const g = Math.round(ag + (bg - ag) * t).toString(16).padStart(2, "0");
    const b_ = Math.round(ab + (bb - ab) * t).toString(16).padStart(2, "0");
    return `#${r}${g}${b_}`;
  };

  return [
    mix(c1Top, c2Top, Math.min(Math.max(t, 0), 1)),
    mix(c1Bottom, c2Bottom, Math.min(Math.max(t, 0), 1))
  ];
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


      let displayedSunset = false;
      let displaySunrise = false;

      const forecast = document.querySelector(".hour-data");
      forecast.replaceChildren();
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
      forecast.replaceChildren()
      
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

          if(arrayOfDays[i].precipProb >= 30)
          {
            const textDiv = document.createElement("div");
            textDiv.classList.add("precip-probability");
            textDiv.textContent = arrayOfDays[i].precipProb + "%";

            iconSVG.classList.add("icon-precipitation");
            icon.appendChild(textDiv);
          }


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
      
      const currentIcon = document.querySelector(".sun-title>svg");

      if(currentIcon !== null)
      {
        currentIcon.remove()
      }

      const currentSunValue = document.querySelector(".sun-value");
      const pastSun = document.querySelector(".sun-title-desc");

      const currentTime = weatherDataObj.getCurrentDateTime();
      const sunset = weatherDataObj.getSunset();
      
      if(compareAsc(currentTime, sunset) == 1) // time is past sunset
      {
        title.insertBefore(createIconSvg("sun-rise"),currentSun);
        
        const sunrise = weatherDataObj.fifteenDayForecast[1].sunrise;
        
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
      const differenceText = weatherDataObj.getMaxTemp() - weatherDataObj.averageHighTemp;
      const sign = differenceText > 0 ? "+" : "";
      difference.textContent = sign + differenceText + "\u00B0";

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

    };

    const moon =(weatherDataObj) => {
      const moonPhase = weatherDataObj.moonPhase;

      const title = document.querySelector(".moon-title");
      const currentMoon = title.querySelector(".moon-phase");

      const currentIcon = document.querySelector(".moon-title>svg");
      if(currentIcon !== null)
      {
        currentIcon.remove();
      }

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
      
      console.log(weatherDataObj.moonRise);
      const moonRise = document.querySelector(".moon-rise>.text");
      moonRise.textContent = format(weatherDataObj.moonRise,"h:mm a");

      const moonSet = document.querySelector(".moon-set>.text");
      moonSet.textContent = format(weatherDataObj.moonSet,"h:mm a");

      const moonDuration = document.querySelector(".moon-duration>.text");
      moonDuration.textContent = weatherDataObj.moonDuration  + " hours" 

    };

    const fullPage = (weather) => {
      const body = document.querySelector("body");
      
      const sunriseHr = weather.getSunrise().getHours() + weather.getSunrise().getMinutes() / 60;
      const sunsetHr  = weather.getSunset().getHours() + weather.getSunset().getMinutes() / 60;

      body.style.background = getSkyGradient(weather.getCurrentDateTime(), sunriseHr, sunsetHr, true);
      
      display.header(weather);

      display.twentyFourHourForecast(weather.getDescription(), weather.todayForecast, weather);

      display.upcomingForecast(weather.upcomingForecast);

      display.feelsLike(weather);

      display.uvIndex(weather);

      display.wind(weather);

      display.sun(weather);

      display.precipitation(weather);

      display.visibility(weather);

      display.humidity(weather);

      display.pressure(weather);

      display.average(weather);

      display.airQuality(weather);

      display.moon(weather);
    };

    const location = (weatherDataObj, parent, window) => {
      const locationDiv = document.createElement("div");
      locationDiv.classList.add("location");

      parent.appendChild(locationDiv);

      const sunriseHr = weatherDataObj.getSunrise().getHours() + weatherDataObj.getSunrise().getMinutes() / 60;
      const sunsetHr  = weatherDataObj.getSunset().getHours() + weatherDataObj.getSunset().getMinutes() / 60;

      locationDiv.style.background = getSkyGradient(weatherDataObj.getCurrentDateTime(), sunriseHr, sunsetHr, true);

      const header = document.createElement("div");
      header.classList.add("location-header");
      locationDiv.appendChild(header);

      const info = document.createElement("div");
      info.classList.add("location-info");
      header.appendChild(info);

      const name = document.createElement("div");
      name.classList.add("name-location");
      name.textContent = toUpperCaseFirstChar(weatherDataObj.getLocationName());
      info.appendChild(name);

      const time = document.createElement("div");
      time.classList.add("time-location");
      time.textContent = format(weatherDataObj.getCurrentDateTime(), "h:mm a");
      info.appendChild(time);

      const temp = document.createElement("div");
      temp.classList.add("location-temp");
      temp.textContent = weatherDataObj.getCurrentTemp() + "\u00B0";
      header.appendChild(temp);

      const desc = document.createElement("div");
      desc.classList.add("location-desc");
      locationDiv.appendChild(desc);

      const condition = document.createElement("div");
      condition.classList.add("location-condition");
      condition.textContent = weatherDataObj.getCurrentCondition();
      desc.appendChild(condition);

      const tempRange = document.createElement("div");
      tempRange.classList.add("location-temp-range");
      desc.appendChild(tempRange);

      const high = document.createElement("div");
      high.classList.add("high");
      high.textContent = `H:${weatherDataObj.getMaxTemp()}\u00B0`;
      tempRange.appendChild(high);

      const low = document.createElement("div");
      low.classList.add("low");
      low.textContent = `L:${weatherDataObj.getMinTemp()}\u00B0`;
      tempRange.appendChild(low);

      locationDiv.addEventListener("click", () => {
        display.fullPage(weatherDataObj);
        window.close();
      })
    }


    return {header, description, twentyFourHourForecast, upcomingForecast, feelsLike, uvIndex, wind, sun, precipitation, visibility, humidity, pressure, average, airQuality, moon, fullPage, location}
})();