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
import PriceQuote from './pages/PriceQuote';
import CreatePost from './pages/CreatePost';
import QuoteDetail from './pages/QuoteDetail';
import CreateQuote from './pages/CreateQuote';
import RHCQS from './pages/Dashboard/RHCQS';
import ChatPage from './pages/ChatPage';
import PostList from './pages/PostList';

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
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | RHCQS - Residential Housing Construction Quotation System" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | RHCQS - Residential Housing Construction Quotation System" />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | RHCQS - Residential Housing Construction Quotation System" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | RHCQS - Residential Housing Construction Quotation System" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | RHCQS - Residential Housing Construction Quotation System" />
              <Tables />
            </>
          }
        />
        <Route
          path="/pricequote"
          element={
            <>
              <PageTitle title="PriceQuote | RHCQS - Residential Housing Construction Quotation System" />
              <PriceQuote />
            </>
          }
        />
        <Route
          path="/createblog"
          element={
            <>
              <PageTitle title="PriceQuote | RHCQS - Residential Housing Construction Quotation System" />
              <CreatePost />
            </>
          }
        />
        <Route
          path="/PostList"
          element={
            <>
              <PageTitle title="PriceQuote | RHCQS - Residential Housing Construction Quotation System" />
              <PostList />
            </>
          }
        />
        <Route
          path="/quotedetail"
          element={
            <>
              <PageTitle title="PriceQuote | RHCQS - Residential Housing Construction Quotation System" />
              <QuoteDetail />
            </>
          }
        />
        <Route
          path="/createquote"
          element={
            <>
              <PageTitle title="PriceQuote | RHCQS - Residential Housing Construction Quotation System" />
              <CreateQuote />
            </>
          }
        />
        <Route
          path="/chatpage"
          element={
            <>
              <PageTitle title="PriceQuote | RHCQS - Residential Housing Construction Quotation System" />
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
