import {
  ServerServiceInterface,
  DbService,
  Server,
  DbCollection,
  ServerEndpointActionInterface,
  ServerError
} from "../../../serendip";
import { BusinessModel, BusinessMemberModel } from "../models";
import * as _ from "underscore";
import { ObjectId } from "bson";

import * as WeatherJs from "weather-js";
import * as ICE from "iranian-calendar-events";

interface WeatherCacheInterface {
  date: number;
  data: object;
  search: string;
}

export class ExternalService implements ServerServiceInterface {
  static dependencies = ["DbService"];

  private weatherCache: WeatherCacheInterface[] = [];

  constructor() {}

  async start() {}

  async iranCalendarEvent(year: number) {
    return ICE.default({ year: year });
  }

  weather(search: string) {
    return new Promise((resolve, reject) => {
      var cache = _.findWhere(this.weatherCache, { search: search });

      if (cache)
        if (Date.now() - cache.date < 1000 * 60 * 60 * 6)
          return resolve(cache.data);

      WeatherJs.find({ search: search, degreeType: "C" }, (err, result) => {
        if (err) return reject(err);

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
