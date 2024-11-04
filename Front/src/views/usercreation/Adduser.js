import React, { useState, useEffect, useRef } from "react";
import apiService from '../../apiService';
import swal from 'sweetalert';
// import DatePicker from "react-datepicker";
import DatePicker from "react-multi-date-picker"
import transition from "react-element-popper/animations/transition"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import InputIcon from "react-multi-date-picker/components/input_icon"
import { useNavigate } from "react-router-dom";
import {
  CButton,
  CFormLabel,
  CFormInput,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CFormSelect,
  CProgress,
  CProgressBar
} from '@coreui/react';

import { cilUserPlus, cilPlus, cilDelete, cilCalculator } from "@coreui/icons";
import CIcon from '@coreui/icons-react';
import axios from "axios";
import { API_URL } from "src/config";

import { RotatingLines } from 'react-loader-spinner';

import PropTypes from 'prop-types'; // Import PropTypes


const Adduser = ({ auth }) => {
  const [dojDate, setDojDate] = useState();

  const [error, setError] = useState('');

  const [ValidationData, SetValidationData] = useState([])


  const [RoleDropDownData, SetRoleDropDownData] = useState([])


  const [DepartmentDropDownData, SetDepartmentDropDownData] = useState([])

  const [loading, setLoading] = useState(false); // Loader state


  const [NewUserregister, setNewUserregister] = useState({
    employeecode: "",
    employeename: "",
    email: "",
    dateofjoin: dojDate,
    UserStatus: null,
    userrole: null,
    department: null

  })

  const handleClear = () => {
    setNewUserregister({
      employeecode: "",
      employeename: "",
      email: "",
      dateofjoin: null,
      UserStatus: "",
      userrole: "",
      department: ""
    });
  };

  console.log(NewUserregister);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };



  //// new employee create

  const handleAddemployee = async () => {



    if (NewUserregister.employeecode == '') {
      swal({
        text: "Please Enter Employeecode",
        icon: "warning",
      })

      return
    }

    const isValidEmployeeCode = ValidationData.some((item) => {
      return (
        item.employeecode.toLowerCase() === NewUserregister.employeecode.toLowerCase()
      )
    })
    if (isValidEmployeeCode) {
      swal({
        text: "This EmployeeCode is Already Exitsing",
        icon: "warning"
      });
      return;
    }

    if (NewUserregister.employeename == '') {
      swal({
        text: "Please Enter EmployeeName",
        icon: "warning",
      })

      return
    }

    // const isValidEmployeeName = ValidationData.some((item) => {
    //   return (
    //     item.employeename.toLowerCase() === NewUserregister.employeename.toLowerCase()
    //   )
    // })
    // if (isValidEmployeeName) {
    //   swal({
    //     text: "This EmployeeName is Already Exitsing",
    //     icon: "warning"
    //   });
    //   return;
    // }


    if (NewUserregister.email == '') {
      swal({
        text: "Please Enter Email ID",
        icon: "warning",
      })

      return
    }


    if (!validateEmail(NewUserregister.email)) {

      swal({
        text: "Please enter a valid email address",
        icon: 'warning'
      })

      return
    }


    const isValidEmail = ValidationData.some((item) => {
      return (
        item.email.toLowerCase() === NewUserregister.email.toLowerCase()
      )
    })
    if (isValidEmail) {
      swal({
        text: "This Email ID is Already Exitsing",
        icon: "warning"
      });
      return;
    }

    try {

      setLoading(true)

      const alldata = { ...NewUserregister, id: '', createdby: auth.empid, updateby: '', branchid: auth.branchid, mode: 'I' }

      const response = await axios.post(`${API_URL}/UserMainmasterRegister`, alldata)

      if (response.status === 200) {
        swal({
          text: `${response.data.message}`,
          icon: 'success'
        })
        setLoading(false)
        setNewUserregister({ ...NewUserregister, employeecode: '', employeename: '', email: '', UserStatus: '', userrole: '', department: '' })
      }

      if (response.status === 500) {
        setLoading(false)
        swal({
          text: `${response.data.message}`,
          icon: 'warning'
        })
        setNewUserregister({ ...NewUserregister, employeecode: '', employeename: '', email: '', UserStatus: '', userrole: '', department: '' })
      }



    } catch (err) {
      console.log(err);
      setLoading(false)
    }






  }






  /// dropdown Data fetching


  const FetchRoleDropdown = async () => {
    try {
      const alldata = { id: '', userrole: '', createdby: '', updateby: '', branchid: auth.branchid, mode: 'S' }
      const response = await axios.post(`${API_URL}/UserroleMaster`, alldata)

      if (response.status === 200) {
        SetRoleDropDownData(response.data)
      }

    } catch (err) {

      console.log(err);
    }
  }





  const FetchDepartmentDropdown = async () => {
    try {

      const alldata = { id: '', departmentname: '', createdby: '', updateby: '', branchid: auth.branchid, mode: 'S' }
      const response = await axios.post(`${API_URL}/DepartmentMaster`, alldata)

      if (response.status === 200) {
        SetDepartmentDropDownData(response.data)
      }

    } catch (err) {

      console.log(err);
    }
  }

  const ValidationFetch = async () => {
    try {

      const alldata = { id: 0, updateby: auth.empid, branchid: auth.branchid, mode: 'S' }

      const response = await axios.post(`${API_URL}/userMainMasterSelect`, alldata)

      if (response.status === 200) {
        SetValidationData(response.data)
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    FetchRoleDropdown()
    FetchDepartmentDropdown()
    ValidationFetch()
  }, [])

  const status = [{ lable: 'Active', value: 'A' }, { lable: 'InActive', value: 'I' }]
  const handleInputChange = (e) => {
    const value = e.target.value;
    // Regular expression to match special characters
    const regex = /[^a-zA-Z0-9]/g;

    if (regex.test(value)) {
      setError('Emp ID should not contain special characters');
    } else {
      setError('');
    }

    setNewUserregister({ ...NewUserregister, employeecode: value });
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
      <CRow className='mb-3'>
        <div className="d-flex">
          <CIcon className="me-2" size={'xxl'} icon={cilUserPlus} />
          <h3> Add User</h3>
        </div>
      </CRow>

      <CCard className="mb-3">
        <CCardHeader className="bg-dark text-light">Personal Information</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="empid">Emp ID  <span style={{ color: 'red' }}>*</span></CFormLabel>
                <CFormInput
                  type="text"
                  id='Emp ID'
                  placeholder="Emp ID"
                  onChange={handleInputChange}
                  value={NewUserregister.employeecode}
                  disabled={loading} // Disable input during loading
                  
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
              </div>
            </CCol>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="empname">Employee Name  <span style={{ color: 'red' }}>*</span></CFormLabel>
                <CFormInput
                  type="text"
                  id='empname'
                  placeholder="Employee Name"
                  onChange={(e) => setNewUserregister({ ...NewUserregister, employeename: e.target.value })}
                  value={NewUserregister.employeename}
                  disabled={loading} // Disable input during loading
                />
              </div>
            </CCol>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="Email">Email  <span style={{ color: 'red' }}>*</span></CFormLabel>
                <CFormInput
                  type="email"
                  id='Email'
                  placeholder="example@gmail.com"
                  onChange={(e) => setNewUserregister({ ...NewUserregister, email: e.target.value })}
                  value={NewUserregister.email}
                  disabled={loading} // Disable input during loading
                />
              </div>
            </CCol>
            <CCol md={6}>
              <CFormLabel className='me-3' htmlFor="doj">Date of Joining  <span style={{ color: 'red' }}>*</span></CFormLabel>
              <div>
                <DatePicker
                  maxDate={new Date()}
                  animations={[transition()]}
                  render={<InputIcon className="form-control" placeholder="Date of Join" />}
                  value={dojDate}
                  disabled={loading} // Disable input during loading
                  onChange={(date) => {
                    const formattedDate = date.format('YYYY/MM/DD')
                    setNewUserregister({ ...NewUserregister, dateofjoin: formattedDate })
                    console.log(formattedDate)
                  }}
                />
              </div>
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="status">Status  <span style={{ color: 'red' }}>*</span></CFormLabel>
              <CFormSelect
                aria-label="Default select example"
                options={['Status',
                  ...status.map(option => ({ label: option.lable, value: option.value }))
                ]}
                onChange={(e) => setNewUserregister({ ...NewUserregister, UserStatus: e.target.value })}
                value={NewUserregister.UserStatus}
                disabled={loading} // Disable input during loading
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="userrole">User Role  <span style={{ color: 'red' }}>*</span></CFormLabel>
              <CFormSelect
                aria-label="Default select example"
                options={['Select Role Name',
                  ...RoleDropDownData.map(option => ({ label: option.userrole, value: option.roleid }))]}
                onChange={(e) => setNewUserregister({ ...NewUserregister, userrole: e.target.value })}

                value={NewUserregister.userrole}

                disabled={loading} // Disable input during loading
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="department">Department<span style={{ color: 'red' }}>*</span></CFormLabel>
              <CFormSelect
              className='text-capitalize'
                aria-label="Default select example"
                options={['Select Department Name',
                  ...DepartmentDropDownData.map(option => ({ label: option.departmentname, value: option.departmentid }))]}
                onChange={(e) => setNewUserregister({ ...NewUserregister, department: e.target.value })}
                value={NewUserregister.department}

                disabled={loading} // Disable input during loading
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <div className='m-2 d-flex justify-content-end'>
        <CButton className="mx-2" type="clear" color="danger" onClick={handleClear}>
          <CIcon icon={cilDelete} /> CLEAR
        </CButton>
        <CButton type="submit" color="success" disabled={loading} onClick={handleAddemployee}>
          <CIcon icon={cilPlus} /> ADD
        </CButton>
      </div >


    </>
  )
}


Adduser.propTypes = {
  auth: PropTypes.any.isRequired,
};

export default Adduser