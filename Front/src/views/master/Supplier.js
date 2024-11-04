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
const Supplier = ({ auth, ipAddress }) => {
  const [loading, setLoading] = useState(false); // Loader state
  // CustomerCode, CustomerName, Address, Pincode, DistanceinKms, State, ContactPerson, PhoneNo, MobileNo, EmailID, GST, GSTIN, CreditDays, PAN, TCS, VendorCode, Created_Date, Created_By, Modified_Date, Modified_By, BranchID
  const [SupplierRegister, setSupplierRegister] = useState({
    SupplierCode: '', SupplierName: '', Address: '', State: '',
    Category: '', ContactPerson: '', PhoneNo: '', MobileNo: '',
    EmailID: '', GSTIN: '', PAN: '', TCS: '', GSTType: '', Commodity: '',
    ISOCertified: '', ShelfLife: '', Period: '',
    PaymentTerms: '', Freight: '', Notes: '',
    Created_Date: '', Created_By: '', Modified_Date: '', Modified_By: '', BranchID: ''
  });

  const [updateSupplier, setUpdateSupplier] = useState({
    SupplierCode: '', SupplierName: '', Address: '', State: '',
    Category: '', ContactPerson: '', PhoneNo: '', MobileNo: '',
    EmailID: '', GSTIN: '', PAN: '', TCS: '', GSTType: '', Commodity: '',
    ISOCertified: '', ShelfLife: '', Period: '',
    PaymentTerms: '', Freight: '', Notes: '', 
    Created_Date: '', Created_By: '', Modified_Date: '', Modified_By: '', BranchID: '', Status: ''
  });

  const handleClear = () => {
    setSupplierRegister({
      SupplierCode: '', SupplierName: '', Address: '', State: '',
      Category: '', ContactPerson: '', PhoneNo: '', MobileNo: '',
      EmailID: '', GSTIN: '', PAN: '', TCS: '', GSTType: '', Commodity: '',
      ISOCertified: '', ShelfLife: '', Period: '',
      PaymentTerms: '', Freight: '', Notes: '',
      Created_Date: '', Created_By: '', Modified_Date: '', Modified_By: '', BranchID: ''
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
    { field: "SupplierCode", headerName: 'Supplier Code', width: '110px', editable: true },
    { field: "SupplierName", headerName: 'Supplier Name', width: '140px', editable: true },
    { field: "Address", headerName: 'Address', width: '140px', editable: true },
    { field: "State", headerName: 'State', width: '170px', editable: true },
    { field: "Category", headerName: 'Category', width: '160px', editable: true },
    { field: "ContactPerson", headerName: 'Contact Person', width: '130px', editable: true },
    { field: "PhoneNo", headerName: 'Phone No', width: '130px', editable: true },
    { field: "MobileNo", headerName: 'Mobile No', width: '130px', editable: true },
    { field: "EmailID", headerName: 'Email ID', width: '140px', editable: true },
    { field: "GSTIN", headerName: 'GSTIN', width: '110px', editable: true },
    { field: "PAN", headerName: 'PAN', width: '110px', editable: true },
    { field: "TCS", headerName: 'TCS', width: '110px', editable: true },
    { field: "GSTType", headerName: 'GST Type', width: '130px', editable: true },
    { field: "Commodity", headerName: 'Commodity', width: '130px', editable: true },
    { field: "ISOCertified", headerName: 'ISO Certified', width: '130px', editable: true },
    { field: "ShelfLife", headerName: 'Shelf Life', width: '130px', editable: true },
    { field: "Period", headerName: 'Period', width: '130px', editable: true },
    { field: "PaymentTerms", headerName: 'Payment Terms', width: '150px', editable: true },
    { field: "Freight", headerName: 'Freight', width: '150px', editable: true },
    { field: "Notes", headerName: 'Notes', width: '150px', editable: true },
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
                params.value === 'M' ? 'warning' :
                  'warning'
          }
        >
          {params.value === 'A' ? 'Active' :
            params.value === 'I' ? 'Inactive' :
              params.value === 'M' ? 'Maintenance' :
                'Unknown'}
        </CBadge>
      )
    },
    {
      field: "Approval",
      headerName: 'Approval Status',
      width: '150px',
      editable: true,
      cellRenderer: (params) => (
        <CBadge
          className='fs-6'
          color={
            params.value === 'A' ? 'success' :
              params.value === 'R' ? 'danger' :
                'warning'
          }
        >
          {params.value === 'A' ? 'Approved' :
            params.value === 'R' ? 'Pending' :
              'Unknown'}
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
            onClick={() => handleEdit(params.data.SupplierCode)}
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
        <CTooltip content="Delete">
          <CIcon
            size='xl'
            icon={cilXCircle}
            className='m-2 border-rounded'
            onClick={() => handleDelete(params.data.SupplierCode)}
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
      fileName: 'AllSupplier_Data.csv',
    };
    gridRef.current.api.exportDataAsCsv(params);
  };


  // Add Customer information
  const [duplicateData, SetduplicateData] = useState([])

  console.log(SupplierRegister);

  const handleNewSupplierRegister = async () => {
    // console.log('NewSupplierRegister:', SupplierRegister);

    if (SupplierRegister.SupplierCode === '') {
      swal({
        text: 'Please Enter Supplier Code',
        icon: 'warning'
      });
      return;
    }

    if (duplicateData.length > 0) {
      const isValidSupplierCode = duplicateData.some((item) => {
        return (
          item.SupplierCode &&
          item.SupplierCode.toLowerCase() === SupplierRegister.SupplierCode.toLowerCase()
        );
      });

      if (isValidSupplierCode) {
        swal({
          text: "This Supplier Code is Already Existing",
          icon: "warning"
        });
        return;
      }
    }

    if (SupplierRegister.SupplierName === '') {
      swal({
        text: 'Please Enter Supplier Name',
        icon: 'warning'
      });
      return;
    }
    if (SupplierRegister.Address === '') {
      swal({
        text: 'Please Enter Address',
        icon: 'warning'
      });
      return;
    }
    if (SupplierRegister.State === '') {
      swal({
        text: 'Please Enter State',
        icon: 'warning'
      });
      return;
    }
    if (SupplierRegister.ContactPerson === '') {
      swal({
        text: 'Please Enter Contact Person',
        icon: 'warning'
      });
      return;
    }
    if (SupplierRegister.PhoneNo === '') {
      swal({
        text: 'Please Enter Phone Number',
        icon: 'warning'
      });
      return;
    }
    if (SupplierRegister.MobileNo === '') {
      swal({
        text: 'Please Enter Mobile Number',
        icon: 'warning'
      });
      return;
    }
    if (SupplierRegister.EmailID === '') {
      swal({
        text: 'Please Enter Email ID',
        icon: 'warning'
      });
      return;
    }
    if (SupplierRegister.GSTIN === '') {
      swal({
        text: 'Please Enter GSTIN',
        icon: 'warning'
      });
      return;
    }
    if (SupplierRegister.PAN === '') {
      swal({
        text: 'Please Enter PAN',
        icon: 'warning'
      });
      return;
    }
    if (SupplierRegister.TCS === '') {
      swal({
        text: 'Please Enter TCS',
        icon: 'warning'
      });
      return;
    }
    if (SupplierRegister.GSTType === '') {
      swal({
        text: 'Please Enter GST Type',
        icon: 'warning'
      });
      return;
    }
    if (SupplierRegister.Commodity === '') {
      swal({
        text: 'Please Enter Commodity',
        icon: 'warning'
      });
      return;
    }
    if (SupplierRegister.ISOCertified === '') {
      swal({
        text: 'Please Enter ISO Certification Status',
        icon: 'warning'
      });
      return;
    }
    if (SupplierRegister.ShelfLife === '') {
      swal({
        text: 'Please Enter Shelf Life',
        icon: 'warning'
      });
      return;
    }
    if (SupplierRegister.Period === '') {
      swal({
        text: 'Please Enter Period',
        icon: 'warning'
      });
      return;
    }
    if (SupplierRegister.PaymentTerms === '') {
      swal({
        text: 'Please Enter Payment Terms',
        icon: 'warning'
      });
      return;
    }
    if (SupplierRegister.Freight === '') {
      swal({
        text: 'Please Enter Freight',
        icon: 'warning'
      });
      return;
    }
    if (SupplierRegister.Notes === '') {
      swal({
        text: 'Please Enter Notes',
        icon: 'warning'
      });
      return;
    }

    try {
      setLoading(true);
      const alldata = {
        ...SupplierRegister, mode: 'I', id: '', created_user: auth.empid, systemip: ipAddress, branchid: auth.branchid
      };

      const response = await axios.post(`${API_URL}/Supplier`, alldata);

      if (response.status === 200) {
        setLoading(false);
        setSupplierRegister({
          SupplierCode: '', SupplierName: '', Address: '', State: '',
          Category: '', ContactPerson: '', PhoneNo: '', MobileNo: '',
          EmailID: '', GSTIN: '', PAN: '', TCS: '', GSTType: '', Commodity: '',
          ISOCertified: '', ShelfLife: '', Period: '',
          PaymentTerms: '', Freight: '', Notes: ''
        });
        FetchGridData();
        swal({
          text: 'Supplier Registered Successfully',
          icon: 'success'
        });
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };



  const handleEdit = async (SupplierID) => {
    console.log('Edit button clicked with id:', SupplierID);

    try {
      console.error('Error in handleEdit:');
      SetEditid(SupplierID);
      const alldata = { ...updateSupplier, mode: 'E', id: SupplierID, createby: '', updateby: '', branchid: auth.branchid };

      const response = await axios.post(`${API_URL}/Supplier`, alldata);
      console.log("API Response:", response.data); // Log the response

      if (response.status === 200) {
        if (Array.isArray(response.data) && response.data.length > 0) {
          const {
            SupplierCode, SupplierName, Address, State, Category,
            ContactPerson, PhoneNo, MobileNo, EmailID, GSTIN,
            PAN, TCS, GSTType, Commodity, ISOCertified, ShelfLife,
            Period, PaymentTerms, Freight, Notes, Created_Date,
            Created_By, Modified_Date, Modified_By, BranchID
          } = response.data[0];

          console.log("Fetched Data:", {
            SupplierCode, SupplierName, Address, State, Category,
            ContactPerson, PhoneNo, MobileNo, EmailID, GSTIN,
            PAN, TCS, GSTType, Commodity, ISOCertified, ShelfLife,
            Period, PaymentTerms, Freight, Notes, Created_Date,
            Created_By, Modified_Date, Modified_By, BranchID
          });

          // Update the supplier state with new data
          setUpdateSupplier(prevState => ({
            ...prevState,
            SupplierCode, SupplierName, Address, State, Category,
            ContactPerson, PhoneNo, MobileNo, EmailID, GSTIN,
            PAN, TCS, GSTType, Commodity, ISOCertified, ShelfLife,
            Period, PaymentTerms, Freight, Notes, Created_Date,
            Created_By, Modified_Date, Modified_By, BranchID,
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


  const handleUpdateSupplier = async () => {
    // console.log('UpdateSupplier:', updateSupplier);

    if (updateSupplier.SupplierCode === '') {
      swal({
        text: 'Please Enter Supplier Code',
        icon: 'warning'
      });
      return;
    }

    if (duplicateData.length > 0) {
      const isValidSupplierCode = duplicateData.some((item) => {
        return (
          item.SupplierCode &&
          item.SupplierCode.toLowerCase() === updateSupplier.SupplierCode.toLowerCase()
        );
      });

      if (isValidSupplierCode) {
        swal({
          text: "This Supplier Code is Already Existing",
          icon: "warning"
        });
        return;
      }
    }

    if (updateSupplier.SupplierName === '') {
      swal({
        text: 'Please Enter Supplier Name',
        icon: 'warning'
      });
      return;
    }
    if (updateSupplier.Address === '') {
      swal({
        text: 'Please Enter Address',
        icon: 'warning'
      });
      return;
    }
    if (updateSupplier.State === '') {
      swal({
        text: 'Please Enter State',
        icon: 'warning'
      });
      return;
    }
    if (updateSupplier.ContactPerson === '') {
      swal({
        text: 'Please Enter Contact Person',
        icon: 'warning'
      });
      return;
    }
    if (updateSupplier.PhoneNo === '') {
      swal({
        text: 'Please Enter Phone Number',
        icon: 'warning'
      });
      return;
    }
    if (updateSupplier.MobileNo === '') {
      swal({
        text: 'Please Enter Mobile Number',
        icon: 'warning'
      });
      return;
    }
    if (updateSupplier.EmailID === '') {
      swal({
        text: 'Please Enter Email ID',
        icon: 'warning'
      });
      return;
    }
    if (updateSupplier.GSTIN === '') {
      swal({
        text: 'Please Enter GSTIN',
        icon: 'warning'
      });
      return;
    }
    if (updateSupplier.PAN === '') {
      swal({
        text: 'Please Enter PAN',
        icon: 'warning'
      });
      return;
    }
    if (updateSupplier.TCS === '') {
      swal({
        text: 'Please Enter TCS',
        icon: 'warning'
      });
      return;
    }
    if (updateSupplier.GSTType === '') {
      swal({
        text: 'Please Enter GST Type',
        icon: 'warning'
      });
      return;
    }
    if (updateSupplier.Commodity === '') {
      swal({
        text: 'Please Enter Commodity',
        icon: 'warning'
      });
      return;
    }
    if (updateSupplier.ISOCertified === '') {
      swal({
        text: 'Please Enter ISO Certification Status',
        icon: 'warning'
      });
      return;
    }
    if (updateSupplier.ShelfLife === '') {
      swal({
        text: 'Please Enter Shelf Life',
        icon: 'warning'
      });
      return;
    }
    if (updateSupplier.Period === '') {
      swal({
        text: 'Please Enter Period',
        icon: 'warning'
      });
      return;
    }
    if (updateSupplier.PaymentTerms === '') {
      swal({
        text: 'Please Enter Payment Terms',
        icon: 'warning'
      });
      return;
    }
    if (updateSupplier.Freight === '') {
      swal({
        text: 'Please Enter Freight',
        icon: 'warning'
      });
      return;
    }
    if (updateSupplier.Notes === '') {
      swal({
        text: 'Please Enter Notes',
        icon: 'warning'
      });
      return;
    }
    if (updateSupplier.Status=== '') {
      swal({
        text: 'Please Enter Status',
        icon: 'warning'
      });
      return;
    }


    try {
      setLoading(true);
      const alldata = {
        ...updateSupplier, mode: 'U', id: Editid, created_user: auth.empid, systemip: ipAddress, branchid: auth.branchid
      };

      const response = await axios.post(`${API_URL}/Supplier`, alldata);

      if (response.status === 200) {
        setLoading(false);
        setUpdateSupplier({
          SupplierCode: '', SupplierName: '', Address: '', State: '', Category: '',
          ContactPerson: '', PhoneNo: '', MobileNo: '', EmailID: '', GST: '',
          GSTIN: '', CreditDays: '', PAN: '', TCS: '', VendorCode: '', Status: ''
        });
        FetchGridData();
        swal({
          text: 'Supplier Details Updated Successfully',
          icon: 'success'
        });
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };


  const handleDelete = (Sup_ID) => {
    console.log('status change button clicked with id:', Sup_ID);
    try {
      setDeletevisible(true)
      SetEditid(Sup_ID)
    } catch (err) {
      console.log(err);
    }
  }



  const handleConfirmDelete = async () => {
    try {
      const alldata = {
        ...updateSupplier, mode: 'D', id: Editid, created_user: auth.empid, systemip: ipAddress, branchid: auth.branchid
      };

      const response = await axios.post(`${API_URL}/Supplier`, alldata);
      setDeletevisible(false);
      FetchGridData();

      if (response.status === 200) {
        swal({
          text: 'Supplier Inactivated Successfully',
          icon: 'success'
        });
      }
    } catch (err) {
      console.log(err);
    }
  };


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
    setLoading(true);
    try {
      const alldata = {
        ...SupplierRegister, mode: 'S', created_user: auth.empid, systemip: ipAddress, branchid: auth.branchid
      };
      const response = await axios.post(`${API_URL}/Supplier`, alldata);

      const formattedData = response.data.map(item => ({
        ...item,
        created_date: item.created_date ? item.created_date.split('T')[0] : ''
      }));

      SetValidationData(response.data);
      if (response.status === 200) {
        SetGridData(formattedData);
        setLoading(false);
        console.log("tabledata", formattedData);
      }

    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };


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
          <CButton color="primary" onClick={() => handleConfirmDelete()} >CONFIRM</CButton>
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
          <h3>All Supplier</h3>
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
            <h3> Edit Supplier</h3>
          </div>
          </CModalTitle>

          <CModalBody>
            <CCard className="mb-3">
              <CCardHeader className="bg-dark text-light">Edit Supplier Information</CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="supplierCode">Supplier Code<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='supplierCode'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, SupplierCode: e.target.value })}
                        value={updateSupplier.SupplierCode}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="supplierName">Supplier Name<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='supplierName'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, SupplierName: e.target.value })}
                        value={updateSupplier.SupplierName}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="address">Address<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='address'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, Address: e.target.value })}
                        value={updateSupplier.Address}
                        disabled={loading}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="state">State<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='state'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, State: e.target.value })}
                        value={updateSupplier.State}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="category">Category<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='category'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, Category: e.target.value })}
                        value={updateSupplier.Category}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="contactPerson">Contact Person<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='contactPerson'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, ContactPerson: e.target.value })}
                        value={updateSupplier.ContactPerson}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="phoneNo">Phone No<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='phoneNo'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, PhoneNo: e.target.value })}
                        value={updateSupplier.PhoneNo}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="mobileNo">Mobile No<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='mobileNo'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, MobileNo: e.target.value })}
                        value={updateSupplier.MobileNo}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="emailID">Email ID<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='emailID'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, EmailID: e.target.value })}
                        value={updateSupplier.EmailID}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="gstin">GSTIN<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='gstin'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, GSTIN: e.target.value })}
                        value={updateSupplier.GSTIN}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="pan">PAN<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='pan'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, PAN: e.target.value })}
                        value={updateSupplier.PAN}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="tcs">TCS<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='tcs'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, TCS: e.target.value })}
                        value={updateSupplier.TCS}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="gstType">GST Type<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='gstType'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, GSTType: e.target.value })}
                        value={updateSupplier.GSTType}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="commodity">Commodity<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='commodity'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, Commodity: e.target.value })}
                        value={updateSupplier.Commodity}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="isoCertified">ISO Certified<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='isoCertified'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, ISOCertified: e.target.value })}
                        value={updateSupplier.ISOCertified}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="shelfLife">Shelf Life<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='shelfLife'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, ShelfLife: e.target.value })}
                        value={updateSupplier.ShelfLife}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="period">Period<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='period'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, Period: e.target.value })}
                        value={updateSupplier.Period}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="paymentTerms">Payment Terms<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='paymentTerms'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, PaymentTerms: e.target.value })}
                        value={updateSupplier.PaymentTerms}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="freight">Freight<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='freight'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, Freight: e.target.value })}
                        value={updateSupplier.Freight}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="notes">Notes<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='notes'
                        onChange={(e) => setUpdateSupplier({ ...updateSupplier, Notes: e.target.value })}
                        value={updateSupplier.Notes}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="status">Status<span style={{ color: 'red' }}>*</span></CFormLabel>
                    <CFormSelect
                      aria-label="Default select example"

                      options={['Status',
                        ...status.map(option => ({ label: option.lable, value: option.value }))
                      ]}
                      onChange={(e) => setUpdateSupplier({ ...updateSupplier, Status: e.target.value })}
                      value={updateSupplier.Status}

                      disabled={loading} // Disable input during loading
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
              <CButton type="submit" color="success" onClick={handleUpdateSupplier}>
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
            <h3> Add Supplier</h3>
          </div>
          </CModalTitle>

          <CModalBody>
            <CCard className="mb-3">
              <CCardHeader className="bg-dark text-light">Supplier Information</CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="supplierCode">Supplier Code<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='supplierCode'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, SupplierCode: e.target.value })}
                        value={SupplierRegister.SupplierCode}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="supplierName">Supplier Name<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='supplierName'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, SupplierName: e.target.value })}
                        value={SupplierRegister.SupplierName}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="address">Address<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='address'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, Address: e.target.value })}
                        value={SupplierRegister.Address}
                        disabled={loading}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="state">State<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='state'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, State: e.target.value })}
                        value={SupplierRegister.State}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="category">Category<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='category'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, Category: e.target.value })}
                        value={SupplierRegister.Category}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="contactPerson">Contact Person<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='contactPerson'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, ContactPerson: e.target.value })}
                        value={SupplierRegister.ContactPerson}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="phoneNo">Phone No<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='phoneNo'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, PhoneNo: e.target.value })}
                        value={SupplierRegister.PhoneNo}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="mobileNo">Mobile No<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='mobileNo'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, MobileNo: e.target.value })}
                        value={SupplierRegister.MobileNo}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="emailID">Email ID<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='emailID'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, EmailID: e.target.value })}
                        value={SupplierRegister.EmailID}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="gstin">GSTIN<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='gstin'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, GSTIN: e.target.value })}
                        value={SupplierRegister.GSTIN}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="pan">PAN<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='pan'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, PAN: e.target.value })}
                        value={SupplierRegister.PAN}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="tcs">TCS<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='tcs'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, TCS: e.target.value })}
                        value={SupplierRegister.TCS}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="gstType">GST Type<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='gstType'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, GSTType: e.target.value })}
                        value={SupplierRegister.GSTType}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="commodity">Commodity<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='commodity'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, Commodity: e.target.value })}
                        value={SupplierRegister.Commodity}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="isoCertified">ISO Certified<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='isoCertified'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, ISOCertified: e.target.value })}
                        value={SupplierRegister.ISOCertified}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="shelfLife">Shelf Life<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='shelfLife'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, ShelfLife: e.target.value })}
                        value={SupplierRegister.ShelfLife}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="period">Period<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='period'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, Period: e.target.value })}
                        value={SupplierRegister.Period}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="paymentTerms">Payment Terms<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='paymentTerms'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, PaymentTerms: e.target.value })}
                        value={SupplierRegister.PaymentTerms}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="freight">Freight<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='freight'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, Freight: e.target.value })}
                        value={SupplierRegister.Freight}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                  <CCol lg={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="notes">Notes<span style={{ color: 'red' }}>*</span></CFormLabel>
                      <CFormInput
                        type="text"
                        id='notes'
                        onChange={(e) => setSupplierRegister({ ...SupplierRegister, Notes: e.target.value })}
                        value={SupplierRegister.Notes}
                        disabled={loading}
                        maxLength={50}
                      />
                    </div>
                  </CCol>
                 
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
              <CButton type="submit" color="success" onClick={() => handleNewSupplierRegister()}  >
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

Supplier.propTypes = {
  auth: PropTypes.any.isRequired,
  ipAddress: PropTypes.string,
};

export default Supplier