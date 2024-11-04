import React, { useMemo, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import 'ag-grid-community/styles/ag-theme-alpine.css';
import CIcon from '@coreui/icons-react';
import { useNavigate } from "react-router-dom";
import { cilBan, cilClipboard, cilCloudDownload, cilCloudUpload, cilDelete, cilFolderOpen, cilPen, cilPencil, cilPeople, cilPlus, cilTrash, cilXCircle } from '@coreui/icons';
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput, CFormLabel, CFormSelect, CFormSwitch, CFormTextarea, CImage, CModal, CModalBody, CModalFooter, CModalTitle, CRow, CTooltip } from '@coreui/react';
import axios from 'axios';
import { API_URL } from 'src/config';
import swal from 'sweetalert';
import DatePicker from 'react-multi-date-picker';
import transition from "react-element-popper/animations/transition"
import InputIcon from "react-multi-date-picker/components/input_icon"
import { RotatingLines } from 'react-loader-spinner';
// import excel_icon from '../../assets/images/excel.png'
const Customer = ({ auth, ipAddress }) => {
    const [loading, setLoading] = useState(false); // Loader state
    // CustomerCode, CustomerName, Address, Pincode, DistanceinKms, State, ContactPerson, PhoneNo, MobileNo, EmailID, GST, GSTIN, CreditDays, PAN, TCS, VendorCode, Created_Date, Created_By, Modified_Date, Modified_By, BranchID
    const [CustomerRegister, SetCustomerRegister] = useState({
        CustomerCode: '', CustomerName: '', Address: '', Pincode: '', DistanceinKms: '',
        State: '', ContactPerson: '', PhoneNo: '', MobileNo: '', EmailID: '', GST: '', GSTIN: '', CreditDays: '', PAN: '', TCS: '',
        VendorCode: '', Created_Date: '', Created_By: '', Modified_Date: '', Modified_By: '', BranchID: ''
    });
    const [updateCustomer, SetupdateCustomer] = useState({
        CustomerCode: '', CustomerName: '', Address: '', Pincode: '', DistanceinKms: '',
        State: '', ContactPerson: '', PhoneNo: '', MobileNo: '', EmailID: '', GST: '', GSTIN: '', CreditDays: '', PAN: '', TCS: '',
        VendorCode: '', Created_Date: '', Created_By: '', Modified_Date: '', Modified_By: '', BranchID: '', Status: '',
    });

    const handleClear = () => {
        SetCustomerRegister({
            CustomerCode: '', CustomerName: '', Address: '', Pincode: '', DistanceinKms: '',
            State: '', ContactPerson: '', PhoneNo: '', MobileNo: '', EmailID: '', GST: '', GSTIN: '', CreditDays: '', PAN: '', TCS: '',
            VendorCode: '', Created_Date: '', Created_By: '', Modified_Date: '', Modified_By: '', BranchID: ''
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
        { field: "CustomerCode", headerName: 'Customer Code', width: '110px', editable: true, },
        { field: "CustomerName", headerName: 'Customer Name', width: '140px', editable: true, },
        { field: "Address", headerName: 'Address', width: '140px', editable: true, },
        { field: "Pincode", headerName: 'Pincode', width: '140px', editable: true, },
        { field: "DistanceinKms", headerName: 'Distance (Kms)', width: '160px', editable: true, },
        { field: "State", headerName: 'State', width: '170px', editable: true, },
        { field: "ContactPerson", headerName: 'Contact Person', width: '130px', editable: true, },
        { field: "PhoneNo", headerName: 'Phone No', width: '130px', editable: true, },
        { field: "MobileNo", headerName: 'Mobile No', width: '130px', editable: true, },
        { field: "EmailID", headerName: 'Email ID', width: '140px', editable: true, },
        { field: "GST", headerName: 'GST', width: '110px', editable: true, },
        { field: "GSTIN", headerName: 'GSTIN', width: '110px', editable: true, },
        { field: "CreditDays", headerName: 'Credit Days', width: '130px', editable: true, },
        { field: "PAN", headerName: 'PAN', width: '110px', editable: true, },
        { field: "TCS", headerName: 'TCS', width: '110px', editable: true, },
        { field: "VendorCode", headerName: 'Vendor Code', width: '130px', editable: true, },
        { field: "Created_Date", headerName: 'Created Date', width: '150px', editable: true, },
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
                                params.value === 'M' ? 'warning' : // Change to 'warning' if it's maintenance
                                    'warning' // Default case if value is not recognized
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
                        onClick={() => handleEdit(params.data.Cus_ID)}
                        style={{ color: 'white', background: 'rgb(34,139,34)', borderRadius: '5px' }}
                    />
                </CTooltip>
            )
            // cellRenderer: cellRenderer,
        },
        {
            headerName: 'Status',
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
                        onClick={() => handleDelete(params.data.Cus_ID)}
                        style={{ color: 'white', background: 'rgb(237,28,36)', borderRadius: '5px', display: params.data.CusStatus === 'I' ? 'none' : 'block' }}
                    />
                </CTooltip>
            )
        },
    ]

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

    console.log(CustomerRegister);

    const handleNewCustomerRegister = async () => {
        // console.log('NewCustomerRegister:', CustomerRegister);

        if (CustomerRegister.CustomerCode === '') {
            swal({
                text: 'Please Enter Customer Code',
                icon: 'warning'
            });

            return;
        }

        if (duplicateData.length > 0) {
            // const isValidEmail = duplicateData.some((item) => {
            //     return (
            //         item.EmailID &&
            //         item.EmailID.toLowerCase() === CustomerRegister.EmailID.toLowerCase()
            //     );
            // });

            // if (isValidEmail) {
            //     swal({
            //         text: "This Email ID is Already Existing",
            //         icon: "warning"
            //     });
            //     return;
            // }

            const isValidCustomerCode = duplicateData.some((item) => {
                return (
                    item.CustomerCode &&
                    item.CustomerCode.toLowerCase() === CustomerRegister.CustomerCode.toLowerCase()
                );
            });

            if (isValidCustomerCode) {
                swal({
                    text: "This Customer Code is Already Existing",
                    icon: "warning"
                });
                return;
            }
        }

        if (CustomerRegister.CustomerName === '') {
            swal({
                text: 'Please Enter Customer Name',
                icon: 'warning'
            });
            return;
        }
        if (CustomerRegister.Address === '') {
            swal({
                text: 'Please Enter Address',
                icon: 'warning'
            });
            return;
        }
        if (CustomerRegister.Pincode === '') {
            swal({
                text: 'Please Enter Pincode',
                icon: 'warning'
            });
            return;
        }
        if (CustomerRegister.DistanceinKms === '') {
            swal({
                text: 'Please Enter Distance in Kms',
                icon: 'warning'
            });
            return;
        }
        if (CustomerRegister.State === '') {
            swal({
                text: 'Please Enter State',
                icon: 'warning'
            });
            return;
        }
        if (CustomerRegister.ContactPerson === '') {
            swal({
                text: 'Please Enter Contact Person',
                icon: 'warning'
            });
            return;
        }
        if (CustomerRegister.PhoneNo === '') {
            swal({
                text: 'Please Enter Phone Number',
                icon: 'warning'
            });
            return;
        }
        if (CustomerRegister.MobileNo === '') {
            swal({
                text: 'Please Enter Mobile Number',
                icon: 'warning'
            });
            return;
        }
        if (CustomerRegister.EmailID === '') {
            swal({
                text: 'Please Enter Email ID',
                icon: 'warning'
            });
            return;
        }
        if (CustomerRegister.GST === '') {
            swal({
                text: 'Please Enter GST',
                icon: 'warning'
            });
            return;
        }
        if (CustomerRegister.GSTIN === '') {
            swal({
                text: 'Please Enter GSTIN',
                icon: 'warning'
            });
            return;
        }
        if (CustomerRegister.CreditDays === '') {
            swal({
                text: 'Please Enter Credit Days',
                icon: 'warning'
            });
            return;
        }
        if (CustomerRegister.PAN === '') {
            swal({
                text: 'Please Enter PAN',
                icon: 'warning'
            });
            return;
        }
        if (CustomerRegister.TCS === '') {
            swal({
                text: 'Please Enter TCS',
                icon: 'warning'
            });
            return;
        }
        if (CustomerRegister.VendorCode === '') {
            swal({
                text: 'Please Enter Vendor Code',
                icon: 'warning'
            });
            return;
        }

        try {
            setLoading(true);
            const alldata = {
                ...CustomerRegister, mode: 'I', id: '', created_user: auth.empid, systemip: ipAddress, branchid: auth.branchid
            };

            const response = await axios.post(`${API_URL}/Customer`, alldata);

            if (response.status === 200) {
                setLoading(false);
                SetCustomerRegister({
                    CustomerCode: '', CustomerName: '', Address: '', Pincode: '', DistanceinKms: '',
                    State: '', ContactPerson: '', PhoneNo: '', MobileNo: '', EmailID: '', GST: '', GSTIN: '', CreditDays: '', PAN: '', TCS: '',
                    VendorCode: ''
                });
                FetchGridData()
                swal({
                    text: 'Customer Registered Successfully',
                    icon: 'success'
                });
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };



    const handleEdit = async (Cus_ID) => {
        console.log('Edit button clicked with id:', Cus_ID);

        try {
            console.error('Error in handleEdit:');
            SetEditid(Cus_ID);
            const alldata = { ...updateCustomer, mode: 'E', id: Editid, createby: '', updateby: '', branchid: auth.branchid };

            const response = await axios.post(`${API_URL}/Customer`, alldata);
            console.log("API Response:", response.data); // Log the response

            if (response.status === 200) {
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const {
                        CustomerCode, CustomerName, Address, Pincode, DistanceinKms,
                        State, ContactPerson, PhoneNo, MobileNo, EmailID, GST,
                        GSTIN, CreditDays, PAN, TCS, VendorCode, Created_Date, Status,
                        Created_By, Modified_Date, Modified_By, BranchID
                    } = response.data[0];

                    console.log("Fetched Data:", {
                        CustomerCode, CustomerName, Address, Pincode, DistanceinKms,
                        State, ContactPerson, PhoneNo, MobileNo, EmailID, GST,
                        GSTIN, CreditDays, PAN, TCS, VendorCode, Created_Date, Status,
                        Created_By, Modified_Date, Modified_By, BranchID
                    });

                    // Update the customer state with new data
                    SetupdateCustomer(prevState => ({
                        ...prevState,
                        CustomerCode, CustomerName, Address, Pincode, DistanceinKms,
                        State, ContactPerson, PhoneNo, MobileNo, EmailID, GST,
                        GSTIN, CreditDays, PAN, TCS, VendorCode, Created_Date, Status,
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

    const handleUpdateCustomer = async () => {
        // console.log('NewCustomerRegister:', CustomerRegister);

        if (updateCustomer.CustomerCode === '') {
            swal({
                text: 'Please Enter Customer Code',
                icon: 'warning'
            });

            return;
        }

        if (duplicateData.length > 0) {
            // const isValidEmail = duplicateData.some((item) => {
            //     return (
            //         item.EmailID &&
            //         item.EmailID.toLowerCase() === CustomerRegister.EmailID.toLowerCase()
            //     );
            // });

            // if (isValidEmail) {
            //     swal({
            //         text: "This Email ID is Already Existing",
            //         icon: "warning"
            //     });
            //     return;
            // }

            const isValidCustomerCode = duplicateData.some((item) => {
                return (
                    item.CustomerCode &&
                    item.CustomerCode.toLowerCase() === updateCustomer.CustomerCode.toLowerCase()
                );
            });

            if (isValidCustomerCode) {
                swal({
                    text: "This Customer Code is Already Existing",
                    icon: "warning"
                });
                return;
            }
        }

        if (updateCustomer.CustomerName === '') {
            swal({
                text: 'Please Enter Customer Name',
                icon: 'warning'
            });
            return;
        }
        if (updateCustomer.Address === '') {
            swal({
                text: 'Please Enter Address',
                icon: 'warning'
            });
            return;
        }
        if (updateCustomer.Pincode === '') {
            swal({
                text: 'Please Enter Pincode',
                icon: 'warning'
            });
            return;
        }
        if (updateCustomer.DistanceinKms === '') {
            swal({
                text: 'Please Enter Distance in Kms',
                icon: 'warning'
            });
            return;
        }
        if (updateCustomer.State === '') {
            swal({
                text: 'Please Enter State',
                icon: 'warning'
            });
            return;
        }
        if (updateCustomer.ContactPerson === '') {
            swal({
                text: 'Please Enter Contact Person',
                icon: 'warning'
            });
            return;
        }
        if (updateCustomer.PhoneNo === '') {
            swal({
                text: 'Please Enter Phone Number',
                icon: 'warning'
            });
            return;
        }
        if (updateCustomer.MobileNo === '') {
            swal({
                text: 'Please Enter Mobile Number',
                icon: 'warning'
            });
            return;
        }
        if (updateCustomer.EmailID === '') {
            swal({
                text: 'Please Enter Email ID',
                icon: 'warning'
            });
            return;
        }
        if (updateCustomer.GST === '') {
            swal({
                text: 'Please Enter GST',
                icon: 'warning'
            });
            return;
        }
        if (updateCustomer.GSTIN === '') {
            swal({
                text: 'Please Enter GSTIN',
                icon: 'warning'
            });
            return;
        }
        if (updateCustomer.CreditDays === '') {
            swal({
                text: 'Please Enter Credit Days',
                icon: 'warning'
            });
            return;
        }
        if (updateCustomer.PAN === '') {
            swal({
                text: 'Please Enter PAN',
                icon: 'warning'
            });
            return;
        }
        if (updateCustomer.TCS === '') {
            swal({
                text: 'Please Enter TCS',
                icon: 'warning'
            });
            return;
        }
        if (updateCustomer.VendorCode === '') {
            swal({
                text: 'Please Enter Vendor Code',
                icon: 'warning'
            });
            return;
        }
        if (updateCustomer.Status === '') {
            swal({
                text: 'Please Enter Vendor Status',
                icon: 'warning'
            });
            return;
        }

        try {
            setLoading(true);
            const alldata = {
                ...updateCustomer, mode: 'U', id: Editid, created_user: auth.empid, systemip: ipAddress, branchid: auth.branchid
            };

            const response = await axios.post(`${API_URL}/Customer`, alldata);

            if (response.status === 200) {
                setLoading(false);
                SetupdateCustomer({
                    CustomerCode: '', CustomerName: '', Address: '', Pincode: '', DistanceinKms: '',
                    State: '', ContactPerson: '', PhoneNo: '', MobileNo: '', EmailID: '', GST: '', GSTIN: '', CreditDays: '', PAN: '', TCS: '',
                    VendorCode: '', Status: ''
                });
                FetchGridData()
                swal({
                    text: 'Customer Details Updated Successfully',
                    icon: 'success'
                });
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };


    const handleDelete = (Cus_ID) => {
        console.log('status change button clicked with id:', Cus_ID);
        try {
            setDeletevisible(true)
            SetEditid(Cus_ID)
        } catch (err) {
            console.log(err);
        }
    }



    const handleconfirmDelete = async () => {
        try {
            const alldata = {
                ...updateCustomer, mode: 'D', id: Editid, created_user: auth.empid, systemip: ipAddress, branchid: auth.branchid
            };

            const response = await axios.post(`${API_URL}/Customer`, alldata);
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
                ...CustomerRegister, mode: 'S', created_user: auth.empid, systemip: ipAddress, branchid: auth.branchid
            };
            const response = await axios.post(`${API_URL}/Customer`, alldata)
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
                    <h3>All Customer</h3>
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
                        <h3> Edit Customer</h3>
                    </div>
                    </CModalTitle>

                    <CModalBody>
                        <CCard className="mb-3">
                            <CCardHeader className="bg-dark text-light">Edit Customer Information</CCardHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Customer Code<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetupdateCustomer({ ...updateCustomer, CustomerCode: e.target.value })}
                                                value={updateCustomer.CustomerCode}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Customer Name<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetupdateCustomer({ ...updateCustomer, CustomerName: e.target.value })}
                                                value={updateCustomer.CustomerName}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Address<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetupdateCustomer({ ...updateCustomer, Address: e.target.value })}
                                                value={updateCustomer.Address}
                                                disabled={loading} // Disable input during loading
                                            //maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Pincode<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetupdateCustomer({ ...updateCustomer, Pincode: e.target.value })}
                                                value={updateCustomer.Pincode}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Distance in (Kms)<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetupdateCustomer({ ...updateCustomer, DistanceinKms: e.target.value })}
                                                value={updateCustomer.DistanceinKms}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">State<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetupdateCustomer({ ...updateCustomer, State: e.target.value })}
                                                value={updateCustomer.State}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Contact Person<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetupdateCustomer({ ...updateCustomer, ContactPerson: e.target.value })}
                                                value={updateCustomer.ContactPerson}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Phone No<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetupdateCustomer({ ...updateCustomer, PhoneNo: e.target.value })}
                                                value={updateCustomer.PhoneNo}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Mobile No<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetupdateCustomer({ ...updateCustomer, MobileNo: e.target.value })}
                                                value={updateCustomer.MobileNo}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Email ID<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetupdateCustomer({ ...updateCustomer, EmailID: e.target.value })}
                                                value={updateCustomer.EmailID}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">GST No<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetupdateCustomer({ ...updateCustomer, GST: e.target.value })}
                                                value={updateCustomer.GST}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">GSTIN<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetupdateCustomer({ ...updateCustomer, GSTIN: e.target.value })}
                                                value={updateCustomer.GSTIN}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Credit Days<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetupdateCustomer({ ...updateCustomer, CreditDays: e.target.value })}
                                                value={updateCustomer.CreditDays}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">PAN<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetupdateCustomer({ ...updateCustomer, PAN: e.target.value })}
                                                value={updateCustomer.PAN}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">TCS<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetupdateCustomer({ ...updateCustomer, TCS: e.target.value })}
                                                value={updateCustomer.TCS}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Vendor Code<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetupdateCustomer({ ...updateCustomer, VendorCode: e.target.value })}
                                                value={updateCustomer.VendorCode}
                                                disabled={loading} // Disable input during loading
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
                                            onChange={(e) => SetupdateCustomer({ ...updateCustomer, Status: e.target.value })}
                                            value={updateCustomer.Status}

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
                            <CButton type="submit" color="success" onClick={handleUpdateCustomer}>
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
                        <h3> Add Customer</h3>
                    </div>
                    </CModalTitle>

                    <CModalBody>
                        <CCard className="mb-3">
                            <CCardHeader className="bg-dark text-light">Customer Information</CCardHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Customer Code<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetCustomerRegister({ ...CustomerRegister, CustomerCode: e.target.value })}
                                                value={CustomerRegister.CustomerCode}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Customer Name<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetCustomerRegister({ ...CustomerRegister, CustomerName: e.target.value })}
                                                value={CustomerRegister.CustomerName}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Address<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetCustomerRegister({ ...CustomerRegister, Address: e.target.value })}
                                                value={CustomerRegister.Address}
                                                disabled={loading} // Disable input during loading
                                            //maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Pincode<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetCustomerRegister({ ...CustomerRegister, Pincode: e.target.value })}
                                                value={CustomerRegister.Pincode}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Distance in (Kms)<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetCustomerRegister({ ...CustomerRegister, DistanceinKms: e.target.value })}
                                                value={CustomerRegister.DistanceinKms}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">State<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetCustomerRegister({ ...CustomerRegister, State: e.target.value })}
                                                value={CustomerRegister.State}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Contact Person<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetCustomerRegister({ ...CustomerRegister, ContactPerson: e.target.value })}
                                                value={CustomerRegister.ContactPerson}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Phone No<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetCustomerRegister({ ...CustomerRegister, PhoneNo: e.target.value })}
                                                value={CustomerRegister.PhoneNo}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Mobile No<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetCustomerRegister({ ...CustomerRegister, MobileNo: e.target.value })}
                                                value={CustomerRegister.MobileNo}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Email ID<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetCustomerRegister({ ...CustomerRegister, EmailID: e.target.value })}
                                                value={CustomerRegister.EmailID}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">GST No<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetCustomerRegister({ ...CustomerRegister, GST: e.target.value })}
                                                value={CustomerRegister.GST}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">GSTIN<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetCustomerRegister({ ...CustomerRegister, GSTIN: e.target.value })}
                                                value={CustomerRegister.GSTIN}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Credit Days<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetCustomerRegister({ ...CustomerRegister, CreditDays: e.target.value })}
                                                value={CustomerRegister.CreditDays}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">PAN<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetCustomerRegister({ ...CustomerRegister, PAN: e.target.value })}
                                                value={CustomerRegister.PAN}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">TCS<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetCustomerRegister({ ...CustomerRegister, TCS: e.target.value })}
                                                value={CustomerRegister.TCS}
                                                disabled={loading} // Disable input during loading
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="palletid">Vendor Code<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='palletid'
                                                onChange={(e) => SetCustomerRegister({ ...CustomerRegister, VendorCode: e.target.value })}
                                                value={CustomerRegister.VendorCode}
                                                disabled={loading} // Disable input during loading
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
                            <CButton type="submit" color="success" onClick={() => handleNewCustomerRegister()}  >
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
Customer.propTypes = {
    auth: PropTypes.any.isRequired,
    ipAddress: PropTypes.string,
};
export default Customer