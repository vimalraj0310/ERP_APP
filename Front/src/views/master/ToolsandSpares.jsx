import React, { useMemo, useState, useEffect, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from 'axios';
import Swal from 'sweetalert2';
import swal from 'sweetalert';
import { Row, Col } from 'react-bootstrap';
// import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import validator from 'validator';
// import { Link } from 'react-router-dom';
import { BallTriangle } from 'react-loader-spinner';
import { API_URL } from 'src/config';
import PropTypes from 'prop-types';
import DatePicker from 'react-multi-date-picker';
import InputIcon from 'react-multi-date-picker/components/input_icon';
import { CTooltip } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilXCircle } from '@coreui/icons';

const ToolsandSpares = ({ auth }) => {
    const [ToolsandSparesInfo, setToolsandSparesInfo] = useState(
        {
            CreatedBy: auth.empid,
            branchid: auth.branchid,
            ToolNo: '',
            Description: '',
            Thickness: '',
            Width: '',
            Length: '',
            Height: '',
            Breadth: '',
            ToolWeight: '',
            MinStock: '',
            LifeTime: '',
            DangerLevel: '',
            Applicator: '',
            BladeType: '',
            Status: '',

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
    // const [email, setEmail] = useState('');
    // const [emailMessage, setEmailMessage] = useState('');
    // const [mobileNumber, setMobileNumber] = useState('');
    // const [message, setMessage] = useState('');
    // const handleInputChange = (event) => {
    //     const value = event.target.value;
    //     if (/^\d*$/.test(value)) {
    //         setMobileNumber(value);

    //         const regex = /^\d{10}$/;
    //         if (value.length === 0 || regex.test(value)) {
    //             setMessage(value.length === 10 ? 'Mobile number is valid.' : '');
    //         } else {
    //             setMessage('Mobile number must be exactly 10 digits.');
    //         }
    //     } else {
    //         setMessage('Only digits are allowed.');
    //     }
    // };
    // const handleEmailChange = (event) => {
    //     const value = event.target.value;
    //     setEmail(value);
    //     setuserdata({ ...userdata, EmailID: value });

    //     if (validator.isEmail(value)) {
    //         setEmailMessage('Email address is valid.');
    //     } else {
    //         setEmailMessage('Invalid email address.');
    //     }
    // };
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
    const handleEdit = async (TS_ID) => {
        try {
            const alldata = { TS_ID, mode: 'SI' }
            const response = await axios.post(`${API_URL}/ToolsDetailsIndividual`, alldata);
            if (response.status === 200) {
                const data = response.data.send
                setToolsandSparesInfo(data[0])
            }
        } catch (error) {
            console.error('ERROR EDITING RECORD:', error);
            throw error;
        }
    }
    const EditRenderer = (params) => {
        return (
            <div>
                {/* <button className='btn' onClick={() => { handleEdit(params.data.TS_ID); setIsModalVisible1(true); }}>
                    <i className="bi bi-pen fs-5"></i>
                </button> */}
                <CTooltip content="Edit">
                    <CIcon
                        size='xl'
                        icon={cilPencil}
                        className='m-2'
                        onClick={() => { handleEdit(params.data.TS_ID); setIsModalVisible1(true); }}
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
    const handleInActive = async (TS_ID) => {
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
                        const alldata = { TS_ID, mode: 'In-active' }
                        const response = await axios.post(`${API_URL}/InActive_ToolsandSpares`, alldata);
                        console.log(TS_ID)
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
            const alldata = { ...ToolsandSparesInfo, UpdatedBy: auth.empid }
            const response = await axios.post(`${API_URL}/UpdateToolsandSpares`,alldata)
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
            const response = await axios.get(`${API_URL}/FetchToolsandSpares`);
            setRowData(response.data.send);
            if (response.status === 200) {
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            console.error('Error Fetching Machine details:', error);
        }
    };
    const columdef = [
        { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
        { headerName: "Tool No", field: "ToolNo", filter: true, floatingFilter: true, width: 120 },
        { headerName: "Description", field: "Description", filter: true, floatingFilter: true, width: 120 },
        { headerName: "Thickness", field: "Thickness", filter: true, floatingFilter: true, width: 120 },
        { headerName: "Width", field: "Width", filter: true, floatingFilter: true, width: 120 },
        { headerName: "Length", field: "Length", filter: true, floatingFilter: true, width: 120 },
        { headerName: "Height", field: "Height", filter: true, floatingFilter: true, width: 120 },
        { headerName: "Breadth", field: "Breadth", filter: true, floatingFilter: true, width: 120 },
        { headerName: "Tool Weight", field: "ToolWeight", filter: true, floatingFilter: true, width: 150 },
        { headerName: "Min Stock", field: "MinStock", filter: true, floatingFilter: true, width: 120 },
        { headerName: "Life Time", field: "LifeTime", filter: true, floatingFilter: true, width: 120 },
        { headerName: "Danger Level", field: "DangerLevel", filter: true, floatingFilter: true, width: 150 },
        { headerName: "Applicator", field: "Applicator", filter: true, floatingFilter: true, width: 120 },
        { headerName: "Blade Type", field: "BladeType", filter: true, floatingFilter: true, width: 120 },
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
                //     onClick={() => handleInActive(params.data.TS_ID)}
                //     style={{ display: params.data.Status === 'i' ? 'none' : 'block' }}></i>
                <CTooltip content="Inactive">
                    <CIcon
                        size='xl'
                        icon={cilXCircle}
                        className='m-2'
                        onClick={() => handleInActive(params.data.TS_ID)}
                        style={{ color: 'white', background: 'rgb(237,28,36)', borderRadius: '5px', display: params.data.Status === 'i' ? 'none' : 'block' }}
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
            const title = 'Tools and Spares ';
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
                    { header: "Tool Number", key: "ToolNo" },
                    { header: "Description", key: "Description" },
                    { header: "Thickness", key: "Thickness" },
                    { header: "Width", key: "Width" },
                    { header: "Height", key: "Height" },
                    { header: "Length", key: "Length" },
                    { header: "Breadth", key: "Breadth" },
                    { header: "Life Time", key: "LifeTime" },
                    { header: "Tool Weight", key: "ToolWeight" },
                    { header: "Min Stock", key: "MinStock" },
                    { header: "Danger Level", key: "DangerLevel" },
                    { header: "Blade Type", key: "BladeType" },
                    { header: "Applicator", key: "Applicator" },
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
                        overflow: 'linebreak', // Allow line break to avoid overlap
                        cellWidth: 'wrap',
                        fontSize: 7,
                    },
                    columnStyles: {
                        0: { cellWidth: 10 },
                        1: { cellWidth: 20 },
                        2: { cellWidth: 10 },
                        3: { cellWidth: 10 },
                        4: { cellWidth: 10 },
                        5: { cellWidth: 10 },
                        6: { cellWidth: 10 },
                        7: { cellWidth: 10 },
                        8: { cellWidth: 20 },
                        9: { cellWidth: 20 },
                        10: { cellWidth: 20 },
                        11: { cellWidth: 20 },
                        12: { cellWidth: 20 }

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

                doc.save(`ToolsandSpares.pdf`);
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
            fileName: 'ToolsandSpares_Details.csv',
            columnKeys: ['ToolNo', 'Description', 'Thickness', 'Length','Width','Breadth','Height','ToolWeight','LifeTime','DangerLevel','Applicator','BladeType','MinStock']
            // Replace with your actual field names
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
        if (ToolsandSparesInfo.ToolNo === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter Tool Number',
                icon: 'warning'
            })
            return
        }
        if (ToolsandSparesInfo.Description === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter Description',
                icon: 'warning'
            })
            return
        }
        if (ToolsandSparesInfo.Thickness === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter Thickness',
                icon: 'warning'
            })
            return
        }
        if (ToolsandSparesInfo.Width === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter Width',
                icon: 'warning'
            })
            return
        }
        if (ToolsandSparesInfo.Length === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter Length',
                icon: 'warning'
            })
            return
        }
        if (ToolsandSparesInfo.Height === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter Height',
                icon: 'warning'
            })
            return
        }
        if (ToolsandSparesInfo.Breadth === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter Breadth',
                icon: 'warning'
            })
            return
        }
        if (ToolsandSparesInfo.ToolWeight === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter ToolWeight',
                icon: 'warning'
            })
            return
        }
        if (ToolsandSparesInfo.MinStock === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter MinStock',
                icon: 'warning'
            })
            return
        }
        if (ToolsandSparesInfo.LifeTime === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter LifeTime',
                icon: 'warning'
            })
            return
        }
        if (ToolsandSparesInfo.LifeTime === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter LifeTime',
                icon: 'warning'
            })
            return
        }
        if (ToolsandSparesInfo.DangerLevel === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter DangerLevel',
                icon: 'warning'
            })
            return
        }
        if (ToolsandSparesInfo.Applicator === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter Applicator',
                icon: 'warning'
            })
            return
        }
        if (ToolsandSparesInfo.BladeType === '') {
            Swal.fire({
                title: 'Warning',
                text: 'Please Enter BladeType',
                icon: 'warning'
            })
            return
        }
        try {
            console.log(ToolsandSparesInfo)
            const response = await axios.post(`${API_URL}/AddToolsandSpares`, ToolsandSparesInfo)
            if (response.status === 200) {
                Swal.fire({
                    title: 'Success',
                    text: 'Machine Information data Saved SuccessFully',
                    icon: 'success'
                })
                setIsModalVisible(false)
                setToolsandSparesInfo({
                    ToolNo: '', ToolWeight: '', Description: '', Width: '', Length: '', Thickness: '',
                    Breadth: '', LifeTime: '', DangerLevel: '', Applicator: '', BladeType: '', Height: '', MinStock: ''
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
                const response = await axios.post(`${API_URL}/ToolsandSpares_Upload`, formData, {
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
                            link.setAttribute('download', 'unuploaded_ToolsandSpares_data.xlsx');
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
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Tools and Spares Master</h1>
                            <button type="button" className="btn-close" onClick={() => setIsModalVisible(false)} data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <div className='d-flex flex-wrap row'>
                                    <div className='col-lg-4 mb-2 '>
                                        <label>Tool No</label>
                                        <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, ToolNo: e.target.value })} value={ToolsandSparesInfo.ToolNo} />
                                    </div>
                                    <div className='col-lg-4 mb-2'>
                                        <label>Description</label>
                                        <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, Description: e.target.value })} value={ToolsandSparesInfo.Description} />
                                    </div>
                                    <div className='col-lg-4 mb-2'>
                                        <label>Thickness</label>
                                        <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, Thickness: e.target.value })} value={ToolsandSparesInfo.Thickness} />
                                    </div>
                                    <div className='col-lg-4 mb-2'>
                                        <label>Width</label>
                                        <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, Width: e.target.value })} value={ToolsandSparesInfo.Width} />
                                    </div>
                                    <div className='col-lg-4 mb-2'>
                                        <label>Length</label>
                                        <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, Length: e.target.value })} value={ToolsandSparesInfo.Length} />
                                    </div>

                                    <div className='col-lg-4 mb-2'>
                                        <label>Height</label>
                                        <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, Height: e.target.value })} value={ToolsandSparesInfo.Height} />
                                    </div>

                                    <div className='col-lg-4 mb-2'>
                                        <label>Breadth</label>
                                        <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, Breadth: e.target.value })} value={ToolsandSparesInfo.Breadth} />
                                    </div>

                                    <div className='col-lg-4 mb-2'>
                                        <label>Tool Weight</label>
                                        <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, ToolWeight: e.target.value })} value={ToolsandSparesInfo.ToolWeight} />
                                    </div>

                                    <div className='col-lg-4 mb-2'>
                                        <label>Min. Stock</label>
                                        <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, MinStock: e.target.value })} value={ToolsandSparesInfo.MinStock} />
                                    </div>

                                    <div className='col-lg-4 mb-2'>
                                        <label>Life Time</label>
                                        <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, LifeTime: e.target.value })} value={ToolsandSparesInfo.LifeTime} />
                                    </div>

                                    <div className='col-lg-4 mb-2'>
                                        <label>Danger Level</label>
                                        <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, DangerLevel: e.target.value })} value={ToolsandSparesInfo.DangerLevel} />
                                    </div>

                                    <div className='col-lg-4 mb-2'>
                                        <label>Applicator No</label>
                                        <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, Applicator: e.target.value })} value={ToolsandSparesInfo.Applicator} />
                                    </div>

                                    <div className='col-lg-4 mb-2'>
                                        <label>Blade Type</label>
                                        <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, BladeType: e.target.value })} value={ToolsandSparesInfo.BladeType} />
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
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Machine Master</h1>
                            <button type="button" className="btn-close" onClick={() => setIsModalVisible1(false)} data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='d-flex flex-wrap row'>
                                <div className='col-lg-4 mb-2 '>
                                    <label>Tool No</label>
                                    <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, ToolNo: e.target.value })} value={ToolsandSparesInfo.ToolNo} />
                                </div>
                                <div className='col-lg-4 mb-2'>
                                    <label>Description</label>
                                    <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, Description: e.target.value })} value={ToolsandSparesInfo.Description} />
                                </div>
                                <div className='col-lg-4 mb-2'>
                                    <label>Thickness</label>
                                    <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, Thickness: e.target.value })} value={ToolsandSparesInfo.Thickness} />
                                </div>
                                <div className='col-lg-4 mb-2'>
                                    <label>Width</label>
                                    <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, Width: e.target.value })} value={ToolsandSparesInfo.Width} />
                                </div>
                                <div className='col-lg-4 mb-2'>
                                    <label>Length</label>
                                    <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, Length: e.target.value })} value={ToolsandSparesInfo.Length} />
                                </div>

                                <div className='col-lg-4 mb-2'>
                                    <label>Height</label>
                                    <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, Height: e.target.value })} value={ToolsandSparesInfo.Height} />
                                </div>

                                <div className='col-lg-4 mb-2'>
                                    <label>Breadth</label>
                                    <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, Breadth: e.target.value })} value={ToolsandSparesInfo.Breadth} />
                                </div>

                                <div className='col-lg-4 mb-2'>
                                    <label>Tool Weight</label>
                                    <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, ToolWeight: e.target.value })} value={ToolsandSparesInfo.ToolWeight} />
                                </div>

                                <div className='col-lg-4 mb-2'>
                                    <label>Min. Stock</label>
                                    <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, MinStock: e.target.value })} value={ToolsandSparesInfo.MinStock} />
                                </div>

                                <div className='col-lg-4 mb-2'>
                                    <label>Life Time</label>
                                    <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, LifeTime: e.target.value })} value={ToolsandSparesInfo.LifeTime} />
                                </div>

                                <div className='col-lg-4 mb-2'>
                                    <label>Danger Level</label>
                                    <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, DangerLevel: e.target.value })} value={ToolsandSparesInfo.DangerLevel} />
                                </div>

                                <div className='col-lg-4 mb-2'>
                                    <label>Applicator No</label>
                                    <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, Applicator: e.target.value })} value={ToolsandSparesInfo.Applicator} />
                                </div>

                                <div className='col-lg-4 mb-2'>
                                    <label>Blade Type</label>
                                    <input className='form-control  custom-border' type='text' onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, BladeType: e.target.value })} value={ToolsandSparesInfo.BladeType} />
                                </div>


                                <div className='col-lg-4 mb-2'>
                                    <label>Status</label>
                                    <select className='form-select  custom-border'  onChange={(e) => setToolsandSparesInfo({ ...ToolsandSparesInfo, Status: e.target.value })} value={ToolsandSparesInfo.Status}>
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
                                        <a href="/ToolsandSpares_Temp.xlsx" className=' nav-link text-decoration-underline ' download>Click to Download</a>
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
                        <i className="bi bi-plus-circle me-1"></i> <span className='pt-1'>Add Tools and Spares</span>
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
ToolsandSpares.propTypes = {
    auth: PropTypes.any.isRequired,
};

export default ToolsandSpares