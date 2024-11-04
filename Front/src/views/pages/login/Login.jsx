import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import Logo1 from "../../../assets/images/Logo-full.png";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilAccountLogout, cilExitToApp, cilLockLocked, cilTouchApp, cilUser } from "@coreui/icons";

import { Navigate, useNavigate } from "react-router-dom";
import swal from 'sweetalert';
import axios from "axios";
import { API_URL } from "src/config";
import secureLocalStorage from "react-secure-storage";
const Login = ({ setAuth, GetPagedata }) => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const [navigateto, setnavigateto] = useState('')



  const navigate = useNavigate();

  const handleLogin = async () => {
    if (loginData.username === '') {
      swal({
        text: 'Please Enter User Name',
        icon: 'warning'
      });
      return;
    }

    if (loginData.password === '') {
      swal({
        text: 'Please Enter User Password',
        icon: 'warning'
      });
      return;
    }

    try {
      console.log(loginData)
      // const alldata = { ...loginData, ipAddress }
      const response = await axios.post(`${API_URL}/login`, loginData);

      if (response.status === 200) {

        const userdata = { ...response.data.send };

        console.log(userdata);

        const pagedata = response.data.pagedata || [];

        setAuth(userdata)

        GetPagedata(pagedata)

        secureLocalStorage.setItem("userData", userdata);
        secureLocalStorage.setItem("pageData", pagedata);


        const userrole = response.data.send.userrole.toLowerCase()

        const firstlogin = response.data.send.firstlogin

        const accountStatus = response.data.send.accountStatus

        const daysUntilExpire = response.data.send.daysUntilExpire

        const ExpirationAlert = response.data.send.ExpirationAlert

        if (userdata.UserStatus === 'SA') {
          navigate('/Dashboard')
          return
        }

        if (accountStatus === 'Expired') {
          swal({
            text: 'Your Password as Expire Please Change Password',
            icon: 'warning'
          })
          navigate('/Expirepassword')
        } else {

          if (firstlogin === 1) {
            swal({
              text: 'Please Change Your Tempory Password',
              icon: 'warning'
            })
            navigate('/RestPasswordFirstLogin')

          }

          else if (userrole === 'admin') {
            const navigateto = response.data.navigation[0].pagename.toLowerCase()
            setnavigateto(navigateto)

            if (daysUntilExpire <= 5) {
              swal({
                text: `Your Password ${ExpirationAlert}`,
                icon: 'warning'
              })
            } else {
              swal({
                text: response.data.message,
                icon: 'success'
              });
            }

          }
          else {
            const navigateParent = response.data.navigation[0].pagename.toLowerCase()
            const navigateChild = response.data.navigation[1].pagename.toLowerCase()
            const navigateto = `${navigateParent}/${navigateChild}`
            setnavigateto(navigateto)

            if (daysUntilExpire <= 5) {
              swal({
                text: `Your Password ${ExpirationAlert}`,
                icon: 'warning'
              })
            } else {
              swal({
                text: response.data.message,
                icon: 'success'
              });
            }

          }

        }
      }
    } catch (err) {
      console.log(err);
      swal({
        text: `${err.response.data.error}`,
        icon: 'error'
      });
    }
  };

  if (navigateto !== '') {
    return <Navigate to={`/${navigateto}`} replace />
  }

  const handleForgotpassword = async () => {
    navigate("/register");
  };



  return (
    <div className="min-vh-100 d-flex flex-row align-items-center styled-box bg-white">
      <CContainer className="">
        <CRow className="justify-content-end">
          <CCol xxl={5} xl={6} lg={7} md={9} sm={12} >
            <CCardGroup className="content">
              <CCard className="custom-shadow">
                <CCardBody className="mx-5">
                  <div className="text-center">
                    <img src={Logo1} alt="Logo" className="w-75"/>
                  </div>
                  <div className="mt-3">
                  <small className="float-end text-muted"> Version: v5.1</small>
                    <CInputGroup className="mb-4">
                      <CInputGroupText className="bg-danger">
                        <CIcon icon={cilUser} size='xl' className="text-white" />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        floatingLabel="User Name"
                        placeholder="Username"
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      />
                    </CInputGroup>
                    <CInputGroup>
                      <CInputGroupText className="bg-danger">
                        <CIcon icon={cilLockLocked} size='xl' className="text-white" />
                      </CInputGroupText >
                      <CFormInput
                        type="password"
                        floatingLabel="Password"
                        placeholder="Password"
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        onKeyDownCapture={(e) => {
                          if (e.key === 'Enter') {
                            handleLogin();
                          }
                      }}
                      />
                    </CInputGroup>
                  </div>
                  <CCol className="float-end" >
                    <CButton color="link" className="" href="/#/forgotpassword">
                      Forgot password?
                    </CButton>
                  </CCol>
                  <div className="mx-2">
                    <CRow className="mt-5 mb-2">
                      <CButton
                        type="submit" color="danger"
                        // variant="outline"
                        className="px-4"
                        onClick={() => handleLogin()}
                      >
                        <CIcon icon={cilExitToApp}  /> LOGIN
                      </CButton>
                    </CRow>
                  </div>
                 
                </CCardBody>
                <CCardFooter className="bg-light text-center">
                  <small className="text-dark">© Copyright {new Date().getFullYear()} All rights reserved by RSPM Infotech</small>
                </CCardFooter>
              </CCard>
            </CCardGroup>

          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

Login.propTypes = {
  setAuth: PropTypes.func.isRequired,
  GetPagedata: PropTypes.func.isRequired,
  ipAddress: PropTypes.any.isRequired
};

export default Login;
