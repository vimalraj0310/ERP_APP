import { cilArrowRight, cilChartLine, cilDelete, cilMove, cilPencil, cilPlus, cilPrint, cilTrash, cilUserPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput, CFormLabel, CFormSelect, CModal, CModalBody, CModalFooter, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane, CTooltip } from '@coreui/react'
import React, { useEffect, useMemo, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";
import { API_URL } from "src/config";
import swal from 'sweetalert';
import DatePicker from "react-multi-date-picker"
import transition from "react-element-popper/animations/transition"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import InputIcon from "react-multi-date-picker/components/input_icon"
import { RotatingLines } from 'react-loader-spinner';
import PropTypes from 'prop-types'; // Import PropTypes
const Superusercreate = ({ auth }) => {

  const [activeKey, setActiveKey] = useState(1)

  const [editvisible, setEditvisible] = useState(false)

  const [GridData, SetGridData] = useState([])

  const [dojDate, setDojDate] = useState()

  const [Editid, SetEditid] = useState(null)


  const [ValidationData, SetValidationData] = useState([])

  const [RoleDropDownData, SetRoleDropDownData] = useState([])

  const [BranchDropDown, SetBranchDropDown] = useState([])

  const [DepartmentDropDownData, SetDepartmentDropDownData] = useState([])

  const [loading, setLoading] = useState(false); // Loader state

  const colmun = [
    { field: "employeecode", headerName:'Employee Code' },
    { field: "employeename",headerName:'Employee Name' },
    { field: "email",headerName:'Email-ID' },
    {
      field: "DateofJoining",headerName:'Date of Joining',
      cellRenderer: (params) => (
        <>
          <p>{new Date(params.value).toISOString().replaceAll('/', '-').slice(0, 10)}</p>
        </>
      )
    },
    { field: "userrole" ,headerName:'User Role'},
    { field: "departmentname" ,headerName:'Department Name'},
    { field: "branchName",headerName:'Branch Name' },
    {
      field: 'Edit',
      width: 100,
      floatingFilter: false,
      cellRenderer: (params) => (
        <CTooltip content="Edit">
          <CIcon
            icon={cilPencil}
            className='mx-2'
            onClick={() => {
              handleEdit(params.data.id)}}
              size='lg'
              style={{ color: 'white', background: 'green', borderRadius: '5px' }}
          />
        </CTooltip>
      )
    },
    {
      field: 'Delete',
      width: 100,
      floatingFilter: false,
      cellRenderer: (params) => (
        <CTooltip content="Delete">
          <CIcon
            icon={cilTrash}
            className='mx-2'
             size='lg'
            onClick={() => handleDelete(params.data.id)}
            style={{ color: 'white', background: 'red', borderRadius: '5px' }}
          />
        </CTooltip>
      )
    },
  ]

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    }
  }, []);


  const [NewUserregister, setNewUserregister] = useState({
    employeecode: "",
    employeename: "",
    email: "",
    dateofjoin: dojDate,
    UserStatus: 'A',
    userrole: null,
    department: null,
    Branch: auth.branchid,
  })



  const [UpdateUserregister, SetUpdateUserregister] = useState({
    id: null,
    employeecode: "",
    employeename: "",
    email: "",
    dateofjoin: dojDate,
    UserStatus: 'A',
    userrole: null,
    department: null,
    Branch: null,
  })


  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };


  const handleEdit = async (id) => {
    try {

      FetchRoleDropdown()
      FetchDepartmentDropdown()
      FetchBranchDropdown()
      SetEditid(id)

      const alldata = { id: id, updateby: auth.empid, branchid: auth.branchid, mode: 'E' }

      const response = await axios.post(`${API_URL}/userMainMasterSelect`, alldata)

      if (response.status === 200) {

        const { employeecode, employeename, email, DateofJoining, branchid, userrole, department } = response.data[0]

        SetUpdateUserregister({
          ...UpdateUserregister, id: id, employeecode: employeecode, employeename: employeename, email: email,
          dateofjoin: DateofJoining, Branch: branchid, userrole: userrole, department: department
        })

        setEditvisible(true)
      }


    } catch (error) {

      console.log(error);
    }
  }


  const handleDelete = async (id) => {

    swal({
      text: 'Are You Sure Rest The Password',
      icon: 'warning',
      buttons: [true, 'Yes Reset'],
      dangerMode: true
    }).then(async (result) => {
      if (result) {
        setLoading(true)
        try {

          const alldata = { id: id, updateby: auth.empid, branchid: auth.branchid, mode: 'D' } // updatedby as goes to delete deleted by 

          const response = await axios.post(`${API_URL}/userMainMasterSelect`, alldata)

          if (response.status === 200) {
            swal({
              text: 'Deleted User SuccessFully',
              icon: 'success'
            })
            ValidationFetch()
            setLoading(false)
          }


        } catch (error) {

          setLoading(false)

          console.log(error);
        }
      }
    })
  }

  //// new Admin create

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

    const isValidEmployeeName = ValidationData.some((item) => {
      return (
        item.employeename.toLowerCase() === NewUserregister.employeename.toLowerCase()
      )
    })
    if (isValidEmployeeName) {
      swal({
        text: "This EmployeeName is Already Exitsing",
        icon: "warning"
      });
      return;
    }


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

      const alldata = { ...NewUserregister, id: '', createdby: 0, updateby: '', branchid: NewUserregister.Branch, mode: 'I' }

      const response = await axios.post(`${API_URL}/UserMainmasterRegister`, alldata)

      if (response.status === 200) {
        swal({
          text: `${response.data.message}`,
          icon: 'success'
        })
        setLoading(false)
        setNewUserregister({ ...NewUserregister, employeecode: '', employeename: '', email: '', status: '', userrole: '', department: '' })
      }

      if (response.status === 500) {
        setLoading(false)
        swal({
          text: `${response.data.message}`,
          icon: 'warning'
        })
        setNewUserregister({ ...NewUserregister, employeecode: '', employeename: '', email: '', status: '', userrole: '', department: '' })
      }



    } catch (err) {
      console.log(err);
      setLoading(false)
    }






  }


  const handleupdate = async () => {
    setLoading(true)
    swal({
      text: 'Are You Sure Want to Update The Data',
      icon: 'warning',
      buttons: [true, 'Yes Update'],
      dangerMode: true
    }).then(async (result) => {
      if (result) {
        try {

          const alldata = { ...UpdateUserregister, updateddby: auth.empid, mode: 'U' }

          const response = await axios.post(`${API_URL}/userMainMasterUpdate`, alldata)

          if (response.status === 200) {
            ValidationFetch()
            setEditvisible(false)
            setLoading(false)
            swal({
              text: "User Data Updated SuccessFullly",
              icon: "success"
            })

          }

        } catch (error) {

          console.log(error);
        }

      }

    })
  }




  /// dropdown Data fetching

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

      const alldata = { id: 0, updateby: auth.empid, branchid: auth.branchid, mode: 'SA' }

      const response = await axios.post(`${API_URL}/userMainMasterSelect`, alldata)

      if (response.status === 200) {

        console.log(response.data);

        SetGridData(response.data)

        SetValidationData(response.data)
      }

    } catch (err) {
      console.log(err);
    }
  }


  useEffect(() => {
    FetchRoleDropdown()
    FetchBranchDropdown()
    FetchDepartmentDropdown()
    ValidationFetch()
  }, [])



  return (
    <div>
      <CModal
        size='lg'
        alignment="center"
        visible={editvisible}
        onClose={() => setEditvisible(false)}
        aria-labelledby="VerticallyCenteredExample">

        <CModalBody>
          <CCardBody>
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="empid">Emp ID  <span style={{ color: 'red' }}>*</span></CFormLabel>
                  <CFormInput
                    type="text"
                    id='Emp ID'
                    placeholder="Emp ID"
                    onChange={(e) => SetUpdateUserregister({ ...UpdateUserregister, employeecode: e.target.value })}
                    value={UpdateUserregister.employeecode}
                    disabled={loading} // Disable input during loading
                  />
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="empname">Employee Name  <span style={{ color: 'red' }}>*</span></CFormLabel>
                  <CFormInput
                    type="text"
                    id='empname'
                    placeholder="Employee Name"
                    onChange={(e) => SetUpdateUserregister({ ...UpdateUserregister, employeename: e.target.value })}
                    value={UpdateUserregister.employeename}
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
                    onChange={(e) => SetUpdateUserregister({ ...UpdateUserregister, email: e.target.value })}
                    value={UpdateUserregister.email}
                    disabled={loading} // Disable input during loading
                  />
                </div>
              </CCol>
              <CCol md={6}>
                <CFormLabel className='me-3' htmlFor="doj">Date of Joining  <span style={{ color: 'red' }}>*</span></CFormLabel>
                <div>
                  <DatePicker
                    animations={[transition()]}
                    render={<InputIcon className="form-control " placeholder="Date of Joining" />}
                    value={new Date(UpdateUserregister.dateofjoin)}
                    disabled={loading} // Disable input during loading
                    maxDate={new Date()}
                    onChange={(date) => {
                      const formattedDate = date.format('YYYY/MM/DD')
                      SetUpdateUserregister({ ...UpdateUserregister, dateofjoin: formattedDate })
                      console.log(formattedDate)
                    }}
                  />
                </div>
              </CCol>

              <CCol md={6}>
                <CFormLabel htmlFor="status">Branch  <span style={{ color: 'red' }}>*</span></CFormLabel>
                <CFormSelect
                  aria-label="Default select example"
                  options={['Select Branch Name',
                    ...BranchDropDown.map(option => ({ label: option.branchName, value: option.branchid }))]}
                  onChange={(e) => SetUpdateUserregister({ ...UpdateUserregister, Branch: e.target.value })}
                  value={UpdateUserregister.Branch}
                  disabled={loading} // Disable input during loading
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="userrole">User Role  <span style={{ color: 'red' }}>*</span></CFormLabel>
                <CFormSelect
                  aria-label="Default select example"
                  options={['Select Role Name',
                    ...RoleDropDownData.map(option => ({ label: option.userrole, value: option.roleid }))]}
                  onChange={(e) => SetUpdateUserregister({ ...UpdateUserregister, userrole: e.target.value })}
                  value={UpdateUserregister.userrole}
                  disabled={loading} // Disable input during loading
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="department">Department<span style={{ color: 'red' }}>*</span></CFormLabel>
                <CFormSelect
                  aria-label="Default select example"
                  options={['Select Department Name',
                    ...DepartmentDropDownData.map(option => ({ label: option.departmentname, value: option.departmentid }))]}
                  onChange={(e) => SetUpdateUserregister({ ...UpdateUserregister, department: e.target.value })}
                  value={UpdateUserregister.department}
                  disabled={loading} // Disable input during loading
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CModalBody>

        <CModalFooter>
          <div className='m-2 d-flex justify-content-end'>
            <CButton className="mx-2" type="clear" color="danger" disabled={loading} onClick={() => setEditvisible(false)}>
              CANCEL
            </CButton>
            <CButton type="submit" color="success" onClick={handleupdate} disabled={loading}>
              UPDATE
            </CButton>
          </div>
        </CModalFooter>

      </CModal>

      <CNav variant="tabs border-info" className='border-3 border-bottom ' role="tablist">
        <CNavItem className="label-print-nav">
          <CNavLink
            href="/#/branchmaster/userperusercreate"
            active={activeKey === 1}
            onClick={() => {
              setActiveKey(1)
            }}
          >
            Create Admin
          </CNavLink>
        </CNavItem>
        <CNavItem className="label-print-nav text-dark">
          <CNavLink
            href="/#/branchmaster/userperusercreate"
            active={activeKey === 2}
            onClick={() => {
              setActiveKey(2)
              ValidationFetch()
            }}
          >
            Admin Details
          </CNavLink>
        </CNavItem>
      </CNav>
      <CTabContent className="">
        <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 1}>
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
          <CRow className='my-3'>
            <div className="d-flex">
              <CIcon className="me-2" size={'xxl'} icon={cilUserPlus} />
              <h3> Add Admin</h3>
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
                      onChange={(e) => setNewUserregister({ ...NewUserregister, employeecode: e.target.value })}
                      value={NewUserregister.employeecode}
                      disabled={loading} // Disable input during loading
                    />
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
                      animations={[transition()]}
                      maxDate={new Date()}
                      render={<InputIcon className="form-control" placeholder="Expire Date"/>}
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

                {/* <CCol md={6}>
                  <CFormLabel htmlFor="status">Branch  <span style={{ color: 'red' }}>*</span></CFormLabel>
                  <CFormSelect
                    aria-label="Default select example"
                    options={['Select Branch Name',
                      ...BranchDropDown.map(option => ({ label: option.branchName, value: option.branchid }))]}
                    onChange={(e) => setNewUserregister({ ...NewUserregister, Branch: e.target.value })}
                    value={NewUserregister.Branch}
                    disabled={loading} // Disable input during loading
                  />
                </CCol> */}

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
            <CButton className="mx-2" type="clear" color="danger">
              <CIcon icon={cilDelete} /> CLEAR
            </CButton>
            <CButton type="submit" color="success" disabled={loading} onClick={handleAddemployee}>
              <CIcon icon={cilPlus} /> ADD
            </CButton>
          </div >
        </CTabPane>
        <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
          <div className="ag-theme-quartz mt-3 " style={{ height: 500 }}>
            <AgGridReact
              rowData={GridData}
              columnDefs={colmun}
              defaultColDef={defaultColDef}
              //onGridReady={onGridReady}
              rowSelection="multiple"
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 15, 20]}
            />
          </div>
        </CTabPane>
      </CTabContent>
    </div>
  )
}
Superusercreate.propTypes = {
  auth: PropTypes.any.isRequired,
};
export default Superusercreate