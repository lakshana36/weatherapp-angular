import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { AppComponent } from './app.component';
import { SummaryComponent } from './component/summary/summary.component';
import { ChartComponent } from './component/chart/chart.component';
import { TpwComponent } from './component/tpw/tpw.component';
import { TemperatureComponent } from './component/temperature/temperature.component';
import { DayTileComponent } from './component/day-tile/day-tile.component';
import { HttpModule } from "@angular/http";
import { WeatherService } from "./weather.service";


@NgModule({
  declarations: [
    AppComponent,
    SummaryComponent,
    ChartComponent,
    TpwComponent,
    TemperatureComponent,
    DayTileComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    Ng2GoogleChartsModule
  ],
  providers: [WeatherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
