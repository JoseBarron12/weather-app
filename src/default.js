import { callAPI } from "./async";
import { WeatherPages } from "./data";
import { getTimeRelative } from "./data";

let currentWeatherPage = new WeatherPages;

let currentUserLocations = (localStorage.getItem("user-locations") === null) ? ["chicago","paris", "new york","tokyo", "london"] : JSON.parse(localStorage.getItem("user-locations"));

console.log(currentUserLocations);


localStorage.setItem("user-locations", JSON.stringify(currentUserLocations));

const getWeatherData = async (defaultLocations) => {
    let array = [];
    
    for(const location of defaultLocations) {
        
        const locationData = await callAPI.searchResult(location);
        const time = await getTimeRelative(new Date(), locationData.tzoffset);
        
        const result = await callAPI.allWeatherData(location,time);
        array.push(result);
    };

    return array;
}

export {currentWeatherPage, currentUserLocations, getWeatherData};

