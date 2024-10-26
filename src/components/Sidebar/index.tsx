import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/logo.svg';

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
              {/* <!-- Menu Item Dashboard --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/' || pathname.includes('dashboard')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-teal-300 dark:hover:bg-meta-4 ${
                          (pathname === '/' ||
                            pathname.includes('dashboard')) &&
                          'bg-teal-300 dark:bg-meta-4'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                            fill=""
                          />
                          <path
                            d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                            fill=""
                          />
                          <path
                            d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                            fill=""
                          />
                          <path
                            d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                            fill=""
                          />
                        </svg>
                        Dashboard
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && 'rotate-180'
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              RHCQS Dashboard
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Dashboard --> */}

              <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                MANAGER
              </h3>

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

              <h3 className="mt-4 mb-4 ml-4 text-sm font-semibold text-bodydark2">
                STAFF SALE
              </h3>

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

              <h3 className="mt-4 mb-4 ml-4 text-sm font-semibold text-bodydark2">
                STAFF DESIGNER
              </h3>

              {/* <!-- Menu Item QuoteStaffList --> */}
              <li>
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
                  Báo giá sơ bộ
                </NavLink>
              </li>

              {/* <!-- Menu Item CreateDesignHouse --> */}
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
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
