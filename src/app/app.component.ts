import {Component, OnInit} from '@angular/core';
import {marks} from "./config/antd.config";
import {format} from "date-fns";
import {dashboardOption, lineCombineOption, lineOption, scatterOption} from "./config/echarts.config";
import {NzUploadChangeParam, NzUploadFile} from "ng-zorro-antd/upload";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'DepressionAnalysis';

  // constant
  FREQ = 200; // 采样频率

  // antd-params
  marks = marks;
  formatterSecond = (value: number) => `${value} 秒`;
  parserSecond = (value: string) => value.replace(' 秒', '');

  // echart-params
  dsOption: any;
  scOption: any;
  lineOption: any;
  singleLineOption: any;

  // input-params
  personDataStr = '';
  preSignalStr = '';
  timeValue = 0;
  uploadFileList: NzUploadFile[] = [];

  user = '';
  formatDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  dashboardData = [];

  scData1 = [];
  scData2 = [];

  // origin data
  currentUserId = -1;
  xData = [];
  heartOriData = [];
  brainOriData = [];
  skinOriData = [];

  // pre-handle signal
  currentTag = -1;
  preHandleData = [];


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

  handleChange(info: NzUploadChangeParam) {
    if (info.file.status !== 'uploading') {
      const file = info.file.originFileObj;
      this.uploadFileList = [];
      // save name
      this.user = file ? file.name.split('.')[0] : '';
      // save origin signal
      const reader = new FileReader();
      reader.readAsText(file as any);
      reader.onload = (f => {
        return (e: any) => {
          this.personDataStr = e.target.result;
          this.xData = this._getSerialX();
          this.currentUserId = this._getCurrentId();
          this.heartOriData = this._getOriginHeart();
          this.brainOriData = this._getOriginBrain();
          this.skinOriData = this._getOriginSkin();

          this.lineOption = lineCombineOption(this.xData,
            this.heartOriData,
            this.brainOriData,
            this.skinOriData);
        }
      })(file);
    }
  }

  handlePreSigChange(info: NzUploadChangeParam, tag: number) {
    if (info.file.status !== 'uploading') {
      const file = info.file.originFileObj;
      this.uploadFileList = [];
      // save origin signal
      const reader = new FileReader();
      reader.readAsText(file as any);
      reader.onload = (f => {
        return (e: any) => {
          this.preSignalStr = e.target.result;
          this.currentTag = tag;
          this.singleLineOption = lineOption(this._getSerialX2(), this._getPreSignal(tag));
        }
      })(file);
    }
  }

  slideChange($event: any) {
    if (this.personDataStr) {
      this.lineOption = lineCombineOption(this._getSerialX(),
        this._getOriginHeart(),
        this._getOriginBrain(),
        this._getOriginSkin());
    }
    if (this.preSignalStr) {
      this.singleLineOption = lineOption(this._getSerialX2(),
        this._getPreSignal(this.currentTag));
    }
  }

  _getPreSignal(tag: number) {
    switch (tag) {
      case 1:
        return JSON.parse(this.preSignalStr)["ECG"].slice(this.timeValue * this.FREQ);
      case 2:
        return JSON.parse(this.preSignalStr)["EEG"].slice(this.timeValue * this.FREQ);
      case 3:
        return JSON.parse(this.preSignalStr)["GSR"].slice(this.timeValue * this.FREQ);
      default:
        return [];
    }
  }

  _getOriginHeart() {
    return JSON.parse(this.personDataStr)["ECG"].slice(this.timeValue * this.FREQ);
  }

  _getOriginBrain() {
    return JSON.parse(this.personDataStr)["EEG"].slice(this.timeValue * this.FREQ);
  }

  _getOriginSkin() {
    return JSON.parse(this.personDataStr)["GSR"].slice(this.timeValue * this.FREQ);
  }

  _getCurrentId() {
    return JSON.parse(this.personDataStr)["index"];
  }

  _getSerialX() {
    return JSON.parse(this.personDataStr)["x"].slice(this.timeValue * this.FREQ);
  }

  _getSerialX2() {
    return JSON.parse(this.preSignalStr)["x"].slice(this.timeValue * this.FREQ);
  }

}
