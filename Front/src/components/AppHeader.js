import React, { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CButton,
  CFormInput,
  CBadge,
  CDropdownHeader,
  CModal,
  CModalBody,
  CModalFooter,
  CTooltip,
  CModalHeader,
  CDropdownDivider,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CFormTextarea,
  CRow,
  CCol,
  CImage,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilExitToApp,
  cilList,
  cilLockUnlocked,
  cilMenu,
  cilMoon,
  cilPlus,
  cilSearch,
  cilSun,
  cilUser,
} from '@coreui/icons'
import { useColorModes } from '@coreui/react'
import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { API_URL } from 'src/config'
import PropTypes from 'prop-types'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import swal from 'sweetalert'
import { RotatingLines } from 'react-loader-spinner';

import secureLocalStorage from 'react-secure-storage'
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { MdNoteAdd } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import { IoHelpCircle } from "react-icons/io5";
import Logofull1 from "../../src/assets/images/RSPM_Logofull.png";
const AppHeader = ({ auth, ipAddress }) => {

  const [secureLocalStorageData, setsecureLocalStorageData] = useState(secureLocalStorage.getItem("userData"));

  const role = auth.userrole.toLowerCase()

  const [visible, setVisible] = useState(false)
  const [helpvisible, setHelpvisible] = useState(false)

  const [GridData, SetGridData] = useState([])

  const [BranchDropDown, SetBranchDropDown] = useState([])

  const [DefaultSelectedBrach, SetDefaultSelectedBrach] = useState(auth.branchid)


  const headerRef = useRef()

  const { colorMode, setColorMode } = useColorModes('')

  const [PasswordNotficationCount, SetPasswordNotficationCount] = useState(null)

  const [PasswordNotficationData, SetPasswordNotficationData] = useState([])

  const [loading, setLoading] = useState(false); // Loader state


  const dispatch = useDispatch()

  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])



  const navigate = useNavigate();
  const adddoc = async () => {
    navigate("/documentregister/adddocument");
  };

  const help = async () => {
    navigate("/documentregister/adddocument");
  };



  const PasswordNotfictionFetch = async () => {
    try {

      const alldata = { mood: 'PD', id: '', branchid: auth.branchid } /// fetch password data mood pd mean password data

      const response = await axios.post(`${API_URL}/Notification`, alldata)

      if (response.status === 200) {
        console.log(response.data?.count?.counts);
        

        SetPasswordNotficationCount(response.data?.count?.counts)
        SetPasswordNotficationData(response.data.PasswordAlertData)
      }

    } catch (err) {
      console.log(err);
    }
  }





  const colmun = [
    { field: "employeecode" },
    { field: "employeename" },
    { field: "email" },
    {
      field: 'User Unlock',
      filter: false,
      sortable: false,
      floatingFilter: false,
      editable: false,
      cellRenderer: (params) => (
        <CTooltip content="Unlock">
          <CIcon
            size='xl'
            icon={cilLockUnlocked}
            className='m-2'
            onClick={() => handleUnlockPassword(params.data.id)}
            style={{ color: 'white', background: 'blue', borderRadius: '5px' }}
          />
        </CTooltip>
      )
    },
  ]


  const handleUnlockPassword = (id) => {
    swal({
      title: "Are you sure?",
      text: "Unlock The User Password",
      icon: "warning",
      buttons: [true, "Yes"],
      dangerMode: false,
    }).then(async (result) => {
      if (result) {
        try {
          const alldata = { mood: 'PU', id, branchid: auth.branchid } /// password unlock mood pu mean passowrd unlock

          const response = await axios.post(`${API_URL}/Notification`, alldata)

          console.log(response.data);

          if (response.status === 200) {

            setVisible(false)

            swal({
              text: 'Unlock Password SuccessFully',
              icon: 'success'
            })
          }
        }
        catch (err) {
          console.log(err);
        }
      }
    });

  }

  const defaultColDef = useMemo(() => ({
    filter: 'agTextColumnFilter',
    floatingFilter: true,

  }), []);




  const FetchBranchDropdown = async () => {
    try {

      const alldata = { id: 0, branchName: '', createdby: 0, updateby: 0, mood: 'S' }
      const response = await axios.post(`${API_URL}/BranchMaster`, alldata)

      if (response.status === 200) {
        SetBranchDropDown(response.data)
      }

    } catch (err) {

      console.log(err);
    }
  }





  const handleBranchChange = (id) => {
    try {
      if (!secureLocalStorageData) {
        throw new Error("No data in local storage");
      }

      const updatedData = { ...secureLocalStorageData, branchid: id };

      secureLocalStorage.removeItem('userData')

      // Save the updated data back to local storage
      secureLocalStorage.setItem("userData", updatedData);

      // Update the state
      setsecureLocalStorageData(updatedData);

      console.log(updatedData, secureLocalStorageData);

      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        window.location.reload()
      }, 1000);

    } catch (error) {
      console.log(error);
      setLoading(false); // Set loading to false in case of an error
    }
  };



  useEffect(() => {

    if (auth.UserStatus !== 'SA') {
      PasswordNotfictionFetch()
    }

    FetchBranchDropdown()


    const intervalLoop = () => {

      if (auth.UserStatus !== 'SA') {
        PasswordNotfictionFetch()
      }

    };

    const intervalId = setInterval(intervalLoop, 10000);

    return () => {

      if (auth.UserStatus !== 'SA') {
        PasswordNotfictionFetch()
      }


      clearInterval(intervalId);
    };
  }, [])


  const [HelpData, SetHelpData] = useState({
    Name: "",
    EmailId: "",
    Comments: "",
    ToMail: "info@rspm.co.in,support@rspm.co.in",
    branchid: auth.branchid
  })


  const handleSubmitHelp = async () => {
    try {

      if (HelpData.Name === '') {
        swal({
          text: 'Please Enter Name Before Submit Form !',
          icon: 'warning'
        })
        return
      }
      if (HelpData.EmailId === '') {
        swal({
          text: 'Please Enter Email Id Before Submit Form !',
          icon: 'warning'
        })
        return
      }
      if (HelpData.Comments === '') {
        swal({
          text: 'Please Enter Comments Before Submit Form !',
          icon: 'warning'
        })
        return
      }


      const response = await axios.post(`${API_URL}/Help-Desk-Mail`, HelpData)

      if (response.status === 200) {

        console.log(response);

        swal({
          text: `${response.data}`,
          icon: 'success'
        })
      }


    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>

      <CModal
        size='lg'
        backdrop="static"
        visible={helpvisible}
        onClose={() => setHelpvisible(false)}
        aria-labelledby="StaticBackdropExampleLabel">
        <CModalHeader>
          <div className='col-4 '>
            <CImage src={Logofull1} className="sidebar-brand-full w-50 h-50" />
          </div>
          <div className='text-start m-3 col-6'>
            <div>
              <span className='fw-bold me-2' > Email:</span>
              info@rspm.co.in / support@rspm.co.in
            </div>
            <div>
              <span className='fw-bold me-2' > Phone:</span>
              +91 9940021769 / +91 7904726741
            </div>
          </div>
        </CModalHeader>
        <CModalBody>

          <CRow>
            <CCol md={6} className='my-2'>
              <CFormInput
                type="text"
                floatingLabel="Name"
                placeholder="Username"
                onChange={(e) => SetHelpData({ ...HelpData, Name: e.target.value })}
              />
            </CCol>

            <CCol md={6} className='my-2'>
              <CFormInput
                type="text"
                floatingLabel="Email ID"
                placeholder="Username"
                onChange={(e) => SetHelpData({ ...HelpData, EmailId: e.target.value })}
              />
            </CCol>

            <CCol className='my-2'>
              <CFormTextarea
                id="floatingTextarea"
                floatingLabel="Comments"
                placeholder="Leave a comment here"
                style={{ height: '200px' }}
                onChange={(e) => SetHelpData({ ...HelpData, Comments: e.target.value })}
              ></CFormTextarea>
            </CCol>
            <CCol md={12} className='text-center'>
              <CButton
                type="submit" color="primary"
                // variant="outline"
                className="px-4 "
                onClick={() => handleSubmitHelp()}
              >
                <CIcon icon={cilExitToApp} /> SUBMIT
              </CButton>
            </CCol>

          </CRow>
        </CModalBody>
      </CModal>



      <CModal
        size='lg'
        backdrop="static"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel">
        <CModalHeader> User Unlock </CModalHeader>
        <CModalBody>

          <div className="ag-theme-quartz" style={{ height: 500 }}>
            <AgGridReact
              rowData={PasswordNotficationData}
              columnDefs={colmun}
              defaultColDef={defaultColDef}
              // onGridReady={onGridReady}
              rowSelection="multiple"
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 15, 20]}
            />
          </div>

        </CModalBody>

      </CModal>

      <CHeader position="sticky" className="p-0 mb-3" ref={headerRef}>
        <CContainer className="border-bottom px-4" fluid>
          <CHeaderToggler
            onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
            style={{ marginInlineStart: '-14px' }}
          >
            <CIcon icon={cilMenu} size="xxl" />
          </CHeaderToggler>




          <CHeaderNav className="d-none d-md-flex">
            <CNavItem >
              <CFormSelect
                className={`${auth.UserStatus === 'SA' ? "d-block" : "d-none"}`}
                aria-label="Default select example"
                options={['Select Branch Name',
                  ...BranchDropDown.map(option => ({ label: option.branchName.toUpperCase(), value: option.branchid }))]}
                onChange={(e) => handleBranchChange(e.target.value)}
                disabled={loading}
                value={DefaultSelectedBrach}
              />
            </CNavItem>
          </CHeaderNav>


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


          <CHeaderNav className="ms-auto">
            <CNavItem>
              <MdNoteAdd style={{ cursor: 'pointer' }} onClick={adddoc} className={`${role !== 'admin' || auth.UserStatus === 'SA' ? "d-none" : "d-block"} fs-1 text-info`} />
            </CNavItem>
          </CHeaderNav>
          <CHeaderNav >
            <CNavItem>
              <CDropdown variant="nav-item">
                <CDropdownToggle placement="bottom-end" caret={false} className={`${role !== 'admin' || auth.UserStatus === 'SA' ? "d-none" : "d-block"} position-relative`}>
                  <FaBell className='text-primary fs-2' />
                  <CBadge color="danger"
                    className=' position-absolute rounded rounded-5 glowing-badge' style={{ top: '2px', right: '0px', display: PasswordNotficationCount !== 0 ? "block" : "none" }}>
                    {PasswordNotficationCount}
                  </CBadge>
                </CDropdownToggle>



                <CDropdownMenu className="pt-0" placement="bottom-end">
                  <CDropdownItem >
                    <li className='position-relative' onClick={() => setVisible(!visible)} > User Unlock</li>
                    <CBadge color="danger"
                      className=' position-absolute' style={{ top: '5px', right: '0px', display: PasswordNotficationCount !== 0 ? "block" : "none" }}
                    >
                      {PasswordNotficationCount}
                    </CBadge>
                  </CDropdownItem>
                  <CDropdownDivider />
                  {/* <CDropdownItem>test</CDropdownItem> */}
                </CDropdownMenu>
              </CDropdown>
            </CNavItem>
          </CHeaderNav>
          <CHeaderNav >
            <CNavItem>
              <IoHelpCircle style={{ cursor: 'pointer' }} onClick={() => setHelpvisible(!visible)} className={`${role !== 'admin' || auth.UserStatus === 'SA' ? "d-none" : "d-block"} fs-1 `} />
            </CNavItem>
          </CHeaderNav>
          <CHeaderNav>
            <li className="nav-item py-1">
              <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
            </li>
            <CDropdown variant="nav-item" placement="bottom-end">
              <CDropdownToggle caret={false}>
                {colorMode === 'dark' ? (
                  <CIcon icon={cilMoon} size="xl" />
                ) : colorMode === 'auto' ? (
                  <CIcon icon={cilContrast} size="xl" />
                ) : (
                  <CIcon icon={cilSun} size="xl" />
                )}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem
                  active={colorMode === 'light'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('light')}
                >
                  <CIcon className="me-2" icon={cilSun} size="xl" /> Light
                </CDropdownItem>
                <CDropdownItem
                  active={colorMode === 'dark'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('dark')}
                >
                  <CIcon className="me-2" icon={cilMoon} size="xl" /> Dark
                </CDropdownItem>
                <CDropdownItem
                  active={colorMode === 'auto'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('auto')}
                >
                  <CIcon className="me-2" icon={cilContrast} size="xl" /> Auto
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
            <li className="nav-item py-1">
              <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
            </li>
            <AppHeaderDropdown auth={auth} ipAddress={ipAddress} />
          </CHeaderNav>
        </CContainer>
        <CContainer className="px-4" fluid>
          <AppBreadcrumb />
        </CContainer>
      </CHeader>
    </>
  )
}

AppHeader.propTypes = {
  auth: PropTypes.any, // Replace 'any' with the appropriate type based on what 'auth' contains
  ipAddress: PropTypes.any
};

export default AppHeader
