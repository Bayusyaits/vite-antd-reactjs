import React from 'react';
import { Layout } from 'antd';
import { Route, Routes } from 'react-router-dom';
const ErrorPage = React.lazy(() => import('../pages/error'));
const HomePage = React.lazy(() => import('../pages/home'));
const APP_VERSION = '1.0.1'
const { Header } = Layout;

const DefaultLayout: React.FC = (props: any) => {
  return (
    <Layout
      className="default-layout"
      id={`v-${APP_VERSION}`}
      style={{
        height: '100vh',
      }}
    >
      <Header
        className="default-layout-bg"
        style={{
          padding: 0,
          width: '100%',
          height: '55px',
        }}
      >
        Header
      </Header>
      <Layout>
        <div className='sidebar'></div>
        <Layout
          style={{
            overflow: 'auto',
          }}
        >
          <Routes>
            <Route index element={<HomePage {...props} />} />
            <Route path="*" element={<ErrorPage {...props} />} />
          </Routes>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout
