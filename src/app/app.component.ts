import {Component, OnInit} from '@angular/core';
import {marks} from "./config/antd.config";
import {format} from "date-fns";
import {dashboardOption, lineCombineOption, lineOption, scatterOption} from "./config/echarts.config";
import {NzUploadChangeParam, NzUploadFile} from "ng-zorro-antd/upload";
import {JsonService} from "./service/json.service";
import {zip} from "./util/trans.util";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'DepressionAnalysis';

  // constant
  FREQ = 200; // 采样频率
  INTR = 20;

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
  currentTag = -1;

  // scatter data
  scatterData: any;

  // table
  tableData: any;
  tableHeart = [];
  tableBrain = [];
  tableSkin = [];

  // analysis
  analysisData: any;
  isHealth = false;
  conf = 0;
  state = '';



  constructor(private jsonService: JsonService) {
    this.dsOption = dashboardOption(this.dashboardData as any);
  }


  ngOnInit() {
    // test
    const dsData = {
      value: 0,
      name: '置信度'
    };
    // @ts-ignore
    this.dashboardData.push(dsData);
    this.dsOption = dashboardOption(this.dashboardData as any);
    this.scOption = scatterOption(
      [],
      [],
      true,
      true,
      "RR(t)",
      "时间(秒)",
      "RR(t-1)",
      "心率（拍/分）",
      true
    );
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
          this.heartOriData = this._getOriginData("ECG");
          this.brainOriData = this._getOriginData("EEG");
          this.skinOriData = this._getOriginData("GSR");

          this.lineOption = lineCombineOption(this.xData,
            this.heartOriData,
            this.brainOriData,
            this.skinOriData);

          // load processed
          this.jsonService.loadPreprocessed(this.currentUserId).subscribe(data => {
            this.procData = data;
          });

          // load scatter
          this.jsonService.loadScatter().subscribe(data => {
            this.scatterData = data;
          });

          // load table
          this.jsonService.loadTable().subscribe(data => {
            this.tableData = data;
          });

          // load analysis
          this.jsonService.loadAnalysis().subscribe(data => {
            this.analysisData = data;
          })
        }
      })(file);
    }
  }

  slideChange() {
    if (this.personDataStr) {
      this.lineOption = lineCombineOption(this._getSerialX(),
        this._getOriginData("ECG"),
        this._getOriginData("EEG"),
        this._getOriginData("GSR"));
    }
    switch (this.currentTag) {
      case 1:
        this.singleLineOption = lineOption(this._getSerialX(), this._getProcData("ECG"));
        break;
      case 2:
        this.singleLineOption = lineOption(this._getSerialX(), this._getProcData("EEG"));
        break;
      case 3:
        this.singleLineOption = lineOption(this._getSerialX(), this._getProcData("GSR"));
        break;
      default:
    }
  }

  handleSelect(tag: number) {
    this.currentTag = tag;
    switch (tag) {
      case 1:
        // heart
        // 1.processed
        this.singleLineOption = lineOption(this._getSerialX(), this._getProcData("ECG"));
        // 2.scatter
        const heartSc = this._getTransData("ECG");
        this.scOption = scatterOption(
          heartSc.left,
          heartSc.right,
          true,
          true,
          "RR(t)",
          "时间(秒)",
          "RR(t-1)",
          "心率（拍/分）",
          true
        );
        // 3.table
        this.tableHeart = this._getTableRowData("ECG");
        break;
      case 2:
        // brain
        this.singleLineOption = lineOption(this._getSerialX(), this._getProcData("EEG"));
        const brainSc = this._getTransData("EEG");
        this.scOption = scatterOption(
          brainSc.left,
          brainSc.right,
          false,
          false,
          "复杂度",
          "模糊熵",
          "",
          "",
          false,
          "line",
        );
        this.tableBrain = this._getTableRowData("EEG");
        break;
      case 3:
        // skin
        this.singleLineOption = lineOption(this._getSerialX(), this._getProcData("GSR"));
        const skinSc = this._getTransData("GSR");
        this.scOption = scatterOption(
          skinSc.left,
          skinSc.right,
          false,
          false,
          "样本熵",
          "模糊熵",
          "",
          "",
          false,
          "line",
        );
        this.tableSkin = this._getTableRowData("GSR");
        break;
      default:

    }
  }

  analyseState() {
    const isHealth = this.analysisData[this.currentUserId.toString()]["conf"];
    if (isHealth == 1) {
      this.state = '抑郁';
    } else {
      this.state = '健康';
    }
    this.conf = this.analysisData[this.currentUserId.toString()]["state"];
    const data = [{value: this.conf, name: '置信度'}];
    this.dsOption = dashboardOption(data as any);
  }

  // prepare for table
  _getTableRowData(category: string) {
    return this.tableData[this.currentUserId.toString()][category];
  }

  // prepare for scatter chart
  _getTransData(category: string) {
    const leftTag = `${category}_left`;
    const rightTag = `${category}_right`;
    const leftData = this.scatterData[this.currentUserId.toString()][leftTag];
    const rightData = this.scatterData[this.currentUserId.toString()][rightTag];
    console.log(leftData);
    console.log(rightData);
    const leftDataTrans = zip(leftData.x, leftData.y);
    const rightDataTrans = zip(rightData.x, rightData.y);
    return {
      left: leftDataTrans,
      right: rightDataTrans
    };
  }

  // prepare for processed chart
  _getProcData(category: string) {
    return this.procData[category].slice(this.timeValue * this.FREQ,
      this.timeValue * this.FREQ + this.INTR * this.FREQ
      );
  }

  // prepare for origin chart
  _getOriginData(category: string) {
    return JSON.parse(this.personDataStr)[category].slice(this.timeValue * this.FREQ,
      this.timeValue * this.FREQ + this.INTR * this.FREQ);
  }

  _getCurrentId() {
    return JSON.parse(this.personDataStr)["index"];
  }

  _getSerialX() {
    return JSON.parse(this.personDataStr)["x"].slice(this.timeValue * this.FREQ,
      this.timeValue * this.FREQ + this.INTR * this.FREQ);
  }

}
