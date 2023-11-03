import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import deDe from 'antd/lib/locale/de_DE';
import enUS from 'antd/lib/locale/en_US';

// import { LoginPage } from 'pages/Login';
import DefaultLayoutWrapper from './layouts/DefaultLayoutWrapper';
import DefaultLayout from './layouts/Default';
import { useLanguage } from './hooks/useLanguage';
import { ConfigProvider, Empty } from 'antd';
const LoginPage = React.lazy(() => import('./pages/login'));
const RegistrationPage = React.lazy(() => import('./pages/registration'));

const App = () => {
  const { language } = useLanguage();
  return (
    <Suspense fallback={<>Loading</>}>
      {/* <ToastContainer /> */}
      <ConfigProvider locale={language === 'en' ? enUS : deDe}>
        <Routes>
          <Route
            index
            element={
              <DefaultLayoutWrapper>
                <DefaultLayout />
              </DefaultLayoutWrapper>
            }
          />
          <Route
            path="login"
            element={
              <DefaultLayoutWrapper>
                <LoginPage />
              </DefaultLayoutWrapper>
            }
          />
          <Route 
            path="registration" 
            element={
            <DefaultLayoutWrapper>
              <RegistrationPage />
            </DefaultLayoutWrapper>} 
          />
          <Route path="*" element={<DefaultLayoutWrapper><Empty /></DefaultLayoutWrapper>} />
        </Routes>
      </ConfigProvider>
    </Suspense>
  );
};

export default App;
