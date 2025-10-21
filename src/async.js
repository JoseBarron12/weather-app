import { locationData } from ".";
import { WeatherData } from "./data";
import { display } from "./display";
import { format, addDays } from "date-fns";

const getFormattedTdyDate = () => {
    return format(new Date(), 'yyyy-MM-dd');
};

const getFormattedTmrDate = () => {
    return format(startOfTomorrow(), 'yyyy-MM-dd');
};

const getFormattedTenDate = () => {
    return format(addDays(new Date(), 9), 'yyyy-MM-dd');
};


export const callAPI = (function() {
    const weather = async (place) => {
        try {
            const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"+ place + "/"+ getFormattedTdyDate() + "/" + getFormattedTenDate() + "/?key=58BNGSSDKDUY7PYBE3E3WZ3TV";
            const response = await fetch(url);
            const weatherData = await response.json();            return weatherData;
        } catch (error) {
            console.log(error)
            return null;
        }
    };

    const averageWeather = async (place) => {
        try {
            const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"+ place + "/"+ getFormattedTdyDate() + "/?key=58BNGSSDKDUY7PYBE3E3WZ3TV";            
            const response = await fetch(url + "&include=stats");
            const weatherData = await response.json();
            return weatherData;
        } catch (error) {
            console.log(error)
            return null;
        }
    
    };

    const airQuality = async (place) => {
        try {
            const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"+ place + "/"+ getFormattedTdyDate() + "/?key=58BNGSSDKDUY7PYBE3E3WZ3TV";
            const response = await fetch(url + "&elements=aqius");
            const weatherData = await response.json();
            return weatherData;
        } catch(error) {
            console.log(error)
            return null;
        } 
    };

    const moon = async (place) => {
        try {
            const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"+ place + "/"+ getFormattedTdyDate() + "/" + getFormattedTenDate() + "/?key=58BNGSSDKDUY7PYBE3E3WZ3TV";
            const response = await fetch(url + "&elements=moonphase,moonriseEpoch,moonsetEpoch");
            const weatherData = await response.json();
            return weatherData;
        } catch(error) {
            console.log(error)
            return null;
        }
    };

    const allWeatherData = (place) => {
        Promise.all([callAPI.weather(place),callAPI.averageWeather(place),callAPI.airQuality(place), callAPI.moon(place)]).then((results) => {
            
            if(!results.includes(null))
            {
                const weather = new WeatherData(results[0]);

                weather.averageHighTemp = results[1];
                weather.airQuality = results[2];
                
                weather.moonPhase = results[3];
                weather.moonRise = results[3];
                weather.moonSet = results[3];
                weather.moonDuration = results[3];

                locationData.push(weather);
                //display.fullPage(weather);
                return weather;
            }
            else
            {
                console.log("ERROR IN QUERY GGS");
            }
            

        });
    }

    return {weather, averageWeather, airQuality, moon, allWeatherData, };
})();