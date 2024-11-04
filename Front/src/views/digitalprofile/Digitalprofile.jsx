import React, { useState } from 'react';
import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem, CButton, CCard, CCardBody, CCardImage, CCol, CForm, CFormCheck, CFormInput, CFormLabel, CInputGroup, CInputGroupText, CLink, CModal, CModalBody, CModalHeader, CModalTitle, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CTooltip } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilHappy, cilLockLocked, cilPowerStandby, cilUser } from '@coreui/icons';
import profile_img from '../../assets/images/avatars/11.png';
import Logo1 from "../../assets/images/Logo-full.png";
import swal from 'sweetalert';
import { RotatingLines } from 'react-loader-spinner';
import PropTypes from 'prop-types'; // Import PropTypes

import "../css/loader.css"
import axios from 'axios';
import { API_URL } from 'src/config';

const Digitalprofile = ({ auth }) => {
  const [activeKey, setActiveKey] = useState(1);
  const [editvisible, setEditvisible] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state

  const [changepasswordData, SetchangepasswordData] = useState({
    usercode: '',
    oldpassword: '',
    newpassword: '',
    confirmpassword: ''
  });

  function checkPassword(str) {
    const lengthCheck = /^.{8,}$/;
    const digitCheck = /^(?=.*\d)/;
    const specialCharCheck = /^(?=.*[!@#$%^&*])/;
    const lowercaseCheck = /^(?=.*[a-z])/;
    const uppercaseCheck = /^(?=.*[A-Z])/;

    if (!lengthCheck.test(str)) {
      swal({
        text: 'Password must be exactly 8 characters long.',
        icon: 'warning'
      });
      return false;
    }
    if (!digitCheck.test(str)) {
      swal({
        text: 'Password must contain at least one digit.',
        icon: 'warning'
      });
      return false;
    }
    if (!specialCharCheck.test(str)) {
      swal({
        text: 'Password must contain at least one special character.',
        icon: 'warning'
      });
      return false;
    }
    if (!lowercaseCheck.test(str)) {
      swal({
        text: 'Password must contain at least one lowercase letter.',
        icon: 'warning'
      });
      return false;
    }
    if (!uppercaseCheck.test(str)) {
      swal({
        text: 'Password must contain at least one uppercase letter.',
        icon: 'warning'
      });
      return false;
    }

    return true;
  }


  const handleChangepassword = async () => {
    if (changepasswordData.usercode === '') {
      swal({
        text: 'Please Enter Usercode',
        icon: 'warning'
      });
      return;
    }

    if (changepasswordData.oldpassword === '') {
      swal({
        text: 'Please Enter Your old Password',
        icon: 'warning'
      });
      return;
    }

    if (changepasswordData.newpassword === '') {
      swal({
        text: 'Please Enter Your New Password',
        icon: 'warning'
      });
      return;
    }

    if (changepasswordData.confirmpassword === '') {
      swal({
        text: 'Please Enter Your Confirm Password',
        icon: 'warning'
      });
      return;
    }

    if (changepasswordData.oldpassword === changepasswordData.newpassword) {
      swal({
        text: 'Old Password and New Password are the same. Please choose a different New Password.',
        icon: 'warning'
      });
      return;
    }

    if (changepasswordData.newpassword !== changepasswordData.confirmpassword) {
      swal({
        text: 'New Password and Confirm Password do not match',
        icon: 'warning'
      });
      return;
    }

    if (!checkPassword(changepasswordData.confirmpassword)) {
      return;
    }


    setLoading(true); // Show loader

    try {

      const response = await axios.post(`${API_URL}/changepassword`, changepasswordData)

      if (response.status === 200) {
        setLoading(false);
        setEditvisible(false);
        swal({
          text: `${response.data.message}`,
          icon: 'success'
        });
      }

      SetchangepasswordData({ ...changepasswordData, usercode: '', oldpassword: '', newpassword: '', confirmpassword: '' })

    } catch (err) {
      console.log(err);
      setLoading(false);
      swal({
        text: `${err.response.data.error}`,
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlechangepasswordModal = async () => {
    setEditvisible(true);
  };

  const handleClear = () => {
    SetchangepasswordData({
      usercode: '',
      oldpassword: '',
      newpassword: '',
      confirmpassword: ''
    });
  };

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <RotatingLines
              visible={true}
              height="96"
              width="96"
              color="grey"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        </div>
      )}

      <CModal
        size="md"
        backdrop="static"
        alignment="center"
        visible={editvisible}
        onClose={() => setEditvisible(false)}
        aria-labelledby="VerticallyCenteredExample"
      >
        <CModalHeader className="fw-bold text-primary">Change your Password</CModalHeader>
        <CModalBody>
          <CForm className="mx-5">
            <div className="text-center my-3">
              <img src={Logo1} alt="Logo" className='w-75' />
            </div>

            <CInputGroup className="mb-3">
              <CInputGroupText className="bg-danger">
                <CIcon icon={cilUser} size='lg' className='text-white' />
              </CInputGroupText>
              <CFormInput
                placeholder="User Name"
                autoComplete="false"
                onChange={(e) => SetchangepasswordData({ ...changepasswordData, usercode: e.target.value })}
                disabled={loading} // Disable input during loading
                value={changepasswordData.usercode}
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText className="bg-danger">
                <CIcon icon={cilLockLocked} size='lg' className='text-white' />
              </CInputGroupText>
              <CFormInput
                type="password"
                placeholder="Old Password"
                autoComplete="old-password"
                onChange={(e) => SetchangepasswordData({ ...changepasswordData, oldpassword: e.target.value })}
                disabled={loading} // Disable input during loading
                value={changepasswordData.oldpassword}
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText className="bg-danger">
                <CIcon icon={cilLockLocked} size='lg' className='text-white' />
              </CInputGroupText>
              <CFormInput
                type="password"
                placeholder="New Password"
                autoComplete="new-password"
                onChange={(e) => SetchangepasswordData({ ...changepasswordData, newpassword: e.target.value })}
                disabled={loading} // Disable input during loading
                value={changepasswordData.newpassword}
              />
            </CInputGroup>
            <CInputGroup className="mb-4">
              <CInputGroupText className="bg-danger">
                <CIcon icon={cilLockLocked} size='lg' className='text-white' />
              </CInputGroupText>
              <CFormInput
                type="password"
                placeholder="Confirm password"
                autoComplete="confirm-password"
                onChange={(e) => SetchangepasswordData({ ...changepasswordData, confirmpassword: e.target.value })}
                disabled={loading} // Disable input during loading
                value={changepasswordData.confirmpassword}
              />
            </CInputGroup>
            <div className="d-flex justify-content-center">
              <div className="mx-3">
                <CButton color="secondary" variant='outline' disabled={loading} onClick={handleClear} >
                  Clear
                </CButton>
              </div>
              <div>
                <CButton color="primary" variant='outline' onClick={handleChangepassword} disabled={loading}>
                  Submit
                </CButton>
              </div>
            </div>
          </CForm>
        </CModalBody>
      </CModal>

      <div>
        <CRow>
          <div className="d-flex">
            <CIcon className="me-2" size="xxl" icon={cilHappy} />
            <h3> My Profile</h3>
          </div>
          <CCol className='mb-3'>
            <CCard style={{ width: '19rem' }} className="mx-5">
              <div className='position-relative'>
                <CCardImage orientation="top" src={profile_img}  />
                <span className="client_badge badge rounded-pill text-bg-light ms-3 fs-6 text-uppercase text-danger"> {auth && auth.usercode}</span>
              </div>
              <CCardBody>

                <div className="text-center">
                  {/* <h3>{auth && auth.usercode}</h3> */}
                  <span>Joined on {new Date(auth && auth.DateofJoining).toDateString()}</span>
                </div>

                <div className="text-center" style={{ display: auth.UserStatus !== 'SA' ? 'block' : 'none' }}>
                  <span className=' text-danger fw-bold text-uppercase'><span className='text-muted'>Branch</span> : {auth.branchName}</span>
                </div>
                <div className="text-center m-2">
                  <h3><span className="badge rounded-pill text-bg-primary ms-3 fs-6">{auth && auth.userrole}</span></h3>
                </div>
                <div>
                  <div className='text-muted'>Emp Name:</div>
                  <div><CFormLabel className='text-uppercase fw-bold'>{auth && auth.employeename}</CFormLabel></div>
                  <div className='text-muted'>Email:</div>
                  <div><CFormLabel className='text-wrap text-uppercase fw-bold w-100'>{auth && auth.email}</CFormLabel></div>
                  <div className='text-muted'>Department:</div>
                  <div><CFormLabel className='text-uppercase fw-bold'>{auth && auth.departmentname}</CFormLabel></div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol >
            <CNav variant="tabs border-dark" className="border-3 border-bottom" role="tablist">
              <CNavItem>
                <CNavLink href="#/digitalprofile" active={activeKey === 1} onClick={() => setActiveKey(1)} disabled={loading}>
                  Settings
                </CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
                <CAccordion className="my-3">
                  <CAccordionItem itemKey={1} className="my-5">
                    <CAccordionHeader>
                      Change Password
                    </CAccordionHeader>
                    <CAccordionBody className="d-flex justify-content-between mx-3">
                      <div>
                        <CLink className="text-dark" onClick={handlechangepasswordModal} disabled={loading}>
                          Click here to change password
                        </CLink>
                      </div>
                    </CAccordionBody>
                  </CAccordionItem>

                  {/* <CAccordionItem itemKey={3} className="my-5">
                    <CAccordionHeader>
                      Running Session
                    </CAccordionHeader>
                    <CAccordionBody>
                      <div className="d-flex justify-content-end m-3">
                        <CTooltip content="Select Device to Logout">
                          <CButton disabled={loading}> <CIcon className="me-2" icon={cilPowerStandby} />LOGOUT</CButton>
                        </CTooltip>
                      </div>
                      <CTable hover className="mt-5">
                        <CTableHead color="dark">
                          <CTableRow>
                            <CTableHeaderCell scope="col"><CFormCheck disabled={loading} /> </CTableHeaderCell>
                            <CTableHeaderCell scope="col">DEVICE</CTableHeaderCell>
                            <CTableHeaderCell scope="col">LOG TIME</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          <CTableRow>
                            <CTableHeaderCell scope="row"><CFormCheck disabled={loading} /></CTableHeaderCell>
                            <CTableDataCell>Windows</CTableDataCell>
                            <CTableDataCell>05-Apr-2024</CTableDataCell>
                            <CTableDataCell>
                              <CTooltip content="Logout">
                                <CIcon icon={cilPowerStandby} className="mx-2" />
                              </CTooltip>
                            </CTableDataCell>
                          </CTableRow>
                        </CTableBody>
                      </CTable>
                    </CAccordionBody>
                  </CAccordionItem> */}
                </CAccordion>
              </CTabPane>
            </CTabContent>
          </CCol>
        </CRow>
      </div>
    </>
  );
};

Digitalprofile.propTypes = {
  auth: PropTypes.any.isRequired,
};



export default Digitalprofile;
