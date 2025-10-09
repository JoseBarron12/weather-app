class WeatherData {
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
}

export {WeatherData}