import {Component, OnInit} from '@angular/core';
import {marks} from "./antd.config";
import {format} from "date-fns";
import {dashboardOption, scatterOption} from "./echarts.config";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'DepressionAnalysis';


  // antd-params
  marks = marks;
  formatterSecond = (value: number) => `${value} 秒`;
  parserSecond = (value: string) => value.replace(' 秒', '');

  // echart-params
  dsOption: any;
  scOption: any;

  // input-params
  timeValue = 0;
  user = '';
  formatDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  dashboardData = [];
  scData1 = [];
  scData2 = [];

  constructor() {
    this.dsOption = dashboardOption(this.dashboardData as any);
    this.scOption = scatterOption(this.scData1, this.scData2);
  }


  ngOnInit() {
    // test
    const dsData = {
      value: 70,
      name: '置信度'
    };
    // @ts-ignore
    this.dashboardData.push(dsData);
    this.dsOption = dashboardOption(this.dashboardData as any);

    const scData1 = [
      [10.0, 8.04],
      [8.0, 6.95],
      [13.0, 7.58],
      [9.0, 8.81],
      [11.0, 8.33],
      [14.0, 9.96],
      [6.0, 7.24],
      [4.0, 4.26],
      [12.0, 10.84],
      [7.0, 4.82],
      [5.0, 5.68]
    ];

    const scData2 = [
      [10.0, 9.14],
      [8.0, 8.14],
      [13.0, 8.74],
      [9.0, 8.77],
      [11.0, 9.26],
      [14.0, 8.10],
      [6.0, 6.13],
      [4.0, 3.10],
      [12.0, 9.13],
      [7.0, 7.26],
      [5.0, 4.74]
    ];
    this.scOption = scatterOption(scData1, scData2);

  }

}
