import "./styles.css";
import { WeatherData } from "./data";
import { display } from "./display";
import { createIconSvg } from "./icon";
import { callAPI} from "./async";
import { format, addDays, startOfTomorrow } from "date-fns";
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
    const response = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/palatine/2025-10-10/2025-10-19/?key=58BNGSSDKDUY7PYBE3E3WZ3TV");
    const weatherData = await response.json();
    const savedWeatherData = JSON.stringify(weatherData);

    localStorage.setItem("currentWeather", savedWeatherData);
}

getWeather();

const getAverageWeather = async () => {
    const response = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/palatine/2025-10-10/?key=58BNGSSDKDUY7PYBE3E3WZ3TV&include=stats");
    const weatherData = await response.json();
    const savedWeatherData = JSON.stringify(weatherData);

    localStorage.setItem("currentAverageWeather", savedWeatherData);
}

getAverageWeather();

const getAirQuality = async () => {
    const response = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/palatine/2025-10-10/?key=58BNGSSDKDUY7PYBE3E3WZ3TV&elements=aqius");
    const weatherData = await response.json();
    const savedWeatherData = JSON.stringify(weatherData);

    localStorage.setItem("currentAirQuality", savedWeatherData);
}

getAirQuality();

const getMoon = async () => {
    const response = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/palatine/2025-10-10/2025-10-11/?key=58BNGSSDKDUY7PYBE3E3WZ3TV&elements=moonphase,moonriseEpoch,moonsetEpoch");
    const weatherData = await response.json();
    const savedWeatherData = JSON.stringify(weatherData);

    localStorage.setItem("currentMoon", savedWeatherData);
}

getMoon();

*/

let mouseDown = false;
let startX, scrollLeft;
const slider = document.querySelector('.hour-data');

const startDragging = (e) => {
  mouseDown = true;
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
}

const stopDragging = (e) => {
  mouseDown = false;
}

const move = (e) => {
  e.preventDefault();
  if(!mouseDown) { return; }
  const x = e.pageX - slider.offsetLeft;
  const scroll = x - startX;
  slider.scrollLeft = scrollLeft - scroll;
}

// Add the event listeners
slider.addEventListener('mousemove', move, false);
slider.addEventListener('mousedown', startDragging, false);
slider.addEventListener('mouseup', stopDragging, false);
slider.addEventListener('mouseleave', stopDragging, false);

const circleSection = document.querySelector(".page-slider");

for(let i = 0; i < 5; i++)
{
    if(i === 0) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "circle current-circle");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "100");
        svg.setAttribute("height", "100");


        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = "circle";
        svg.appendChild(title);

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z");
        svg.appendChild(path);

        circleSection.appendChild(svg);
    }
    else
    {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "circle");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "100");
        svg.setAttribute("height", "100");


        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = "circle";
        svg.appendChild(title);

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z");
        svg.appendChild(path);

        circleSection.appendChild(svg);
    }
}

//callAPI.allWeatherData("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/palatine/2025-10-10/2025-10-11/?key=58BNGSSDKDUY7PYBE3E3WZ3TV");


const getFormattedTdyDate = () => {
    return format(new Date(), 'yyyy-MM-dd');
};

const getFormattedTmrDate = () => {
    return format(startOfTomorrow(), 'yyyy-MM-dd');
};

const getFormattedTenDate = () => {
    return format(addDays(new Date(), 9), 'yyyy-MM-dd');
};

console.log(getFormattedTdyDate());
console.log(getFormattedTmrDate());
console.log(getFormattedTenDate());


callAPI.allWeatherData("palatine");