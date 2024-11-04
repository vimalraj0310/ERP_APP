import React, { useMemo, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import 'ag-grid-community/styles/ag-theme-alpine.css';
import CIcon from '@coreui/icons-react';
import { useNavigate } from "react-router-dom";
import { cilBan, cilCloudDownload, cilCloudUpload, cilDelete, cilPencil, cilPeople, cilPlus, cilSync, cilTrash, cilXCircle } from '@coreui/icons';
import DatePicker from "react-multi-date-picker"
import InputIcon from "react-multi-date-picker/components/input_icon"
import transition from "react-element-popper/animations/transition"
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput, CFormLabel, CFormSelect, CModal, CModalBody, CModalFooter, CModalTitle, CRow, CTooltip } from '@coreui/react';
import axios from 'axios';
import { API_URL } from 'src/config';
import swal from 'sweetalert';
import { RotatingLines } from 'react-loader-spinner';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { SiMicrosoftexcel } from "react-icons/si";
import { GrDocumentPdf } from "react-icons/gr";
const Allusers = ({ auth, ipAddress }) => {

  const [editvisible, setEditvisible] = useState(false)

  const [deletevisible, setDeletevisible] = useState(false)

  const [Uploadvisible, setUploadvisible] = useState(false)

  const [Editid, SetEditid] = useState(null)

  const [RoleDropDownData, SetRoleDropDownData] = useState([])

  const [StatusDropDownData, SetStatusDropDownData] = useState([])

  const [DepartmentDropDownData, SetDepartmentDropDownData] = useState([])

  const [loading, setLoading] = useState(false); // Loader state

  const [GridData, SetGridData] = useState([])

  const navigate = useNavigate();

  const addStaff = async () => {
    navigate("/usercreation/adduser");
  };


  const [UpdateUserregister, SetUpdateUserregister] = useState({
    id: null,
    employeecode: "",
    employeename: "",
    email: "",
    dateofjoin: '',
    UserStatus: null,
    userrole: 0,
    department: 0

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
      field: "email",
      headerName: 'Email-ID'
    },
    {
      field: "DateofJoining",
      headerName: 'Date of Joining',
      cellRenderer: (params) => (
        <>
          <p>{params.value}</p>
        </>
      )
    },

    {
      field: "userrole",
      headerName: 'User Role'
    },
    {
      field: "departmentname",
      headerName: 'Department Name'
    },

    {
      field: "UserStatus",
      headerName: 'User Status',
      cellRenderer: (params) => (
        <CBadge className='fs-6' color={params.value === 'A' ? 'success' : 'danger'}>
          {params.value === 'A' ? 'Active' : 'In-Active'}
        </CBadge>
      )
    },
    {
      // field: 'Edit',
      headerName: 'Edit',
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
            style={{ color: 'white', background: 'rgb(237,28,36)', borderRadius: '5px', display: params.data.UserStatus === 'I' ? 'none' : 'block' }}
          />
        </CTooltip>
      )
    },
    {
      headerName: 'Reset',
      // field: 'Rest Password',
      width: 75,
      filter: false,
      sortable: false,
      floatingFilter: false,
      editable: false,
      cellRenderer: (params) => (
        <CTooltip content="Password Reset">
          <CIcon
            size='xl'
            icon={cilSync}
            className='m-2'
            onClick={() => handleResetPassword(params)}
            style={{ color: 'white', background: 'blue', borderRadius: '5px', display: params.data.UserStatus === 'I' ? 'none' : 'block' }}
          />
        </CTooltip>
      )
    },
  ]



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



  const handleEdit = async (id) => {
    try {
      setEditvisible(true)
      SetEditid(id)
      FetchRoleDropdown()
      FetchDepartmentDropdown()

      const alldata = { id: id, updateby: auth.empid, branchid: auth.branchid, mode: 'E' }

      const response = await axios.post(`${API_URL}/userMainMasterSelect`, alldata)

      if (response.status === 200) {

        const { employeecode, employeename, email, DateofJoining, UserStatus, userrole, department } = response.data[0]

        SetUpdateUserregister({
          ...UpdateUserregister, id: id, employeecode: employeecode, employeename: employeename,
          email: email, dateofjoin: DateofJoining, UserStatus: UserStatus, userrole: userrole, department: department
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

    setLoading(true)
    try {

      const alldata = { id: Editid, updateby: auth.empid, branchid: auth.branchid, mode: 'D' }

      const response = await axios.post(`${API_URL}/userMainMasterSelect`, alldata)

      if (response.status === 200) {
        setDeletevisible(false)
        FetchGridData()
        setLoading(false)
        swal({
          text: 'User Inactive SuccessFully',
          icon: 'success'
        })

      }

    } catch (err) {
      console.log(err);
    }
  }



  const handleupdate = async () => {
    setLoading(true)
    try {

      const alldata = { ...UpdateUserregister, updateddby: auth.empid, mode: 'U' }

      const response = await axios.post(`${API_URL}/userMainMasterUpdate`, alldata)

      if (response.status === 200) {
        FetchGridData()
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


  const handleResetPassword = async (params) => {
    swal({
      text: 'Are You Sure Reset The Password',
      icon: 'warning',
      buttons: [true, 'Yes Reset'],
      dangerMode: true
    }).then(async (result) => {
      if (result) {
        try {

          const alldata = { id: params.data.id, employeecode: params.data.employeecode, employeename: params.data.employeename, email: params.data.email, branchid: auth.branchid }

          const response = await axios.post(`${API_URL}/ResetPassword`, alldata)

          if (response.status === 200) {
            swal({
              text: 'Password Reset SuccessFully',
              icon: 'success'
            })
          }

        } catch (error) {

          console.log(error);

        }
      }
    })

  }


  const defaultColDef = useMemo(() => ({
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    editable: true,
  }), []);


  const FetchGridData = async () => {
    try {

      const alldata = { id: 0, updateby: auth.empid, branchid: auth.branchid, mode: 'S' }

      const response = await axios.post(`${API_URL}/userMainMasterSelect`, alldata)


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
      fileName: 'Alluser_Data.csv',
    };
    gridRef.current.api.exportDataAsCsv(params);
  };

  const handleexport = () => {
    console.log(GridData);

    const doc = new jsPDF({ format: 'a3' });
    const title = 'User Details';
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

    doc.save(`User_Details.pdf`);

  }



  const [uploadxl, setuploadxl] = useState(false)


  const handleUploadExcelSheet = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileName = selectedFile.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      if (fileExtension === 'csv' || fileExtension === 'xls' || fileExtension === 'xlsx') {
        setuploadxl(selectedFile);
      } else {
        console.log('Please select a CSV or Excel file.');
        swal({
          title: 'Invalid File Format',
          html: 'Please select a valid CSV or Excel file format.<br>(Other formats are not supported)',
          icon: 'warning'
        });
        setuploadxl(false); // Reset uploadxl state
        e.target.value = null; // Clear the file input field
        return;
      }
    }
  };

  const [unuploadfillink, setunuploadfillink] = useState(false)

  const handleuploaddata = (e) => {
    if (!uploadxl) {
      swal({
        text: 'Please Select Upload File',
        icon: 'warning',
      });
      return;
    }

    swal({
      title: "Are you sure?",
      text: "Once Upload, you will and check userlist!",
      icon: "warning",
      buttons: true,
      closeOnEsc: true,
      dangerMode: false,
    }).then(async (result) => {

      setLoading(true)
      if (result) {
        try {
          const formData = new FormData();
          formData.append('file', uploadxl);
          formData.append('createdby', auth.empid)
          formData.append('systemip', ipAddress)
          formData.append('branchid', auth.branchid)
          setUploadvisible(false);

          const response = await axios.post(`${API_URL}/UserUploadData`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.status === 200) {
            setLoading(false)
            const { message, uploadcount, unuploadedFilePath } = response.data;

            if (unuploadedFilePath) {
              setunuploadfillink(true)
              FetchGridData()
              swal({
                heightAuto: true,
                title: `Total Uploaded File Count: ${uploadcount}`,
                text: "Some data could not be uploaded. Please download the file to see the errors.",
                icon: 'warning',
                buttons: {
                  cancel: "OK",
                  download: {
                    text: "Download File",
                    value: "download",
                  },
                },
              }).then((value) => {
                if (value === "download") {
                  const link = document.createElement('a');
                  link.href = `${API_URL}${unuploadedFilePath}`;
                  link.setAttribute('download', 'unuploaded_data.xlsx');
                  document.body.appendChild(link);
                  link.click();
                  link.parentNode.removeChild(link);
                }
              });
            } else {
              setUploadvisible(false);
              FetchGridData()
              swal({
                heightAuto: true,
                title: `Total Uploaded File Count: ${uploadcount}`,
                icon: 'success',
                width: '500px',
                timer: 4000,
                animation: true,
                customClass: {
                  title: 'swaltitle',
                },
              });
            }
          } else {
            swal({
              heightAuto: true,
              title: `Error: ${response.status}`,
              icon: 'error',
              width: '500px',
              timer: 4000,
              animation: true,
              customClass: {
                title: 'swaltitle',
              },
            });
          }
        } catch (err) {
          console.log(err);
          setLoading(false)
          swal({
            heightAuto: true,
            title: 'Internal Server Error',
            icon: 'error',
            width: '500px',
            timer: 4000,
            animation: true,
            customClass: {
              title: 'swaltitle',
            },
          });
        } finally {
          setUploadvisible(true);
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
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
          <h3> All Users</h3>
        </div>
      </CRow>
      <CRow className='d-flex mb-3'>
        <CCol className='d-flex justify-content-end'>

          <CButton type="submit" color="primary" variant="outline" className='me-2' onClick={() => setUploadvisible(true)}>
            {/* <CImage src={excel_icon} className='w-50 h-50 '></CImage> */}
            <CIcon icon={cilCloudDownload} /> IMPORT
          </CButton>

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
          <CButton type="submit" color="info" variant="outline" onClick={addStaff}>
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



      {/* { Edit Document modal start} */}

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
            <h3> Edit User</h3>
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
                        disabled
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
                        value={UpdateUserregister.email}
                        onChange={(e) => SetUpdateUserregister({ ...UpdateUserregister, email: e.target.value })}
                        disabled={loading} // Disable input during loading
                      />
                    </div>
                  </CCol>
                  <CCol md={6}>

                    <CFormLabel className='me-3' htmlFor="doj">Date of Joining  <span style={{ color: 'red' }}>*</span></CFormLabel>
                    <div >
                      <DatePicker
                        animations={[transition()]}
                        render={<InputIcon className="form-control" />}
                        value={new Date(UpdateUserregister.dateofjoin)}
                        disabled={loading} // Disable input during loading
                        onChange={(date) => {
                          const formattedDate = date.format('YYYY-MM-DD')
                          SetUpdateUserregister({ ...UpdateUserregister, dateofjoin: formattedDate })
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
                      onChange={(e) => SetUpdateUserregister({ ...UpdateUserregister, UserStatus: e.target.value })}
                      value={UpdateUserregister.UserStatus}
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
            </CCard>
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


      </>


      {/* Upload Modal Start*/}

      <CModal
        size='lg'
        alignment="center"
        visible={Uploadvisible}
        onClose={() => setUploadvisible(false)}
        aria-labelledby="VerticallyCenteredExample"
      >
        <CModalTitle id="VerticallyCenteredExample" className='ms-3'>Import Data</CModalTitle>
        <CModalBody>

          <div className="import-input">
            <label htmlFor="importdata" className=' form-label '>Import Data</label>
            <input type="file" className=' form-control ' onChange={handleUploadExcelSheet} />
          </div>
          <hr className='mt-2' />
          <div className="download-sample-template text-center">
            <p>Important ⚠</p>
            <span className='text-danger'>Download The Below The Template That Colum Name Based Enter The Data Then Upload here</span>
            <div>
              <a href="/UserUpload_Temp.xlsx" className=' nav-link text-decoration-underline ' download>Click to Download</a>
            </div>
          </div>

        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setUploadvisible(false)}>
            CANCEL
          </CButton>
          <CButton color="primary" onClick={() => handleuploaddata()} >Upload Data</CButton>
        </CModalFooter>
      </CModal>


      {/* Upload Modal End */}
    </>



  );
};

Allusers.propTypes = {
  auth: PropTypes.any.isRequired,
  ipAddress: PropTypes.any.isRequired
};


export default Allusers;