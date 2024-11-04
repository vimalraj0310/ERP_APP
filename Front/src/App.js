import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom'

import './scss/style.scss'
import secureLocalStorage from 'react-secure-storage'
import "../src/views/css/loader.css"
import axios from 'axios'
import { API_URL } from './config'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages 
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Forgotpassword = React.lazy(() => import('./views/pages/forgotpassword/Forgotpassword'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const RestPasswordFirstLogin = React.lazy(() => import('./views/pages/firsttimelogin/Firsttimelogin'))
const Expirepassword = React.lazy(() => import('./views/pages/expirepassword/Expirepassword'))

function App() {

// monisha

  const [auth, setAuth] = useState(secureLocalStorage.getItem("userData"));
  const [pagedata, setPagedata] = useState(secureLocalStorage.getItem("pageData"));

  const [ipAddress, setIPAddress] = useState(null);

  useEffect(() => {
    const localData = () => {
      const isAuthenticated = secureLocalStorage.getItem("userData");
      setAuth(isAuthenticated);
      const pagedatas = secureLocalStorage.getItem("pageData");
      console.log(pagedatas);
      setPagedata(pagedatas);
    };
    localData();
  }, []);



  const fetchIPAddress = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/ip`);
      const ipAddress = response.data.ip.split(':').pop(); // Extract only the IPv4 address
      setIPAddress(ipAddress);
      console.log(ipAddress);
    } catch (error) {
      console.error('Error fetching IP address:', error);
    }
  };


  

  useEffect(() => {
    fetchIPAddress()
  }, [])

  return (
    <HashRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route path="/" element={<Login setAuth={setAuth} GetPagedata={setPagedata} ipAddress={ipAddress} />} />
          <Route path="/login" element={<Login setAuth={setAuth} GetPagedata={setPagedata} ipAddress={ipAddress} />} />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route path="/RestPasswordFirstLogin" element={<RestPasswordFirstLogin />} />
          <Route path="/Expirepassword" element={<Expirepassword />} />
          <Route
            path="*"
            element={
              auth !== null ? (
                <DefaultLayout auth={auth} pageData={pagedata} ipAddress={auth.ipAddress} />
              ) : (
                <Page404 />
              )
            }
          />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
