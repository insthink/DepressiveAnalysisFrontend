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
        formatter: '{value}',
        color: 'auto'
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

export const scatterOption = (data1: any[], data2: any[]) => {
  return {
    title: {
      left: 'center',
      top: 0
    },
    grid: [
      {left: '5%', top: '10%', width: '42%', height: '60%'},
      {right: '5%', top: '10%', width: '42%', height: '60%'},
    ],
    xAxis: [
      {
        gridIndex: 0,
        name: 'RR(t)',
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: 14,
          color: light_blue,
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: light_blue,
        },
        axisLine:{
          lineStyle: {
            color: light_blue,
          }
        }
      },
      {
        gridIndex: 1,
        name: '时间(秒)',
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: 14,
          color: light_blue,
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: light_blue,
        },
        axisLine:{
          lineStyle: {
            color: light_blue,
          }
        }
      },
    ],
    yAxis: [
      {
        gridIndex: 0,
        name: 'RR(t-1)',
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: 14,
          color: light_blue,
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: light_blue,
        },
        axisLine:{
          lineStyle: {
            color: light_blue,
          }
        }
      },
      {
        gridIndex: 1,
        name: '心率(拍/分)',
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: 14,
          color: light_blue,
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: light_blue,
        },
        axisLine:{
          lineStyle: {
            color: light_blue,
          }
        }
      },
    ],
    series: [
      {
        type: 'scatter',
        xAxisIndex: 0,
        yAxisIndex: 0,
        itemStyle:  {
          color: 'red',

        },
        symbolSize: 5,
        data: data1,
      },
      {
        type: 'scatter',
        itemStyle:  {
          color: 'red'
        },
        xAxisIndex: 1,
        yAxisIndex: 1,
        symbolSize: 5,
        data: data2,
      },
    ]
  }
};
