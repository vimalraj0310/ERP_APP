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


const Product = ({ auth, ipAddress }) => {
    const [loading, setLoading] = useState(false); // Loader state
    // PartCode, Description, HSNCode, OPStock, Model, BatchQty, CycleTime, GSTSlab, Tax, DwgNo, Rev, Date, QuotationRef, MinQty, MaxQty, PDFFile
    const [ProductRegister, setProductRegister] = useState({
        PartCode: '', Description: '', HSNCode: '', OPStock: '',
        Model: '', BatchQty: '', CycleTime: '', GSTSlab: '',
        Tax: '', DwgNo: '', Rev: '', Date: '',
        QuotationRef: '', MinQty: '', MaxQty: '', PDFFile: '',
        Created_Date: '', Created_By: '', Modified_Date: '', Modified_By: '', BranchID: ''
    });


    const [updateProduct, setUpdateProduct] = useState({
        PartCode: '', Description: '', HSNCode: '', OPStock: '',
        Model: '', BatchQty: '', CycleTime: '', GSTSlab: '',
        Tax: '', DwgNo: '', Rev: '', Date: '',
        QuotationRef: '', MinQty: '', MaxQty: '', PDFFile: '',
        Created_Date: '', Created_By: '', Modified_Date: '', Modified_By: '', BranchID: '', Status: ''
    });

    const handleClear = () => {
        setProductRegister({
            PartCode: '', Description: '', HSNCode: '', OPStock: '',
            Model: '', BatchQty: '', CycleTime: '', GSTSlab: '',
            Tax: '', DwgNo: '', Rev: '', Date: '',
            QuotationRef: '', MinQty: '', MaxQty: '', PDFFile: '',
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
    const [pdfData, setPdfData] = useState(null);
    const [showPdfViewer, setShowPdfViewer] = useState(false);

    const handlePDFView = (base64String) => {
        setPdfData(base64String);
        setShowPdfViewer(true);
    };


    const column = [
        { field: "PartCode", headerName: 'Part Code', width: '110px', editable: true },
        { field: "Description", headerName: 'Description', width: '140px', editable: true },
        { field: "HSNCode", headerName: 'HSN Code', width: '140px', editable: true },
        { field: "OPStock", headerName: 'OP Stock', width: '140px', editable: true },
        { field: "Model", headerName: 'Model', width: '160px', editable: true },
        { field: "BatchQty", headerName: 'Batch Qty', width: '130px', editable: true },
        { field: "CycleTime", headerName: 'Cycle Time', width: '130px', editable: true },
        { field: "GSTSlab", headerName: 'GST Slab', width: '130px', editable: true },
        { field: "Tax", headerName: 'Tax', width: '130px', editable: true },
        { field: "DwgNo", headerName: 'Drawing No', width: '130px', editable: true },
        { field: "Rev", headerName: 'Revision', width: '130px', editable: true },
        { field: "Date", headerName: 'Date', width: '140px', editable: true },
        { field: "QuotationRef", headerName: 'Quotation Ref', width: '140px', editable: true },
        { field: "MinQty", headerName: 'Min Qty', width: '130px', editable: true },
        { field: "MaxQty", headerName: 'Max Qty', width: '130px', editable: true },
        {
            field: "PDFFile",
            headerName: 'PDF File',
            width: '130px',
            editable: false,
            cellRenderer: (params) => {
                console.log('Params Data PDFFile:', params.data.PDFFile);                
                const PDFFile = params.data.PDFFile; // Extract PDFFile
                return PDFFile ? (
                    <a 
                        href={`data:application/pdf;base64,${PDFFile.split(',')[0]}`} // Base64 handling
                        target="_blank" 
                        rel="noopener noreferrer"
                        // style={{ color: 'blue', textDecoration: 'underline' }}
                    >
                        View Document
                    </a>
                ) : (
                    'No Document'
                );
            },
        },
        
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
                        onClick={() => handleEdit(params.data.PartCode)}
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
                        onClick={() => handleDelete(params.data.PartCode)}
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
            fileName: 'AllProduct_Data.csv',
        };
        gridRef.current.api.exportDataAsCsv(params);
    };


    // Add Customer information
    const [duplicateData, SetduplicateData] = useState([])

    console.log(ProductRegister);

    const handleNewProductRegister = async () => {
        // console.log('NewProductRegister:', ProductRegister);

        if (ProductRegister.PartCode === '') {
            swal({
                text: 'Please Enter Part Code',
                icon: 'warning'
            });
            return;
        }

        if (duplicateData.length > 0) {
            const isValidPartCode = duplicateData.some((item) => {
                return (
                    item.PartCode &&
                    item.PartCode.toLowerCase() === ProductRegister.PartCode.toLowerCase()
                );
            });

            if (isValidPartCode) {
                swal({
                    text: "This Part Code is Already Existing",
                    icon: "warning"
                });
                return;
            }
        }

        if (ProductRegister.Description === '') {
            swal({
                text: 'Please Enter Description',
                icon: 'warning'
            });
            return;
        }
        if (ProductRegister.HSNCode === '') {
            swal({
                text: 'Please Enter HSN Code',
                icon: 'warning'
            });
            return;
        }
        if (ProductRegister.OPStock === '') {
            swal({
                text: 'Please Enter Opening Stock',
                icon: 'warning'
            });
            return;
        }
        if (ProductRegister.Model === '') {
            swal({
                text: 'Please Enter Model',
                icon: 'warning'
            });
            return;
        }
        if (ProductRegister.BatchQty === '') {
            swal({
                text: 'Please Enter Batch Quantity',
                icon: 'warning'
            });
            return;
        }
        if (ProductRegister.CycleTime === '') {
            swal({
                text: 'Please Enter Cycle Time',
                icon: 'warning'
            });
            return;
        }
        if (ProductRegister.GSTSlab === '') {
            swal({
                text: 'Please Enter GST Slab',
                icon: 'warning'
            });
            return;
        }
        if (ProductRegister.Tax === '') {
            swal({
                text: 'Please Enter Tax',
                icon: 'warning'
            });
            return;
        }
        if (ProductRegister.DwgNo === '') {
            swal({
                text: 'Please Enter Drawing No',
                icon: 'warning'
            });
            return;
        }
        if (ProductRegister.Rev === '') {
            swal({
                text: 'Please Enter Revision',
                icon: 'warning'
            });
            return;
        }
        if (ProductRegister.Date === '') {
            swal({
                text: 'Please Enter Date',
                icon: 'warning'
            });
            return;
        }
        if (ProductRegister.QuotationRef === '') {
            swal({
                text: 'Please Enter Quotation Reference',
                icon: 'warning'
            });
            return;
        }
        if (ProductRegister.MinQty === '') {
            swal({
                text: 'Please Enter Minimum Quantity',
                icon: 'warning'
            });
            return;
        }
        if (ProductRegister.MaxQty === '') {
            swal({
                text: 'Please Enter Maximum Quantity',
                icon: 'warning'
            });
            return;
        }
        if (ProductRegister.PDFFile === '') {
            swal({
                text: 'Please Enter PDF File',
                icon: 'warning'
            });
            return;
        }

        const formData = new FormData();
        Object.entries(ProductRegister).forEach(([key, value]) => {
            formData.append(key, value);
        });

        if (ProductRegister.PDFFile) {
            // Convert base64 to Blob
            const byteCharacters = atob(ProductRegister.PDFFile.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const file = new File([blob], 'document.pdf', { type: 'application/pdf' });

            formData.append('PDFFile', file);
        }


        try {
            setLoading(true);
            const alldata = {
                mode: 'I',
                id: '',
                created_user: auth.empid,
                systemip: ipAddress,
                branchid: auth.branchid,
            };
            Object.entries(alldata).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const response = await axios.post(`${API_URL}/Product`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setLoading(false);
                // Reset form
                setProductRegister({
                    PartCode: '', Description: '', HSNCode: '', OPStock: '',
                    Model: '', BatchQty: '', CycleTime: '', GSTSlab: '',
                    Tax: '', DwgNo: '', Rev: '', Date: '',
                    QuotationRef: '', MinQty: '', MaxQty: '', PDFFile: ''
                });
                // FetchGridData();
                swal({
                    text: 'Product Registered Successfully',
                    icon: 'success'
                });
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    // Upload file

    const handlePDFFile = (event) => {
        const files = event.target.files;
        console.log('Selected files:', files); // Log selected files
        const validFileTypes = ['application/pdf'];
        const maxFileSize = 1 * 1024 * 1024; // 1 MB
        let totalFileSize = 0;
        const fileReaders = [];
        let isCancel = false;

        const readFile = (file) => {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    const base64String = fileReader.result;
                    console.log('Base64 String:', base64String); // Log the base64 string
                    resolve(base64String);
                };
                fileReader.onerror = reject;
                fileReader.readAsDataURL(file);
            });
        };

        for (let i = 0; i < files.length; i++) {
            if (!validFileTypes.includes(files[i].type)) {
                swal({
                    text: 'Only PDF files are allowed.',
                    icon: 'warning'
                });
                event.target.value = null;
                return;
            }
            totalFileSize += files[i].size;
            if (totalFileSize > maxFileSize) {
                swal({
                    text: 'Total file size exceeds 1 MB.',
                    icon: 'warning'
                });
                event.target.value = null;
                return;
            }
            fileReaders.push(readFile(files[i]));
        }

        Promise.all(fileReaders)
            .then((base64Files) => {
                if (!isCancel) {
                    console.log('Final Base64 File:', base64Files[0]); // Log final base64 file
                    setProductRegister((prev) => ({ ...prev, PDFFile: base64Files[0] }));
                    setUpdateProduct((prev) => ({ ...prev, PDFFile: base64Files[0] }));
                }
            })
            .catch((error) => console.error('File read error:', error));

        return () => {
            isCancel = true;
        };
    };


    // const handlePDFFile = (event) => {
    //     const files = event.target.files; // This is a FileList
    //     console.log('Selected files:', files);

    //     if (files.length > 0) {
    //         const totalFileSize = Array.from(files).reduce((total, file) => total + file.size, 0);
    //         const maxFileSize = 1 * 1024 * 1024; // 1 MB

    //         if (totalFileSize > maxFileSize) {
    //             swal({ text: 'Total file size exceeds 1 MB.', icon: 'warning' });
    //             event.target.value = null; // Clear the input
    //             return;
    //         }

    //         // Store the first file object directly, assuming only one file is allowed
    //         setProductRegister((prev) => ({
    //             ...prev,
    //             PDFFile: files[0], // Use the first file
    //         }));
    //     }
    // };



    // const handleEdit = async (Prod_ID) => {
    //     console.log('Edit button clicked with id:', Prod_ID);

    //     try {
    //         console.error('Error in handleEdit:');
    //         SetEditid(Prod_ID);
    //         const alldata = { ...updateProduct, mode: 'E', id: Prod_ID, createby: '', updateby: '', branchid: auth.branchid };

    //         const response = await axios.post(`${API_URL}/Product`, alldata);
    //         console.log("API Response:", response.data); // Log the response

    //         if (response.status === 200) {
    //             if (Array.isArray(response.data) && response.data.length > 0) {
    //                 const {
    //                     PartCode, Description, HSNCode, OPStock, Model,
    //                     BatchQty, CycleTime, GSTSlab, Tax, DwgNo,
    //                     Rev, Date, QuotationRef, MinQty, MaxQty, PDFFile,
    //                     Created_Date, Created_By, Modified_Date, Modified_By, BranchID
    //                 } = response.data[0];

    //                 console.log("Fetched Data:", {
    //                     PartCode, Description, HSNCode, OPStock, Model,
    //                     BatchQty, CycleTime, GSTSlab, Tax, DwgNo,
    //                     Rev, Date, QuotationRef, MinQty, MaxQty, PDFFile,
    //                     Created_Date, Created_By, Modified_Date, Modified_By, BranchID
    //                 });

    //                 // Update the product state with new data
    //                 setUpdateProduct(prevState => ({
    //                     ...prevState,
    //                     PartCode, Description, HSNCode, OPStock, Model,
    //                     BatchQty, CycleTime, GSTSlab, Tax, DwgNo,
    //                     Rev, Date, QuotationRef, MinQty, MaxQty, PDFFile,
    //                     Created_Date, Created_By, Modified_Date, Modified_By, BranchID,
    //                 }));
    //                 setEditvisible(true);
    //             } else {
    //                 console.error('No data returned from the server');
    //             }
    //         }

    //     } catch (err) {
    //         console.error('Error in handleEdit:', err);
    //     }
    // };

    const handleEdit = async (Prod_ID) => {
        console.log('Edit button clicked with id:', Prod_ID);

        try {
            // Prepare the data to send
            const alldata = {
                ...updateProduct,
                mode: 'E',
                id: Prod_ID,
                created_user: auth.empid || 'default_user_id', // Ensure this is set correctly
                branchid: auth.branchid
            };

            // Check if PDFFile is present
            if (updateProduct.PDFFile) {
                const base64String = updateProduct.PDFFile.split(',')[1];
                console.log('Base64 String:', base64String); // Log for debugging

                try {
                    const byteCharacters = atob(base64String); // Attempt to decode
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: 'application/pdf' });
                    const file = new File([blob], 'document.pdf', { type: 'application/pdf' });
                    alldata.PDFFile = file; // Set the PDF file correctly
                } catch (error) {
                    console.error('Error decoding PDF file:', error);
                    alldata.PDFFile = null; // Handle as needed
                }
            } else {
                alldata.PDFFile = null; // Handle as needed
            }

            console.log("Prepared data for API call:", alldata); // Log prepared data

            const response = await axios.post(`${API_URL}/Product`, alldata);
            console.log("API Response:", response.data); // Log the response

            if (response.status === 200) {
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const {
                        PartCode, Description, HSNCode, OPStock, Model,
                        BatchQty, CycleTime, GSTSlab, Tax, DwgNo,
                        Rev, Date, QuotationRef, MinQty, MaxQty, PDFFile, Status,
                        Created_Date, Created_By, Modified_Date, Modified_By, BranchID
                    } = response.data[0];

                    console.log("Fetched Data:", {
                        PartCode, Description, HSNCode, OPStock, Model,
                        BatchQty, CycleTime, GSTSlab, Tax, DwgNo,
                        Rev, Date, QuotationRef, MinQty, MaxQty, PDFFile, Status,
                        Created_Date, Created_By, Modified_Date, Modified_By, BranchID
                    });

                    // Update the product state with new data
                    setUpdateProduct(prevState => ({
                        ...prevState,
                        PartCode, Description, HSNCode, OPStock, Model,
                        BatchQty, CycleTime, GSTSlab, Tax, DwgNo,
                        Rev, Date, QuotationRef, MinQty, MaxQty, PDFFile, Status,
                        Created_Date, Created_By, Modified_Date, Modified_By, BranchID,
                    }));
                    SetEditid(Prod_ID)
                    setEditvisible(true);
                } else {
                    console.error('No data returned from the server');
                }
            }
        } catch (err) {
            console.error('Error in handleEdit:', err);
        }
    };


    const handleUpdateProduct = async () => {
        // console.log('UpdateProduct:', updateProduct);

        if (updateProduct.PartCode === '' || updateProduct.PartCode === 'null') {
            swal({
                text: 'Please Enter Part Code',
                icon: 'warning'
            });
            return;
        }

        if (duplicateData.length > 0) {
            const isValidPartCode = duplicateData.some((item) => {
                return (
                    item.PartCode &&
                    item.PartCode.toLowerCase() === updateProduct.PartCode.toLowerCase()
                );
            });

            if (isValidPartCode) {
                swal({
                    text: "This Part Code is Already Existing",
                    icon: "warning"
                });
                return;
            }
        }

        if (updateProduct.Description === '') {
            swal({
                text: 'Please Enter Description',
                icon: 'warning'
            });
            return;
        }
        if (updateProduct.HSNCode === '') {
            swal({
                text: 'Please Enter HSN Code',
                icon: 'warning'
            });
            return;
        }
        if (updateProduct.OPStock === '') {
            swal({
                text: 'Please Enter Opening Stock',
                icon: 'warning'
            });
            return;
        }
        if (updateProduct.Model === '') {
            swal({
                text: 'Please Enter Model',
                icon: 'warning'
            });
            return;
        }
        if (updateProduct.BatchQty === '') {
            swal({
                text: 'Please Enter Batch Quantity',
                icon: 'warning'
            });
            return;
        }
        if (updateProduct.CycleTime === '') {
            swal({
                text: 'Please Enter Cycle Time',
                icon: 'warning'
            });
            return;
        }
        if (updateProduct.GSTSlab === '') {
            swal({
                text: 'Please Enter GST Slab',
                icon: 'warning'
            });
            return;
        }
        if (updateProduct.Tax === '') {
            swal({
                text: 'Please Enter Tax',
                icon: 'warning'
            });
            return;
        }
        if (updateProduct.DwgNo === '') {
            swal({
                text: 'Please Enter Drawing Number',
                icon: 'warning'
            });
            return;
        }
        if (updateProduct.Rev === '') {
            swal({
                text: 'Please Enter Revision',
                icon: 'warning'
            });
            return;
        }
        if (updateProduct.Date === '') {
            swal({
                text: 'Please Enter Date',
                icon: 'warning'
            });
            return;
        }
        if (updateProduct.QuotationRef === '') {
            swal({
                text: 'Please Enter Quotation Reference',
                icon: 'warning'
            });
            return;
        }
        if (updateProduct.MinQty === '') {
            swal({
                text: 'Please Enter Minimum Quantity',
                icon: 'warning'
            });
            return;
        }
        if (updateProduct.MaxQty === '') {
            swal({
                text: 'Please Enter Maximum Quantity',
                icon: 'warning'
            });
            return;
        }
        if (updateProduct.PDFFile === '') {
            swal({
                text: 'Please Enter PDF File',
                icon: 'warning'
            });
            return;
        }

        // Prepare form data
        const formData = new FormData();
        Object.entries(updateProduct).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // Handle PDF file
        if (updateProduct.PDFFile) {
            try {
                const pdfData = updateProduct.PDFFile.split(',');
                if (pdfData[0] === 'data:application/pdf;base64') {
                    const base64String = pdfData[1];
                    const byteCharacters = atob(base64String);
                    const byteNumbers = new Uint8Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const blob = new Blob([byteNumbers], { type: 'application/pdf' });
                    formData.append('PDFFile', blob);
                }
            } catch (error) {
                console.error('Error processing PDF file:', error);
                swal({ text: 'Invalid PDF File format', icon: 'error' });
                return;
            }
        }

        // Prepare additional data for submission
        const additionalData = {
            mode: 'U',
            id: Editid,
            created_user: auth.empid,
            branchid: auth.branchid,
        };
        Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, value);
        });
        console.log('after the formData fetching', formData)
        try {
            setLoading(true);
            const response = await axios.post(`${API_URL}/Product`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                setLoading(false);
                setUpdateProduct({
                    PartCode: '', Description: '', HSNCode: '', OPStock: '', Model: '',
                    BatchQty: '', CycleTime: '', GSTSlab: '', Tax: '', DwgNo: '',
                    Rev: '', Date: '', QuotationRef: '', MinQty: '', MaxQty: '', PDFFile: ''
                });
                FetchGridData();
                swal({
                    text: 'Product Details Updated Successfully',
                    icon: 'success'
                });
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };


    const handleDelete = (Prod_ID) => {
        console.log('status change button clicked with id:', Prod_ID);
        try {
            setDeletevisible(true)
            SetEditid(Prod_ID)
        } catch (err) {
            console.log(err);
        }
    }



    const handleConfirmDelete = async () => {
        try {
            const alldata = {
                ...updateProduct, mode: 'D', id: Editid, created_user: auth.empid, systemip: ipAddress, branchid: auth.branchid
            };

            const response = await axios.post(`${API_URL}/Product`, alldata);
            setDeletevisible(false);
            FetchGridData();

            if (response.status === 200) {
                swal({
                    text: 'Product Inactivated Successfully',
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
                ...ProductRegister, mode: 'S', created_user: auth.empid, systemip: ipAddress, branchid: auth.branchid
            };
            const response = await axios.post(`${API_URL}/Product`, alldata);

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
                    <h3>All Product</h3>
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
                        <h3> Edit Product</h3>
                    </div>
                    </CModalTitle>

                    <CModalBody>
                        <CCard className="mb-3">
                            <CCardHeader className="bg-dark text-light">Edit Product Information</CCardHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="partCode">Part Code<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='partCode'
                                                onChange={(e) => setUpdateProduct({ ...updateProduct, PartCode: e.target.value })}
                                                value={updateProduct.PartCode}
                                                disabled={loading}
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="description">Description<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='description'
                                                onChange={(e) => setUpdateProduct({ ...updateProduct, Description: e.target.value })}
                                                value={updateProduct.Description}
                                                disabled={loading}
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="hsnCode">HSN Code<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='hsnCode'
                                                onChange={(e) => setUpdateProduct({ ...updateProduct, HSNCode: e.target.value })}
                                                value={updateProduct.HSNCode}
                                                disabled={loading}
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="opStock">Opening Stock<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='opStock'
                                                onChange={(e) => setUpdateProduct({ ...updateProduct, OPStock: e.target.value })}
                                                value={updateProduct.OPStock}
                                                disabled={loading}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="model">Model<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='model'
                                                onChange={(e) => setUpdateProduct({ ...updateProduct, Model: e.target.value })}
                                                value={updateProduct.Model}
                                                disabled={loading}
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="batchQty">Batch Qty<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='batchQty'
                                                onChange={(e) => setUpdateProduct({ ...updateProduct, BatchQty: e.target.value })}
                                                value={updateProduct.BatchQty}
                                                disabled={loading}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="cycleTime">Cycle Time<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='cycleTime'
                                                onChange={(e) => setUpdateProduct({ ...updateProduct, CycleTime: e.target.value })}
                                                value={updateProduct.CycleTime}
                                                disabled={loading}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="gstSlab">GST Slab<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='gstSlab'
                                                onChange={(e) => setUpdateProduct({ ...updateProduct, GSTSlab: e.target.value })}
                                                value={updateProduct.GSTSlab}
                                                disabled={loading}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="tax">Tax<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='tax'
                                                onChange={(e) => setUpdateProduct({ ...updateProduct, Tax: e.target.value })}
                                                value={updateProduct.Tax}
                                                disabled={loading}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="dwgNo">Drawing No<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='dwgNo'
                                                onChange={(e) => setUpdateProduct({ ...updateProduct, DwgNo: e.target.value })}
                                                value={updateProduct.DwgNo}
                                                disabled={loading}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="rev">Revision<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='rev'
                                                onChange={(e) => setUpdateProduct({ ...updateProduct, Rev: e.target.value })}
                                                value={updateProduct.Rev}
                                                disabled={loading}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="date">Date<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="date"
                                                id='date'
                                                onChange={(e) => setUpdateProduct({ ...updateProduct, Date: e.target.value })}
                                                value={updateProduct.Date}
                                                disabled={loading}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="quotationRef">Quotation Ref<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='quotationRef'
                                                onChange={(e) => setUpdateProduct({ ...updateProduct, QuotationRef: e.target.value })}
                                                value={updateProduct.QuotationRef}
                                                disabled={loading}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="minQty">Min Qty<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='minQty'
                                                onChange={(e) => setUpdateProduct({ ...updateProduct, MinQty: e.target.value })}
                                                value={updateProduct.MinQty}
                                                disabled={loading}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="maxQty">Max Qty<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='maxQty'
                                                onChange={(e) => setUpdateProduct({ ...updateProduct, MaxQty: e.target.value })}
                                                value={updateProduct.MaxQty}
                                                disabled={loading}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="pdfFile">PDF File<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="file"
                                                id='pdfFile'
                                                name='PDFFile'
                                                onChange={handlePDFFile}
                                                
                                                disabled={loading}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="status">Status<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormSelect
                                                aria-label="Default select example"
                                                options={['Status', ...status.map(option => ({ label: option.lable, value: option.value }))]}
                                                onChange={(e) => setUpdateProduct({ ...updateProduct, Status: e.target.value })}
                                                value={updateProduct.Status}
                                                disabled={loading}
                                            />
                                        </div>
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
                            <CButton type="submit" color="success" onClick={handleUpdateProduct}>
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
                        <h3> Add Product</h3>
                    </div>
                    </CModalTitle>

                    <CModalBody>
                        <CCard className="mb-3">
                            <CCardHeader className="bg-dark text-light">Product Information</CCardHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="partCode">Part Code<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='partCode'
                                                onChange={(e) => setProductRegister({ ...ProductRegister, PartCode: e.target.value })}
                                                value={ProductRegister.PartCode}
                                                disabled={loading}
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="description">Description<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='description'
                                                onChange={(e) => setProductRegister({ ...ProductRegister, Description: e.target.value })}
                                                value={ProductRegister.Description}
                                                disabled={loading}
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="hsnCode">HSN Code<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='hsnCode'
                                                onChange={(e) => setProductRegister({ ...ProductRegister, HSNCode: e.target.value })}
                                                value={ProductRegister.HSNCode}
                                                disabled={loading}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="opStock">Opening Stock<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='opStock'
                                                onChange={(e) => setProductRegister({ ...ProductRegister, OPStock: e.target.value })}
                                                value={ProductRegister.OPStock}
                                                disabled={loading}
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="model">Model<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='model'
                                                onChange={(e) => setProductRegister({ ...ProductRegister, Model: e.target.value })}
                                                value={ProductRegister.Model}
                                                disabled={loading}
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="batchQty">Batch Quantity<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='batchQty'
                                                onChange={(e) => setProductRegister({ ...ProductRegister, BatchQty: e.target.value })}
                                                value={ProductRegister.BatchQty}
                                                disabled={loading}
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="cycleTime">Cycle Time<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='cycleTime'
                                                onChange={(e) => setProductRegister({ ...ProductRegister, CycleTime: e.target.value })}
                                                value={ProductRegister.CycleTime}
                                                disabled={loading}
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="gstSlab">GST Slab<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='gstSlab'
                                                onChange={(e) => setProductRegister({ ...ProductRegister, GSTSlab: e.target.value })}
                                                value={ProductRegister.GSTSlab}
                                                disabled={loading}
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="tax">Tax<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='tax'
                                                onChange={(e) => setProductRegister({ ...ProductRegister, Tax: e.target.value })}
                                                value={ProductRegister.Tax}
                                                disabled={loading}
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="dwgNo">Drawing No<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='dwgNo'
                                                onChange={(e) => setProductRegister({ ...ProductRegister, DwgNo: e.target.value })}
                                                value={ProductRegister.DwgNo}
                                                disabled={loading}
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="rev">Revision<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='rev'
                                                onChange={(e) => setProductRegister({ ...ProductRegister, Rev: e.target.value })}
                                                value={ProductRegister.Rev}
                                                disabled={loading}
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="date">Date<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="date"
                                                id='date'
                                                onChange={(e) => setProductRegister({ ...ProductRegister, Date: e.target.value })}
                                                value={ProductRegister.Date}
                                                disabled={loading}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="quotationRef">Quotation Ref<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='quotationRef'
                                                onChange={(e) => setProductRegister({ ...ProductRegister, QuotationRef: e.target.value })}
                                                value={ProductRegister.QuotationRef}
                                                disabled={loading}
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="minQty">Minimum Quantity<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='minQty'
                                                onChange={(e) => setProductRegister({ ...ProductRegister, MinQty: e.target.value })}
                                                value={ProductRegister.MinQty}
                                                disabled={loading}
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="maxQty">Maximum Quantity<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='maxQty'
                                                onChange={(e) => setProductRegister({ ...ProductRegister, MaxQty: e.target.value })}
                                                value={ProductRegister.MaxQty}
                                                disabled={loading}
                                                maxLength={50}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol lg={3}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="pdfFile">PDF File<span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="file"
                                                id='pdfFile'
                                                name='PDFFile'
                                                onChange={handlePDFFile}
                                                disabled={loading}
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
                            <CButton type="submit" color="success" onClick={() => handleNewProductRegister()}  >
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

Product.propTypes = {
    auth: PropTypes.any.isRequired,
    ipAddress: PropTypes.string,
};
export default Product