export const callAPI = (function() {
    const weather = async (url) => {
        try {
            const response = await fetch(url);
            const weatherData = await response.json();
            return weatherData;
        } catch (error) {
            console.log(error)
            return null;
        }
    };

    const airQuality = async (url) => {
        try {
            const response = await fetch(url + "&elements=aqius");
            const weatherData = await response.json();
            return weatherData;
        } catch(error) {
            console.log(error)
            return null;
        } 
    };

    const moon = async (url) => {
        try {
            const response = await fetch(url + "&elements=moonphase,moonriseEpoch,moonsetEpoch");
            const weatherData = await response.json();
            return weatherData;
        } catch(error) {
            console.log(error)
            return null;
        }
    };

    const allWeatherData = (url) => {
        Promise.all([callAPI.weather(url), callAPI.airQuality(url), callAPI.moon(url)]).then((results) => {
            results.forEach(data => {
                if(data === null)
                {
                    console.log("ERROR DATA NO:" + data)
                }
                else
                {
                    console.log(data);
                }
                
            });
        });
    }

    return {weather, airQuality, moon, allWeatherData};
})();