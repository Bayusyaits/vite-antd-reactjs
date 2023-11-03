import { cloneElement } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { Layout } from 'antd';

export default function DefaultLayoutWrapper({ children }: any) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [query, setQuery] = useSearchParams();
  const APP_VERSION = '1.0.1'
  return (
    <Layout
      id={`v-${APP_VERSION}`}
      style={{
        height: '100vh',
        paddingLeft: '2.5rem',
        paddingRight: '2.5rem',
        paddingTop: '2.5rem',
      }}
    >
    { 
      cloneElement(children, {
        location,
        navigate,
        params,
        query,
        setQuery,
      })
    }
    </Layout>
  )
};

