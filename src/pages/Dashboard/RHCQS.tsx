import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CardDataStats from '../../components/DashboardCard/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
// import ChartThree from '../../components/Charts/ChartThree';
import ChartTwo from '../../components/Charts/ChartTwo';
import {
  getTotalSaleStaffAccount,
  getTotalDesignerStaffAccount,
  getTotalCustomerAccount,
  getTotalProjects,
  getTotalRevenue,
  getTotalCost,
  getTotalProgress,
} from '../../api/Dashboard/TotalAccount';
import {} from '../../api/Dashboard/TotalProject';
import { Profile } from '../../types/Account';
import CardDataStatsCombined from '../../components/DashboardCard/CardDataStatsCombined';
import HouseDesignDrawingIcon from '../../SVG/DashboardIcon/HouseDesginDrawingIcon';
import CardTotalPrice from '../../components/DashboardCard/CardTotalPrice';
import RevenueIcon from '../../SVG/DashboardIcon/RevenueIcon';
import CostIcon from '../../SVG/DashboardIcon/CostIcon';

const RHCQS: React.FC = () => {
  const [user, setUser] = useState<Profile | undefined>(undefined);
  const [totalSaleStaff, setTotalSaleStaff] = useState<number>(0);
  const [totalDesignerStaff, setTotalDesignerStaff] = useState<number>(0);
  const [totalCustomer, setTotalCustomer] = useState<number>(0);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [totalProgress, setTotalProgress] = useState<number>(0);

  useEffect(() => {
    const fetchTotalSaleStaff = async () => {
      try {
        const total = await getTotalSaleStaffAccount();
        setTotalSaleStaff(total);
      } catch (error) {
        toast.error('Không thể lấy dữ liệu nhân viên báo giá');
      }
    };

    const fetchTotalDesignerStaff = async () => {
      try {
        const total = await getTotalDesignerStaffAccount();
        setTotalDesignerStaff(total);
      } catch (error) {
        toast.error('Không thể lấy dữ liệu nhân viên thiết kế');
      }
    };

    const fetchTotalCustomer = async () => {
      try {
        const total = await getTotalCustomerAccount();
        setTotalCustomer(total);
      } catch (error) {
        toast.error('Không thể lấy dữ liệu khách hàng');
      }
    };

    const fetchTotalProjects = async () => {
      try {
        const total = await getTotalProjects();
        setTotalProjects(total);
      } catch (error) {
        toast.error('Không thể lấy dữ liệu tổng số dự án');
      }
    };

    const fetchTotalRevenue = async () => {
      try {
        const total = await getTotalRevenue();
        setTotalRevenue(total);
      } catch (error) {
        toast.error('Không thể lấy dữ liệu tổng doanh thu');
      }
    };

    const fetchTotalCost = async () => {
      try {
        const total = await getTotalCost();
        setTotalCost(total);
      } catch (error) {
        toast.error('Không thể lấy dữ liệu tổng doanh thu');
      }
    };

    const fetchTotalProgress = async () => {
      try {
        const total = await getTotalProgress();
        setTotalProgress(total);
      } catch (error) {
        toast.error('Không thể lấy dữ liệu tổng doanh thu');
      }
    };

    fetchTotalSaleStaff();
    fetchTotalDesignerStaff();
    fetchTotalCustomer();
    fetchTotalProjects();
    fetchTotalRevenue();
    fetchTotalCost();
    fetchTotalProgress();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Tổng số dự án" total={totalProjects}>
          <HouseDesignDrawingIcon
            className="mr-2 fill-primary dark:fill-white"
            width="30"
            height="30"
          />
        </CardDataStats>
        <CardTotalPrice
          title="Tổng Doanh Thu"
          totalRevenue={formatCurrency(totalRevenue)}
          totalProgress={formatCurrency(totalProgress)}
        >
          <RevenueIcon
            className="mr-2 fill-primary dark:fill-white"
            width="30"
            height="30"
          />
        </CardTotalPrice>
        <CardDataStats title="Tổng chi" total={formatCurrency(totalCost)}>
          <CostIcon
            className="mr-2 fill-primary dark:fill-white"
            width="30"
            height="30"
          />
        </CardDataStats>

        <CardDataStatsCombined
          saleStaff={totalSaleStaff}
          designerStaff={totalDesignerStaff}
          customer={totalCustomer}
        />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        {/* <ChartThree /> */}
        <div className="col-span-12 xl:col-span-8"></div>
      </div>
    </>
  );
};

export default RHCQS;
