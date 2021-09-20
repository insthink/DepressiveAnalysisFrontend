import {Component, OnInit} from '@angular/core';
import {marks} from "./config/antd.config";
import {format} from "date-fns";
import {dashboardOption, lineCombineOption, scatterOption} from "./config/echarts.config";
import {NzUploadChangeParam, NzUploadFile} from "ng-zorro-antd/upload";
import {JsonService} from "./service/json.service";


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
  procData: any;

  // scatter data
  scatterData: any;

  // table
  tableData: any;

  // analysis
  analysisData: any;


  constructor(private jsonService: JsonService) {
    this.dsOption = dashboardOption(this.dashboardData as any);
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
    this.scOption = scatterOption([], [],
      true, true,
      'RR(t)', '时间（秒）',
      'RR(t-1)', '心率（拍/分）');
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
          // load origin
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

          // load processed
          this.jsonService.loadPreprocessed(this.currentUserId).subscribe(data => {
            this.procData = data;
            console.log(data);
          });

          // load scatter
          this.jsonService.loadScatter().subscribe(data => {
            this.scatterData = data;
            console.log(data);
          });

          // load table
          this.jsonService.loadTable().subscribe(data => {
            this.tableData = data;
            console.log(data);
          });

          // load analysis
          this.jsonService.loadAnalysis().subscribe(data => {
            this.analysisData = data;
            console.log(data);
          })
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

}
