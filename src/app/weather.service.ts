import { Injectable } from '@angular/core';
import { ISummary } from "./models/summary";
import { ITemperature } from "./models/temperature";
import { Itpw } from "./models/tpw";
import { IDayTile } from "./models/dayTile";
import { Http } from '@angular/http';
import * as _ from 'lodash';
import * as moment from 'moment';
@Injectable()
export class WeatherService {
  summary: ISummary;
  temperature: ITemperature;
  tpw:Itpw;
  dayWiseMap: any;
  dayTileList: Array<IDayTile>;
  chartdetails: Array<any>;
  tempArray: Array<any>;
  constructor(private httpService: Http) {
    this.dayWiseMap = {};
    this.chartdetails=[];
    this.tempArray = [];
   }
   updateDayInfoFor(dayNum: number) {
    const dayInfoForDay = this.dayWiseMap[dayNum];
    console.log(dayInfoForDay);
    this.summary = {
      ...this.summary,
      day: moment(dayInfoForDay[0].dt * 1000).format("dddd"),
      weatherCondition: dayInfoForDay[0].weather[0].description
    }
    this.temperature={
      currentWeatherImageURL:"https://openweathermap.org/img/w/"+dayInfoForDay[0].weather[0].icon+".png",
      temperatureInCelcius: Math.round(dayInfoForDay[0].main.temp - 270),
      temperatureInKelvin:Math.round(dayInfoForDay[0].temp- 270),
      temperatureInFahrenheit:Math.round((dayInfoForDay[0].temp - 270)*1.8+32)
    }
    this.tpw={
      temparature:Math.round(dayInfoForDay[0].main.temp - 270),
      pressure: Math.round(dayInfoForDay[0].main.pressure/10),
      windSpeed:Math.round(dayInfoForDay[0].wind.speed*2.23694)
     };
  }
  fetchWeatherInfo(cityName: string) {
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=27d43832d2a4adcb97fcbfa23db130aa`;
    this.httpService.get(url)
      .subscribe((rsp) => {
        console.log(rsp.json());
        const data = rsp.json();
        this.summary = {
          cityName: data.city.name,
          day: moment(data.list[0].dt * 1000).format("dddd"),
          weatherCondition: data.list[0].weather[0].description
        };

        this.temperature={
          currentWeatherImageURL: "https://openweathermap.org/img/w/"+data.list[0].weather[0].icon+".png",
          temperatureInCelcius: Math.round(data.list[0].main.temp - 270),
          temperatureInKelvin:Math.round(data.list[0].main.temp- 270),
          temperatureInFahrenheit:Math.round((data.list[0].main.temp - 270)*1.8+32)
        };
        console.log(this.temperature);
         this.tpw={
          temparature:Math.round(data.list[0].main.temp - 270),
          pressure: Math.round(data.list[0].main.pressure/10),
          windSpeed:Math.round(data.list[0].wind.speed*2.23694)
         };
        data.list.forEach(date => {
         
          const dateValue = new Date(date.dt * 1000);
          const dayNum = dateValue.getDay();
          if (dayNum in this.dayWiseMap) {
            this.dayWiseMap[dayNum].push(date);
          } else {
            this.dayWiseMap[dayNum] = [date];
          }
         
        });
        console.log(this.dayWiseMap);
        const sortedMap = _.sortBy(this.dayWiseMap, (value) => {
          let dayOfWeek = new Date(value[0].dt * 1000).getDay();
          console.log(dayOfWeek+"dayOfWeek");
          let today = new Date().getDay();
          console.log(today+"today");
          const diff = dayOfWeek - today;
          console.log(diff+"diff");
          return diff < 0 ? diff + 7 : diff;
        });

        console.log(sortedMap);

        this.dayTileList = _.map(sortedMap, (obj) => {
          var url=  "https://openweathermap.org/img/w/"+obj[0].weather[0].icon+".png";
          const minTemp = _.reduce(obj.map(interval => interval.main.temp_min), (a, b) => a + b) / obj.length;
          return {
            day: moment(obj[0].dt * 1000).format("ddd"),
            minTemp: _.round(minTemp - 270),
            maxTemp: _.round(obj[0].main.temp_max - 270),
            imageURL: url,
            dayNum: new Date(obj[0].dt * 1000).getDay()
          }
        
        });
          
        console.log(this.dayTileList);
        const currentDayDetails = this.dayWiseMap[new Date().getDay()];
        console.log(currentDayDetails);
        this.chartdetails = currentDayDetails
        .map(tempInfoObj => {
          return [moment(tempInfoObj.dt * 1000).format('dddd, h:mm a'), tempInfoObj.main.temp]
        })
        console.log("chardata",this.chartdetails);
     
      });
  }

}
