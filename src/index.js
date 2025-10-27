import { callAPI } from "./async";
import { WeatherData } from "./data";
import { display } from "./display";
import { addHours, isDate } from "date-fns";
import "./styles.css";
import { functionality } from "./functionality";
import { currentWeatherPage } from "./default";

const slider = document.querySelector('.hour-data');

functionality.slider(slider);

const btn = document.querySelector(".drop-down-btn");

functionality.dropDownBtn(btn);

const editListBtn = document.querySelector(".drop-down-option:first-of-type");

functionality.showEditPgs(editListBtn);


const dialog = document.querySelector("dialog");

const showWinBtn = document.querySelector(".menu>svg");

functionality.showWinBtn(showWinBtn, dialog);


const search = dialog.querySelector("input#search");
const searchWindow = dialog.querySelector("div.search");

functionality.showSearchWin(search, searchWindow);

const searchExitBtn = dialog.querySelector(".search-cancel");

functionality.exitSearchWinBtn(searchExitBtn, searchWindow, search);

//callAPI.weather("jamal")

const searchLocation = dialog.querySelector("input#search-input");

functionality.searchForLocation(searchLocation);


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
  display.location(weatherData,locations,dialog, index);

  if(index == 0)
  {
    display.fullPage(weatherData);
  }

});

const circleSection = document.querySelector(".page-slider");

display.circleSection(circleSection, weatherClassData.length, currentWeatherPage.currentPage)

const circles = document.querySelectorAll(".page-slider>svg");

const leftIcon = document.querySelector(".left");

leftIcon.addEventListener("click", () => {
  
  circles[currentWeatherPage.currentPage].classList.toggle("current-circle");
  if(currentWeatherPage.currentPage == 0)
  {
    currentWeatherPage.currentPage = weatherClassData.length - 1;
  }
  else
  {
    currentWeatherPage.currentPage = currentWeatherPage.currentPage  - 1;
  }
  display.fullPage(weatherClassData[currentWeatherPage.currentPage]);
  circles[currentWeatherPage.currentPage].classList.toggle("current-circle");
  
});

const rightIcon = document.querySelector(".right");

rightIcon.addEventListener("click", () => {
  
  circles[currentWeatherPage.currentPage].classList.toggle("current-circle");
  
  if(currentWeatherPage.currentPage == weatherClassData.length - 1)
  {
    currentWeatherPage.currentPage = 0;
  }
  else
  {
    currentWeatherPage.currentPage = currentWeatherPage.currentPage  + 1;
  }
  
  display.fullPage(weatherClassData[currentWeatherPage.currentPage]);
  circles[currentWeatherPage.currentPage].classList.toggle("current-circle");
});

export {locationData, weatherClassData};