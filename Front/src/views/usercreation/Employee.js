import React, { useMemo, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import CIcon from '@coreui/icons-react';
import { useNavigate } from "react-router-dom";
import { cilBan, cilCloudDownload, cilCloudUpload, cilDelete, cilPencil, cilPeople, cilPlus, cilTrash, cilUserPlus, cilXCircle } from '@coreui/icons';
import DatePicker from "react-multi-date-picker"
import InputIcon from "react-multi-date-picker/components/input_icon"
import transition from "react-element-popper/animations/transition"
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CModal, CModalBody, CModalFooter, CModalTitle, CRow, CTooltip } from '@coreui/react';
import axios from 'axios';
import { API_URL } from 'src/config';
import swal from 'sweetalert';

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { SiMicrosoftexcel } from "react-icons/si";
import { GrDocumentPdf } from "react-icons/gr";
const Employee = ({ auth }) => {

  const [editvisible, setEditvisible] = useState(false)
  const [addvisible, setAddvisible] = useState(false)

  const [deletevisible, setDeletevisible] = useState(false)

  const [Editid, SetEditid] = useState(null)



  const [StatusDropDownData, SetStatusDropDownData] = useState([])

  const [DepartmentDropDownData, SetDepartmentDropDownData] = useState([])


  const [GridData, SetGridData] = useState([])

  const navigate = useNavigate();

  const addEmployee = async () => {
    FetchDepartmentDropdown()
    setAddvisible(true)

  };


  const [Userregister, SetUserregister] = useState({
    employeecode: '',
    employeename: '',
    designation: '',
    department: null,
    remarks: '',
    status: null,
  })

  const [UpdateUserregister, SetUpdateUserregister] = useState({
    employeecode: '',
    employeename: '',
    designation: '',
    department: '',
    remarks: '',
    status: '',
  })



  const colmun = [
    {
      field: "employeecode",
      headerName: 'Employee Code'
    },
    {
      field: "employeename",
      headerName: 'Employee Name'
    },
    {
      field: "desgination",
      headerName: 'Designation'
    },
    {
      field: "remarks",
      headerName: 'Remarks'
    },
    {
      field: "departmentname",
      headerName: 'Department Name'
    },
    {
      field: "Empstatus",
      headerName: 'Employee Status',
      cellRenderer: (params) => (
        <CBadge className='fs-6' color={params.value === 'A' ? 'success' : 'danger'}>
          {params.value === 'A' ? 'Active' : 'In-Active'}
        </CBadge>
      )
    },
    {
      headerName: 'Edit',
      // field: 'Edit',
      width: 75,
      filter: false,
      sortable: false,
      floatingFilter: false,
      editable: false,
      cellRenderer: (params) => (
        <CTooltip content="Edit">
          <CIcon
            size='xl'
            icon={cilPencil}
            className='m-2'
            onClick={() => handleEdit(params.data.id)}
            style={{ color: 'white', background: 'rgb(34,139,34)', borderRadius: '5px' }}
          />
        </CTooltip>
      )
    },
    {
      headerName: 'Status',
      // field: 'Delete',
      width: 83,
      filter: false,
      sortable: false,
      floatingFilter: false,
      editable: false,
      cellRenderer: (params) => (
        <CTooltip content="Inactive">
          <CIcon
            size='xl'
            icon={cilXCircle}
            className='m-2'
            onClick={() => handleDelete(params.data.id)}
            style={{ color: 'white', background: 'rgb(237,28,36)', borderRadius: '5px' }}
          />
        </CTooltip>
      )
    },
  ]



  /// dropdown Data fetching


  const FetchDepartmentDropdown = async () => {
    try {

      const alldata = { id: '', departmentname: '', createdby: '', updateby: '', branchid: auth.branchid, mode: 'S' }
      const response = await axios.post(`${API_URL}/DepartmentMaster`, alldata)

      if (response.status === 200) {
        SetDepartmentDropDownData(response.data)

        console.log(response.data);
      }

    } catch (err) {

      console.log(err);
    }
  }



  const handleEdit = async (id) => {
    try {
      setEditvisible(true)
      SetEditid(id)
      FetchDepartmentDropdown()
      const alldata = {
        ...Userregister, id: id, createdby: null, updateby: null, mood: 'E', branchid: auth.branchid
      }
      const response = await axios.post(`${API_URL}/employeemaster`, alldata)

      if (response.status === 200) {

        const { employeecode, employeename, desgination, department, remarks, Empstatus } = response.data[0]

        SetUpdateUserregister({
          employeecode: employeecode, employeename: employeename, designation: desgination,
          department: department, status: Empstatus, remarks: remarks
        })



      }
    } catch (err) {
      console.log(err);
    }
  }



  const handleDelete = (id) => {
    try {
      setDeletevisible(true)
      SetEditid(id)
    } catch (err) {
      console.log(err);
    }
  }



  const handleconfirmDelete = async () => {
    try {

      const alldata = { ...Userregister, id: Editid, createdby: null, updateby: null, mood: 'D', branchid: auth.branchid }
      const response = await axios.post(`${API_URL}/employeemaster`, alldata)

      if (response.status === 200) {
        setDeletevisible(false)
        FetchGridData()
        swal({
          text: 'Employee Inactive SuccessFully',
          icon: 'success'
        })
      }

    } catch (err) {
      console.log(err);
    }
  }


  const handleupdate = async () => {

    if (UpdateUserregister.employeecode === '') {

      swal({
        text: 'Please Enter Employee Code',
        icon: 'warning'
      })
      return
    }


    if (UpdateUserregister.employeename === '') {

      swal({
        text: 'Please Enter Employee Name',
        icon: 'warning'
      })
      return
    }

    if (UpdateUserregister.designation === '') {
      swal({
        text: 'Please Enter Desgination',
        icon: 'warning'
      })
      return
    }

    if (UpdateUserregister.department === null) {
      swal({
        text: 'Please Enter Department',
        icon: 'warning'
      })
      return
    }

    if (UpdateUserregister.remarks === '') {
      swal({
        text: 'Please Enter Remarks',
        icon: 'warning'
      })
      return
    }

    if (UpdateUserregister.status === null) {
      swal({
        text: 'Please Select Status',
        icon: 'warning'
      })
      return
    }
    try {

      const alldata = { ...UpdateUserregister, id: Editid, createdby: null, updateby: auth.empid, mood: 'U', branchid: auth.branchid }
      const response = await axios.post(`${API_URL}/employeemaster`, alldata)
      if (response.status === 200) {
        FetchGridData()
        setEditvisible(false)
        SetUpdateUserregister({ ...Userregister, employeecode: '', employeename: '', designation: '', department: '', remarks: '', status: '' })
        swal({
          text: "Employee Data Updated SuccessFullly",
          icon: "success"
        })
      }

    } catch (error) {

      console.log(error);
    }
  }

  const handlecreateEmployee = async () => {

    if (Userregister.employeecode === '') {

      swal({
        text: 'Please Enter Employee Code',
        icon: 'warning'
      })
      return
    }

    const isValidEmployeeCode = GridData.some((item) => {
      return (
        item.employeecode.toLowerCase() === Userregister.employeecode.toLowerCase()
      )
    })
    if (isValidEmployeeCode) {
      swal({
        text: "This EmployeeCode is Already Exitsing",
        icon: "warning"
      });
      return;
    }

    if (Userregister.employeename === '') {

      swal({
        text: 'Please Enter Employee Name',
        icon: 'warning'
      })
      return
    }

    const isValidEmployeeName = GridData.some((item) => {
      return (
        item.employeename.toLowerCase() === Userregister.employeename.toLowerCase()
      )
    })
    if (isValidEmployeeName) {
      swal({
        text: "This EmployeeName is Already Exitsing",
        icon: "warning"
      });
      return;
    }


    if (Userregister.designation === '') {
      swal({
        text: 'Please Enter Desgination',
        icon: 'warning'
      })
      return
    }

    if (Userregister.department === null) {
      swal({
        text: 'Please Enter Department',
        icon: 'warning'
      })
      return
    }

    if (Userregister.remarks === '') {
      swal({
        text: 'Please Enter Remarks',
        icon: 'warning'
      })
      return
    }

    if (Userregister.status === null) {
      swal({
        text: 'Please Select Status',
        icon: 'warning'
      })
      return
    }

    try {
      const alldata = { ...Userregister, id: '', createdby: auth.empid, updateby: null, mood: 'I', branchid: auth.branchid }

      const response = await axios.post(`${API_URL}/employeemaster`, alldata)
      if (response.status === 200) {
        FetchGridData()
        setAddvisible(false)
        SetUserregister({ ...Userregister, employeecode: '', employeename: '', designation: '', department: '', remarks: '', status: '' })
        swal({
          text: "Employee Created By SuccessFullly",
          icon: "success"
        })
      }
    } catch (error) {
      console.log(error);
    }
  }


  const defaultColDef = useMemo(() => ({
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    editable: true,
  }), []);


  const FetchGridData = async () => {
    try {

      const alldata = {
        ...Userregister, id: '', createdby: null, updateby: null, mood: 'G', branchid: auth.branchid
      }

      const response = await axios.post(`${API_URL}/employeemaster`, alldata)

      if (response.status === 200) {
        SetGridData(response.data)
      }

    } catch (err) {
      console.log(err);
    }

  }

  useEffect(() => {
    FetchGridData()
  }, [])


  const status = [{ lable: 'Active', value: 'A' }, { lable: 'InActive', value: 'I' }]

  const gridRef = useRef(null);
  const onExportClick = () => {
    const params = {
      fileName: 'Allemployee_Data.csv',
    };
    gridRef.current.api.exportDataAsCsv(params);
  };

  const handleexport = () => {
    console.log(GridData);

    const doc = new jsPDF({ format: 'a3' });
    const title = 'Employee Details';
    const titleX = doc.internal.pageSize.width / 2; // Centering the title horizontally
    const titleY = 15; // Setting the vertical position of the title

    // Setting font size and weight
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    doc.text(title, titleX, titleY, { align: 'center' });

    // Extracting keys from the first object to use as column headers
    const keys = Object.keys(GridData[0]);
    const data = GridData.map(obj => keys.map(key => obj[key]));

    doc.autoTable({
      head: [keys],
      body: data,
      margin: { top: 20 },
      styles: {
        theme: 'grid',
        minCellHeight: 9,
        halign: "center",
        valign: "center",
        fontSize: 10,
        overflow: 'linebreak',
        lineColor: "#000"
      },
      didDrawPage: function (data) {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        const footerText = `Printed By: ${auth.employeename}; 
        Printed On: ${new Date().toLocaleDateString()} Time: ${new Date().toLocaleTimeString()}
        Note: This document has been generated electronically and is valid without signature.`;
        // const noteText = '';

        const pageWidth = doc.internal.pageSize.width;
        const footerY = doc.internal.pageSize.height - 10; // Positioning the footer 10 units from the bottom
        doc.text(footerText, pageWidth / 2, footerY, { align: 'center' });
        // doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth / 2, footerY + 5, { align: 'left' });

        // Note
        // const noteText = 'Note: This document has been generated electronically and is valid without signature.';
        // doc.text(noteText, pageWidth / 2, footerY + 15, { align: 'center' });

      }
    });

    doc.save(`Employee_Details.pdf`);

  }


  return (

    <>
      {/* Delete Model start*/}
      <CModal
        size='sm'
        alignment="center"
        visible={deletevisible}
        onClose={() => setDeletevisible(false)}
        aria-labelledby="VerticallyCenteredExample"
      >
        <CModalTitle id="VerticallyCenteredExample" className='ms-3'>Are you sure?</CModalTitle>
        <CModalBody>
          <p>This operation can&apos;t be reverted</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeletevisible(false)}>
            CANCEL
          </CButton>
          <CButton color="primary" onClick={() => handleconfirmDelete()} >CONFIRM</CButton>
        </CModalFooter>
      </CModal>
      {/* Delete model end*/}



      <CRow className='mb-3'>
        <div className="d-flex">
          <CIcon className="me-2" size={'xxl'} icon={cilPeople} />
          <h3> All Employees</h3>
        </div>
      </CRow>
      <CRow className='d-flex mb-3'>
        <CCol className='d-flex justify-content-end'>

          <CTooltip content="Export Excel">
            <CButton type="submit" color="success" variant="outline" className='me-2' onClick={onExportClick}>
              <SiMicrosoftexcel /> EXPORT
            </CButton>
          </CTooltip>
          <CTooltip content="Export PDF">
            <CButton type="submit" color="danger" variant="outline" className='me-2' onClick={handleexport}>
              <GrDocumentPdf /> EXPORT
            </CButton>
          </CTooltip>
          <CButton type="submit" color="primary" variant="outline" onClick={addEmployee}>
            <CIcon icon={cilPlus} /> ADD
          </CButton>
        </CCol>
      </CRow>
      {/* <div style={containerStyle}> */}
      <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact
          ref={gridRef}
          rowData={GridData}
          columnDefs={colmun}
          defaultColDef={defaultColDef}
          // onGridReady={onGridReady}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 30, 40, 50]}
        />
      </div>
      {/* </div> */}



      {/* { Edit Employee modal start} */}

      <>
        <CModal
          size="lg"
          alignment="center"
          visible={editvisible}
          onClose={() => setEditvisible(false)}
          aria-labelledby="VerticallyCenteredExample"
        >
          <CModalTitle><div className="d-flex">
            <CIcon className="me-2" size={'xxl'} icon={cilPencil} />
            <h3> Edit Employee</h3>
          </div>
          </CModalTitle>

          <CModalBody >

            <CCard className="mb-3">
              <CCardHeader className="bg-dark text-light">Personal Information</CCardHeader>
              <CCardBody className='col-12'>
                <CRow>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="empid">Emp ID <span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='Emp ID'
                        placeholder="Emp ID"
                        value={UpdateUserregister.employeecode}
                        onChange={(e) => SetUpdateUserregister({ ...UpdateUserregister, employeecode: e.target.value })}

                      />
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="empname">Employee Name <span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='empname'
                        placeholder="Employee Name"
                        value={UpdateUserregister.employeename}
                        onChange={(e) => SetUpdateUserregister({ ...UpdateUserregister, employeename: e.target.value })}

                      />
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="designation">Designation <span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='designation'
                        placeholder="Designation"
                        value={UpdateUserregister.designation}
                        onChange={(e) => SetUpdateUserregister({ ...UpdateUserregister, designation: e.target.value })}

                      />
                    </div>
                  </CCol>
                  {/* <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="Email">Email  <span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="email"
                        id='Email'
                        placeholder="example@gmail.com"
                        value={UpdateUserregister.email}
                        onChange={(e) => SetUpdateUserregister({ ...UpdateUserregister, email: e.target.value })}
                      />
                    </div>
                  </CCol> */}
                  <CCol md={6}>
                    <CFormLabel htmlFor="department">Department<span style={{ color: 'red' }}>*</span></CFormLabel>
                    <CFormSelect
                      className='text-capitalize'
                      aria-label="Default select example"
                      options={['Select Department Name',
                        ...DepartmentDropDownData.map(option => ({ label: option.departmentname, value: option.departmentid }))]}
                      onChange={(e) => SetUpdateUserregister({ ...UpdateUserregister, department: e.target.value })}
                      value={UpdateUserregister.department}

                    />
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="remark">Remark </CFormLabel>
                      <CFormTextarea
                        type="textarea"
                        id='remark'
                        placeholder="Remark"
                        onChange={(e) => SetUpdateUserregister({ ...UpdateUserregister, remarks: e.target.value })}
                        value={UpdateUserregister.remarks}
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
                      onChange={(e) => SetUpdateUserregister({ ...UpdateUserregister, status: e.target.value })}
                      value={UpdateUserregister.status}

                    />
                  </CCol>

                  {/* <CCol md={6}>
                    <CFormLabel htmlFor="userrole">User Role  <span style={{ color: 'red' }}>*</span></CFormLabel>
                    <CFormSelect
                      aria-label="Default select example"
                      options={['Select Role Name',
                        ...RoleDropDownData.map(option => ({ label: option.userrole, value: option.roleid }))]}
                      onChange={(e) => SetUpdateUserregister({ ...UpdateUserregister, userrole: e.target.value })}
                      value={UpdateUserregister.userrole}
                    />
                  </CCol> */}


                </CRow>
              </CCardBody>
            </CCard>
          </CModalBody>


          <CModalFooter>
            <div className='m-2 d-flex justify-content-end'>
              <CButton className="mx-2" type="clear" color="danger" onClick={() => setEditvisible(false)}>
                CANCEL
              </CButton>
              <CButton type="submit" color="success" onClick={handleupdate}>
                UPDATE
              </CButton>
            </div>
          </CModalFooter>
        </CModal>


      </>
      {/* Edit Employee modal end */}



      {/* { Add Employee modal start} */}

      <>
        <CModal
          size="lg"
          alignment="center"
          visible={addvisible}
          onClose={() => setAddvisible(false)}
          aria-labelledby="VerticallyCenteredExample"
        >
          <CModalTitle><div className="d-flex">
            <CIcon className="me-2" size={'xxl'} icon={cilUserPlus} />
            <h3> Add Employee</h3>
          </div>
          </CModalTitle>

          <CModalBody >

            <CCard className="mb-3">
              <CCardHeader className="bg-dark text-light">Personal Information</CCardHeader>
              <CCardBody className='col-12'>
                <CRow>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="empid">Emp ID <span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='Emp ID'
                        placeholder="Emp ID"
                        value={Userregister.employeecode}
                        onChange={(e) => SetUserregister({ ...Userregister, employeecode: e.target.value })}
                      // disabled
                      />
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="empname">Employee Name <span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='empname'
                        placeholder="Employee Name"
                        value={Userregister.employeename}
                        onChange={(e) => SetUserregister({ ...Userregister, employeename: e.target.value })}
                      />
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="designation">Designation <span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='designation'
                        placeholder="Designation"
                        value={Userregister.designation}
                        onChange={(e) => SetUserregister({ ...Userregister, designation: e.target.value })}
                      />
                    </div>
                  </CCol>
                  {/* <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="Email">Email  <span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="email"
                        id='Email'
                        placeholder="example@gmail.com"
                        value={UpdateUserregister.email}
                        onChange={(e) => SetUpdateUserregister({ ...UpdateUserregister, email: e.target.value })}
                      />
                    </div>
                  </CCol> */}
                  <CCol md={6}>
                    <CFormLabel htmlFor="department">Department<span style={{ color: 'red' }}>*</span></CFormLabel>
                    <CFormSelect
                      className='text-capitalize'
                      aria-label="Default select example"
                      options={['Select Department Name',
                        ...DepartmentDropDownData.map(option => ({ label: option.departmentname, value: option.departmentid }))]}
                      onChange={(e) => SetUserregister({ ...Userregister, department: e.target.value })}
                      value={Userregister.department}
                    />
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel htmlFor="status">Status  <span style={{ color: 'red' }}>*</span></CFormLabel>
                    <CFormSelect
                      aria-label="Default select example"
                      options={['Select Status Name',
                        ...status.map(option => ({ label: option.lable, value: option.value }))]}

                      onChange={(e) => SetUserregister({ ...Userregister, status: e.target.value })}
                      value={Userregister.status} />
                  </CCol>


                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="remark">Remark  </CFormLabel>
                      <CFormTextarea
                        type="textarea"
                        id='remark'
                        placeholder="Remark"
                        value={Userregister.remarks}
                        onChange={(e) => SetUserregister({ ...Userregister, remarks: e.target.value })}

                      />
                    </div>
                  </CCol>

                  {/* <CCol md={6}>
                    <CFormLabel htmlFor="userrole">User Role  <span style={{ color: 'red' }}>*</span></CFormLabel>
                    <CFormSelect
                      aria-label="Default select example"
                      options={['Select Role Name',
                        ...RoleDropDownData.map(option => ({ label: option.userrole, value: option.roleid }))]}
                      onChange={(e) => SetUpdateUserregister({ ...UpdateUserregister, userrole: e.target.value })}
                      value={UpdateUserregister.userrole}
                    />
                  </CCol> */}


                </CRow>
              </CCardBody>
            </CCard>
          </CModalBody>


          <CModalFooter>
            <div className='m-2 d-flex justify-content-end'>
              <CButton className="mx-2" type="clear" color="danger" onClick={() => setAddvisible(false)}>
                CANCEL
              </CButton>
              <CButton type="submit" color="success" onClick={handlecreateEmployee}>
                ADD
              </CButton>
            </div>
          </CModalFooter>
        </CModal>


      </>
      {/* Add Employee modal end */}

    </>



  );
};

Employee.propTypes = {
  auth: PropTypes.any.isRequired,
};

export default Employee;