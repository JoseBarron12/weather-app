import { fromUnixTime } from "date-fns";

class WeatherData {
    
    dayForecast = [];
    fifteenDayForecast = [];
    
    constructor(data)
    {
        this._data = data;
    }

    get data() {
        return this._data
    }

    getLocationName() {
        return this._data.resolvedAddress;
    }

    getCurrentTemp() {
        return Math.round(this._data.currentConditions.temp);
    }

    getCurrentCondition() {
        return this._data.currentConditions.conditions;
    }

    getMaxTemp() {
        return Math.round(this._data.days[0].tempmax);
    }

    getMinTemp() {
        return Math.round(this._data.days[0].tempmin);
    }

    getDescription() {
        return this._data.description;
    }

    getCurrentDateTime() {
        return fromUnixTime(this._data.currentConditions.datetimeEpoch);
    }

    getSunrise(){
        return fromUnixTime(this._data.currentConditions.sunriseEpoch);
    }

    getSunset() {
        return fromUnixTime(this._data.currentConditions.sunsetEpoch);
    }

    getFeelsLikeTemp() {
        return Math.round(this._data.currentConditions.feelslike);
    }

    getUVIndex() {
        return this._data.currentConditions.uvindex;
    }

    getWindSpeed() {
        return this._data.currentConditions.windspeed;
    }

    getWindGust() {
        return this._data.currentConditions.windgust;
    }

    getWindDirection() {
        return this._data.currentConditions.winddir;
    }

    getAmountOfPrecipitation() {
        return this._data.currentConditions.precip;
    }

    getChanceOfPrecipitation() {
        return this._data.currentConditions.precipprob;
    }

    getTypeOfPrecipitation() {
        return this._data.currentConditions.preciptype;
    }

    getVisibility() {
        return this._data.currentConditions.visibility;
    }

    getHumidity() {
        return Math.round(this._data.currentConditions.humidity);
    }

    getDewPt() {
        return Math.round(this._data.currentConditions.dew);
    }

    getPressure() {
        return this._data.currentConditions.pressure
    }
    
}

class IndividualWeatherData{
    constructor(date, tempMin, tempMax, icon)
    {
        this._date = date;
        this._tempMin = tempMin;
        this._tempMax = tempMax;
        this._icon = icon;
    }

    get date() {
        return this._date;
    }

    get tempMin() {
        return this._tempMin;
    }

    get tempMax() {
        return this._tempMax;
    }

    get icon() {
        return this._icon;
    }
}



export {WeatherData, IndividualWeatherData}