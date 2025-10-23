import { callAPI } from "./async";
import { WeatherData } from "./data";
import { display } from "./display";
import { addHours, isDate } from "date-fns";
import "./styles.css";
import { functionality } from "./functionality";

const slider = document.querySelector('.hour-data');

functionality.slider(slider);

const btn = document.querySelector(".drop-down-btn");

functionality.dropDownBtn(btn);

const dialog = document.querySelector("dialog");

const showWinBtn = document.querySelector(".menu>svg");

functionality.showWinBtn(showWinBtn, dialog);


const search = dialog.querySelector("input#search");
const searchWindow = dialog.querySelector("div.search");

functionality.showSearchWin(search, searchWindow);

const searchExitBtn = dialog.querySelector(".search-cancel");

functionality.exitSearchWinBtn(searchExitBtn, searchWindow);

//callAPI.weather("jamal")


const defaultLocations = ["chicago","paris", "new york","tokyo", "london"];

let locationData = [];

/*
defaultLocations.forEach((location, index) => {
    setTimeout(() => {
      callAPI.allWeatherData(location);
      localStorage.setItem("locations", JSON.stringify(locationData);
      console.log(localStorage.getItem("locations"));
    }, index * 5000);
}) */
const weatherDatas = JSON.parse(localStorage.getItem("locations"));
console.log(weatherDatas);


const locations = document.querySelector(".locations");
const weatherClassData = [];

weatherDatas.forEach((data, index) => {
  
  const weatherData = new WeatherData(data._data)
  weatherData.setMoonDuration(data._moonDuration);
  weatherData.setMoonPhase(data._moonPhase);
  weatherData.setMoonRise(new Date(data._moonRise));
  weatherData.setMoonSet(new Date(data._moonSet));
  
  weatherData.setAirQuality(25);
  weatherData.setAverageHighTemp(data._averageHighTemp);

  //console.log(addHours(weatherData.getCurrentDateTime(),data._data.tzoffset));

  weatherClassData.push(weatherData);
  display.location(weatherData,locations,dialog);

  if(index == 0)
  {
    display.fullPage(weatherData);
  }

});

const circleSection = document.querySelector(".page-slider");

for(let i = 0; i < weatherClassData.length; i++)
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

const circles = document.querySelectorAll(".page-slider>svg");

const leftIcon = document.querySelector(".left");

let currentPage = 0;

leftIcon.addEventListener("click", () => {
  
  circles[currentPage].classList.toggle("current-circle");
  if(currentPage == 0)
  {
    currentPage = weatherClassData.length - 1;
  }
  else
  {
    currentPage--;
  }
  display.fullPage(weatherClassData[currentPage]);
  circles[currentPage].classList.toggle("current-circle");
  
});

const rightIcon = document.querySelector(".right");

rightIcon.addEventListener("click", () => {
  
  circles[currentPage].classList.toggle("current-circle");
  
  if(currentPage == weatherClassData.length - 1)
  {
    currentPage = 0;
  }
  else
  {
    currentPage++
  }
  
  display.fullPage(weatherClassData[currentPage]);
  circles[currentPage].classList.toggle("current-circle");
})

export {locationData, currentPage};