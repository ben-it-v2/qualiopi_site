import { Routes, Route } from 'react-router-dom';

import Login from '../Login/Login';
import Main from '../Main/Main';
import Layout from '../Layout/Layout';
import Unauthorized from '../Unauthorized/Unauthorized';
import Missing from '../Missing/Missing';
import RequireAuth from '../RequireAuth/RequireAuth';
import Cfa from '../Cfa/Cfa';
import CfaDetail from '../CfaDetail/CfaDetail';

import './App.css';

const ROLES = {
  'User': 2**0,
  'Admin': 2**1
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route path="login" element={<Login />}/>
        <Route path="unauthorized" element={<Unauthorized />}/>

        {/* Private routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]}/>}>
          <Route exact path="/" element={<Main />}/>
          <Route exact path="cfa" element={<Cfa />}/>
          <Route path="cfa/:name" element={<CfaDetail />}/>
        </Route>
        
        {/*<Route path="admin" element={<Admin />}/>*/}
        {/*<Route path="cfa" element={<Cfa />}/>*/}

        {/* Catch all routes */}
        <Route path="*" element={<Missing />}/>
      </Route>
    </Routes>
  )
}

export default App;
