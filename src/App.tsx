import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import CreatePost from './pages/BlogPost/CreatePost';
import QuoteDetail from './pages/Quote/QuoteDetail';
import CreateQuote from './pages/Quote/CreateQuote/CreateQuote';
import RHCQS from './pages/Dashboard/RHCQS';
import ChatPage from './pages/ChatPage';
import PostList from './pages/BlogPost/PostList';
import CreateDesignHouse from './pages/CreateDesignHouse/CreateDesignHouse';
import EditQuote from './pages/Quote/EditQuote/EditQuote';
import AccountList from './pages/Manager/AccountList';
import ProjectDetail from './pages/Manager/Project/ProjectDetail';
import CreateContractDesign from './pages/DesignStaff/CreateContractDesign';
import ProjectList from './pages/SaleStaff/Project/ProjectListSaleStaff';
import ProjectListManager from './pages/Manager/Project/ProjectListManager';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="RHCQS Dashboard | RHCQS - Residential Housing Construction Quotation System" />
              <RHCQS />
            </>
          }
        />
        // Manager
        <Route
          path="/project-list-manager"
          element={
            <>
              <PageTitle title="Project Manager | RHCQS - Residential Housing Construction Quotation System" />
              <ProjectListManager />
            </>
          }
        />
        <Route
          path="/account-list-manager"
          element={
            <>
              <PageTitle title="Staff List | RHCQS - Residential Housing Construction Quotation System" />
              <AccountList />
            </>
          }
        />
        <Route
          path="/projectdetail"
          element={
            <>
              <PageTitle title="Project Detail | RHCQS - Residential Housing Construction Quotation System" />
              <ProjectDetail />
            </>
          }
        />
        // Sale Staff
        <Route
          path="/project-list-staff"
          element={
            <>
              <PageTitle title="Quote List | RHCQS - Residential Housing Construction Quotation System" />
              <ProjectList />
            </>
          }
        />
        <Route
          path="/createpost"
          element={
            <>
              <PageTitle title="Create Post | RHCQS - Residential Housing Construction Quotation System" />
              <CreatePost />
            </>
          }
        />
        <Route
          path="/postlist"
          element={
            <>
              <PageTitle title="Post list | RHCQS - Residential Housing Construction Quotation System" />
              <PostList />
            </>
          }
        />
        <Route
          path="/quotedetail"
          element={
            <>
              <PageTitle title="Quote Detail | RHCQS - Residential Housing Construction Quotation System" />
              <QuoteDetail />
            </>
          }
        />
        <Route
          path="/Create-Quote"
          element={
            <>
              <PageTitle title="Create Quote | RHCQS - Residential Housing Construction Quotation System" />
              <CreateQuote />
            </>
          }
        />
        <Route
          path="/Create-Contract-Design"
          element={
            <>
              <PageTitle title="Create Contract Design | RHCQS - Residential Housing Construction Quotation System" />
              <CreateContractDesign />
            </>
          }
        />
        <Route
          path="/editquote"
          element={
            <>
              <PageTitle title="Edit Quote | RHCQS - Residential Housing Construction Quotation System" />
              <EditQuote />
            </>
          }
        />
        <Route
          path="/createdesignhouse"
          element={
            <>
              <PageTitle title="Create Design House | RHCQS - Residential Housing Construction Quotation System" />
              <CreateDesignHouse />
            </>
          }
        />
        <Route
          path="/chatpage"
          element={
            <>
              <PageTitle title="Chat | RHCQS - Residential Housing Construction Quotation System" />
              <ChatPage />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | RHCQS - Residential Housing Construction Quotation System" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | RHCQS - Residential Housing Construction Quotation System" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | RHCQS - Residential Housing Construction Quotation System" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | RHCQS - Residential Housing Construction Quotation System" />
              <Buttons />
            </>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | RHCQS - Residential Housing Construction Quotation System" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | RHCQS - Residential Housing Construction Quotation System" />
              <SignUp />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
