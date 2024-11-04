import React, { useMemo, useState, useEffect, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from 'axios';
import Swal from 'sweetalert2';
import swal from 'sweetalert';
// import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import validator from 'validator';
// import { Link } from 'react-router-dom';
import { BallTriangle } from 'react-loader-spinner';
import { API_URL } from 'src/config';
import PropTypes from 'prop-types';
import DatePicker from 'react-multi-date-picker';
import transition from "react-element-popper/animations/transition"
import InputIcon from 'react-multi-date-picker/components/input_icon';
import { CTooltip } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilXCircle } from '@coreui/icons';

const Operator = ({ auth }) => {
    const [tableData, setTableData] = useState([]);
    const [userdata, setuserdata] = useState(
        {
            CreatedBy: auth.empid,
            DateOfJoining: '',
            DateOfBirth: '',
            EmployeeName: '',
            PhoneNumber: '',
            Status: '',
            EmailID: '',
            EmployeeCode: '',
            UpdateDatedBy: '',
            FatherName: '',
            BloodGroup: '',
            aadharNumber: '',
            Ops_ID: ''
        }
    );
    const modalRef = useRef(null);
    const modalRef1 = useRef(null);
    const [Uploadvisible, setUploadvisible] = useState(false)
    const [uploadxl, setuploadxl] = useState(false)
    const [loading, setLoading] = useState(false); // Loader state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [10, 50, 100];
    // View Start
    // const [view, setview] = useState([]);
    const [email, setEmail] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [message, setMessage] = useState('');
    const handleInputChange = (event) => {
        const value = event.target.value;

        if (/^\d*$/.test(value)) {
            setMobileNumber(value);

            const regex = /^\d{10}$/;
            if (value.length === 0 || regex.test(value)) {
                setMessage(value.length === 10 ? 'Mobile number is valid.' : '');
            } else {
                setMessage('Mobile number must be exactly 10 digits.');
            }
        } else {
            setMessage('Only digits are allowed.');
        }
    };
    const handleEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);
        setuserdata({ ...userdata, EmailID: value });

        if (validator.isEmail(value)) {
            setEmailMessage('Email address is valid.');
        } else {
            setEmailMessage('Invalid email address.');
        }
    };
    // const handleView = async (SFGRM_ID) => {
    //     try {
    //         console.log(SFGRM_ID)
    //         const alldata = { SFGRM_ID, mode: 'SI' }
    //         const response = await axios.post(`${API_URL}/MappedDetailsIndividual`, alldata);
    //         setview(response.data.send);
    //         console.log(response.data.send)
    //     }
    //     catch (error) {
    //         console.log(error)
    //     }
    // }
    // const ViewRenderer = (params) => {
    //     return <div>
    //         <button className='btn' onClick={() => handleView(params.data.SFGRM_ID)} data-bs-toggle="modal" data-bs-target="#exampleModalView">
    //             <i className="bi bi-eye-fill fs-5"></i>
    //         </button>
    //     </div>
    // }
    const handleEdit = async (Ops_ID) => {
        try {
            const alldata = { Ops_ID, mode: 'SI' }
            const response = await axios.post(`${API_URL}/OperatorDetailsIndividual`, alldata);
            if (response.status === 200) {
                const data = response.data.send
                setuserdata(data[0])
            }
        } catch (error) {
            console.error('ERROR EDITING RECORD:', error);
            throw error;
        }
    }
    const EditRenderer = (params) => {
        return (
            <div>
                {/* <button className='btn' onClick={() => { handleEdit(params.data.Ops_ID); setIsModalVisible1(true); }}>
                    <i className="bi bi-pen fs-5"></i>
                </button> */}
                <CTooltip content="Edit">
                    <CIcon
                        size='xl'
                        icon={cilPencil}
                        className='m-2'
                        onClick={() => { handleEdit(params.data.Ops_ID); setIsModalVisible1(true); }}
                        style={{ color: 'white', background: 'rgb(34,139,34)', borderRadius: '5px' }}
                    />
                </CTooltip>
            </div>
        );
    };
    // const DeleteRenderer = (params) => {
    //     return <div>
    //         <button className='btn' onClick={() => handleInActive(params.data.SFGRM_ID)} >
    //             <i className="bi bi-trash fs-5"></i>
    //         </button>
    //     </div>
    // }
    const handleInActive = async (Ops_ID) => {
        try {
            Swal.fire({
                title: "Do you want to Inactive?",
                showDenyButton: true,
                confirmButtonText: "Yes",
                denyButtonText: `No`,
                text: "Action Can't Be Retrieve",
                icon: "error"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const alldata = { Ops_ID, mode: 'In-active' }
                        const response = await axios.post(`${API_URL}/InActive_Operator`, alldata);
                        console.log(Ops_ID)
                        Swal.fire("In-Active Success!", "", "success");
                        fetchData()
                    } catch (error) {
                        console.error('Error deleting record:', error);
                        throw error;
                    }
                } else if (result.isDenied) {
                    Swal.fire("Changes are not saved", "", "info");
                }
            });
        } catch (error) {
            console.error('ERROR EDITING RECORD:', error);
            throw error;
        }
    }
    //   Submit Updated Details
    const handleUpdate = async (e) => {
        try {
            const alldata = { ...userdata, UpdatedBy: auth.empid }
            const response = await axios.post(`${API_URL}/UpdateOperator`, alldata)
            const res = { ...response.data.send }
            if (response.status === 200) {
                setLoading(false)
                Swal.fire({
                    title: 'Updated Successfully',
                    text: '',
                    icon: 'success',
                    confirmButtonText: 'Done'
                }).then(() => {
                    setIsModalVisible1(false)
                });
                fetchData();

            }
        }
        catch (err) {
            console.log(err)
        }
    }
    // Edit End
    const [rowData, setRowData] = useState([]);
    const fetchData = async () => {
        setLoading(true)

        try {
            const response = await axios.get(`${API_URL}/fetchOperator`);
            setRowData(response.data.send);
            if (response.status === 200) {
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            console.error('Error fetching Mapped Supplier Details details:', error);
        }
    };
    const columdef = [
        { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
        { headerName: " Employee Code", field: "EmployeeCode", filter: true, floatingFilter: true, width: 200 },
        { headerName: "Employee Name", field: "EmployeeName", filter: true, floatingFilter: true, width: 200 },
        { headerName: "Aadhar Number", field: "aadharNumber", filter: true, floatingFilter: true, width: 200 },
        { headerName: "Date Of Joining", field: "DateOfJoining", filter: true, floatingFilter: true, width: 200 },
        { headerName: "Phone Number", field: "PhoneNumber", filter: true, floatingFilter: true, width: 200 },
        { headerName: "Date Of Birth", field: "DateOfBirth", filter: true, floatingFilter: true, width: 200 },
        { headerName: "Father Name", field: "FatherName", filter: true, floatingFilter: true, width: 200 },
        { headerName: "Blood Group", field: "BloodGroup", filter: true, floatingFilter: true, width: 200 },
        { headerName: "Email ID", field: "EmailID", filter: true, floatingFilter: true, width: 200 },
        {
            headerName: "Status",
            field: "Status",
            width: 100,
            cellRenderer: params => {
                // Determine the status based on the value in params
                const statusText = params.value === 'a' ? 'Active' : 'In-Active';
                // Determine the CSS class based on the status
                const statusClass = params.value === 'a' ? 'badge bg-success' : 'badge bg-danger';
                return (
                    <span className={statusClass}>
                        {statusText}
                    </span>
                );
            }
        },
        { headerName: "Edit", field: 'Edit', cellRenderer: EditRenderer, width: 80 },
        {
            headerName: 'In-Active',
            field: 'Status',
            width: 150,
            filter: false,
            sortable: false,
            floatingFilter: false,
            editable: false,
            cellRenderer: (params) => (

                // <i className="bi bi-x-circle fs-4"
                //     onClick={() => handleInActive(params.data.Ops_ID)}
                //     style={{ display: params.data.Status === 'i' ? 'none' : 'block' }}></i>
                <CTooltip content="Inactive">
                <CIcon
                    size='xl'
                    icon={cilXCircle}
                    className='m-2'
                    onClick={() => handleInActive(params.data.Ops_ID)}
                    style={{ color: 'white', background: 'rgb(237,28,36)', borderRadius: '5px', display: params.data.UserStatus === 'i' ? 'none' : 'block' }}
                />
            </CTooltip>
            )
        },
    ]
    const autoGroupColumnDef = useMemo(() => {
        return {
            headerCheckboxSelection: true,
            field: "id",
            flex: 1,
            minWidth: 240,
            cellRendererParams: {
                checkbox: true,
            },
        };
    }, []);
    const fileInput = useRef(null);
    const componentRef = useRef(null);
    // Download PDF Format Start
    const generatePDF = async () => {
        // Get the filtered data from the AG Grid
        setLoading(true)
        try {
            const filteredData = gridRef.current.api.getModel().rowsToDisplay.map(rowNode => rowNode.data);
            console.log(filteredData);
            const doc = new jsPDF({ format: 'a4' });
            const title = 'Supplier-FG Rate Mapping';
            const titleX = doc.internal.pageSize.width / 2; // Centering the title horizontally
            const titleY = 15; // Setting the vertical position of the title

            // Setting font size and weight
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");

            // Center the title using alignment
            doc.text(title, titleX, titleY, { align: 'center' });

            // Extracting column headers and mapping the data
            if (filteredData.length > 0) {
                // Define the column names and the corresponding keys in the data
                const columnMapping = [
                    { header: "Supplier Name", key: "SupplierName" },
                    { header: "Supplier Code", key: "SupplierCode" },
                    { header: "Part Number", key: "PartNumber" },
                    { header: "Description", key: "Description" },
                    { header: "Price", key: "Price" }
                ];

                // Extract headers and data for the table
                const columnHeaders = columnMapping.map(col => col.header);
                const data = filteredData.map(obj => columnMapping.map(col => obj[col.key] || ''));

                doc.autoTable({
                    head: [columnHeaders],
                    body: data,
                    margin: { top: 20, right: 10, left: 10, bottom: 30 }, // Add bottom margin for footer
                    styles: {
                        theme: 'grid',
                        halign: "center",
                        valign: "middle", // Center vertically
                        fontSize: 10,
                        overflow: 'linebreak', // Allow line break to avoid overlap
                        cellWidth: 'wrap', // Adjust cell width to fit text
                    },
                    columnStyles: {
                        0: { cellWidth: 40 },
                        1: { cellWidth: 40 },
                        2: { cellWidth: 40 },
                        3: { cellWidth: 40 },
                        4: { cellWidth: 30 }

                    },
                    didDrawPage: function (data) {
                        const pageCount = doc.internal.getNumberOfPages();
                        doc.setFontSize(10);

                        const pageWidth = doc.internal.pageSize.width;
                        const footerY = doc.internal.pageSize.height - 10; // Positioning the footer 10 units from the bottom

                        // Replace with your footer text
                        const footerText = `Page ${data.pageCount}`;
                        doc.text(footerText, pageWidth / 2, footerY, { align: 'center' });
                    }
                });

                doc.save(`Supplier-FGRateMapping.pdf`);
            } else {
                alert('No data available to export');
            }
        } catch (error) {

            setLoading(false)

            console.error("Error generating PDF:", error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setLoading(false); // Reset loading state in the end
        }
    };
    // Download PDF Format END
    const gridRef = useRef(null);
    const onExportClick = () => {
        const params = {
            fileName: 'Supplier-FGRateMapping.csv',
        };
        gridRef.current.api.exportDataAsCsv(params);
    };
    const [select, setselect] = useState({
        id: '',
    })
    useEffect(() => {
        fetchData();
    }, []);
    const inputRef = useRef(null);
    useEffect(() => {
        if (isModalVisible && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isModalVisible])
    const HandleSaveChanges = async () => {
        if (userdata.EmployeeCode === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter Employee Code',
                icon: 'warning'
            })
            return
        }
        if (userdata.EmployeeName === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter Employee Name',
                icon: 'warning'
            })
            return
        }
        if (userdata.aadharNumber === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter Employee aadharNumber',
                icon: 'warning'
            })
            return
        }
        if (userdata.FatherName === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter Employee Father Name',
                icon: 'warning'
            })
            return
        }
        if (userdata.BloodGroup === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter Blood Group',
                icon: 'warning'
            })
            return
        }
        if (userdata.DateOfBirth === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please select Date of Birth',
                icon: 'warning'
            })
            return
        }
        if (userdata.DateOfJoining === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please select Date of Joining',
                icon: 'warning'
            })
            return
        }
        if (userdata.PhoneNumber === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter Phone Number',
                icon: 'warning'
            })
            return
        }
        if (userdata.EmailID === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter EmailID',
                icon: 'warning'
            })
            return
        }
        if (userdata.Status === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Select Status',
                icon: 'warning'
            })
            return
        }

        try {
            console.log(userdata)
            const alldata = { ...userdata, branchid: auth.branchid }
            const response = await axios.post(`${API_URL}/AddOperator`, alldata)
            if (response.status === 200) {
                Swal.fire({
                    title: 'Success',
                    text: 'Employee data Saved SuccessFully',
                    icon: 'success'
                })
                setIsModalVisible(false)
                setuserdata({
                    EmployeeRole: '',
                    DateOfJoining: '',
                    DateOfBirth: '',
                    EmployeeName: '',
                    PhoneNumber: '',
                    Status: '',
                    EmailID: '',
                    EmployeeCode: '',
                    UpdateDatedBy: '',
                    FatherName: '',
                    BloodGroup: '',
                    aadharNumber: ''
                })
                fetchData();
            }
        } catch (err) {
            console.log(err)
        }
    }

    // Handle Import
    const handleUploadExcelSheet = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const fileName = selectedFile.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();

            if (fileExtension === 'csv' || fileExtension === 'xls' || fileExtension === 'xlsx') {
                setuploadxl(selectedFile);
            } else {
                Swal.fire({
                    title: 'Invalid File Format',
                    text: 'Please select a valid CSV or Excel file format.',
                    icon: 'warning'
                });
                setuploadxl(null);
                e.target.value = null; // Clear the file input field
            }
        }
    };
    const handleUploadData = async () => {
        if (!uploadxl) {
            Swal.fire({
                text: 'Please Select Upload File',
                icon: 'warning',
            });
            return;
        }
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Once uploaded, you will not be able to check the user list immediately!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Upload',
        });
        setLoading(true);
        if (result.isConfirmed) {
            try {
                const formData = new FormData();
                formData.append('file', uploadxl);
                formData.append('CreatedBy', auth.empid)
                formData.append('branchid', auth.branchid)
                const response = await axios.post(`${API_URL}/Operator_Upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                const { message, uploadcount, unuploadedFilePath } = response.data;
                console.log(response.data)
                if (unuploadedFilePath) {
                    console.log(unuploadedFilePath)
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
                            console.log(unuploadedFilePath)
                            link.href = `${API_URL}${unuploadedFilePath}`;
                            link.setAttribute('download', 'unuploaded_Operator_data.xlsx');
                            document.body.appendChild(link);
                            link.click();
                            link.parentNode.removeChild(link);
                        }
                    });
                } else {

                    fetchData();
                    Swal.fire({
                        title: `Total Uploaded File Count: ${uploadcount}`,
                        text: 'All data uploaded successfully',
                        icon: 'success',
                    });
                }
            } catch (err) {
                console.error(err);
                setLoading(false);
                Swal.fire({
                    title: 'Internal Server Error',
                    icon: 'error',
                });
            } finally {
                setUploadvisible(false);
                setLoading(false);
            }
        }
    };
    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner">
                        (<BallTriangle
                            height={100}
                            width={100}
                            radius={5}
                            color="#4fa94d"
                            ariaLabel="ball-triangle-loading"
                            wrapperStyle={{}}
                            wrapperclassName=""
                            visible={true}
                        />)

                    </div>
                </div>
            )}
            {/* Add  */}
            <div
                className={`modal fade ${isModalVisible ? 'show' : ''}`}
                id="exampleModalAdd"
                aria-labelledby="exampleModalLabel"
                style={{ display: isModalVisible ? 'block' : 'none' }}
                ref={modalRef}
            >                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add Employee Master</h1>
                            <button type="button" className="btn-close" onClick={() => setIsModalVisible(false)} data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <div className='d-flex flex-wrap row'>
                                    <div className='col-lg-4 mb-2 '>
                                        <label>Employee Code</label>
                                        <input className='form-control  custom-border' type='text' onChange={(e) => setuserdata({ ...userdata, EmployeeCode: e.target.value })} value={userdata.EmployeeCode} />
                                    </div>
                                    <div className='col-lg-4 mb-2'>
                                        <label>Employee Name</label>
                                        <input className='form-control  custom-border' type='text' onChange={(e) => setuserdata({ ...userdata, EmployeeName: e.target.value })} value={userdata.EmployeeName} />
                                    </div>
                                    <div className='col-lg-4 mb-2'>
                                        <label>aadhar Number</label>
                                        <input className='form-control  custom-border' type='text' onChange={(e) => setuserdata({ ...userdata, aadharNumber: e.target.value })} value={userdata.aadharNumber} />
                                    </div>
                                    <div className='col-lg-4 mb-2'>
                                        <label>Father Name</label>
                                        <input className='form-control  custom-border' type='text' onChange={(e) => setuserdata({ ...userdata, FatherName: e.target.value })} value={userdata.FatherName} />
                                    </div>
                                    <div className='col-lg-4 mb-2'>
                                        <label>Blood Group</label>
                                        <input className='form-control  custom-border' type='text' onChange={(e) => setuserdata({ ...userdata, BloodGroup: e.target.value })} value={userdata.BloodGroup} />
                                    </div>


                                    <div className='col-lg-4 mb-2'>
                                        <label>Date of Birth</label>
                                        <DatePicker
                                            maxDate={new Date()}
                                            animations={[transition()]}
                                            render={<InputIcon className="form-control" placeholder="Date of Birth" />}
                                            disabled={loading} // Disable input during loading
                                            value={userdata.DateOfBirth}
                                            onChange={(date) => {
                                                const formattedDate = date.format('YYYY/MM/DD')
                                                setuserdata({ ...userdata, DateOfBirth: formattedDate })
                                            }}
                                        />

                                    </div>
                                    <div className='col-lg-4 mb-2'>
                                        <label>Phone Number</label>
                                        <input className='form-control  custom-border' type='text'
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                setuserdata({ ...userdata, PhoneNumber: e.target.value });
                                            }}
                                            maxLength='10'
                                            value={userdata.PhoneNumber} />

                                        {message && (<p style={{ color: message === 'Mobile number is valid.' ? 'green' : 'red' }}>{message}</p>)}

                                    </div>
                                    <div className='col-lg-4 mb-2'>
                                        <label>Email Id</label>
                                        <input
                                            className='form-control  custom-border'
                                            type='email'
                                            value={userdata.EmailID}
                                            onChange={handleEmailChange}
                                        />
                                        {emailMessage && (
                                            <p style={{ color: emailMessage === 'Email address is valid.' ? 'green' : 'red' }}>
                                                {emailMessage}
                                            </p>
                                        )}
                                    </div>
                                    <div className='col-lg-4 mb-2'>
                                        <label>Date of Joining</label>
                                        <DatePicker
                                            maxDate={new Date()}
                                            animations={[transition()]}
                                            render={<InputIcon className="form-control" placeholder="Date of Join" />}
                                            disabled={loading}
                                            // Disable input during loading
                                            onChange={(date) => {
                                                const formattedDate = date.format('YYYY/MM/DD')
                                                setuserdata({ ...userdata, DateOfJoining: formattedDate })
                                            }}
                                        />

                                    </div>
                                    <div className='col-lg-4 mb-2'>
                                        <label>Status</label>
                                        <select className='form-select  custom-border' type='' onChange={(e) => setuserdata({ ...userdata, Status: e.target.value })}
                                            value={userdata.Status} >
                                            <option></option>
                                            <option value='a'>Active</option>
                                            <option value='i'>In-Active</option>
                                        </select>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setIsModalVisible(false)} data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={HandleSaveChanges}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal View */}
            <div className="modal fade" id="exampleModalView" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Rate Master-FG Part</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* <Row>
                        <Col xl={3} lg={2} className='text-end '>
                            <label className='mt-2'>Supplier :</label>
                        </Col>
                        <Col xl={7} lg={8} className=''>
                            <input className='form-control ' onChange={(e) => setSupplierInfo({ ...SupplierInfo, SupplierName: e.target.value })} value={SupplierInfo.SupplierName} />
                        </Col>
                    </Row>
                    <hr></hr>
                    <Row>
                        <Col lg={4}>
                            <label>Part Number</label>
                            <input className='form-control' onChange={(e) => setdata({ ...data, PartNumber: e.target.value })} value={data.PartNumber} />
                        </Col>
                        <Col lg={4}>
                            <label>Description</label>
                            <input className='form-control' onChange={(e) => setdata({ ...data, Description: e.target.value })} value={data.Description} />
                        </Col>
                        <Col lg={4}>
                            <label>Price</label>
                            <input className='form-control' onKeyDown={handleKeydown} onChange={(e) => setdata({ ...data, Price: e.target.value })} value={data.Price} />
                        </Col>
                    </Row>

                    <div className='table-responsive'>
                        <table className='table text-nowrap'>
                            <thead>
                                <tr>
                                    <th>Part No</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Modify</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(tableData) && tableData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.PartNumber}</td>
                                        <td>{item.Description}</td>
                                        <td>{item.Price}</td>
                                        <td>
                                            <i className="bi bi-x-circle" style={{ fontSize: "20px", cursor: 'pointer' }}
                                                onClick={() => handleDeleteUser(index)}></i>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div> */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" >Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal EDIT */}
            <div
                className={`modal fade ${isModalVisible1 ? 'show' : ''}`}
                id="exampleModalEdit"
                aria-labelledby="exampleModalLabel"
                style={{ display: isModalVisible1 ? 'block' : 'none' }}
                ref={modalRef1}             >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Employee Master</h1>
                            <button type="button" className="btn-close" onClick={() => setIsModalVisible1(false)} data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='d-flex flex-wrap row'>
                                <div className='col-lg-4 mb-2 '>
                                    <label>Employee Code</label>
                                    <input className='form-control  custom-border' type='text' onChange={(e) => setuserdata({ ...userdata, EmployeeCode: e.target.value })} value={userdata.EmployeeCode} disabled />
                                </div>
                                <div className='col-lg-4 mb-2'>
                                    <label>Employee Name</label>
                                    <input className='form-control  custom-border' type='text' onChange={(e) => setuserdata({ ...userdata, EmployeeName: e.target.value })} value={userdata.EmployeeName} />
                                </div>
                                <div className='col-lg-4 mb-2'>
                                    <label>aadhar Number</label>
                                    <input className='form-control  custom-border' type='text' onChange={(e) => setuserdata({ ...userdata, aadharNumber: e.target.value })} value={userdata.aadharNumber} />
                                </div>
                                <div className='col-lg-4 mb-2'>
                                    <label>Father Name</label>
                                    <input className='form-control  custom-border' type='text' onChange={(e) => setuserdata({ ...userdata, FatherName: e.target.value })} value={userdata.FatherName} />
                                </div>
                                <div className='col-lg-4 mb-2'>
                                    <label>Blood Group</label>
                                    <input className='form-control  custom-border' type='text' onChange={(e) => setuserdata({ ...userdata, BloodGroup: e.target.value })} value={userdata.BloodGroup} />
                                </div>


                                <div className='col-lg-4 mb-2'>
                                    <label>Date of Birth</label>
                                    <DatePicker
                                        maxDate={new Date()}
                                        animations={[transition()]}
                                        render={<InputIcon className="form-control" placeholder="Date of Birth" />}
                                        disabled={loading}
                                        value={userdata.DateOfBirth}

                                        // Disable input during loading
                                        onChange={(date) => {
                                            const formattedDate = date.format('YYYY/MM/DD')
                                            setuserdata({ ...userdata, DateOfBirth: formattedDate })
                                        }}
                                    />

                                </div>
                                <div className='col-lg-4 mb-2'>
                                    <label>Phone Number</label>
                                    <input className='form-control  custom-border' type='text'
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setuserdata({ ...userdata, PhoneNumber: e.target.value });
                                        }}
                                        maxLength='10'
                                        value={userdata.PhoneNumber} />

                                    {message && (<p style={{ color: message === 'Mobile number is valid.' ? 'green' : 'red' }}>{message}</p>)}

                                </div>
                                <div className='col-lg-4 mb-2'>
                                    <label>Email Id</label>
                                    <input
                                        className='form-control  custom-border'
                                        type='email'
                                        value={userdata.EmailID}
                                        onChange={handleEmailChange}
                                    />
                                    {emailMessage && (
                                        <p style={{ color: emailMessage === 'Email address is valid.' ? 'green' : 'red' }}>
                                            {emailMessage}
                                        </p>
                                    )}
                                </div>
                                <div className='col-lg-4 mb-2'>
                                    <label>Date of Joining</label>
                                    <DatePicker
                                        maxDate={new Date()}
                                        animations={[transition()]}
                                        render={<InputIcon className="form-control" placeholder="Date of Join" />}
                                        disabled={loading} // Disable input during loading
                                        value={userdata.DateOfJoining}
                                        onChange={(date) => {
                                            const formattedDate = date.format('YYYY/MM/DD')
                                            setuserdata({ ...userdata, DateOfJoining: formattedDate })
                                        }}
                                    />
                                </div>
                                <div className='col-lg-4 mb-2'>
                                    <label>Status</label>
                                    <select className='form-select  custom-border' type='' onChange={(e) => setuserdata({ ...userdata, Status: e.target.value })}
                                        value={userdata.Status} >
                                        <option></option>
                                        <option value='a'>Active</option>
                                        <option value='i'>In-Active</option>
                                    </select>
                                </div>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setIsModalVisible1(false)} >Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleUpdate}>Update Changes</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal for Download Format Operator Asset*/}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Download Format</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="d-flex justify-content-evenly">
                                <div className="btn btn-success" onClick={onExportClick}>
                                    <i className="bi bi-file-earmark-spreadsheet fs-1"></i>
                                </div>
                                <div className="btn btn-danger" onClick={generatePDF} >
                                    <i className="bi bi-file-earmark-pdf fs-1"></i>
                                </div>
                            </div>
                            <div className="d-flex justify-content-evenly mt-2">
                                <span className="text-muted">Download Excel Format</span>
                                <span className="text-muted">Download PDF Format</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {Uploadvisible && (
                <div className={`modal fade ${Uploadvisible ? 'show' : ''}`} style={{ display: Uploadvisible ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                        <div className="modal-content card">
                            <div className="modal-header">
                                <button type="button" className="btn-close" onClick={() => setUploadvisible(false)}></button>

                            </div>
                            <div className="modal-body">
                                <div className="import-input">
                                    <label htmlFor="importdata" className="form-label">Import Data</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept=".csv, .xls, .xlsx"
                                        onChange={handleUploadExcelSheet}
                                    />
                                </div>
                                <hr className="mt-2" />
                                <div className="download-sample-template text-center">
                                    <p>Important ⚠</p>
                                    <span className='text-danger'>Download The Below The Template That Colum Name Based Enter The Data Then Upload here</span>
                                    <div>
                                        <a href="/Operator_Upload_Temp.xlsx" className=' nav-link text-decoration-underline ' download>Click to Download</a>
                                    </div>
                                </div>
                                <div className="text-center mt-3">
                                    <button className="btn btn-danger mx-2" onClick={() => setUploadvisible(false)}>
                                        CANCEL
                                    </button>
                                    <button className="btn btn-success mx-2" onClick={handleUploadData}>
                                        Upload Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className='card px-5 pt-2 pb-3'>
                <div className='d-flex justify-content-end flex-wrap '>
                    {/* File import */}
                    <button className=" btn btn-secondary mx-2 mb-2 " onClick={() => setUploadvisible(true)}>
                        <i className="bi bi-cloud-download me-1 "></i>Import
                    </button>

                    {/* File Export Register */}
                    <button className="btn btn-danger text-white mx-2 d-flex mb-2  "
                        data-bs-toggle="modal" data-bs-target="#exampleModal"
                    >
                        <i className="bi bi-cloud-upload  me-1 "></i>Export</button>
                    {/* Add New Register */}
                    <button className="btn  border-0 btn-success text-white mx-2 mb-2 " onClick={() => setIsModalVisible(true)}>
                        <i className="bi bi-plus-circle me-1"></i> <span className='pt-1'>Add Employee</span>
                    </button>

                </div>


                <div style={{ height: "450px" }} className='ag-theme-alpine'>
                    <AgGridReact ref={gridRef} rowData={rowData} columnDefs={columdef} rowSelection={"multiple"} autoGroupColumnDef={autoGroupColumnDef} pagination={pagination} paginationPageSize={paginationPageSize} paginationPageSizeSelector={paginationPageSizeSelector}
                    />
                </div>


                <div className='mt-2'>
                    <button className='btn btn-danger'>Back to Master</button>
                </div>
            </div>
        </div>
    )
}
Operator.propTypes = {
    auth: PropTypes.any.isRequired,
};

export default Operator
