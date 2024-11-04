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
// import { Link } from 'react-router-dom';
import { BallTriangle } from 'react-loader-spinner';
import { API_URL } from 'src/config';
import PropTypes from 'prop-types';
import CIcon from '@coreui/icons-react';
import { CTooltip } from '@coreui/react';
import { cilPencil, cilXCircle } from '@coreui/icons';
const RMTransferMapping = ({ auth }) => {
    const [tableData, setTableData] = useState([]);
    const [Transfer, setTransfer] = useState({
        FromCode: '', ToCode: '', TransferedBy: auth.empid,branchid:auth.branchid,RMTM_ID:'',Status:''
    })
    const [loading, setLoading] = useState(false); // Loader state
    const modalRef = useRef(null);
    const modalRef1 = useRef(null);
    const [Uploadvisible, setUploadvisible] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [10, 50, 100];
    // View Start
    const handleEdit = async (RMTM_ID) => {
        try {
            const alldata = { RMTM_ID, mode: 'SI' }
            const response = await axios.post(`${API_URL}/RMTransferMappingIndividual`, alldata);
            console.log(RMTM_ID)
            setTransfer(...response.data.send)
            // return () => clearInterval(interval);

        } catch (error) {
            console.error('ERROR EDITING RECORD:', error);
            throw error;
        }
    }
    const EditRenderer = (params) => {
        return (
            <div>
                {/* <button className='btn' onClick={() => { handleEdit(params.data.RMTM_ID); setIsModalVisible1(true); }}>
                    <i className="bi bi-pen fs-5"></i>
                </button> */}
                  <CTooltip content="Edit">
                    <CIcon
                        size='xl'
                        icon={cilPencil}
                        className='m-2'
                        onClick={() => { handleEdit(params.data.RMTM_ID); setIsModalVisible1(true); }}
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
    const handleInActive = async (RMTM_ID) => {
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

                        const alldata = { RMTM_ID, mode: 'In-active' }
                        const response = await axios.post(`${API_URL}/InActive_RMtransferMapping`, alldata);
                        console.log(RMTM_ID)
                        Swal.fire("In-Active Success!", "", "success");
                        fetchData();
                        setTransfer({
                            Status:''
                        })

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
            const alldata = { ...Transfer, UpdatedBy: auth.empid }
            console.log(alldata)
            const response = await axios.post(`${API_URL}/Update_RMtransferMapping`, alldata)
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
               
                fetchData()

                setTransfer({
                    FromCode:'',ToCode:'',Status:''
                })

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
            const response = await axios.get(`${API_URL}/RMTransferMappingSelect`);
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
        { headerName: " From Code", field: "FromCode", filter: true, floatingFilter: true, width: 130 },
        { headerName: "ToCode", field: "ToCode", filter: true, floatingFilter: true, width: 190 },
        // { headerName: "To Code", field: "ToCode", filter: true, floatingFilter: true, width: 130 },
        // { headerName: "To Location", field: "ToLocation", filter: true, floatingFilter: true, width: 200 },
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
                //     onClick={() => handleInActive(params.data.RMTM_ID)}
                //     style={{ display: params.data.Status === 'i' ? 'none' : 'block' }}></i>
                <CTooltip content="Inactive">
                <CIcon
                    size='xl'
                    icon={cilXCircle}
                    className='m-2'
                    onClick={() => handleInActive(params.data.RMTM_ID)}
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
    // const generatePDF = async () => {
    //     // Get the filtered data from the AG Grid
    //     setLoading(true)
    //     try {
    //         const filteredData = gridRef.current.api.getModel().rowsToDisplay.map(rowNode => rowNode.data);
    //         console.log(filteredData);
    //         const doc = new jsPDF({ format: 'a4' });
    //         const title = 'Supplier-FG Rate Mapping';
    //         const titleX = doc.internal.pageSize.width / 2; // Centering the title horizontally
    //         const titleY = 15; // Setting the vertical position of the title

    //         // Setting font size and weight
    //         doc.setFontSize(12);
    //         doc.setFont("helvetica", "bold");

    //         // Center the title using alignment
    //         doc.text(title, titleX, titleY, { align: 'center' });

    //         // Extracting column headers and mapping the data
    //         if (filteredData.length > 0) {
    //             // Define the column names and the corresponding keys in the data
    //             const columnMapping = [
    //                 { header: "Supplier Name", key: "SupplierName" },
    //                 { header: "Supplier Code", key: "SupplierCode" },
    //                 { header: "Part Number", key: "PartNumber" },
    //                 { header: "Description", key: "Description" },
    //                 { header: "Price", key: "Price" }
    //             ];

    //             // Extract headers and data for the table
    //             const columnHeaders = columnMapping.map(col => col.header);
    //             const data = filteredData.map(obj => columnMapping.map(col => obj[col.key] || ''));

    //             doc.autoTable({
    //                 head: [columnHeaders],
    //                 body: data,
    //                 margin: { top: 20, right: 10, left: 10, bottom: 30 }, // Add bottom margin for footer
    //                 styles: {
    //                     theme: 'grid',
    //                     halign: "center",
    //                     valign: "middle", // Center vertically
    //                     fontSize: 10,
    //                     overflow: 'linebreak', // Allow line break to avoid overlap
    //                     cellWidth: 'wrap', // Adjust cell width to fit text
    //                 },
    //                 columnStyles: {
    //                     0: { cellWidth: 40 },
    //                     1: { cellWidth: 40 },
    //                     2: { cellWidth: 40 },
    //                     3: { cellWidth: 40 },
    //                     4: { cellWidth: 30 }

    //                 },
    //                 didDrawPage: function (data) {
    //                     const pageCount = doc.internal.getNumberOfPages();
    //                     doc.setFontSize(10);

    //                     const pageWidth = doc.internal.pageSize.width;
    //                     const footerY = doc.internal.pageSize.height - 10; // Positioning the footer 10 units from the bottom

    //                     // Replace with your footer text
    //                     const footerText = `Page ${data.pageCount}`;
    //                     doc.text(footerText, pageWidth / 2, footerY, { align: 'center' });
    //                 }
    //             });

    //             doc.save(`Supplier-FGRateMapping.pdf`);
    //         } else {
    //             alert('No data available to export');
    //         }
    //     } catch (error) {

    //         setLoading(false)

    //         console.error("Error generating PDF:", error);
    //         alert('Failed to generate PDF. Please try again.');
    //     } finally {
    //         setLoading(false); // Reset loading state in the end
    //     }
    // };
    // Download PDF Format END

    const gridRef = useRef(null);
    // const onExportClick = () => {
    //     const params = {
    //         fileName: 'Supplier-FGRateMapping.csv',
    //     };
    //     gridRef.current.api.exportDataAsCsv(params);
    // };
    // const [select, setselect] = useState({
    //     id: '',
    // })
    useEffect(() => {
        fetchData();
    }, []);
    const inputRef = useRef(null);
    useEffect(() => {
        if (isModalVisible && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isModalVisible])

    // const handleKeydown = async (e) => {
    //     if (e.key === 'Enter') {
    //         handleEnter();
    //     }
    // }
    // const handleEnter = async () => {
    //     if (SupplierInfo.SupplierName === '') {
    //         Swal.fire({
    //             title: 'warning',
    //             text: 'Please Enter Supplier',
    //             icon: 'warning'
    //         })
    //         return
    //     }
    //     try {
    //         const alldata = { ...data, ...SupplierInfo, branchid: auth.branchid }
    //         console.log(tableData)
    //         setTableData(prevData => {
    //             const newData = [...prevData, alldata];
    //             if (gridRef.current) {
    //                 // gridRef.current.api.setRowData(newData);
    //             }
    //             return newData;
    //         });

    //         setdata({
    //             PartNumber: '', Price: '', Description: ''
    //         })

    //     } catch (err) {
    //         console.log(err)
    //     }
    // }
    const HandleSaveChanges = async () => {
        try {
            console.log(Transfer)
            const response = await axios.post(`${API_URL}/RMTransferMapping`, Transfer)
            if (response.status === 200) {
                console.log('Data Passed Successfully')
                Swal.fire({
                    icon: 'success',
                    title: 'SuccessFully Mapped',
                    text: 'Mapped Rate to Supplier SuccessFully'
                }).then(() => {
                    setIsModalVisible(false)
                });
                fetchData()
                setTransfer({
                    FromCode:'',
                    ToCode:''
                })
            }


        } catch (err) {
            console.log(err)
        }
    }



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
                            <h1 className="modal-title fs-5" id="exampleModalLabel">RM Transfer Mapping Master</h1>
                            <button type="button" className="btn-close" onClick={() => setIsModalVisible(false)} data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <Row>
                                <Col className='d-flex'>
                                    <label className='col-lg-2 pt-2 me-2 text-end'>From Code:</label>
                                    <input className='form-control' onChange={(e) => setTransfer({ ...Transfer, FromCode: e.target.value })} />
                                </Col>
                            </Row>
                            <Row className='mt-5'>
                                <Col className='d-flex'>
                                    <label className='col-lg-2 pt-2 me-2 text-end'>To Code:</label>
                                    <input className='form-control' onChange={(e) => setTransfer({ ...Transfer, ToCode: e.target.value })} />
                                </Col>
                            </Row>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setIsModalVisible(false)} data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={HandleSaveChanges}>Transfer</button>
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
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Rate Master-FG Part EDIT</h1>
                            <button type="button" className="btn-close" onClick={() => setIsModalVisible1(false)} data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <Row>
                                <Col lg={4}>
                                    <label>From Code</label>
                                    <input className='form-control'
                                        onChange={(e) => setTransfer({ ...Transfer, FromCode: e.target.value })}
                                        value={Transfer.FromCode} />
                                </Col>
                                <Col lg={4}>
                                    <label>To Code</label>
                                    <input className='form-control'
                                        onChange={(e) => setTransfer({ ...Transfer, ToCode: e.target.value })}
                                        value={Transfer.ToCode} />
                                </Col>
                               
                                <Col lg={4}>
                                    <label>Status</label>
                                    <select onChange={(e) => setTransfer({ ...Transfer, Status: e.target.value })} className='form-select' value={Transfer.Status}>
                                        <option>Select Status</option>
                                        <option value='a'>Active</option>
                                        <option value='i'>In-Active</option>

                                    </select>
                                </Col>

                            </Row>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setIsModalVisible1(false)} >Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleUpdate}>Update Changes</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Download Format Register Asset*/}
            {/* <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
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
            </div> */}

            {/* {Uploadvisible && (
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
                                        <a href="/SFGRM_Temp.xlsx" className=' nav-link text-decoration-underline ' download>Click to Download</a>
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
            )} */}

            <div className='card px-5 pt-2 pb-3'>
                <div className='d-flex justify-content-end flex-wrap '>
                    {/* File import */}
                    {/* <button className=" btn btn-secondary mx-2 mb-2 " onClick={() => setUploadvisible(true)}>
                        <i className="bi bi-cloud-download me-1 "></i>Import
                    </button> */}

                    {/* File Export Register */}
                    {/* <button className="btn btn-danger text-white mx-2 d-flex mb-2  "
                        data-bs-toggle="modal" data-bs-target="#exampleModal"
                    >
                        <i className="bi bi-cloud-upload  me-1 "></i>Export
                    </button> */}
                    {/* Add New Register */}
                    <button className="btn  border-0 btn-success text-white mx-2 mb-2 " onClick={() => setIsModalVisible(true)}>
                        <i className="bi bi-plus-circle me-1"></i> <span className='pt-1'>Add </span>
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
RMTransferMapping.propTypes = {
    auth: PropTypes.any.isRequired,
};

export default RMTransferMapping
