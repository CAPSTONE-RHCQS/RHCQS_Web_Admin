import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Settings from './pages/Settings';
import DefaultLayout from './layout/DefaultLayout';
import CreatePost from './pages/BlogPost/CreatePost';
import QuoteDetail from './pages/Quote/QuoteDetail';
import CreateQuote from './pages/Quote/CreateQuote/CreateQuote';
import RHCQS from './pages/Dashboard/RHCQS';
import PostList from './pages/BlogPost/PostList';
import CreateDesignHouse from './pages/CreateDesignHouse/CreateDesignHouse';
import EditQuote from './pages/Quote/EditQuote/EditQuote';
import AccountList from './pages/Manager/AccountList';
import ProjectDetail from './pages/Manager/Project/ProjectDetail';
import CreateContractDesign from './pages/DesignStaff/CreateContractDesign';
import ProjectList from './pages/SaleStaff/Project/ProjectListSaleStaff';
import ProjectListManager from './pages/Manager/Project/ProjectListManager';
import DetailedQuotation from './pages/Quote/DetailedQuotation/DetailedQuotation.tsx';
import UploadDesignDrawing from './pages/DesignStaff/UploadDesignDrawing';
import PrivateRoute from './components/PrivateRoute';

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
            <PrivateRoute allowedRoles={['Manager']}>
              <PageTitle title="Project Manager | RHCQS - Residential Housing Construction Quotation System" />
              <ProjectListManager />
            </PrivateRoute>
          }
        />
        <Route
          path="/account-list-manager"
          element={
            <PrivateRoute allowedRoles={['Manager']}>
              <PageTitle title="Staff List | RHCQS - Residential Housing Construction Quotation System" />
              <AccountList />
            </PrivateRoute>
          }
        />
        <Route
          path="/projectdetail/:id"
          element={
            <PrivateRoute allowedRoles={['Manager']}>
              <PageTitle title="Project Detail | RHCQS - Residential Housing Construction Quotation System" />
              <ProjectDetail />
            </PrivateRoute>
          }
        />
        // Sale Staff
        <Route
          path="/project-list-staff"
          element={
            <PrivateRoute allowedRoles={['SalesStaff']}>
              <PageTitle title="Quote List | RHCQS - Residential Housing Construction Quotation System" />
              <ProjectList />
            </PrivateRoute>
          }
        />
        <Route
          path="/createpost"
          element={
            <PrivateRoute allowedRoles={['SalesStaff']}>
              <PageTitle title="Create Post | RHCQS - Residential Housing Construction Quotation System" />
              <CreatePost />
            </PrivateRoute>
          }
        />
        <Route
          path="/postlist"
          element={
            <PrivateRoute allowedRoles={['SalesStaff']}>
              <PageTitle title="Post list | RHCQS - Residential Housing Construction Quotation System" />
              <PostList />
            </PrivateRoute>
          }
        />
        <Route
          path="/quotedetail"
          element={
            <PrivateRoute allowedRoles={['SalesStaff']}>
              <PageTitle title="Quote Detail | RHCQS - Residential Housing Construction Quotation System" />
              <QuoteDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/detailed-quotation"
          element={
            <PrivateRoute allowedRoles={['SalesStaff']}>
              <PageTitle title="Quote Detail | RHCQS - Residential Housing Construction Quotation System" />
              <DetailedQuotation />
            </PrivateRoute>
          }
        />
        <Route
          path="/Create-Quote"
          element={
            <PrivateRoute allowedRoles={['SalesStaff']}>
              <PageTitle title="Create Quote | RHCQS - Residential Housing Construction Quotation System" />
              <CreateQuote />
            </PrivateRoute>
          }
        />
        <Route
          path="/Create-Contract-Design"
          element={
            <PrivateRoute allowedRoles={['SalesStaff']}>
              <PageTitle title="Create Contract Design | RHCQS - Residential Housing Construction Quotation System" />
              <CreateContractDesign />
            </PrivateRoute>
          }
        />
        <Route
          path="/editquote"
          element={
            <PrivateRoute allowedRoles={['DesignStaff']}>
              <PageTitle title="Edit Quote | RHCQS - Residential Housing Construction Quotation System" />
              <EditQuote />
            </PrivateRoute>
          }
        />
        <Route
          path="/createdesignhouse"
          element={
            <PrivateRoute allowedRoles={['DesignStaff']}>
              <PageTitle title="Create Design House | RHCQS - Residential Housing Construction Quotation System" />
              <CreateDesignHouse />
            </PrivateRoute>
          }
        />
        <Route
          path="/UploadDesignDrawing"
          element={
            <PrivateRoute allowedRoles={['DesignStaff']}>
              <PageTitle title="Create Design House | RHCQS - Residential Housing Construction Quotation System" />
              <UploadDesignDrawing />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute
              allowedRoles={['Manager', 'Sales Staff', 'DesignStaff']}
            >
              <PageTitle title="Settings | RHCQS - Residential Housing Construction Quotation System" />
              <Settings />
            </PrivateRoute>
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
