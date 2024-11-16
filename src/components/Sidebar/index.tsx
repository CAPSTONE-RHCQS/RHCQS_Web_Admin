import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/logo.svg';
import DashboardSidebarItem from './DashboardSidebarItem';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role;

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-linear-gradient duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img src={Logo} alt="Logo" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {userRole === 'Manager' && (
                <>
                  <DashboardSidebarItem
                    sidebarExpanded={sidebarExpanded}
                    setSidebarExpanded={setSidebarExpanded}
                  />
                  {/* <!-- Menu Item ProjectManager --> */}
                  <li>
                    <NavLink
                      to="/project-list-manager"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('/project-list-manager') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 960 960"
                        width="24px"
                        fill="#5f6368"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <path d="M192 816v-337l-64 49-44-58 108-82v-124h72v69l216-165 396 302-44 58-64-49v337H192Zm72-72h180v-144.27h72V600h180V279.67L480 198 264 362v321Zm-72-528q0-48 30-78t78-30q17 0 26.5-9.5T336 72h72q0 48-30 78t-78 30q-17 0-26.5 9.5T264 216h-72Zm72 528h432-432Z" />
                      </svg>
                      Danh sách dự án
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
                      <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 64 68"
                        height="24px"
                        width="24px"
                        fill="#5f6368"
                      >
                        <g>
                          <rect x="54" y="17" width="2" height="14" />
                          <path d="M2.137,50.984a3.935,3.935,0,0,0,.176.565c.029.07.073.131.106.2a3.666,3.666,0,0,0,1.352,1.571,3.989,3.989,0,0,0,.454.247c.077.038.147.088.227.122A4.049,4.049,0,0,0,5,53.857c.07.018.134.048.205.062A3.993,3.993,0,0,0,6,54H33V52H6a2.012,2.012,0,0,1-.4-.04c-.048-.01-.093-.03-.14-.043a1.969,1.969,0,0,1-.233-.072,2.214,2.214,0,0,1-.2-.109c-.045-.026-.093-.046-.136-.074a2.091,2.091,0,0,1-.3-.249,2.024,2.024,0,0,1-.248-.3c-.038-.057-.066-.121-.1-.182s-.061-.1-.084-.157a1.84,1.84,0,0,1-.08-.258c-.011-.039-.028-.076-.036-.117A2,2,0,0,1,6,48H9a1,1,0,0,0,1-1V12H45V10H10V5A1,1,0,0,0,9,4H6A4,4,0,0,0,2,8V50a3.993,3.993,0,0,0,.081.8C2.094,50.862,2.121,50.921,2.137,50.984ZM4,14V8A2,2,0,0,1,6,6H8V46H6a3.97,3.97,0,0,0-2,.537Z" />
                          <path d="M36,20H25a1,1,0,0,0-.765.363c0,.006-.012.007-.016.012l-8,10a1.044,1.044,0,0,0-.13.22c0,.007-.008.012-.011.019a1,1,0,0,0-.07.345c0,.015-.008.027-.008.041V43a1,1,0,0,0,1,1H43V42H34V32H48v6h2V31c0-.014-.008-.026-.008-.041a.991.991,0,0,0-.07-.344c0-.009-.01-.015-.013-.023a.968.968,0,0,0-.128-.216l-3-3.754L45.219,27.87l1.7,2.13H33.481l-4.267-5.333L27.081,22H36ZM27,42H23V36h4Zm5,0H29V35a1,1,0,0,0-1-1H22a1,1,0,0,0-1,1v7H18V32H32ZM28.946,27.534,30.919,30H19.081L25,22.6Z" />
                          <path d="M39,34a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V35a1,1,0,0,0-1-1Zm3,4H40V36h2Z" />
                          <path d="M61.383,29.076a1,1,0,0,0-1.09.217l-31,31A1,1,0,0,0,30,62H61a1,1,0,0,0,1-1V30A1,1,0,0,0,61.383,29.076ZM60,60H32.414L60,32.414Z" />
                          <path d="M44.076,55.383A1,1,0,0,0,45,56H55a1,1,0,0,0,1-1V45a1,1,0,0,0-1.707-.707l-10,10A1,1,0,0,0,44.076,55.383ZM54,47.414V54H47.414Z" />
                          <path d="M57.707,2.293a1,1,0,0,0-1.414,0l-18,18a1.011,1.011,0,0,0-.241.391l-1,3a1,1,0,0,0,.241,1.023l.293.293-2.293,2.293,1.414,1.414L39,26.414l.293.293A1,1,0,0,0,40,27a1.014,1.014,0,0,0,.316-.051l3-1a1,1,0,0,0,.391-.242l18-18a1,1,0,0,0,0-1.414ZM40.271,24.856,39.145,23.73l.542-1.629L41.9,24.313Zm3.229-1.77L40.914,20.5,45,16.414,47.586,19Zm5.5-5.5L46.414,15,57,4.414,59.586,7Z" />
                          <path d="M12,44v3a1,1,0,0,0,1,1h3V46H14V44Z" />
                          <path d="M16,14H13a1,1,0,0,0-1,1v3h2V16h2Z" />
                        </g>
                      </svg>
                      Danh sách mẫu nhà
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
                      <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 0 24 24"
                        width="20px"
                        fill="#5f6368"
                      >
                        <path d="M12 2L2 7v13h20V7L12 2zm0 2.18l7 3.89V18h-4v-4H9v4H5V8.07l7-3.89zM12 12h2v2h-2v-2z" />
                      </svg>
                      Quản lý gói xây dựng
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
                      <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 0 24 24"
                        width="20px"
                        fill="#5f6368"
                      >
                        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 8h14v-2H7v2zm0-4h14v-2H7v2zm0-6v2h14V7H7z" />
                      </svg>
                      Quản lý hạng mục
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
                      <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 0 24 24"
                        width="20px"
                        fill="#5f6368"
                      >
                        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 8h14v-2H7v2zm0-4h14v-2H7v2zm0-6v2h14V7H7z" />
                      </svg>
                      Quản lý Dịch vụ và tiện ích
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
                      <svg
                        fill="#ffffff"
                        height="20px"
                        width="20px"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 511.999 511.999"
                      >
                        <path d="M361.079,110.717c3.076-4.802,1.674-11.19-3.128-14.264c-30.42-19.474-65.673-29.769-101.95-29.769 c-104.388,0-189.317,84.927-189.317,189.317s84.928,189.317,189.317,189.317s189.317-84.927,189.315-189.316 c0-42.677-13.861-82.965-40.087-116.509c-3.51-4.491-10-5.286-14.494-1.775c-4.494,3.512-5.288,10.001-1.775,14.495 c23.358,29.876,35.704,65.765,35.704,103.787c0,93.002-75.662,168.664-168.664,168.664S87.337,349.001,87.337,255.999 S162.999,87.336,256.001,87.336c32.323,0,63.725,9.167,90.814,26.51C351.613,116.92,358.003,115.52,361.079,110.717z"></path>
                        <path d="M500.389,255.999c0-11.871,2.872-25.02,5.649-37.735c4.878-22.338,9.922-45.437,1.246-66.359 c-9.045-21.812-29.357-34.694-49.002-47.151c-11.117-7.051-21.618-13.709-29.474-21.566 c-7.855-7.856-14.515-18.356-21.564-29.474c-12.458-19.643-25.34-39.956-47.15-49.001c-20.924-8.674-44.021-3.631-66.36,1.247 c-12.715,2.777-25.863,5.648-37.734,5.648c-11.871,0-25.019-2.871-37.734-5.648c-22.337-4.878-45.437-9.922-66.36-1.247 c-21.812,9.044-34.692,29.357-47.15,49.001c-7.049,11.117-13.709,21.618-21.564,29.474c-7.856,7.855-18.358,14.515-29.474,21.564 C34.073,117.21,13.76,130.093,4.715,151.905c-8.675,20.921-3.632,44.019,1.246,66.357c2.777,12.715,5.649,25.864,5.649,37.735 c0,11.871-2.872,25.02-5.649,37.735c-4.878,22.338-9.922,45.437-1.246,66.359c9.046,21.813,29.359,34.695,49.003,47.153 l3.971,2.524c4.808,3.066,11.192,1.656,14.259-3.152c3.069-4.808,1.658-11.192-3.15-14.26l-4.019-2.554 c-17.713-11.232-34.443-21.842-40.987-37.621c-6.192-14.936-2.043-33.931,2.348-54.041c3.01-13.786,6.123-28.042,6.123-42.143 c0-14.1-3.112-28.356-6.123-42.143c-4.391-20.11-8.539-39.105-2.348-54.04c6.544-15.78,23.274-26.39,40.986-37.622 c11.577-7.34,23.545-14.932,33.017-24.402c9.47-9.47,17.062-21.44,24.403-33.017c11.231-17.712,21.841-34.44,37.62-40.983 c14.935-6.194,33.931-2.046,54.043,2.346c13.785,3.01,28.041,6.123,42.14,6.123c14.099,0,28.353-3.112,42.14-6.123 c20.112-4.392,39.109-8.541,54.043-2.346c15.779,6.543,26.387,23.271,37.62,40.983c7.341,11.577,14.933,23.547,24.403,33.017 c9.47,9.47,21.442,17.062,33.017,24.403c17.713,11.232,34.442,21.842,40.986,37.621c6.192,14.936,2.043,33.931-2.347,54.041 c-3.01,13.786-6.123,28.042-6.123,42.143s3.112,28.356,6.123,42.143c4.391,20.11,8.539,39.105,2.347,54.04 c-6.544,15.78-23.274,26.39-40.986,37.622c-11.577,7.34-23.545,14.932-33.017,24.402c-9.47,9.47-17.062,21.44-24.403,33.017 c-11.231,17.712-21.841,34.44-37.62,40.983c-14.935,6.193-33.931,2.046-54.043-2.346c-13.785-3.01-28.041-6.123-42.14-6.123 c-14.099,0-28.353,3.112-42.14,6.123c-20.112,4.392-39.105,8.541-54.043,2.348c-15.779-6.543-26.387-23.273-37.62-40.983 c-2.942-4.639-5.984-9.434-9.124-14.031c-3.219-4.709-9.646-5.916-14.352-2.699c-4.709,3.218-5.918,9.643-2.7,14.352 c2.942,4.304,5.757,8.74,8.735,13.438c12.458,19.643,25.339,39.956,47.15,49.001c8.271,3.428,16.877,4.714,25.645,4.714 c13.416,0,27.206-3.011,40.715-5.963c12.715-2.777,25.863-5.648,37.734-5.648c11.871,0,25.019,2.871,37.734,5.648 c22.338,4.878,45.436,9.922,66.36,1.247c21.812-9.045,34.692-29.357,47.15-49.001c7.049-11.117,13.709-21.618,21.564-29.474 c7.856-7.855,18.357-14.515,29.474-21.564c19.645-12.458,39.957-25.341,49.002-47.153c8.675-20.921,3.632-44.019-1.246-66.357 C503.261,281.019,500.389,267.87,500.389,255.999z"></path>
                        <path d="M166.087,345.913c2.017,2.017,4.661,3.025,7.303,3.025c2.642,0,5.286-1.009,7.301-3.025l165.222-165.222 c4.033-4.031,4.033-10.57,0-14.603s-10.57-4.033-14.604,0L166.087,331.31C162.055,335.341,162.055,341.88,166.087,345.913z"></path>
                        <path d="M200.927,238.79c20.877,0,37.863-16.985,37.863-37.863c0-20.878-16.986-37.863-37.863-37.863 s-37.863,16.985-37.863,37.863C163.064,221.805,180.05,238.79,200.927,238.79z M200.927,183.716 c9.489,0,17.211,7.72,17.211,17.211c0,9.491-7.72,17.211-17.211,17.211c-9.491,0-17.211-7.72-17.211-17.211 C183.717,191.436,191.437,183.716,200.927,183.716z"></path>
                        <path d="M311.075,348.938c20.877,0,37.863-16.985,37.863-37.863c0-20.879-16.986-37.863-37.863-37.863 s-37.863,16.985-37.863,37.863C273.212,331.953,290.198,348.938,311.075,348.938z M311.075,293.864 c9.489,0,17.211,7.72,17.211,17.211c0,9.491-7.72,17.211-17.211,17.211c-9.491,0-17.211-7.72-17.211-17.211 C293.864,301.584,301.584,293.864,311.075,293.864z"></path>
                      </svg>
                      Quản lý khuyến mãi
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
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M19.9484 16.3206C19.8842 15.9668 19.9275 15.6018 20.0727 15.2727C20.211 14.9501 20.4406 14.6749 20.7333 14.4811C21.026 14.2872 21.369 14.1832 21.72 14.1818H21.8182C22.3968 14.1818 22.9518 13.9519 23.361 13.5428C23.7701 13.1336 24 12.5787 24 12C24 11.4213 23.7701 10.8664 23.361 10.4572C22.9518 10.0481 22.3968 9.81818 21.8182 9.81818H21.6327C21.2817 9.81678 20.9387 9.71277 20.646 9.51894C20.3534 9.32511 20.1237 9.04993 19.9855 8.72727V8.64C19.8402 8.31096 19.7969 7.94597 19.8611 7.59208C19.9253 7.2382 20.094 6.91165 20.3455 6.65454L20.4109 6.58909C20.6138 6.38646 20.7747 6.14583 20.8845 5.88096C20.9943 5.61609 21.0508 5.33218 21.0508 5.04545C21.0508 4.75873 20.9943 4.47482 20.8845 4.20995C20.7747 3.94508 20.6138 3.70445 20.4109 3.50182C20.2083 3.29896 19.9676 3.13803 19.7028 3.02823C19.4379 2.91844 19.154 2.86192 18.8673 2.86192C18.5805 2.86192 18.2966 2.91844 18.0318 3.02823C17.7669 3.13803 17.5263 3.29896 17.3236 3.50182L17.2582 3.56727C17.0011 3.81877 16.6745 3.98748 16.3206 4.05164C15.9668 4.11581 15.6018 4.07249 15.2727 3.92727C14.9501 3.78899 14.6749 3.55937 14.4811 3.26669C14.2872 2.97401 14.1832 2.63104 14.1818 2.28V2.18182C14.1818 1.60316 13.9519 1.04821 13.5428 0.63904C13.1336 0.22987 12.5787 0 12 0C11.4213 0 10.8664 0.22987 10.4572 0.63904C10.0481 1.04821 9.81818 1.60316 9.81818 2.18182V2.36727C9.81678 2.71831 9.71277 3.06128 9.51894 3.35396C9.32511 3.64664 9.04993 3.87626 8.72727 4.01455H8.64C8.31096 4.15976 7.94597 4.20308 7.59208 4.13891C7.2382 4.07475 6.91165 3.90604 6.65454 3.65455L6.58909 3.58909C6.38646 3.38623 6.14583 3.2253 5.88096 3.11551C5.61609 3.00571 5.33218 2.94919 5.04545 2.94919C4.75873 2.94919 4.47482 3.00571 4.20995 3.11551C3.94508 3.2253 3.70445 3.38623 3.50182 3.58909C3.29896 3.79172 3.13803 4.03235 3.02823 4.29722C2.91844 4.56209 2.86192 4.846 2.86192 5.13273C2.86192 5.41945 2.91844 5.70337 3.02823 5.96823C3.13803 6.2331 3.29896 6.47373 3.50182 6.67636L3.56727 6.74182C3.81877 6.99892 3.98748 7.32547 4.05164 7.67936C4.11581 8.03324 4.07249 8.39824 3.92727 8.72727C3.8026 9.06626 3.57883 9.35989 3.28505 9.57001C2.99128 9.78013 2.64108 9.89701 2.28 9.90545H2.18182C1.60316 9.90545 1.04821 10.1353 0.63904 10.5445C0.22987 10.9537 0 11.5086 0 12.0873C0 12.6659 0.22987 13.2209 0.63904 13.63C1.04821 14.0392 1.60316 14.2691 2.18182 14.2691H2.36727C2.71831 14.2705 3.06128 14.3745 3.35396 14.5683C3.64664 14.7622 3.87626 15.0373 4.01455 15.36C4.15976 15.689 4.20308 16.054 4.13891 16.4079C4.07475 16.7618 3.90604 17.0883 3.65455 17.3455L3.58909 17.4109C3.38623 17.6135 3.2253 17.8542 3.11551 18.119C3.00571 18.3839 2.94919 18.6678 2.94919 18.9545C2.94919 19.2413 3.00571 19.5252 3.11551 19.7901C3.2253 20.0549 3.38623 20.2956 3.58909 20.4982C3.79172 20.701 4.03235 20.862 4.29722 20.9718C4.56209 21.0816 4.846 21.1381 5.13273 21.1381C5.41945 21.1381 5.70337 21.0816 5.96823 20.9718C6.2331 20.862 6.47373 20.701 6.67636 20.4982L6.74182 20.4327C6.99892 20.1812 7.32547 20.0125 7.67936 19.9484C8.03324 19.8842 8.39824 19.9275 8.72727 20.0727C9.06626 20.1974 9.35989 20.4212 9.57001 20.7149C9.78013 21.0087 9.89701 21.3589 9.90545 21.72V21.8182C9.90545 22.3968 10.1353 22.9518 10.5445 23.361C10.9537 23.7701 11.5086 24 12.0873 24C12.6659 24 13.2209 23.7701 13.63 23.361C14.0392 22.9518 14.2691 22.3968 14.2691 21.8182V21.6327C14.2705 21.2817 14.3745 20.9387 14.5683 20.646C14.7622 20.3534 15.0373 20.1237 15.36 19.9855C15.689 19.8402 16.054 19.7969 16.4079 19.8611C16.7618 19.9253 17.0883 20.094 17.3455 20.3455L17.4109 20.4109C17.6135 20.6138 17.8542 20.7747 18.119 20.8845C18.3839 20.9943 18.6678 21.0508 18.9545 21.0508C19.2413 21.0508 19.5252 20.9943 19.7901 20.8845C20.0549 20.7747 20.2956 20.6138 20.4982 20.4109C20.701 20.2083 20.862 19.9676 20.9718 19.7028C21.0816 19.4379 21.1381 19.154 21.1381 18.8673C21.1381 18.5805 21.0816 18.2966 20.9718 18.0318C20.862 17.7669 20.701 17.5263 20.4982 17.3236L20.4327 17.2582C20.1812 17.0011 20.0125 16.6745 19.9484 16.3206ZM12.261 17.2174C14.9984 17.2174 17.2175 14.9983 17.2175 12.2609C17.2175 9.52346 14.9984 7.30435 12.261 7.30435C9.52355 7.30435 7.30444 9.52346 7.30444 12.2609C7.30444 14.9983 9.52355 17.2174 12.261 17.2174Z"
                          fill="white"
                        />
                      </svg>
                      Quản lý vật tư
                    </NavLink>
                  </li>
                  {/* <!-- Menu Item DetailedQuoteManager --> */}
                  {/* <li>
                  <NavLink
                    to="/detailed-quote-manager"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                      pathname.includes('detailed-quote-manager') &&
                      'bg-teal-300 dark:bg-meta-4'
                    }`}
                  >
                    <svg
                      className="fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      fill="#5f6368"
                    >
                      <path d="M444-192h72v-48h12q20.4 0 34.2-13.8Q576-267.6 576-288v-72q0-20.4-13.8-34.2Q548.4-408 528-408h-96v-72h144v-48h-60v-48h-72v48h-12q-20.4 0-34.2 13.8Q384-500.4 384-480v72q0 20.4 13.8 34.2Q411.6-360 432-360h96v72H384v48h60v48ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v189-189 624-624Z" />
                    </svg>
                    Báo giá chi tiết
                  </NavLink>
                </li> */}
                  {/* <!-- Menu Item StaffList --> */}
                  <li>
                    <NavLink
                      to="/account-list-manager"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('account-list-manager') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#5f6368"
                      >
                        <path d="M0-240v-59q0-51 45-80t123-29q15 0 30 1.5t30 4.5q-17 20-26.5 45t-9.5 50.56V-240H0Zm240 0v-61q0-27.86 14.5-50.93T293-387q44-22 91-33.5t95.53-11.5Q529-432 576-420.5t91 33.5q24 12 38.5 35.07T720-301v61H240Zm528 0v-67.37q0-26.95-9.5-50.79T732-402q17-3 31.5-4.5T792-408q78 0 123 29t45 80v59H768Zm-454-72h332q-7-17-59.5-32.5T480-360q-54 0-106.5 15.5T314-312ZM167.79-456Q138-456 117-477.03q-21-21.02-21-50.55Q96-558 117.03-579q21.02-21 50.55-21Q198-600 219-579.24t21 51.45Q240-498 219.24-477t-51.45 21Zm624 0Q762-456 741-477.03q-21-21.02-21-50.55Q720-558 741.03-579q21.02-21 50.55-21Q822-600 843-579.24t21 51.45Q864-498 843.24-477t-51.45 21ZM479.5-480q-49.5 0-84.5-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85.5q0 49.5-35 84.5t-85.5 35Zm.5-72q20.4 0 34.2-13.8Q528-579.6 528-600q0-20.4-13.8-34.2Q500.4-648 480-648q-20.4 0-34.2 13.8Q432-620.4 432-600q0 20.4 13.8 34.2Q459.6-552 480-552Zm0 240Zm0-288Z" />
                      </svg>
                      Quản lý tài khoản
                    </NavLink>
                  </li>
                  {/* <!-- Menu Item BlogList --> */}
                  <li>
                    <NavLink
                      to="/blog-list-manager"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('blog-list-manager') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 0 24 24"
                        width="20px"
                        fill="#5f6368"
                      >
                        <path d="M4 4h16v2H4V4zm0 4h10v2H4V8zm0 4h16v2H4v-2zm0 4h10v2H4v-2zm0 4h16v2H4v-2z" />
                      </svg>
                      Danh sách bài đăng
                    </NavLink>
                  </li>
                </>
              )}

              {userRole === 'SalesStaff' && (
                <>
                  <DashboardSidebarItem
                    sidebarExpanded={sidebarExpanded}
                    setSidebarExpanded={setSidebarExpanded}
                  />
                  {/* <!-- Menu Item QuoteStaffList --> */}
                  <li>
                    <NavLink
                      to="/project-list-staff"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('project-list-staff') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#5f6368"
                      >
                        <path d="M192-144v-337l-64 49-44-58 108-82v-124h72v69l216-165 396 302-44 58-64-49v337H192Zm72-72h180v-144.27h72V-216h180v-320.33L480-701 264-537v321Zm-72-528q0-48 30-78t78-30q17 0 26.5-9.5T336-888h72q0 48-30 78t-78 30q-17 0-26.5 9.5T264-744h-72Zm72 528h432-432Z" />
                      </svg>
                      Danh sách dự án
                    </NavLink>
                  </li>

                  {/* <!-- Menu Item CreateQuote --> */}
                  {/* <li>
                <NavLink
                  to="/Create-Quote"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                    pathname.includes('createquote') &&
                    'bg-teal-300 dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#5f6368"
                  >
                    <path d="M444-192h72v-48h12q20.4 0 34.2-13.8Q576-267.6 576-288v-72q0-20.4-13.8-34.2Q548.4-408 528-408h-96v-72h144v-48h-60v-48h-72v48h-12q-20.4 0-34.2 13.8Q384-500.4 384-480v72q0 20.4 13.8 34.2Q411.6-360 432-360h96v72H384v48h60v48ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v189-189 624-624Z" />
                  </svg>
                  Tạo báo giá sơ bộ
                </NavLink>
              </li> */}

                  {/* <!-- Menu Item QuoteStaffList --> */}
                  {/* <li>
                <NavLink
                  to="/quotestafflist"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                    pathname.includes('quotestafflist') &&
                    'bg-teal-300 dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#5f6368"
                  >
                    <path d="M444-192h72v-48h12q20.4 0 34.2-13.8Q576-267.6 576-288v-72q0-20.4-13.8-34.2Q548.4-408 528-408h-96v-72h144v-48h-60v-48h-72v48h-12q-20.4 0-34.2 13.8Q384-500.4 384-480v72q0 20.4 13.8 34.2Q411.6-360 432-360h96v72H384v48h60v48ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v189-189 624-624Z" />
                  </svg>
                  Báo giá chi tiết
                </NavLink>
              </li> */}

                  {/* <!-- Menu Item detailed-quotation --> */}
                  <li>
                    <NavLink
                      to="/detailed-quotation"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('detailed-quotation') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#5f6368"
                      >
                        <path d="M444-192h72v-48h12q20.4 0 34.2-13.8Q576-267.6 576-288v-72q0-20.4-13.8-34.2Q548.4-408 528-408h-96v-72h144v-48h-60v-48h-72v48h-12q-20.4 0-34.2 13.8Q384-500.4 384-480v72q0 20.4 13.8 34.2Q411.6-360 432-360h96v72H384v48h60v48ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v189-189 624-624Z" />
                      </svg>
                      Tạo báo giá chi tiết
                    </NavLink>
                  </li>

                  {/* <!-- Menu Item CreateQuote --> */}
                  <li>
                    <NavLink
                      to="/create-Contract-Design"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('createquote') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#5f6368"
                      >
                        <path d="M240-96q-40 0-68-28t-28-68v-144h96v-528h576v660q0 45-31.5 76.5T708-96H240Zm467.79-72q15.21 0 25.71-10.35T744-204v-588H312v456h360v132q0 15.3 10.29 25.65Q692.58-168 707.79-168ZM360-600v-72h336v72H360Zm0 120v-72h336v72H360ZM240-168h360v-96H216v72q0 10.2 6.9 17.1 6.9 6.9 17.1 6.9Zm0 0h-24 384-360Z" />
                      </svg>
                      Tạo hợp đồng thiết kế
                    </NavLink>
                  </li>

                  {/* <!-- Menu Item CreateBlog --> */}
                  <li>
                    <NavLink
                      to="/createpost"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('createpost') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#5f6368"
                      >
                        <path d="M215.79-144Q186-144 165-165.21t-21-51Q144-246 165.21-267t51-21Q246-288 267-266.79t21 51Q288-186 266.79-165t-51 21ZM720-144q0-120-45.26-224.48-45.25-104.48-123.43-182.71-78.17-78.23-182.57-123.52Q264.34-720 144-720v-96q140 0 261.63 52.38 121.63 52.37 213.59 144.28 91.96 91.9 144.37 213.46Q816-284.33 816-144h-96Zm-240 0q0-70-26-131t-72-107q-46-46-107-72t-131-26v-96q90.52 0 168.74 33.7Q390.96-508.6 450-450q58.6 59.04 92.3 137.26Q576-234.52 576-144h-96Z" />
                      </svg>
                      Tạo bài đăng
                    </NavLink>
                  </li>
                </>
              )}

              {userRole === 'DesignStaff' && (
                <>
                  <DashboardSidebarItem
                    sidebarExpanded={sidebarExpanded}
                    setSidebarExpanded={setSidebarExpanded}
                  />
                  {/* <!-- Menu Item QuoteStaffList --> */}
                  <li>
                    <NavLink
                      to="/house-design-list"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('housedesignlist') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#5f6368"
                      >
                        <path d="m359-511 90-90-54-55-46 45-50-50 45-46-56-55-90 90 161 161Zm313 313 90-90-54-55-46 45-50-50 45-46-56-55-90 90 161 161Zm21-546 51 51-51-51ZM297-144H144v-153l164-163L96-672l192-192 212 212 142-143q11-11 24-16t27-5q14 0 27 5t24 16l51 51q11 11 16 24t5 27q0 14-5 27t-16 24L652-500l212 212L672-96 460-308 297-144Zm-81-72h51l375-375-51-51-375 375v51Zm401-401-26-25 51 51-25-26Z" />
                      </svg>
                      Danh sách công việc
                    </NavLink>
                  </li>

                  {/* <!-- Menu Item CreateDesignHouse -->
              <li>
                <NavLink
                  to="/createdesignhouse"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                    pathname.includes('createdesignhouse') &&
                    'bg-teal-300 dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#5f6368"
                  >
                    <path d="m359-511 90-90-54-55-46 45-50-50 45-46-56-55-90 90 161 161Zm313 313 90-90-54-55-46 45-50-50 45-46-56-55-90 90 161 161Zm21-546 51 51-51-51ZM297-144H144v-153l164-163L96-672l192-192 212 212 142-143q11-11 24-16t27-5q14 0 27 5t24 16l51 51q11 11 16 24t5 27q0 14-5 27t-16 24L652-500l212 212L672-96 460-308 297-144Zm-81-72h51l375-375-51-51-375 375v51Zm401-401-26-25 51 51-25-26Z" />
                  </svg>
                  Tạo thiết kế nhà
                </NavLink>
              </li> */}

                  {/* <!-- Menu Item Settings --> */}
                  <li>
                    <NavLink
                      to="/settings"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                        pathname.includes('settings') &&
                        'bg-teal-300 dark:bg-meta-4'
                      }`}
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="19"
                        viewBox="0 0 18 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_130_9763)">
                          <path
                            d="M17.0721 7.30835C16.7909 6.99897 16.3971 6.83022 15.9752 6.83022H15.8909C15.7502 6.83022 15.6377 6.74585 15.6096 6.63335C15.5815 6.52085 15.5252 6.43647 15.4971 6.32397C15.4409 6.21147 15.4971 6.09897 15.5815 6.0146L15.6377 5.95835C15.9471 5.6771 16.1159 5.28335 16.1159 4.86147C16.1159 4.4396 15.9752 4.04585 15.6659 3.73647L14.569 2.61147C13.9784 1.99272 12.9659 1.9646 12.3471 2.58335L12.2627 2.6396C12.1784 2.72397 12.0377 2.7521 11.8971 2.69585C11.7846 2.6396 11.6721 2.58335 11.5315 2.55522C11.3909 2.49897 11.3065 2.38647 11.3065 2.27397V2.13335C11.3065 1.26147 10.6034 0.55835 9.73148 0.55835H8.15648C7.7346 0.55835 7.34085 0.7271 7.0596 1.00835C6.75023 1.31772 6.6096 1.71147 6.6096 2.10522V2.21772C6.6096 2.33022 6.52523 2.44272 6.41273 2.49897C6.35648 2.5271 6.32835 2.5271 6.2721 2.55522C6.1596 2.61147 6.01898 2.58335 5.9346 2.49897L5.87835 2.4146C5.5971 2.10522 5.20335 1.93647 4.78148 1.93647C4.3596 1.93647 3.96585 2.0771 3.65648 2.38647L2.53148 3.48335C1.91273 4.07397 1.8846 5.08647 2.50335 5.70522L2.5596 5.7896C2.64398 5.87397 2.6721 6.0146 2.61585 6.09897C2.5596 6.21147 2.53148 6.29585 2.47523 6.40835C2.41898 6.52085 2.3346 6.5771 2.19398 6.5771H2.1096C1.68773 6.5771 1.29398 6.71772 0.984604 7.0271C0.675229 7.30835 0.506479 7.7021 0.506479 8.12397L0.478354 9.69897C0.450229 10.5708 1.15335 11.274 2.02523 11.3021H2.1096C2.25023 11.3021 2.36273 11.3865 2.39085 11.499C2.4471 11.5833 2.50335 11.6677 2.53148 11.7802C2.5596 11.8927 2.53148 12.0052 2.4471 12.0896L2.39085 12.1458C2.08148 12.4271 1.91273 12.8208 1.91273 13.2427C1.91273 13.6646 2.05335 14.0583 2.36273 14.3677L3.4596 15.4927C4.05023 16.1115 5.06273 16.1396 5.68148 15.5208L5.76585 15.4646C5.85023 15.3802 5.99085 15.3521 6.13148 15.4083C6.24398 15.4646 6.35648 15.5208 6.4971 15.549C6.63773 15.6052 6.7221 15.7177 6.7221 15.8302V15.9427C6.7221 16.8146 7.42523 17.5177 8.2971 17.5177H9.8721C10.744 17.5177 11.4471 16.8146 11.4471 15.9427V15.8302C11.4471 15.7177 11.5315 15.6052 11.644 15.549C11.7002 15.5208 11.7284 15.5208 11.7846 15.4927C11.9252 15.4365 12.0377 15.4646 12.1221 15.549L12.1784 15.6333C12.4596 15.9427 12.8534 16.1115 13.2752 16.1115C13.6971 16.1115 14.0909 15.9708 14.4002 15.6615L15.5252 14.5646C16.144 13.974 16.1721 12.9615 15.5534 12.3427L15.4971 12.2583C15.4127 12.174 15.3846 12.0333 15.4409 11.949C15.4971 11.8365 15.5252 11.7521 15.5815 11.6396C15.6377 11.5271 15.7502 11.4708 15.8627 11.4708H15.9471H15.9752C16.819 11.4708 17.5221 10.7958 17.5502 9.92397L17.5784 8.34897C17.5221 8.01147 17.3534 7.5896 17.0721 7.30835ZM16.2284 9.9521C16.2284 10.1208 16.0877 10.2615 15.919 10.2615H15.8346H15.8065C15.1596 10.2615 14.569 10.6552 14.344 11.2177C14.3159 11.3021 14.2596 11.3865 14.2315 11.4708C13.9784 12.0333 14.0909 12.7365 14.5409 13.1865L14.5971 13.2708C14.7096 13.3833 14.7096 13.5802 14.5971 13.6927L13.4721 14.7896C13.3877 14.874 13.3034 14.874 13.2471 14.874C13.1909 14.874 13.1065 14.874 13.0221 14.7896L12.9659 14.7052C12.5159 14.2271 11.8409 14.0865 11.2221 14.3677L11.1096 14.424C10.4909 14.6771 10.0971 15.2396 10.0971 15.8865V15.999C10.0971 16.1677 9.95648 16.3083 9.78773 16.3083H8.21273C8.04398 16.3083 7.90335 16.1677 7.90335 15.999V15.8865C7.90335 15.2396 7.5096 14.649 6.89085 14.424C6.80648 14.3958 6.69398 14.3396 6.6096 14.3115C6.3846 14.199 6.1596 14.1708 5.9346 14.1708C5.54085 14.1708 5.1471 14.3115 4.83773 14.6208L4.78148 14.649C4.66898 14.7615 4.4721 14.7615 4.3596 14.649L3.26273 13.524C3.17835 13.4396 3.17835 13.3552 3.17835 13.299C3.17835 13.2427 3.17835 13.1583 3.26273 13.074L3.31898 13.0177C3.7971 12.5677 3.93773 11.8646 3.6846 11.3021C3.65648 11.2177 3.62835 11.1333 3.5721 11.049C3.3471 10.4583 2.7846 10.0365 2.13773 10.0365H2.05335C1.8846 10.0365 1.74398 9.89585 1.74398 9.7271L1.7721 8.1521C1.7721 8.0396 1.82835 7.98335 1.85648 7.9271C1.8846 7.89897 1.96898 7.84272 2.08148 7.84272H2.16585C2.81273 7.87085 3.40335 7.4771 3.65648 6.88647C3.6846 6.8021 3.74085 6.71772 3.76898 6.63335C4.0221 6.07085 3.9096 5.36772 3.4596 4.91772L3.40335 4.83335C3.29085 4.72085 3.29085 4.52397 3.40335 4.41147L4.52835 3.3146C4.61273 3.23022 4.6971 3.23022 4.75335 3.23022C4.8096 3.23022 4.89398 3.23022 4.97835 3.3146L5.0346 3.39897C5.4846 3.8771 6.1596 4.01772 6.77835 3.7646L6.89085 3.70835C7.5096 3.45522 7.90335 2.89272 7.90335 2.24585V2.13335C7.90335 2.02085 7.9596 1.9646 7.98773 1.90835C8.01585 1.8521 8.10023 1.82397 8.21273 1.82397H9.78773C9.95648 1.82397 10.0971 1.9646 10.0971 2.13335V2.24585C10.0971 2.89272 10.4909 3.48335 11.1096 3.70835C11.194 3.73647 11.3065 3.79272 11.3909 3.82085C11.9815 4.1021 12.6846 3.9896 13.1627 3.5396L13.2471 3.48335C13.3596 3.37085 13.5565 3.37085 13.669 3.48335L14.7659 4.60835C14.8502 4.69272 14.8502 4.7771 14.8502 4.83335C14.8502 4.8896 14.8221 4.97397 14.7659 5.05835L14.7096 5.1146C14.2034 5.53647 14.0627 6.2396 14.2877 6.8021C14.3159 6.88647 14.344 6.97085 14.4002 7.05522C14.6252 7.64585 15.1877 8.06772 15.8346 8.06772H15.919C16.0315 8.06772 16.0877 8.12397 16.144 8.1521C16.2002 8.18022 16.2284 8.2646 16.2284 8.3771V9.9521Z"
                            fill=""
                          />
                          <path
                            d="M9.00029 5.22705C6.89092 5.22705 5.17529 6.94268 5.17529 9.05205C5.17529 11.1614 6.89092 12.8771 9.00029 12.8771C11.1097 12.8771 12.8253 11.1614 12.8253 9.05205C12.8253 6.94268 11.1097 5.22705 9.00029 5.22705ZM9.00029 11.6114C7.59404 11.6114 6.44092 10.4583 6.44092 9.05205C6.44092 7.6458 7.59404 6.49268 9.00029 6.49268C10.4065 6.49268 11.5597 7.6458 11.5597 9.05205C11.5597 10.4583 10.4065 11.6114 9.00029 11.6114Z"
                            fill=""
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_130_9763">
                            <rect
                              width="18"
                              height="18"
                              fill="white"
                              transform="translate(0 0.052124)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      Settings
                    </NavLink>
                  </li>
                  {/* <!-- Menu Item Settings --> */}
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
                    <svg
                      className="fill-current"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_130_9763)">
                        <path
                          d="M17.0721 7.30835C16.7909 6.99897 16.3971 6.83022 15.9752 6.83022H15.8909C15.7502 6.83022 15.6377 6.74585 15.6096 6.63335C15.5815 6.52085 15.5252 6.43647 15.4971 6.32397C15.4409 6.21147 15.4971 6.09897 15.5815 6.0146L15.6377 5.95835C15.9471 5.6771 16.1159 5.28335 16.1159 4.86147C16.1159 4.4396 15.9752 4.04585 15.6659 3.73647L14.569 2.61147C13.9784 1.99272 12.9659 1.9646 12.3471 2.58335L12.2627 2.6396C12.1784 2.72397 12.0377 2.7521 11.8971 2.69585C11.7846 2.6396 11.6721 2.58335 11.5315 2.55522C11.3909 2.49897 11.3065 2.38647 11.3065 2.27397V2.13335C11.3065 1.26147 10.6034 0.55835 9.73148 0.55835H8.15648C7.7346 0.55835 7.34085 0.7271 7.0596 1.00835C6.75023 1.31772 6.6096 1.71147 6.6096 2.10522V2.21772C6.6096 2.33022 6.52523 2.44272 6.41273 2.49897C6.35648 2.5271 6.32835 2.5271 6.2721 2.55522C6.1596 2.61147 6.01898 2.58335 5.9346 2.49897L5.87835 2.4146C5.5971 2.10522 5.20335 1.93647 4.78148 1.93647C4.3596 1.93647 3.96585 2.0771 3.65648 2.38647L2.53148 3.48335C1.91273 4.07397 1.8846 5.08647 2.50335 5.70522L2.5596 5.7896C2.64398 5.87397 2.6721 6.0146 2.61585 6.09897C2.5596 6.21147 2.53148 6.29585 2.47523 6.40835C2.41898 6.52085 2.3346 6.5771 2.19398 6.5771H2.1096C1.68773 6.5771 1.29398 6.71772 0.984604 7.0271C0.675229 7.30835 0.506479 7.7021 0.506479 8.12397L0.478354 9.69897C0.450229 10.5708 1.15335 11.274 2.02523 11.3021H2.1096C2.25023 11.3021 2.36273 11.3865 2.39085 11.499C2.4471 11.5833 2.50335 11.6677 2.53148 11.7802C2.5596 11.8927 2.53148 12.0052 2.4471 12.0896L2.39085 12.1458C2.08148 12.4271 1.91273 12.8208 1.91273 13.2427C1.91273 13.6646 2.05335 14.0583 2.36273 14.3677L3.4596 15.4927C4.05023 16.1115 5.06273 16.1396 5.68148 15.5208L5.76585 15.4646C5.85023 15.3802 5.99085 15.3521 6.13148 15.4083C6.24398 15.4646 6.35648 15.5208 6.4971 15.549C6.63773 15.6052 6.7221 15.7177 6.7221 15.8302V15.9427C6.7221 16.8146 7.42523 17.5177 8.2971 17.5177H9.8721C10.744 17.5177 11.4471 16.8146 11.4471 15.9427V15.8302C11.4471 15.7177 11.5315 15.6052 11.644 15.549C11.7002 15.5208 11.7284 15.5208 11.7846 15.4927C11.9252 15.4365 12.0377 15.4646 12.1221 15.549L12.1784 15.6333C12.4596 15.9427 12.8534 16.1115 13.2752 16.1115C13.6971 16.1115 14.0909 15.9708 14.4002 15.6615L15.5252 14.5646C16.144 13.974 16.1721 12.9615 15.5534 12.3427L15.4971 12.2583C15.4127 12.174 15.3846 12.0333 15.4409 11.949C15.4971 11.8365 15.5252 11.7521 15.5815 11.6396C15.6377 11.5271 15.7502 11.4708 15.8627 11.4708H15.9471H15.9752C16.819 11.4708 17.5221 10.7958 17.5502 9.92397L17.5784 8.34897C17.5221 8.01147 17.3534 7.5896 17.0721 7.30835ZM16.2284 9.9521C16.2284 10.1208 16.0877 10.2615 15.919 10.2615H15.8346H15.8065C15.1596 10.2615 14.569 10.6552 14.344 11.2177C14.3159 11.3021 14.2596 11.3865 14.2315 11.4708C13.9784 12.0333 14.0909 12.7365 14.5409 13.1865L14.5971 13.2708C14.7096 13.3833 14.7096 13.5802 14.5971 13.6927L13.4721 14.7896C13.3877 14.874 13.3034 14.874 13.2471 14.874C13.1909 14.874 13.1065 14.874 13.0221 14.7896L12.9659 14.7052C12.5159 14.2271 11.8409 14.0865 11.2221 14.3677L11.1096 14.424C10.4909 14.6771 10.0971 15.2396 10.0971 15.8865V15.999C10.0971 16.1677 9.95648 16.3083 9.78773 16.3083H8.21273C8.04398 16.3083 7.90335 16.1677 7.90335 15.999V15.8865C7.90335 15.2396 7.5096 14.649 6.89085 14.424C6.80648 14.3958 6.69398 14.3396 6.6096 14.3115C6.3846 14.199 6.1596 14.1708 5.9346 14.1708C5.54085 14.1708 5.1471 14.3115 4.83773 14.6208L4.78148 14.649C4.66898 14.7615 4.4721 14.7615 4.3596 14.649L3.26273 13.524C3.17835 13.4396 3.17835 13.3552 3.17835 13.299C3.17835 13.2427 3.17835 13.1583 3.26273 13.074L3.31898 13.0177C3.7971 12.5677 3.93773 11.8646 3.6846 11.3021C3.65648 11.2177 3.62835 11.1333 3.5721 11.049C3.3471 10.4583 2.7846 10.0365 2.13773 10.0365H2.05335C1.8846 10.0365 1.74398 9.89585 1.74398 9.7271L1.7721 8.1521C1.7721 8.0396 1.82835 7.98335 1.85648 7.9271C1.8846 7.89897 1.96898 7.84272 2.08148 7.84272H2.16585C2.81273 7.87085 3.40335 7.4771 3.65648 6.88647C3.6846 6.8021 3.74085 6.71772 3.76898 6.63335C4.0221 6.07085 3.9096 5.36772 3.4596 4.91772L3.40335 4.83335C3.29085 4.72085 3.29085 4.52397 3.40335 4.41147L4.52835 3.3146C4.61273 3.23022 4.6971 3.23022 4.75335 3.23022C4.8096 3.23022 4.89398 3.23022 4.97835 3.3146L5.0346 3.39897C5.4846 3.8771 6.1596 4.01772 6.77835 3.7646L6.89085 3.70835C7.5096 3.45522 7.90335 2.89272 7.90335 2.24585V2.13335C7.90335 2.02085 7.9596 1.9646 7.98773 1.90835C8.01585 1.8521 8.10023 1.82397 8.21273 1.82397H9.78773C9.95648 1.82397 10.0971 1.9646 10.0971 2.13335V2.24585C10.0971 2.89272 10.4909 3.48335 11.1096 3.70835C11.194 3.73647 11.3065 3.79272 11.3909 3.82085C11.9815 4.1021 12.6846 3.9896 13.1627 3.5396L13.2471 3.48335C13.3596 3.37085 13.5565 3.37085 13.669 3.48335L14.7659 4.60835C14.8502 4.69272 14.8502 4.7771 14.8502 4.83335C14.8502 4.8896 14.8221 4.97397 14.7659 5.05835L14.7096 5.1146C14.2034 5.53647 14.0627 6.2396 14.2877 6.8021C14.3159 6.88647 14.344 6.97085 14.4002 7.05522C14.6252 7.64585 15.1877 8.06772 15.8346 8.06772H15.919C16.0315 8.06772 16.0877 8.12397 16.144 8.1521C16.2002 8.18022 16.2284 8.2646 16.2284 8.3771V9.9521Z"
                          fill=""
                        />
                        <path
                          d="M9.00029 5.22705C6.89092 5.22705 5.17529 6.94268 5.17529 9.05205C5.17529 11.1614 6.89092 12.8771 9.00029 12.8771C11.1097 12.8771 12.8253 11.1614 12.8253 9.05205C12.8253 6.94268 11.1097 5.22705 9.00029 5.22705ZM9.00029 11.6114C7.59404 11.6114 6.44092 10.4583 6.44092 9.05205C6.44092 7.6458 7.59404 6.49268 9.00029 6.49268C10.4065 6.49268 11.5597 7.6458 11.5597 9.05205C11.5597 10.4583 10.4065 11.6114 9.00029 11.6114Z"
                          fill=""
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_130_9763">
                          <rect
                            width="18"
                            height="18"
                            fill="white"
                            transform="translate(0 0.052124)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    Đăng nhập
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
