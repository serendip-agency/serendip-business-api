"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("underscore");
const WeatherJs = require("weather-js");
const ICE = require("iranian-calendar-events");
class ExternalService {
    constructor() {
        this.weatherCache = [];
    }
    async start() { }
    async iranCalendarEvent(year) {
        return ICE.default({ year: year });
    }
    weather(search) {
        return new Promise((resolve, reject) => {
            var cache = _.findWhere(this.weatherCache, { search: search });
            if (cache)
                if (Date.now() - cache.date < 1000 * 60 * 60 * 6)
                    return resolve(cache.data);
            WeatherJs.find({ search: search, degreeType: "C" }, (err, result) => {
                if (err)
                    return reject(err);
                resolve(result);
                if (cache)
                    this.weatherCache.splice(this.weatherCache.indexOf(cache), 1);
                this.weatherCache.push({
                    search: search,
                    date: Date.now(),
                    data: result
                });
            });
        });
    }
}
ExternalService.dependencies = ["DbService"];
exports.ExternalService = ExternalService;
