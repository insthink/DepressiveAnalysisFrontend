import {EChartsOption} from "echarts";

const slight_blue = '#67e0e3';
const light_blue = '#37a2da';
const dark_blue = '#206fda';

export const dashboardOption = (data: []) => {
  return {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%'
    },
    series: [{
      name: 'Pressure',
      type: 'gauge',
      axisLine: {
        lineStyle: {
          width: 10,
          color: [
            [0.3, slight_blue],
            [0.7, light_blue],
            [1, dark_blue]
          ]
        }
      },
      pointer: {
        itemStyle: {
          color: 'auto'
        }
      },
      axisLabel: {
        color: 'auto',
      },
      detail: {
        formatter: '{value}%',
        color: 'auto',
        fontSize: 24,
      },
      title: {
        offsetCenter: [0, '-20%'],
        fontSize: 14,
        color: '#c3c6da'
      },
      data: data
    }]
  } as EChartsOption
};

export const scatterOption = (dataL: any[],
                              dataR: any[],
                              showX: boolean,
                              showY: boolean,
                              labelX1: string,
                              labelX2: string,
                              labelY1: string,
                              labelY2: string,
                              needLine?: boolean,
                              type = 'scatter') => {
  dataL.sort((a, b) => a[0] - b[0]);
  const endIndex = dataL.length - 1;
  let markLineOpt = {};
  if (needLine && dataL.length > 0) {
    console.log(dataL[0]);
    console.log(dataL[endIndex]);
    markLineOpt = {
      animation: false,
      label: {
        align: 'right'
      },
      lineStyle: {
        type: 'solid',
        color: 'blue'
      },
      tooltip: {
        formatter: 'y = x'
      },
      data: [[{
        coord: [dataL[0][0],dataL[0][0]],
        symbol: 'none'
      }, {
        coord: [dataL[endIndex][0], dataL[endIndex][0]],
        symbol: 'none'
      }]]
    };
  }

  return {
    title: {
      left: 'center',
      top: 0
    },
    grid: [
      {left: '7%', top: '10%', width: '40%', height: '60%'},
      {right: '7%', top: '10%', width: '40%', height: '60%'},
    ],
    xAxis: [
      {
        gridIndex: 0,
        name: labelX1,
        nameLocation: 'middle',
        nameTextStyle: {
          color: light_blue,
          padding: 7
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: showX,
        },
        axisLabel: {
          color: light_blue,
          show: showX,
        },
        axisLine: {
          lineStyle: {
            color: light_blue,
          },
        },
        scale: true,
      },
      {
        gridIndex: 1,
        name: labelX2,
        nameLocation: 'middle',
        nameTextStyle: {
          color: light_blue,
          padding: 7
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: showX,
        },
        axisLabel: {
          color: light_blue,
          show: showX,
        },
        axisLine: {
          lineStyle: {
            color: light_blue,
          }
        },
        scale: true,
      },
    ],
    yAxis: [
      {
        gridIndex: 0,
        name: labelY1,
        nameLocation: 'middle',
        nameTextStyle: {
          padding: 15,
          color: light_blue,
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: showY,
        },
        axisLabel: {
          color: light_blue,
          show: showY,
        },
        axisLine: {
          lineStyle: {
            color: light_blue,
          }
        },
        scale: true,
      },
      {
        gridIndex: 1,
        name: labelY2,
        nameLocation: 'middle',
        nameTextStyle: {
          padding: 15,
          color: light_blue,
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: showY,
        },
        axisLabel: {
          color: light_blue,
          show: showY,
        },
        axisLine: {
          lineStyle: {
            color: light_blue,
          }
        },
        scale: true,
      },
    ],
    series: [
      {
        type: type,
        xAxisIndex: 0,
        yAxisIndex: 0,
        itemStyle: {
          color: 'red',
        },
        symbolSize: 5,
        data: dataL,
        markLine: markLineOpt
      },
      {
        type: type,
        itemStyle: {
          color: 'red'
        },
        xAxisIndex: 1,
        yAxisIndex: 1,
        symbolSize: 5,
        data: dataR,
      },
    ]
  }
};

export const lineCombineOption = (dataX: any[],
                                  dataY1: any[],
                                  dataY2: any[],
                                  dataY3: any[]) => {
  return {
    grid: [
      {left: '7%', top: '14%', width: '80%', height: '20%'},
      {left: '7%', top: '47%', width: '80%', height: '20%'},
      {left: '7%', bottom: '0%', width: '80%', height: '20%'},
    ],
    xAxis: [
      {gridIndex: 0, data: dataX, show: false},
      {gridIndex: 1, data: dataX, show: false},
      {gridIndex: 2, data: dataX, show: false},
    ],
    yAxis: [
      {gridIndex: 0, show: false},
      {gridIndex: 1, show: false},
      {gridIndex: 2, show: false},
    ],
    series: [
      {
        name: 'I',

        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        symbol: null,
        data: dataY1
      },
      {
        name: 'II',
        type: 'line',
        xAxisIndex: 1,
        yAxisIndex: 1,
        symbol: null,
        data: dataY2,
      },
      {
        name: 'III',
        type: 'line',
        xAxisIndex: 2,
        yAxisIndex: 2,
        symbol: null,
        data: dataY3,
      },
    ]
  }
};

export const lineOption = (dataX: [], dataY: []) => {
  return {
    grid: [
      {left: '7%', top: '10%', width: '80%', height: '30%'},
    ],
    toolbox: {
      feature: {
        dataZoom: {},
        brush: {
          type: ['rect']
        }
      }
    },
    xAxis: [
      {data: dataX, show: false},
    ],
    yAxis: [
      {show: false},
    ],
    series: [
      {
        name: 'I',
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        symbol: null,
        data: dataY,
        itemStyle: {
          color: '#2FAC83'
        }
      },
    ]
  }
};
