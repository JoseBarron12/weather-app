import { fromUnixTime, getHours } from "date-fns";

class WeatherData {
    
    dayForecast = [];
    fifteenDayForecast = [];
    
    constructor(data)
    {
        this._data = data;

        const days = data.days;

        for(const day of days)
        {
            const dayData = new IndividualWeatherData(
                fromUnixTime(day.datetimeEpoch),
                Math.round(day.tempmin),
                Math.round(day.temp),
                Math.round(day.tempmax),
                day.icon
            );

            this.fifteenDayForecast.push(dayData);
        }

        const currentHour = getHours(fromUnixTime(data.currentConditions.datetimeEpoch));
        console.log(currentHour);

        const currentDay = days[0];
        console.log(currentDay);

        const currentDayHours = currentDay.hours;

        for(let i = currentHour; i < currentDayHours.length; i++)
        {
            const hourData = new IndividualWeatherData(
                fromUnixTime(currentDayHours[i].datetimeEpoch),
                Math.round(currentDayHours[i].tempmin),
                Math.round(currentDayHours[i].temp),
                Math.round(currentDayHours[i].tempmax),
                currentDayHours[i].icon
            );
            this.dayForecast.push(hourData);
        }

        const leftoverHours = 24 - (24 - currentHour);
        const nextDay = days[1];
        const nextDayHours = nextDay.hours;

        for(let i = 0; i < leftoverHours; i++)
        {
            const hourData = new IndividualWeatherData(
                fromUnixTime(nextDayHours[i].datetimeEpoch),
                Math.round(nextDayHours[i].tempmin),
                Math.round(nextDayHours[i].temp),
                Math.round(nextDayHours[i].tempmax),
                nextDayHours[i].icon,
                fromUnixTime(nextDayHours[i].sunsetEpoch)
            );
            this.dayForecast.push(hourData);
        }

    }

    get data() {
        return this._data
    }

    get upcomingForecast() {
        return this.fifteenDayForecast;
    }

    get todayForecast() {
        return this.dayForecast;
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
        return Math.round(this._data.currentConditions.windspeed);
    }

    getWindGust() {
        return Math.round(this._data.currentConditions.windgust);
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
        return Math.round(this._data.currentConditions.visibility);
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
    constructor(date, tempMin, temp, tempMax, icon, sunrise)
    {
        this._date = date;
        this._tempMin = tempMin;
        this._temp = temp;
        this._tempMax = tempMax;
        this._icon = icon;
        this._sunrise = sunrise;
    }

    get date() {
        return this._date;
    }

    get tempMin() {
        return this._tempMin;
    }

    get temp() {
        return this._temp;
    }

    get tempMax() {
        return this._tempMax;
    }

    get icon() {
        return this._icon;
    }

    get sunrise() {
        return this._sunrise;
    }
}



export {WeatherData, IndividualWeatherData}