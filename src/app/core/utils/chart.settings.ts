export function revenueAndExpensesChartSettings(revenue, expenses, month, min, max): any {
  return {
    series: [
      {
        name: 'Revenue',
        data: revenue
      },
      {
        name: 'Expenses',
        data: expenses
      }
    ],
    chart: {
      height: 450,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    colors: ['#58BE85', '#4A9FF6'],
    dataLabels: {
      enabled: true
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Revenue and Expenses',
      align: 'left'
    },
    markers: {
      size: 1
    },
    xaxis: {
      categories: month,
      title: {
        text: 'Month'
      }
    },
    yaxis: {
      title: {
        text: 'Dollars'
      },
      min,
      max
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5
    }
  };
}

export function getBalanceChartSettings(series, labels, total): any {
  return {
    series: [
      {
        name: 'balance',
        data: series
      }
    ],
    chart: {
      height: 450,
      type: 'bar',
      events: {
        click: (chart, w, e) => {
          // console.log(chart, w, e)
        }
      }
    },
    title: {
      text: 'Cash Reserves',
      align: 'left'
    },
    colors: [
      '#008FFB',
      '#00E396',
      '#FEB019',
      '#FF4560',
      '#775DD0',
      '#546E7A',
      '#26a69a',
      '#D10CE8'
    ],
    plotOptions: {
      bar: {
        columnWidth: '70%',
        distributed: true
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: [10, 7, 5],
      curve: 'smooth',
      dashArray: [0, 8, 5]
    },
    legend: {
      customLegendItems: [`Total ${total}`],
      fontWeight: 700,
      fontSize: '14px',
      horizontalAlign: 'left',
      fontFamily: 'Helvetica, Arial',
      markers: {
        width: 0,
        height: 0,
        radius: 0,
      },
    },
    grid: {
      show: false
    },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          colors: [
            '#008FFB',
            '#00E396',
            '#FEB019',
            '#FF4560',
            '#775DD0',
            '#546E7A',
            '#26a69a',
            '#D10CE8'
          ],
          fontSize: '12px'
        }
      }
    }
  };
}

