import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import {
  getTotalPriceByMonth,
  getTotalPaidPriceByMonth,
  getTotalProgressPriceByMonth,
} from '../../api/Dashboard/TotalProject';

const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#5BABAC', '#80CAEE', '#FF5733'],
  chart: {
    fontFamily: 'Montserrat, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 10000000000,
    labels: {
      formatter: function (value) {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(value);
      },
    },
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
  yaxis: {
    title: {
      style: {
        fontSize: '0px';
      };
    };
    min: number;
    max: number;
  };
}

const ChartOne: React.FC = () => {
  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: 'Tổng Tiền Tạm Tính',
        data: [],
      },
      {
        name: 'Tổng Thực nhận',
        data: [],
      },
      {
        name: 'Đang chờ xử lý',
        data: [],
      },
    ],
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      max: 10000000000,
    },
  });

  const [selectedYear, setSelectedYear] = useState<number>(2025);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalRevenueData: number[] = [];
        const totalSalesData: number[] = [];
        const totalProgressData: number[] = [];

        for (let month = 1; month <= 12; month++) {
          const totalPrice = await getTotalPriceByMonth(month, selectedYear);
          const totalPaidPrice = await getTotalPaidPriceByMonth(
            month,
            selectedYear,
          );
          const totalProgressPrice = await getTotalProgressPriceByMonth(
            month,
            selectedYear,
          );

          totalRevenueData.push(totalPrice);
          totalSalesData.push(totalPaidPrice);
          totalProgressData.push(totalProgressPrice);
        }

        const allData = [
          ...totalRevenueData,
          ...totalSalesData,
          ...totalProgressData,
        ];
        const maxDataValue = Math.max(...allData);

        setState({
          series: [
            {
              name: 'Tổng Tiền Tạm Tính',
              data: totalRevenueData,
            },
            {
              name: 'Tổng Thực nhận',
              data: totalSalesData,
            },
            {
              name: 'Đang chờ xử lý',
              data: totalProgressData,
            },
          ],
          yaxis: {
            title: {
              style: {
                fontSize: '0px',
              },
            },
            min: 0,
            max: maxDataValue,
          },
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedYear]);

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };
  handleReset;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
            <div className="flex items-center min-w-47.5">
              <span
                className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border"
                style={{ borderColor: '#5BABAC' }}
              >
                <span
                  className="block h-2.5 w-full max-w-2.5 rounded-full"
                  style={{ backgroundColor: '#5BABAC' }}
                ></span>
              </span>
              <div className="w-full">
                <p className="font-semibold" style={{ color: '#5BABAC' }}>
                  Tổng Tiền Tạm Tính
                </p>
                <p className="text-sm font-medium">01.01.2024 - 01.12.2024</p>
              </div>
            </div>
            <div className="flex items-center min-w-47.5">
              <span
                className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border"
                style={{ borderColor: '#80CAEE' }}
              >
                <span
                  className="block h-2.5 w-full max-w-2.5 rounded-full"
                  style={{ backgroundColor: '#80CAEE' }}
                ></span>
              </span>
              <div className="w-full">
                <p className="font-semibold" style={{ color: '#80CAEE' }}>
                  Tổng Thực nhận
                </p>
                <p className="text-sm font-medium">01.01.2024 - 01.12.2024</p>
              </div>
            </div>
            <div className="flex items-center min-w-47.5">
              <span
                className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border"
                style={{ borderColor: '#FF5733' }}
              >
                <span
                  className="block h-2.5 w-full max-w-2.5 rounded-full"
                  style={{ backgroundColor: '#FF5733' }}
                ></span>
              </span>
              <div className="w-full">
                <p className="font-semibold" style={{ color: '#FF5733' }}>
                  Đang chờ xử lý
                </p>
                <p className="text-sm font-medium">01.01.2024 - 01.12.2024</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <div className="relative z-20 inline-block">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
              >
                <option value={2024} className="dark:bg-boxdark">
                  2024
                </option>
                <option value={2025} className="dark:bg-boxdark">
                  2025
                </option>
              </select>
              <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                    fill="#637381"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
                    fill="#637381"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
