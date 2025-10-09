class WeatherData {
    constructor(data)
    {
        this._data = data;
    }

    get data() {
        return this._data
    }
}

export {WeatherData}