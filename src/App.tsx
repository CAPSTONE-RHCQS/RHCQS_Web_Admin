import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import DefaultLayout from './layout/DefaultLayout';
import CreatePost from './pages/BlogPost/CreatePost';
import InitialQuotationDetailManager from './pages/Manager/InitialQuotation/InitialQuotationDetailManager.tsx';
import RHCQS from './pages/Dashboard/RHCQS';
import PostList from './pages/BlogPost/PostList';
import CreateDesignHouse from './pages/CreateDesignHouse/CreateDesignHouse';
import AccountList from './pages/Manager/Account/AccountList.tsx';
import ProjectDetailManager from './pages/Manager/Project/ProjectDetailManager.tsx';
import CreateContractDesign from './pages/SalesStaff/Contract/CreateContractDesign.tsx';
import ProjectListManager from './pages/Manager/Project/ProjectListManager';
import PrivateRoute from './components/PrivateRoute';
import ConstructionList from './pages/Manager/Construction/ConstructionList.tsx';
import ProjectListSalesStaff from './pages/SalesStaff/Project/ProjectListSalesStaff.tsx';
import ProjectDetailSalesStaff from './pages/SalesStaff/Project/ProjectDetailSalesStaff.tsx';
import BlogList from './components/BlogList.tsx';
import CreateConstructionContract from './pages/SalesStaff/Contract/CreateConstructionContract.tsx';
import InitialQuotationDetailStaff from './pages/SalesStaff/InitialQuotation/InitialQuotationDetailStaff.tsx';
import PackageList from './pages/Manager/Package/PackageList.tsx';
import FinalQuotationDetailManager from './pages/Manager/FinalQuotation/FinalQuotationDetailManager.tsx';
import FinalQuotationDetailStaff from './pages/SalesStaff/FinalQuotation/FinalQuotationDetailStaff.tsx';
import PromotionList from './pages/Manager/Promotions/PromotionList.tsx';
import UtilityList from './pages/Manager/Utility/UtilityList.tsx';
import HouseDesignList from './pages/DesignStaff/HouseDesignDrawing/HouseDesignList.tsx';
import HouseTemplateList from './pages/Manager/HouseTemplate/HouseTemplateList.tsx';
import HouseTemplateDetail from './pages/Manager/HouseTemplate/HouseTemplateDetail.tsx';
import HouseDesignDetailSalesStaff from './pages/SalesStaff/HouseDesignDrawing/HouseDesignDetailDesignStaff.tsx';
import HouseDesignDetailDesignStaff from './pages/DesignStaff/HouseDesignDrawing/HouseDesignDetailDesignStaff.tsx';
import HouseDesignDetailManager from './pages/Manager/HouseDesignDrawing/HouseDesignDetailManager.tsx';
import CreateHouseModel from './pages/Manager/HouseTemplate/CreateHouseTemplate/CreateHouseModel.tsx';
import AddImageHouse from './pages/Manager/HouseTemplate/CreateHouseTemplate/AddImageHouse.tsx';
import Settings from './pages/Settings.tsx';
import MaterialSectionList from './pages/Manager/Material/MaterialSectionList.tsx';
import ScrollToTop from './components/ScrollToTop';
import SupplierList from './pages/Manager/Supplier/SupplierList.tsx';
import CreateNewFinalQuotationStaff from './pages/SalesStaff/FinalQuotation/CreateNewFinalQuotationStaff.tsx';
import ContractDetailStaff from './pages/SalesStaff/Contract/ContractDetailStaff.tsx';
import ContractDetailManager from './pages/Manager/Contract/ContractDetailManager.tsx';
import LaborList from './pages/Manager/Labor/LaborList.tsx';
import CreateNewInitialQuotationStaff from './pages/SalesStaff/InitialQuotation/CreateNewInitialQuotationStaff.tsx';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const isAuthPage = pathname === '/auth/signin';

  return loading ? (
    <Loader />
  ) : (
    <>
      <ScrollToTop />
      {isAuthPage ? (
        <Routes>
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
      ) : (
        <DefaultLayout>
          <Routes>
            <Route
              index
              element={
                <PrivateRoute
                  allowedRoles={['Manager', 'SalesStaff', 'DesignStaff']}
                >
                  <PageTitle title="RHCQS Dashboard | RHCQS - Residential Housing Construction Quotation System" />
                  <RHCQS />
                </PrivateRoute>
              }
            />
            {/* Manager Routes */}
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
              path="/package-list-manager"
              element={
                <PrivateRoute allowedRoles={['Manager']}>
                  <PageTitle title="Package List | RHCQS - Residential Housing Construction Quotation System" />
                  <PackageList />
                </PrivateRoute>
              }
            />
            <Route
              path="/house-templates"
              element={
                <PrivateRoute allowedRoles={['Manager']}>
                  <PageTitle title="House Templates | RHCQS - Residential Housing Construction Quotation System" />
                  <HouseTemplateList />
                </PrivateRoute>
              }
            />
            <Route
              path="/house-template/:id"
              element={
                <PrivateRoute allowedRoles={['Manager']}>
                  <PageTitle title="House Template Detail | RHCQS - Residential Housing Construction Quotation System" />
                  <HouseTemplateDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-house-template"
              element={
                <PrivateRoute allowedRoles={['Manager']}>
                  <PageTitle title="Create House Template | RHCQS - Residential Housing Construction Quotation System" />
                  <CreateHouseModel />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-image-house"
              element={
                <PrivateRoute allowedRoles={['Manager']}>
                  <PageTitle title="Add Image House | RHCQS - Residential Housing Construction Quotation System" />
                  <AddImageHouse />
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
              path="/utility-list-manager"
              element={
                <PrivateRoute allowedRoles={['Manager']}>
                  <PageTitle title="Utility List | RHCQS - Residential Housing Construction Quotation System" />
                  <UtilityList />
                </PrivateRoute>
              }
            />
            <Route
              path="/promotion-list-manager"
              element={
                <PrivateRoute allowedRoles={['Manager']}>
                  <PageTitle title="Promotion List | RHCQS - Residential Housing Construction Quotation System" />
                  <PromotionList />
                </PrivateRoute>
              }
            />
            <Route
              path="/material-section-list-manager"
              element={
                <PrivateRoute allowedRoles={['Manager']}>
                  <PageTitle title="Material Section List | RHCQS - Residential Housing Construction Quotation System" />
                  <MaterialSectionList />
                </PrivateRoute>
              }
            />
            <Route
              path="/supplier-list-manager"
              element={
                <PrivateRoute allowedRoles={['Manager']}>
                  <PageTitle title="Supplier List | RHCQS - Residential Housing Construction Quotation System" />
                  <SupplierList />
                </PrivateRoute>
              }
            />
            <Route
              path="/labor-list-manager"
              element={
                <PrivateRoute allowedRoles={['Manager']}>
                  <PageTitle title="Labor List | RHCQS - Residential Housing Construction Quotation System" />
                  <LaborList />
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
              path="/project-detail-manager/:id"
              element={
                <PrivateRoute allowedRoles={['Manager']}>
                  <PageTitle title="Project Detail | RHCQS - Residential Housing Construction Quotation System" />
                  <ProjectDetailManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/initial-quotation-detail-manager/:id"
              element={
                <PrivateRoute allowedRoles={['Manager']}>
                  <PageTitle title="Initial Quotation Detail | RHCQS - Residential Housing Construction Quotation System" />
                  <InitialQuotationDetailManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/final-quotation-detail-manager/:id"
              element={
                <PrivateRoute allowedRoles={['Manager']}>
                  <PageTitle title="Quote Detail Manager | RHCQS - Residential Housing Construction Quotation System" />
                  <FinalQuotationDetailManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/contract-detail-manager/:contractId"
              element={
                <PrivateRoute allowedRoles={['Manager']}>
                  <PageTitle title="Contract Detail | RHCQS - Residential Housing Construction Quotation System" />
                  <ContractDetailManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/house-design-detail-manager/:id"
              element={
                <PrivateRoute allowedRoles={['Manager']}>
                  <PageTitle title="House Design Detail | RHCQS - Residential Housing Construction Quotation System" />
                  <HouseDesignDetailManager />
                </PrivateRoute>
              }
            />
            {/* Sales Staff Routes */}
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
              path="/house-design-detail-salesstaff/:id"
              element={
                <PrivateRoute allowedRoles={['SalesStaff']}>
                  <PageTitle title="House Design Detail | RHCQS - Residential Housing Construction Quotation System" />
                  <HouseDesignDetailDesignStaff />
                </PrivateRoute>
              }
            />
            <Route
              path="/initial-quotation-detail-staff/:id"
              element={
                <PrivateRoute allowedRoles={['SalesStaff']}>
                  <PageTitle title="Initial Quotation Detail | RHCQS - Residential Housing Construction Quotation System" />
                  <InitialQuotationDetailStaff />
                </PrivateRoute>
              }
            />
            <Route
              path="/final-quotation-detail-staff/:id"
              element={
                <PrivateRoute allowedRoles={['SalesStaff']}>
                  <PageTitle title="Quote Detail Sales Staff | RHCQS - Residential Housing Construction Quotation System" />
                  <FinalQuotationDetailStaff />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-new-final-quotation-staff/:id"
              element={
                <PrivateRoute allowedRoles={['SalesStaff']}>
                  <PageTitle title="Quote Detail Sales Staff | RHCQS - Residential Housing Construction Quotation System" />
                  <CreateNewFinalQuotationStaff />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-initial-quote/:projectId"
              element={
                <PrivateRoute allowedRoles={['SalesStaff']}>
                  <PageTitle title="Create Initial Quote | RHCQS - Residential Housing Construction Quotation System" />
                  <CreateNewInitialQuotationStaff />
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
              path="/create-construction-contract/:projectId"
              element={
                <PrivateRoute allowedRoles={['SalesStaff']}>
                  <PageTitle title="Create Construction Contract | RHCQS - Residential Housing Construction Quotation System" />
                  <CreateConstructionContract />
                </PrivateRoute>
              }
            />
            <Route
              path="/contract-detail-staff/:contractId"
              element={
                <PrivateRoute allowedRoles={['SalesStaff']}>
                  <PageTitle title="Contract Detail | RHCQS - Residential Housing Construction Quotation System" />
                  <ContractDetailStaff />
                </PrivateRoute>
              }
            />
            <Route
              path="/blog-list-staff"
              element={
                <PrivateRoute allowedRoles={['SalesStaff']}>
                  <PageTitle title="Blog List Staff | RHCQS - Residential Housing Construction Quotation System" />
                  <BlogList />
                </PrivateRoute>
              }
            />
            {/* Design Staff Routes */}
            <Route
              path="/house-design-list"
              element={
                <PrivateRoute allowedRoles={['DesignStaff']}>
                  <PageTitle title="Design House List | RHCQS - Residential Housing Construction Quotation System" />
                  <HouseDesignList />
                </PrivateRoute>
              }
            />
            <Route
              path="/house-design-detail-designstaff/:id"
              element={
                <PrivateRoute allowedRoles={['DesignStaff']}>
                  <PageTitle title="House Design Detail | RHCQS - Residential Housing Construction Quotation System" />
                  <HouseDesignDetailDesignStaff />
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
          </Routes>
        </DefaultLayout>
      )}
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
}

export default App;
