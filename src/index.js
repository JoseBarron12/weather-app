import "./styles.css";
import { WeatherData } from "./data";
import { display } from "./display";
import { createIconSvg } from "./icon";
import { callAPI} from "./async";
import { format, addDays, startOfTomorrow, getHours } from "date-fns";
import { he } from "date-fns/locale";

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

//callAPI.allWeatherData("palatine");

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
const body = document.querySelector("body");

body.style.background = getSkyGradient(new Date(), true);

const location = document.querySelector(".location");

location.style.background = getSkyGradient(12, true);

const dropDownFunctionality = (parent, height) => {

    const isOpen = parent.classList.toggle("isOpen");

    const dropDownMenu = parent.nextElementSibling;
    dropDownMenu.style.top = `${height}px`;
    dropDownMenu.style.right = `16px`;

    if(isOpen) {
        dropDownMenu.style.display = "block";
    }
    else {
        dropDownMenu.style.display = "none";
    }

    const newBtn = dropDownMenu.cloneNode(true);
    dropDownMenu.parentNode.replaceChild(newBtn, dropDownMenu);
    
    newBtn.addEventListener("mouseleave", () => {
        newBtn.style.display = "none";
        parent.classList.remove("isOpen");
    });

    newBtn.addEventListener("click", () => {
        newBtn.style.display = "none";
        parent.classList.remove("isOpen");
    });

}

const btn = document.querySelector(".drop-down-btn");

btn.addEventListener("click", () => {
    const rect = btn.getBoundingClientRect();   
    dropDownFunctionality(btn, rect.width + 8 + rect.top);
    });

    btn.addEventListener("mouseenter", () => {
    const rect = btn.getBoundingClientRect();  
    dropDownFunctionality(btn, rect.width + 8 + rect.top);
});
