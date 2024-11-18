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
      className={`absolute left-0 top-0 z-9999 flex h-screen ${
        isHovered || sidebarOpen || isPinned ? 'w-72.5' : 'w-25'
      } flex-col overflow-y-hidden bg-linear-gradient duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen || isPinned ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img src={Logo} alt="Logo" />
        </NavLink>

        <div className="flex items-center">
          {isPinned ? (
            <button
              onClick={() => {
                setIsPinned(false);
                setSidebarOpen(false);
              }}
              className="ml-2 text-white"
              aria-label="Unpin Sidebar"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          ) : (
            <button
              onClick={() => setIsPinned(true)}
              className={`ml-2 text-white ${
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
            className="block lg:hidden"
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
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
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
                        Quản lý Dịch vụ và tiện ích
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
                        Quản lý nhà cung cấp
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
                        Quản lý tài khoản
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

                  {/* <!-- Menu Item Settings --> */}
                  <li>
                    <NavLink
                      to="/settings"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('settings') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <SettingsIcon />
                      <span
                        className={`${
                          !isHovered && !sidebarOpen ? 'hidden' : ''
                        }`}
                      >
                        Settings
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
