import { differenceInHours, differenceInMinutes, fromUnixTime, getHours } from "date-fns";
import { id } from "date-fns/locale";



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
                day.icon, fromUnixTime(day.sunriseEpoch),
                Math.round(day.precipprob)
            );

            this.fifteenDayForecast.push(dayData);
        }

        const currentHour = getHours(fromUnixTime(data.currentConditions.datetimeEpoch));

        const currentDay = days[0];

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
        return this._data.days[0].precip;
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
        return Math.round(this._data.currentConditions.pressure);
    }

    set averageHighTemp(data) {
        this._averageHighTemp = data.days[0].normal.tempmax[1];
    }

    get averageHighTemp() {
        return Math.round(this._averageHighTemp);
    }

    set airQuality(data) {
        this._airQuality = data.days[0].aqius;
    }

    get airQuality() {
        return this._airQuality;
    }

    set moonPhase(data) {
        this._moonPhase = data.days[0].moonphase;
    }

    get moonPhase() {
        return this._moonPhase;
    }

    set moonRise(data) {
        this._moonRise = fromUnixTime(data.days[0].moonriseEpoch);
    }

    get moonRise() {
        return this._moonRise;
    }

    set moonSet(data) {
        this._moonSet = fromUnixTime(data.days[0].moonsetEpoch);
    }

    get moonSet() {
        return this._moonSet;
    }

    set moonDuration(data) {
        this._moonDuration = differenceInHours(this._moonSet, this._moonRise);
    }

    get moonDuration() {
        return this._moonDuration;
    }

    setAverageHighTemp(newTemp) {
        this._averageHighTemp = newTemp
    }

    setMoonRise(newDate) {
        this._moonRise = newDate;
    }

    setMoonSet(newDate) {
        this._moonSet = newDate;
    }

    setMoonDuration(newDuration) {
        this._moonDuration = newDuration;
    }

    setMoonPhase(newPhase) {
        this._moonPhase = newPhase;
    }

    setAirQuality(newQuality) {
        this._airQuality = newQuality;
    }

}

class IndividualWeatherData{
    constructor(date, tempMin, temp, tempMax, icon, sunrise, precipProb)
    {
        this._date = date;
        this._tempMin = tempMin;
        this._temp = temp;
        this._tempMax = tempMax;
        this._icon = icon;
        this._sunrise = sunrise;
        this._precipProb = precipProb;
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

    get precipProb() {
        return this._precipProb;
    }
}

class WeatherLocation {
    constructor(name, time, temp, tempMin, tempMax, desc, isCurrentLoc)
    {
        this._id = crypto.randomUUID();
        this._name = name;
        this._time = time;
        this._temp = temp;
        this._tempMin = tempMin;
        this._tempMax = tempMax;
        this._desc = desc;
        this._isCurrentLoc = isCurrentLoc;
    };

    get Id() {
        return this._id;
    }

    set Id(newId) {
        this._id = newId;
    }

    get name() {
        return this._name;
    }

    set name(newName) {
        this._name = newName;
    }

    get time() {
        return this._time;
    }

    set time(newTime) {
        this._time = newTime;
    }

    get temp() {
        return this._temp;
    }

    set temp(newTemp) {
        this._temp = newTemp;
    }

    get tempMin() {
        return this._tempMin;
    }

    set tempMin(newTemp) {
        this._tempMin = newTemp;
    }

    get tempMax() {
        return this._tempMax;
    }

    set tempMax(newTemp) {
        this._tempMax = newTemp;
    }

    get desc() {
        return this._desc;
    }

    set desc(newDesc) {
        this._desc = newDesc;
    }

    get isCurrentLoc() {
        return this.isCurrentLoc;
    }

    set isCurrentLoc(newFlag) {
        this._isCurrentLoc = newFlag;
    }

}



export {WeatherData, IndividualWeatherData, WeatherLocation}