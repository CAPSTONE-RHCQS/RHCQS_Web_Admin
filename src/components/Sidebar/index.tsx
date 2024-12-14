import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../images/logo/logo.svg';
import ArrowIcon from '../../SVG/SidebarIcon/ArrowIcon';
import ProjectListIconManager from '../../SVG/SidebarIcon/ManagerIcon/ProjectListManagerIcon';
import HouseTemplatesManagerIcon from '../../SVG/SidebarIcon/ManagerIcon/HouseTemplatesManagerIcon';
import PackageManagerIcon from '../../SVG/SidebarIcon/ManagerIcon/PackageManagerIcon';
import ConstructionManagerIcon from '../../SVG/SidebarIcon/ManagerIcon/ConstructionManagerIcon';
import UtilityManagerIcon from '../../SVG/SidebarIcon/ManagerIcon/UtilityManagerIcon';
import PromotionManagerIcon from '../../SVG/SidebarIcon/ManagerIcon/PromotionManagerIcon';
import MaterialSectionManagerIcon from '../../SVG/SidebarIcon/ManagerIcon/MaterialSectionManagerIcon';
import StaffListManagerIcon from '../../SVG/SidebarIcon/ManagerIcon/StaffListManagerIcon';
import ProjectListSalesStaff from '../../SVG/SidebarIcon/SalesStaffIcon/ProjectListSalesStaff';
import BlogListSalesStaffIcon from '../../SVG/SidebarIcon/SalesStaffIcon/BlogListSalesStaffIcon';
import HouseDesignListDesignStaffIcon from '../../SVG/SidebarIcon/DesignStaffIcon/HouseDesignListDesignStaffIcon';
import SettingsIcon from '../../SVG/SidebarIcon/SettingsIcon';
import SignInIcon from '../../SVG/SidebarIcon/SignInIcon';
import SupplierManagerIcon from '../../SVG/SidebarIcon/ManagerIcon/SupplierManagerIcon';
import DashboardIcon from '../../SVG/SidebarIcon/DashboardIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack, faTimes } from '@fortawesome/free-solid-svg-icons';
import LaborManagerIcon from '../../SVG/SidebarIcon/ManagerIcon/LaborManagerIcon';
import ContructionWorkIcon from '../../SVG/SidebarIcon/ManagerIcon/ContructionWorkIcon';
import DesignPriceManagerIcon from '../../SVG/SidebarIcon/ManagerIcon/DesignPriceManagerIcon';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role;
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(true);

  useEffect(() => {
    if (isPinned) {
      setSidebarOpen(true);
    }
  }, [isPinned]);

  return (
    <aside
      ref={sidebar}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!isPinned) {
          setSidebarOpen(false);
        }
        setIsHovered(false);
      }}
      className={`absolute left-0 top-0 z-9999 flex h-screen transition-all duration-500 ease-in-out ${
        isHovered || sidebarOpen || isPinned ? 'w-72.5' : 'w-25'
      } flex-col overflow-y-hidden bg-linear-gradient duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen || isPinned ? 'translate-x-0' : '-translate-x-full'
      } shadow-xl`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 bg-gradient-to-tr from-[#2a8b8d] to-[#74b0b2] shadow-md">
        <NavLink to="/">
          <img
            src={Logo}
            alt="Logo"
            className="transition-transform duration-300 hover:scale-110"
          />
        </NavLink>

        <div className="flex items-center">
          {isPinned ? (
            <button
              onClick={() => {
                setIsPinned(false);
                setSidebarOpen(false);
              }}
              className="ml-2 text-white transition-colors duration-300 hover:text-[#314e34]"
              aria-label="Unpin Sidebar"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          ) : (
            <button
              onClick={() => setIsPinned(true)}
              className={`ml-2 text-white transition-colors duration-300 hover:text-[#314e34] ${
                !isHovered && !sidebarOpen ? 'hidden' : ''
              }`}
              aria-label="Pin Sidebar"
            >
              <FontAwesomeIcon icon={faThumbtack} />
            </button>
          )}

          <button
            ref={trigger}
            onClick={() => {
              if (isPinned) {
                setIsPinned(false);
                setSidebarOpen(false);
              } else {
                setSidebarOpen(!sidebarOpen);
              }
            }}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block lg:hidden transition-transform duration-300 hover:rotate-180"
          >
            <ArrowIcon />
          </button>
        </div>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <NavLink
                  to="/"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-white transition-colors duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                    pathname === '/' && 'bg-teal-300 dark:bg-meta-4'
                  }`}
                >
                  <DashboardIcon />
                  <span
                    className={`${!isHovered && !sidebarOpen ? 'hidden' : ''}`}
                  >
                    Bảng điều khiển
                  </span>
                </NavLink>
              </li>

              {userRole === 'Manager' && (
                <>
                  <h3
                    className={`mt-4 ml-4 text-sm font-semibold text-bodydark2 ${
                      !isHovered && !sidebarOpen ? 'hidden' : ''
                    }`}
                  >
                    Danh sách
                  </h3>

                  {/* <!-- Menu Item ProjectListManager --> */}
                  <li>
                    <NavLink
                      to="/project-list-manager"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('/project-list-manager') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <ProjectListIconManager />
                      <span
                        className={`${
                          !isHovered && !sidebarOpen ? 'hidden' : ''
                        }`}
                      >
                        Danh sách dự án
                      </span>
                    </NavLink>
                  </li>

                  {/* <!-- Menu Item HouseTemplatesManager --> */}
                  <li>
                    <NavLink
                      to="/house-templates"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('/house-templates') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <HouseTemplatesManagerIcon />
                      <span
                        className={`${
                          !isHovered && !sidebarOpen ? 'hidden' : ''
                        }`}
                      >
                        Danh sách mẫu nhà
                      </span>
                    </NavLink>
                  </li>

                  {/* <!-- Menu Item StaffList --> */}
                  <li>
                    <NavLink
                      to="/account-list-manager"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('account-list-manager') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <StaffListManagerIcon />
                      <span
                        className={`${
                          !isHovered && !sidebarOpen ? 'hidden' : ''
                        }`}
                      >
                        Danh sách tài khoản
                      </span>
                    </NavLink>
                  </li>

                  <h3
                    className={`mt-4 ml-4 text-sm font-semibold text-bodydark2 ${
                      !isHovered && !sidebarOpen ? 'hidden' : ''
                    }`}
                  >
                    Thi công
                  </h3>
                  {/* <!-- Menu Item PackageManager --> */}
                  <li>
                    <NavLink
                      to="/package-list-manager"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('/package-list-manager') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <PackageManagerIcon />
                      <span
                        className={`${
                          !isHovered && !sidebarOpen ? 'hidden' : ''
                        }`}
                      >
                        Quản lý gói xây dựng
                      </span>
                    </NavLink>
                  </li>

                  {/* <!-- Menu Item ConstructionManager --> */}
                  <li>
                    <NavLink
                      to="/construction-list-manager"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('/construction-list-manager') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <ConstructionManagerIcon />
                      <span
                        className={`${
                          !isHovered && !sidebarOpen ? 'hidden' : ''
                        }`}
                      >
                        Quản lý hạng mục
                      </span>
                    </NavLink>
                  </li>

                  {/* <!-- Menu Item ConstructionWorkManager --> */}
                  <li>
                    <NavLink
                      to="/construction-work-list-manager"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('/construction-work-list-manager') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <ContructionWorkIcon />
                      <span
                        className={`${
                          !isHovered && !sidebarOpen ? 'hidden' : ''
                        }`}
                      >
                        Công tác hạng mục
                      </span>
                    </NavLink>
                  </li>

                  {/* <!-- Menu Item UtilityManager --> */}
                  <li>
                    <NavLink
                      to="/utility-list-manager"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('/utility-list-manager') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <UtilityManagerIcon />
                      <span
                        className={`${
                          !isHovered && !sidebarOpen ? 'hidden' : ''
                        }`}
                      >
                        Dịch vụ và Tiện ích
                      </span>
                    </NavLink>
                  </li>

                  <h3
                    className={`mt-4 ml-4 text-sm font-semibold text-bodydark2 ${
                      !isHovered && !sidebarOpen ? 'hidden' : ''
                    }`}
                  >
                    Khác
                  </h3>

                  {/* <!-- Menu Item MaterialSectionManager --> */}
                  <li>
                    <NavLink
                      to="/material-section-list-manager"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('/material-section-list-manager') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <MaterialSectionManagerIcon />
                      <span
                        className={`${
                          !isHovered && !sidebarOpen ? 'hidden' : ''
                        }`}
                      >
                        Quản lý vật tư
                      </span>
                    </NavLink>
                  </li>

                  {/* <!-- Menu Item SupplierManager --> */}
                  <li>
                    <NavLink
                      to="/supplier-list-manager"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('/supplier-list-manager') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <SupplierManagerIcon />
                      <span
                        className={`${
                          !isHovered && !sidebarOpen ? 'hidden' : ''
                        }`}
                      >
                        Quản lý cung cấp
                      </span>
                    </NavLink>
                  </li>

                  {/* <!-- Menu Item LaborManager --> */}
                  <li>
                    <NavLink
                      to="/labor-list-manager"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('/labor-list-manager') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <LaborManagerIcon />
                      <span
                        className={`${
                          !isHovered && !sidebarOpen ? 'hidden' : ''
                        }`}
                      >
                        Quản lý nhân công
                      </span>
                    </NavLink>
                  </li>

                  {/* <!-- Menu Item PromotionManager --> */}
                  <li>
                    <NavLink
                      to="/promotion-list-manager"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('/promotion-list-manager') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <PromotionManagerIcon />
                      <span
                        className={`${
                          !isHovered && !sidebarOpen ? 'hidden' : ''
                        }`}
                      >
                        Quản lý khuyến mãi
                      </span>
                    </NavLink>
                  </li>
                  {/* <!-- Menu Item DesignPriceManager --> */}
                  <li>
                    <NavLink
                      to="/design-price-list-manager"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('/design-price-list-manager') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <DesignPriceManagerIcon />
                      <span
                        className={`${
                          !isHovered && !sidebarOpen ? 'hidden' : ''
                        }`}
                      >
                        Quản lý giá thiết kế
                      </span>
                    </NavLink>
                  </li>
                </>
              )}

              {userRole === 'SalesStaff' && (
                <>
                  {/* <!-- Menu Item ProjectListSalesStaff --> */}
                  <li>
                    <NavLink
                      to="/project-list-staff"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('project-list-staff') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <ProjectListSalesStaff />
                      <span
                        className={`${
                          !isHovered && !sidebarOpen ? 'hidden' : ''
                        }`}
                      >
                        Danh sách dự án
                      </span>
                    </NavLink>
                  </li>

                  {/* <!-- Menu Item BlogListSalesStaff --> */}
                  <li>
                    <NavLink
                      to="/blog-list-staff"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('blog-list-staff') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <BlogListSalesStaffIcon />
                      <span
                        className={`${
                          !isHovered && !sidebarOpen ? 'hidden' : ''
                        }`}
                      >
                        Danh sách bài đăng
                      </span>
                    </NavLink>
                  </li>
                </>
              )}

              {userRole === 'DesignStaff' && (
                <>
                  {/* <!-- Menu Item HouseDesignListDesignStaff --> */}
                  <li>
                    <NavLink
                      to="/house-design-list"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('housedesignlist') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <HouseDesignListDesignStaffIcon />
                      <span
                        className={`${
                          !isHovered && !sidebarOpen ? 'hidden' : ''
                        }`}
                      >
                        Danh sách công việc
                      </span>
                    </NavLink>
                  </li>
                </>
              )}

              {/* <!-- Sign in --> */}
              {!userRole && (
                <li>
                  <NavLink
                    to="/auth/signin"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                      pathname.includes('auth-signin') &&
                      'bg-teal-300 dark:bg-meta-4'
                    }`}
                  >
                    <SignInIcon />
                    <span
                      className={`${
                        !isHovered && !sidebarOpen ? 'hidden' : ''
                      }`}
                    >
                      Đăng nhập
                    </span>
                  </NavLink>
                </li>
              )}
              {/* <!-- Sign in --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
