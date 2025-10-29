import { locationData } from ".";
import { WeatherData } from "./data";
import { display } from "./display";
import { format, addDays } from "date-fns";

const getFormattedTdyDate = (date) => {
    if(date === undefined)
    {
        return format(new Date(), 'yyyy-MM-dd');
    }
    else
    {
        return format(date, 'yyyy-MM-dd');
    }
};

const getFormattedTmrDate = () => {
    return format(startOfTomorrow(), 'yyyy-MM-dd');
};

const getFormattedTenDate = (date) => {
    if(date === undefined)
    {
        return format(addDays(new Date(), 9), 'yyyy-MM-dd');
    }
    else
    {
        return format(addDays(date, 9), 'yyyy-MM-dd');
    }
    
};

/**
 * 58BNGSSDKDUY7PYBE3E3WZ3TV
 * L2H3CRVGLUHZ4PZ8G5V6ZFFAS
 * 49ZTX4PRUA3RHVYAB4P3965HV
 */


export const callAPI = (function() {
    const searchResult = async (place, date) => {
        try {
            const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"+ place + "/"+ getFormattedTdyDate(date) + "/?key=49ZTX4PRUA3RHVYAB4P3965HV" + "&include=resolvedAddress,current";
            const response = await fetch(url);
            const weatherData = await response.json();            
            return weatherData;
        } catch (error) {
            console.log(error)
            return null;
        }
    };
    
    const weather = async (place, date) => {
        try {
            const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"+ place + "/"+ getFormattedTdyDate(date) + "/" + getFormattedTenDate(date) + "/?key=49ZTX4PRUA3RHVYAB4P3965HV";
            const response = await fetch(url);
            const weatherData = await response.json();            
            return weatherData;
        } catch (error) {
            console.log(error)
            return null;
        }
    };

    const averageWeather = async (place, date) => {
        try {
            const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"+ place + "/"+ getFormattedTdyDate(date) + "/?key=49ZTX4PRUA3RHVYAB4P3965HV";            
            const response = await fetch(url + "&include=stats");
            const weatherData = await response.json();
            return weatherData;
        } catch (error) {
            console.log(error)
            return null;
        }
    
    };

    const airQuality = async (place, date) => {
        try {
            const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"+ place + "/"+ getFormattedTdyDate(date) + "/?key=49ZTX4PRUA3RHVYAB4P3965HV";
            const response = await fetch(url + "&elements=aqius");
            const weatherData = await response.json();
            return weatherData;
        } catch(error) {
            console.log(error)
            return null;
        } 
    };

    const moon = async (place, date) => {
        try {
            const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"+ place + "/"+ getFormattedTdyDate(date) + "/" + getFormattedTenDate(date) + "/?key=49ZTX4PRUA3RHVYAB4P3965HV";
            const response = await fetch(url + "&elements=moonphase,moonriseEpoch,moonsetEpoch");
            const weatherData = await response.json();
            return weatherData;
        } catch(error) {
            console.log(error)
            return null;
        }
    };

    const allWeatherData = async (place, date) => {
        
        const results = await Promise.all([callAPI.weather(place, date),callAPI.averageWeather(place, date), callAPI.moon(place, date)]);

        if(!results.includes(null))
        {
            const weather = new WeatherData(results[0]);

            weather.averageHighTemp = results[1];
            weather.setAirQuality(25);
                
            weather.moonPhase = results[2];
            weather.moonRise = results[2];
            weather.moonSet = results[2];
            weather.moonDuration = results[2];

            //locationData.push(weather);
            //display.fullPage(weather);
            return weather;
        }
        else
        {
            console.log("ERROR IN QUERY GGS");
            return null;
        }     
    }

    return {weather, averageWeather, airQuality, moon, allWeatherData,searchResult };
})();