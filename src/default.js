import { callAPI } from "./async";
import { WeatherPages } from "./data";

let currentWeatherPage = new WeatherPages;

let currentUserLocations = (localStorage.getItem("user-locations") === null) ? ["chicago","paris", "new york","tokyo", "london"] : JSON.parse(localStorage.getItem("user-locations"));

console.log(currentUserLocations);


localStorage.setItem("user-locations", JSON.stringify(currentUserLocations));

const getWeatherData = async (defaultLocations) => {
    let array = [];
    
    for(const location of defaultLocations) {
        const result = await callAPI.allWeatherData(location);
        array.push(result);
    };

    return array;
}

export {currentWeatherPage, currentUserLocations, getWeatherData};

