import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @Input() chartData;
  pieChartData: any;
  constructor() { }

  ngOnInit() {this.pieChartData = {
    chartType: 'LineChart',
    dataTable: [['Time', 'Temperature'],...this.chartData]
  }
  console.log("hello");

  }

}
