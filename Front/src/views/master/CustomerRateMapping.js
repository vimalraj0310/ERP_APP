import React, { useMemo, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import 'ag-grid-community/styles/ag-theme-alpine.css';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload, cilCloudUpload, cilFolderOpen, cilPencil, cilPlus, cilXCircle } from '@coreui/icons';
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput, CFormLabel, CFormSelect, CModal, CModalBody, CModalFooter, CModalTitle, CRow, CTooltip } from '@coreui/react';
import axios from 'axios';
import { API_URL } from 'src/config';
import swal from 'sweetalert';
import { RotatingLines } from 'react-loader-spinner';
// import excel_icon from '../../assets/images/excel.png'
const CustomerRateMapping = ({ auth, ipAddress }) => {
  const [loading, setLoading] = useState(false); // Loader state
  // PartNo, Description, Unit, Location, Balance, PackingStandard, HSNCode, Purchaser, MinStock, MaxStock, Category, Vendor1, V1GST, V1Rate, Vendor2, V2GST, V2Rate, Vendor3, V3GST, V3Rate, 
  const [RawMaterialRegister, SetRawMaterialRegister] = useState({
      PartNo: '', Description: '', Unit: '', Location: '', Balance: '', PackingStandard: '',
      HSNCode: '', Purchaser: '', MinStock: '', MaxStock: '', Category: '',
      Vendor1: '', V1GST: '', V1Rate: '', Vendor2: '', V2GST: '', V2Rate: '', Vendor3: '', V3GST: '', V3Rate: '',
      Status: '', Created_Date: '', Created_By: '', Modified_Date: '', Modified_By: '', BranchID: ''
  });

  const [updateRawMaterial, SetupdateRawMaterial] = useState({
      PartNo: '', Description: '', Unit: '', Location: '', Balance: '', PackingStandard: '',
      HSNCode: '', Purchaser: '', MinStock: '', MaxStock: '', Category: '',
      Vendor1: '', V1GST: '', V1Rate: '', Vendor2: '', V2GST: '', V2Rate: '', Vendor3: '', V3GST: '', V3Rate: '',
      Status: '', Created_Date: '', Created_By: '', Modified_Date: '', Modified_By: '', BranchID: ''
  });

  const handleClear = () => {
      SetRawMaterialRegister({
          PartNo: '', Description: '', Unit: '', Location: '', Balance: '', PackingStandard: '',
          HSNCode: '', Purchaser: '', MinStock: '', MaxStock: '', Category: '',
          Vendor1: '', V1GST: '', V1Rate: '', Vendor2: '', V2GST: '', V2Rate: '', Vendor3: '', V3GST: '', V3Rate: '',
          Status: '', Created_Date: '', Created_By: '', Modified_Date: '', Modified_By: '', BranchID: ''
      });
  };


  const [GridData, SetGridData] = useState([])

  const [addvisible, setaddvisible] = useState(false)

  const [editvisible, setEditvisible] = useState(false)

  const [deletevisible, setDeletevisible] = useState(false)

  const [Uploadvisible, setUploadvisible] = useState(false)

  const [Editid, SetEditid] = useState(null)

  const [ValidationData, SetValidationData] = useState([])


  const column = [
      { field: "PartNo", headerName: 'Part No', width: '110px', editable: true },
      { field: "Description", headerName: 'Description', width: '140px', editable: true },
      { field: "Unit", headerName: 'Unit', width: '140px', editable: true },
      { field: "Location", headerName: 'Location', width: '140px', editable: true },
      { field: "Balance", headerName: 'Balance', width: '140px', editable: true },
      { field: "PackingStandard", headerName: 'Packing Standard', width: '160px', editable: true },
      { field: "HSNCode", headerName: 'HSN Code', width: '170px', editable: true },
      { field: "Purchaser", headerName: 'Purchaser', width: '130px', editable: true },
      { field: "MinStock", headerName: 'Min Stock', width: '130px', editable: true },
      { field: "MaxStock", headerName: 'Max Stock', width: '130px', editable: true },
      { field: "Category", headerName: 'Category', width: '140px', editable: true },
      { field: "Vendor1", headerName: 'Vendor 1', width: '130px', editable: true },
      { field: "V1GST", headerName: 'V1 GST', width: '110px', editable: true },
      { field: "V1Rate", headerName: 'V1 Rate', width: '110px', editable: true },
      { field: "Vendor2", headerName: 'Vendor 2', width: '130px', editable: true },
      { field: "V2GST", headerName: 'V2 GST', width: '110px', editable: true },
      { field: "V2Rate", headerName: 'V2 Rate', width: '110px', editable: true },
      { field: "Vendor3", headerName: 'Vendor 3', width: '130px', editable: true },
      { field: "V3GST", headerName: 'V3 GST', width: '110px', editable: true },
      { field: "V3Rate", headerName: 'V3 Rate', width: '110px', editable: true },
      {
          field: "Status",
          headerName: 'Status',
          width: '150px',
          editable: true,
          cellRenderer: (params) => (
              <CBadge
                  className='fs-6'
                  color={
                      params.value === 'A' ? 'success' :
                          params.value === 'I' ? 'danger' :
                              params.value === 'M' ? 'warning' : 'warning'
                  }
              >
                  {params.value === 'A' ? 'Active' :
                      params.value === 'I' ? 'Inactive' :
                          params.value === 'M' ? 'Maintenance' : 'Unknown'}
              </CBadge>
          )
      },
      {
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
                      onClick={() => handleEdit(params.data.PartNo)}
                      style={{ color: 'white', background: 'rgb(34,139,34)', borderRadius: '5px' }}
                  />
              </CTooltip>
          )
      },
      {
          headerName: 'Delete',
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
                      className='m-2 border-rounded'
                      onClick={() => handleDelete(params.data.PartNo)}
                      style={{ color: 'white', background: 'rgb(237,28,36)', borderRadius: '5px', display: params.data.Status === 'I' ? 'none' : 'block' }}
                  />
              </CTooltip>
          )
      },
  ];


  const defaultColDef = useMemo(() => {
      return {
          // flex: 1,
          filter: 'agTextColumnFilter',
          floatingFilter: true,
          editable: true,
      }
  }, []);

  const status = [{ lable: 'Active', value: 'A' }, { lable: 'InActive', value: 'I' }]
  const Approval = [{ lable: 'Approved', value: 'A' }, { lable: 'Wait for Approval', value: 'R' }]
  const gridRef = useRef(null);
  const onExportClick = () => {
      const params = {
          fileName: 'Alldocument_Data.csv',
      };
      gridRef.current.api.exportDataAsCsv(params);
  };


  // Add Customer information
  const [duplicateData, SetduplicateData] = useState([])

  console.log(RawMaterialRegister);

  const handleNewRawMaterialRegister = async () => {
      // console.log('NewRawMaterialRegister:', RawMaterialRegister);

      if (RawMaterialRegister.PartNo === '') {
          swal({
              text: 'Please Enter Part No',
              icon: 'warning'
          });
          return;
      }

      if (duplicateData.length > 0) {
          const isValidPartNo = duplicateData.some((item) => {
              return (
                  item.PartNo &&
                  item.PartNo.toLowerCase() === RawMaterialRegister.PartNo.toLowerCase()
              );
          });

          if (isValidPartNo) {
              swal({
                  text: "This Part No is Already Existing",
                  icon: "warning"
              });
              return;
          }
      }

      if (RawMaterialRegister.Description === '') {
          swal({
              text: 'Please Enter Description',
              icon: 'warning'
          });
          return;
      }
      if (RawMaterialRegister.Unit === '') {
          swal({
              text: 'Please Enter Unit',
              icon: 'warning'
          });
          return;
      }
      if (RawMaterialRegister.Location === '') {
          swal({
              text: 'Please Enter Location',
              icon: 'warning'
          });
          return;
      }
      if (RawMaterialRegister.Balance === '') {
          swal({
              text: 'Please Enter Balance',
              icon: 'warning'
          });
          return;
      }
      if (RawMaterialRegister.PackingStandard === '') {
          swal({
              text: 'Please Enter Packing Standard',
              icon: 'warning'
          });
          return;
      }
      if (RawMaterialRegister.HSNCode === '') {
          swal({
              text: 'Please Enter HSN Code',
              icon: 'warning'
          });
          return;
      }
      if (RawMaterialRegister.Purchaser === '') {
          swal({
              text: 'Please Enter Purchaser',
              icon: 'warning'
          });
          return;
      }
      if (RawMaterialRegister.MinStock === '') {
          swal({
              text: 'Please Enter Min Stock',
              icon: 'warning'
          });
          return;
      }
      if (RawMaterialRegister.MaxStock === '') {
          swal({
              text: 'Please Enter Max Stock',
              icon: 'warning'
          });
          return;
      }
      if (RawMaterialRegister.Category === '') {
          swal({
              text: 'Please Enter Category',
              icon: 'warning'
          });
          return;
      }
      if (RawMaterialRegister.Vendor1 === '') {
          swal({
              text: 'Please Enter Vendor 1',
              icon: 'warning'
          });
          return;
      }
      if (RawMaterialRegister.V1GST === '') {
          swal({
              text: 'Please Enter V1 GST',
              icon: 'warning'
          });
          return;
      }
      if (RawMaterialRegister.V1Rate === '') {
          swal({
              text: 'Please Enter V1 Rate',
              icon: 'warning'
          });
          return;
      }
    

      try {
          setLoading(true);
          const alldata = {
              ...RawMaterialRegister, mode: 'I', id: '', created_user: auth.empid, systemip: ipAddress, branchid: auth.branchid
          };

          const response = await axios.post(`${API_URL}/RawMaterial`, alldata);

          if (response.status === 200) {
              setLoading(false);
              SetRawMaterialRegister({
                  PartNo: '', Description: '', Unit: '', Location: '', Balance: '', PackingStandard: '',
                  HSNCode: '', Purchaser: '', MinStock: '', MaxStock: '', Category: '',
                  Vendor1: '', V1GST: '', V1Rate: '', Vendor2: '', V2GST: '', V2Rate: '', Vendor3: '', V3GST: '', V3Rate: '',
                  Status: ''
              });
              FetchGridData();
              swal({
                  text: 'Raw Material Registered Successfully',
                  icon: 'success'
              });
          }
      } catch (err) {
          console.log(err);
          setLoading(false);
      }
  };

  const handleEdit = async (RM_ID) => {
      console.log('Edit button clicked with Part No:', RM_ID);

      try {
          console.error('Error in handleEdit:');
          SetEditid(RM_ID);
          const alldata = { ...updateRawMaterial, mode: 'E', id: RM_ID, createby: '', updateby: '', branchid: auth.branchid };

          const response = await axios.post(`${API_URL}/RawMaterial`, alldata);
          console.log("API Response:", response.data); // Log the response

          if (response.status === 200) {
              if (Array.isArray(response.data) && response.data.length > 0) {
                  const {
                      PartNo, Description, Unit, Location, Balance,
                      PackingStandard, HSNCode, Purchaser, MinStock,
                      MaxStock, Category, Vendor1, V1GST, V1Rate,
                      Vendor2, V2GST, V2Rate, Vendor3, V3GST,
                      V3Rate, Status, Created_Date
                  } = response.data[0];

                  console.log("Fetched Data:", {
                      PartNo, Description, Unit, Location, Balance,
                      PackingStandard, HSNCode, Purchaser, MinStock,
                      MaxStock, Category, Vendor1, V1GST, V1Rate,
                      Vendor2, V2GST, V2Rate, Vendor3, V3GST,
                      V3Rate, Status, Created_Date
                  });

                  // Update the raw material state with new data
                  SetupdateRawMaterial(prevState => ({
                      ...prevState,
                      PartNo, Description, Unit, Location, Balance,
                      PackingStandard, HSNCode, Purchaser, MinStock,
                      MaxStock, Category, Vendor1, V1GST, V1Rate,
                      Vendor2, V2GST, V2Rate, Vendor3, V3GST,
                      V3Rate, Status, Created_Date
                  }));
                  setEditvisible(true);
              } else {
                  console.error('No data returned from the server');
              }
          }

      } catch (err) {
          console.error('Error in handleEdit:', err);
      }
  };


  const handleUpdateRawMaterial = async () => {
      // console.log('UpdateRawMaterial:', updateRawMaterial);

      if (updateRawMaterial.PartNo === '') {
          swal({
              text: 'Please Enter Part No',
              icon: 'warning'
          });
          return;
      }

      if (duplicateData.length > 0) {
          const isValidPartNo = duplicateData.some((item) => {
              return (
                  item.PartNo &&
                  item.PartNo.toLowerCase() === updateRawMaterial.PartNo.toLowerCase()
              );
          });

          if (isValidPartNo) {
              swal({
                  text: "This Part No is Already Existing",
                  icon: "warning"
              });
              return;
          }
      }

      if (updateRawMaterial.Description === '') {
          swal({
              text: 'Please Enter Description',
              icon: 'warning'
          });
          return;
      }
      if (updateRawMaterial.Unit === '') {
          swal({
              text: 'Please Enter Unit',
              icon: 'warning'
          });
          return;
      }
      if (updateRawMaterial.Location === '') {
          swal({
              text: 'Please Enter Location',
              icon: 'warning'
          });
          return;
      }
      if (updateRawMaterial.Balance === '') {
          swal({
              text: 'Please Enter Balance',
              icon: 'warning'
          });
          return;
      }
      if (updateRawMaterial.PackingStandard === '') {
          swal({
              text: 'Please Enter Packing Standard',
              icon: 'warning'
          });
          return;
      }
      if (updateRawMaterial.HSNCode === '') {
          swal({
              text: 'Please Enter HSN Code',
              icon: 'warning'
          });
          return;
      }
      if (updateRawMaterial.Purchaser === '') {
          swal({
              text: 'Please Enter Purchaser',
              icon: 'warning'
          });
          return;
      }
      if (updateRawMaterial.MinStock === '') {
          swal({
              text: 'Please Enter Min Stock',
              icon: 'warning'
          });
          return;
      }
      if (updateRawMaterial.MaxStock === '') {
          swal({
              text: 'Please Enter Max Stock',
              icon: 'warning'
          });
          return;
      }
      if (updateRawMaterial.Category === '') {
          swal({
              text: 'Please Enter Category',
              icon: 'warning'
          });
          return;
      }
      if (updateRawMaterial.Vendor1 === '') {
          swal({
              text: 'Please Enter Vendor 1',
              icon: 'warning'
          });
          return;
      }
      if (updateRawMaterial.V1GST === '') {
          swal({
              text: 'Please Enter V1 GST',
              icon: 'warning'
          });
          return;
      }
      if (updateRawMaterial.V1Rate === '') {
          swal({
              text: 'Please Enter V1 Rate',
              icon: 'warning'
          });
          return;
      }
      if (updateRawMaterial.Status === '') {
          swal({
              text: 'Please Enter Status',
              icon: 'warning'
          });
          return;
      }

      try {
          setLoading(true);
          const alldata = {
              ...updateRawMaterial, mode: 'U', id: Editid, created_user: auth.empid, systemip: ipAddress, branchid: auth.branchid
          };

          const response = await axios.post(`${API_URL}/RawMaterial`, alldata);

          if (response.status === 200) {
              setLoading(false);
              SetupdateRawMaterial({
                  PartNo: '', Description: '', Unit: '', Location: '', Balance: '', PackingStandard: '',
                  HSNCode: '', Purchaser: '', MinStock: '', MaxStock: '', Category: '',
                  Vendor1: '', V1GST: '', V1Rate: '', Vendor2: '', V2GST: '', V2Rate: '', Vendor3: '', V3GST: '', V3Rate: '',
                  Status: ''
              });
              FetchGridData();
              swal({
                  text: 'Raw Material Details Updated Successfully',
                  icon: 'success'
              });
          }
      } catch (err) {
          console.log(err);
          setLoading(false);
      }
  };



  const handleDelete = (RM_ID) => {
      console.log('status change button clicked with id:', RM_ID);
      try {
          setDeletevisible(true)
          SetEditid(RM_ID)
      } catch (err) {
          console.log(err);
      }
  }



  const handleconfirmDelete = async () => {
      try {
          const alldata = {
              ...RawMaterialRegister, mode: 'D', id: Editid, created_user: auth.empid, systemip: ipAddress, branchid: auth.branchid
          };

          const response = await axios.post(`${API_URL}/RawMaterial`, alldata);
          setDeletevisible(false)
          FetchGridData()
          if (response.status === 200) {
              swal({
                  text: 'Customer Inactive SuccessFully',
                  icon: 'success'
              })

          }

      } catch (err) {
          console.log(err);
      }
  }

  const [showModal, setShowModal] = useState(false);

  const [currentFile, setCurrentFile] = useState(null);
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

  const [uploadxl, setuploadxl] = useState(false)

  // Fetch Grid Data


  const FetchGridData = async () => {
      setLoading(true)
      try {

          const alldata = {
              ...RawMaterialRegister, mode: 'S', created_user: auth.empid, systemip: ipAddress, branchid: auth.branchid
          };
          const response = await axios.post(`${API_URL}/RawMaterial`, alldata)
          const formattedData = response.data.map(item => ({
              ...item,
              created_date: item.created_date ? item.created_date.split('T')[0] : ''
          }));
          SetValidationData(response.data);
          if (response.status === 200) {
              SetGridData(formattedData)
              setLoading(false)
              console.log("tabledata", formattedData)
          }

      } catch (err) {
          setLoading(false)
          console.log(err);
      }

  }

  useEffect(() => {
      FetchGridData()
  }, [])

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
            <p>The Customer will be Inactive</p>
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setDeletevisible(false)}>
                CANCEL
            </CButton>
            <CButton color="primary" onClick={() => handleconfirmDelete()} >CONFIRM</CButton>
        </CModalFooter>
    </CModal>
    {/* Delete model end*/}


    {/* Upload Document view */}

    <CModal
        size='xl'
        alignment="center"
        visible={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="VerticallyCenteredExample"
    >
        {currentFile && (
            <iframe
                src={currentFile}
                width="100%"
                height="600px"
                title="Document Viewer"
            ></iframe>
        )}
    </CModal>


    <CRow className='mb-3'>
        <div className="d-flex">
            <CIcon className="me-2 text-primary" size={'xxl'} icon={cilFolderOpen} />
            <h3>All Raw Material</h3>
        </div>
    </CRow>

    <CRow className='d-flex mb-3'>
        <CCol className='d-flex justify-content-end'>
            {/* <CButton style={{ display: unuploadfillink ? 'block' : 'none' }} type="submit" href={`${API_URL}/download/unuploaded_data.xlsx`} color="danger" variant="outline" className='me-2' onClick={() => setunuploadfillink(false)}>
<CIcon icon={cilCloudUpload} />download
</CButton> */}
            <CButton type="submit" color="info" variant="outline" className='me-2' onClick={() => setUploadvisible(true)}>
                {/* <CImage src={excel_icon} className='w-50 h-50 '></CImage> */}
                <CIcon icon={cilCloudDownload} /> IMPORT
            </CButton>
            <CButton type="submit" color="danger" variant="outline" className='me-2' onClick={onExportClick}>
                <CIcon icon={cilCloudUpload} /> EXPORT
            </CButton>
            <CButton type="submit" color="success" variant="outline" onClick={() => setaddvisible(true)} >
                <CIcon icon={cilPlus} /> ADD
            </CButton>
        </CCol>
    </CRow>
    {/* <div style={containerStyle}> */}
    <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact
            rowData={GridData}
            ref={gridRef}
            columnDefs={column}
            defaultColDef={defaultColDef}
            // onGridReady={onGridReady}
            rowSelection="multiple"
            suppressExcelExport={true}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 30, 40, 50]}
        />
    </div>
    {/* </div> */}




    {/* { Edit Customer modal start} */}
    <>
        <CModal
            size='xl'
            alignment="center"
            visible={editvisible}
            onClose={() => setEditvisible(false)}
            aria-labelledby="VerticallyCenteredExample"
        >

            <CModalTitle><div className="d-flex">
                <CIcon className="me-2" size={'xxl'} icon={cilPencil} />
                <h3> Edit Raw Material</h3>
            </div>
            </CModalTitle>

            <CModalBody>
                <CCard className="mb-3">
                    <CCardHeader className="bg-dark text-light">Edit Raw Material Information</CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="partno">Part No<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='partno'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, PartNo: e.target.value })}
                                        value={updateRawMaterial.PartNo}
                                        disabled={loading}
                                        maxLength={100}
                                    />
                                </div>
                            </CCol>
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="description">Description<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='description'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, Description: e.target.value })}
                                        value={updateRawMaterial.Description}
                                        disabled={loading}
                                        maxLength={500}
                                    />
                                </div>
                            </CCol>
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="unit">Unit<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='unit'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, Unit: e.target.value })}
                                        value={updateRawMaterial.Unit}
                                        disabled={loading}
                                        maxLength={50}
                                    />
                                </div>
                            </CCol>
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="location">Location<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='location'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, Location: e.target.value })}
                                        value={updateRawMaterial.Location}
                                        disabled={loading}
                                        maxLength={100}
                                    />
                                </div>
                            </CCol>
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="balance">Balance<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='balance'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, Balance: e.target.value })}
                                        value={updateRawMaterial.Balance}
                                        disabled={loading}
                                        maxLength={100}
                                    />
                                </div>
                            </CCol>
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="packingstandard">Packing Standard<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='packingstandard'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, PackingStandard: e.target.value })}
                                        value={updateRawMaterial.PackingStandard}
                                        disabled={loading}
                                        maxLength={100}
                                    />
                                </div>
                            </CCol>
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="hsncode">HSN Code<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='hsncode'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, HSNCode: e.target.value })}
                                        value={updateRawMaterial.HSNCode}
                                        disabled={loading}
                                        maxLength={100}
                                    />
                                </div>
                            </CCol>
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="purchaser">Purchaser<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='purchaser'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, Purchaser: e.target.value })}
                                        value={updateRawMaterial.Purchaser}
                                        disabled={loading}
                                        maxLength={100}
                                    />
                                </div>
                            </CCol>
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="minstock">Min Stock<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='minstock'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, MinStock: e.target.value })}
                                        value={updateRawMaterial.MinStock}
                                        disabled={loading}
                                        maxLength={100}
                                    />
                                </div>
                            </CCol>
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="maxstock">Max Stock<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='maxstock'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, MaxStock: e.target.value })}
                                        value={updateRawMaterial.MaxStock}
                                        disabled={loading}
                                        maxLength={100}
                                    />
                                </div>
                            </CCol>
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="category">Category<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='category'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, Category: e.target.value })}
                                        value={updateRawMaterial.Category}
                                        disabled={loading}
                                        maxLength={100}
                                    />
                                </div>
                            </CCol>
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="vendor1">Vendor 1<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='vendor1'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, Vendor1: e.target.value })}
                                        value={updateRawMaterial.Vendor1}
                                        disabled={loading}
                                        maxLength={100}
                                    />
                                </div>
                            </CCol>
                            {/* Repeat for Vendor 2 and Vendor 3 with corresponding state updates */}
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="v1gst">Vendor 1 GST<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='v1gst'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, V1GST: e.target.value })}
                                        value={updateRawMaterial.V1GST}
                                        disabled={loading}
                                        maxLength={100}
                                    />
                                </div>
                            </CCol>
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="v1rate">Vendor 1 Rate<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='v1rate'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, V1Rate: e.target.value })}
                                        value={updateRawMaterial.V1Rate}
                                        disabled={loading}
                                        maxLength={100}
                                    />
                                </div>
                            </CCol>
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="vendor1">Vendor 2<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='vendor1'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, Vendor2: e.target.value })}
                                        value={updateRawMaterial.Vendor2}
                                        disabled={loading}
                                        maxLength={100}
                                    />
                                </div>
                            </CCol>
                            {/* Repeat for Vendor 2 and Vendor 3 with corresponding state updates */}
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="v1gst">Vendor 2 GST<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='v1gst'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, V2GST: e.target.value })}
                                        value={updateRawMaterial.V2GST}
                                        disabled={loading}
                                        maxLength={100}
                                    />
                                </div>
                            </CCol>
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="v1rate">Vendor 2 Rate<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='v1rate'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, V2Rate: e.target.value })}
                                        value={updateRawMaterial.V2Rate}
                                        disabled={loading}
                                        maxLength={100}
                                    />
                                </div>
                            </CCol>
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="vendor1">Vendor 3<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='vendor1'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, Vendor3: e.target.value })}
                                        value={updateRawMaterial.Vendor3}
                                        disabled={loading}
                                        maxLength={100}
                                    />
                                </div>
                            </CCol>

                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="v1gst">Vendor 3 GST<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='v1gst'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, V3GST: e.target.value })}
                                        value={updateRawMaterial.V3GST}
                                        disabled={loading}
                                        maxLength={100}
                                    />
                                </div>
                            </CCol>
                            <CCol lg={3}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="v1rate">Vendor 3 Rate<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='v1rate'
                                        onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, V3Rate: e.target.value })}
                                        value={updateRawMaterial.V3Rate}
                                        disabled={loading}
                                        maxLength={100}
                                    />
                                </div>
                            </CCol>

                            <CCol md={3}>
                                <CFormLabel htmlFor="status">Status<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormSelect
                                    aria-label="Default select example"
                                    options={[
                                        'Status',
                                        ...status.map(option => ({ label: option.label, value: option.value }))
                                    ]}
                                    onChange={(e) => SetupdateRawMaterial({ ...updateRawMaterial, Status: e.target.value })}
                                    value={updateRawMaterial.Status}
                                    disabled={loading}
                                />
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
            </CModalBody>


            <CModalFooter>
                <div className='m-2 d-flex justify-content-end'>
                    <CButton className="mx-2" type="clear" color="danger" onClick={() => setEditvisible(false)}>
                        CANCEL
                    </CButton>
                    <CButton type="submit" color="success" onClick={handleUpdateRawMaterial}>
                        UPDATE
                    </CButton>
                </div>
            </CModalFooter>


        </CModal>


    </>
    {/* { Edit Customer Modal end} */}

    {/* { Add Customer modal start} */}
    <>
        <CModal
            size='xl'
            alignment="center"
            visible={addvisible}
            onClose={() => setaddvisible(false)}
            aria-labelledby="VerticallyCenteredExample"
        >

            <CModalTitle><div className="d-flex">
                <CIcon className="me-2" size={'xxl'} icon={cilPencil} />
                <h3> Add Raw Material</h3>
            </div>
            </CModalTitle>

            <CModalBody>
                <CCard className="mb-3">
                    <CCardHeader className="bg-dark text-light">Raw Material Information</CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol lg={3}>
                                <CFormLabel htmlFor="partno">Part No<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="text"
                                    id='partno'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, PartNo: e.target.value })}
                                    value={RawMaterialRegister.PartNo}
                                    disabled={loading}
                                    maxLength={100}
                                />
                            </CCol>

                            <CCol lg={3}>
                                <CFormLabel htmlFor="description">Description<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="text"
                                    id='description'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, Description: e.target.value })}
                                    value={RawMaterialRegister.Description}
                                    disabled={loading}
                                    maxLength={100}
                                />
                            </CCol>

                            <CCol lg={3}>
                                <CFormLabel htmlFor="unit">Unit<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="number"
                                    id='unit'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, Unit: e.target.value })}
                                    value={RawMaterialRegister.Unit}
                                    disabled={loading}
                                    maxLength={50}
                                />
                            </CCol>

                            <CCol lg={3}>
                                <CFormLabel htmlFor="location">Location<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="text"
                                    id='location'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, Location: e.target.value })}
                                    value={RawMaterialRegister.Location}
                                    disabled={loading}
                                    maxLength={100}
                                />
                            </CCol>

                            <CCol lg={3}>
                                <CFormLabel htmlFor="balance">Balance<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="number"
                                    id='balance'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, Balance: e.target.value })}
                                    value={RawMaterialRegister.Balance}
                                    disabled={loading}
                                />
                            </CCol>

                            <CCol lg={3}>
                                <CFormLabel htmlFor="packingStandard">Packing Standard<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="text"
                                    id='packingStandard'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, PackingStandard: e.target.value })}
                                    value={RawMaterialRegister.PackingStandard}
                                    disabled={loading}
                                    maxLength={100}
                                />
                            </CCol>

                            <CCol lg={3}>
                                <CFormLabel htmlFor="hsncode">HSN Code<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="text"
                                    id='hsncode'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, HSNCode: e.target.value })}
                                    value={RawMaterialRegister.HSNCode}
                                    disabled={loading}
                                    maxLength={50}
                                />
                            </CCol>

                            <CCol lg={3}>
                                <CFormLabel htmlFor="purchaser">Purchaser<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="text"
                                    id='purchaser'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, Purchaser: e.target.value })}
                                    value={RawMaterialRegister.Purchaser}
                                    disabled={loading}
                                    maxLength={100}
                                />
                            </CCol>

                            <CCol lg={3}>
                                <CFormLabel htmlFor="minStock">Min Stock<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="number"
                                    id='minStock'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, MinStock: e.target.value })}
                                    value={RawMaterialRegister.MinStock}
                                    disabled={loading}
                                />
                            </CCol>

                            <CCol lg={3}>
                                <CFormLabel htmlFor="maxStock">Max Stock<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="number"
                                    id='maxStock'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, MaxStock: e.target.value })}
                                    value={RawMaterialRegister.MaxStock}
                                    disabled={loading}
                                />
                            </CCol>
                            <CCol lg={3}>
                                <CFormLabel htmlFor="category">Category<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="text"
                                    id='category'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, Category: e.target.value })}
                                    value={RawMaterialRegister.Category}
                                    disabled={loading}
                                    maxLength={100}
                                />
                            </CCol>
                            <CCol lg={3}>
                                <CFormLabel htmlFor="vendor2">Vendor 1<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="text"
                                    id='vendor2'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, Vendor1: e.target.value })}
                                    value={RawMaterialRegister.Vendor1}
                                    disabled={loading}
                                    maxLength={100}
                                />
                            </CCol>

                            <CCol lg={3}>
                                <CFormLabel htmlFor="v2gst">Vendor 1 GST<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="text"
                                    id='v2gst'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, V1GST: e.target.value })}
                                    value={RawMaterialRegister.V1GST}
                                    disabled={loading}
                                    maxLength={100}
                                />
                            </CCol>

                            <CCol lg={3}>
                                <CFormLabel htmlFor="v2rate">Vendor 1 Rate<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="number"
                                    id='v2rate'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, V1Rate: e.target.value })}
                                    value={RawMaterialRegister.V1Rate}
                                    disabled={loading}
                                    maxLength={100}
                                />
                            </CCol>

                            <CCol lg={3}>
                                <CFormLabel htmlFor="vendor2">Vendor 2<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="text"
                                    id='vendor2'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, Vendor2: e.target.value })}
                                    value={RawMaterialRegister.Vendor2}
                                    disabled={loading}
                                    maxLength={100}
                                />
                            </CCol>

                            <CCol lg={3}>
                                <CFormLabel htmlFor="v2gst">Vendor 2 GST<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="text"
                                    id='v2gst'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, V2GST: e.target.value })}
                                    value={RawMaterialRegister.V2GST}
                                    disabled={loading}
                                    maxLength={100}
                                />
                            </CCol>

                            <CCol lg={3}>
                                <CFormLabel htmlFor="v2rate">Vendor 2 Rate<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="number"
                                    id='v2rate'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, V2Rate: e.target.value })}
                                    value={RawMaterialRegister.V2Rate}
                                    disabled={loading}
                                    maxLength={100}
                                />
                            </CCol>

                            <CCol lg={3}>
                                <CFormLabel htmlFor="vendor3">Vendor 3<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="text"
                                    id='vendor3'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, Vendor3: e.target.value })}
                                    value={RawMaterialRegister.Vendor3}
                                    disabled={loading}
                                    maxLength={100}
                                />
                            </CCol>

                            <CCol lg={3}>
                                <CFormLabel htmlFor="v3gst">Vendor 3 GST<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="text"
                                    id='v3gst'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, V3GST: e.target.value })}
                                    value={RawMaterialRegister.V3GST}
                                    disabled={loading}
                                    maxLength={100}
                                />
                            </CCol>

                            <CCol lg={3}>
                                <CFormLabel htmlFor="v3rate">Vendor 3 Rate<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    type="number"
                                    id='v3rate'
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, V3Rate: e.target.value })}
                                    value={RawMaterialRegister.V3Rate}
                                    disabled={loading}
                                    maxLength={100}
                                />
                            </CCol>

                            {/* <CCol lg={3}>
                                <CFormLabel htmlFor="status">Status<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormSelect
                                    aria-label="Default select example"
                                    options={[
                                        'Status',
                                        ...status.map(option => ({ label: option.label, value: option.value }))
                                    ]}
                                    onChange={(e) => SetRawMaterialRegister({ ...RawMaterialRegister, Status: e.target.value })}
                                    value={RawMaterialRegister.Status}
                                    disabled={loading}
                                />
                            </CCol> */}
                        </CRow>
                    </CCardBody>
                </CCard>
            </CModalBody>


            <CModalFooter>
                <div className='m-2 d-flex justify-content-end'>
                    <CButton className="" type="clear" color="warning" onClick={handleClear}>
                        CLEAR
                    </CButton>
                    <CButton className="mx-2" type="button" color="danger" onClick={() => setaddvisible(false)}>
                        CANCEL
                    </CButton>
                    <CButton type="submit" color="success" onClick={() => handleNewRawMaterialRegister()}  >
                        Add
                    </CButton>
                </div>
            </CModalFooter>


        </CModal>


    </>
    {/* { Add Customer Modal end} */}


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
                <span className='text-danger'>Download The Below The Template That Column Name Based Enter The Data Then Upload here</span>
                <div>
                    <a href="/PalletTempleUpload.xlsx" className=' nav-link text-decoration-underline ' download>Click to Download</a>
                </div>
            </div>

        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setUploadvisible(false)}>
                CANCEL
            </CButton>
            <CButton color="primary"  >Upload Data</CButton>
        </CModalFooter>
    </CModal>


    {/* Upload Modal End */}


</>
  )
}
CustomerRateMapping.propTypes = {
  auth: PropTypes.any.isRequired,
  ipAddress: PropTypes.string,
};
export default CustomerRateMapping