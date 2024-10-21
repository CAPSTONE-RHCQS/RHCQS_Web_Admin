import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Settings from './pages/Settings';
import DefaultLayout from './layout/DefaultLayout';
import CreatePost from './pages/BlogPost/CreatePost';
import InitialQuoteDetail from './pages/Quote/InitialQuoteDetail.tsx';
import CreateQuote from './pages/Quote/CreateQuote/CreateQuote';
import RHCQS from './pages/Dashboard/RHCQS';
import PostList from './pages/BlogPost/PostList';
import CreateDesignHouse from './pages/CreateDesignHouse/CreateDesignHouse';
import EditQuote from './pages/Quote/EditQuote/EditQuote';
import AccountList from './pages/Manager/AccountList';
import ProjectDetail from './pages/Manager/Project/ProjectDetail';
import CreateContractDesign from './pages/SalesStaff/CreateContractDesign.tsx';
import ProjectListManager from './pages/Manager/Project/ProjectListManager';
import UploadDesignDrawing from './pages/DesignStaff/UploadDesignDrawing';
import PrivateRoute from './components/PrivateRoute';
import ConstructionList from './pages/Manager/ConstructionList.tsx';
import ProjectListSalesStaff from './pages/SalesStaff/Project/ProjectListSalesStaff.tsx';
import ProjectDetailSalesStaff from './pages/SalesStaff/Project/ProjectDetailSalesStaff.tsx';
import FinalQuotationDetail from './pages/Quote/DetailedQuotation/FinalQuotationDetail.tsx';
import BlogList from './components/BlogList.tsx';

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
          path="/blog-list-manager"
          element={
            <PrivateRoute allowedRoles={['Manager']}>
              <PageTitle title="Blog Manager | RHCQS - Residential Housing Construction Quotation System" />
              <BlogList />
            </PrivateRoute>
          }
        />
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
          path="/construction-list-manager"
          element={
            <PrivateRoute allowedRoles={['Manager']}>
              <PageTitle title="Construction List | RHCQS - Residential Housing Construction Quotation System" />
              <ConstructionList />
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
          path="/project-detail/:id"
          element={
            <PrivateRoute allowedRoles={['Manager']}>
              <PageTitle title="Project Detail | RHCQS - Residential Housing Construction Quotation System" />
              <ProjectDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/final-quotation-detail/:id"
          element={
            <PrivateRoute allowedRoles={['Manager', 'SalesStaff']}>
              <PageTitle title="Quote Detail | RHCQS - Residential Housing Construction Quotation System" />
              <FinalQuotationDetail />
            </PrivateRoute>
          }
        />
        // Sale Staff
        <Route
          path="/project-list-staff"
          element={
            <PrivateRoute allowedRoles={['SalesStaff']}>
              <PageTitle title="Quote List | RHCQS - Residential Housing Construction Quotation System" />
              <ProjectListSalesStaff />
            </PrivateRoute>
          }
        />
        <Route
          path="/project-detail-staff/:id"
          element={
            <PrivateRoute allowedRoles={['SalesStaff']}>
              <PageTitle title="Project Detail Staff | RHCQS - Residential Housing Construction Quotation System" />
              <ProjectDetailSalesStaff />
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
          path="/initial-quote-detail/:id"
          element={
            <PrivateRoute allowedRoles={['Manager', 'SalesStaff']}>
              <PageTitle title="Initial Quote Detail | RHCQS - Residential Housing Construction Quotation System" />
              <InitialQuoteDetail />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/final-quotation-detail/:id"
          element={
            <PrivateRoute allowedRoles={['SalesStaff']}>
              <PageTitle title="Quote Detail | RHCQS - Residential Housing Construction Quotation System" />
              <FinalQuotationDetail />
            </PrivateRoute>
          }
        /> */}
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
          path="/create-contract-design/:projectId"
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
      <ToastContainer position="bottom-right" autoClose={5000} />
    </DefaultLayout>
  );
}

export default App;
