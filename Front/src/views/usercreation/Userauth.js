import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { CButton, CCardBody, CCard, CFormSelect, CCol, CRow, CModal, CModalBody, CModalHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CFormSwitch } from '@coreui/react';
import { cilClipboard, cilCheckAlt } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import swal from 'sweetalert';
import axios from 'axios';
import { API_URL } from 'src/config';


const Userauth = ({ auth }) => {
    const [editvisible, setEditvisible] = useState(false);

    const [UserRolePermissonData, SetUserRolePermissonData] = useState([]);


    const [ReportGridData, SetReportGridData] = useState([]);

    const [RoleDropDownData, SetRoleDropDownData] = useState([]);

    const [PageMappingDataRoleid, SetPageMappingDataRoleid] = useState(null);

    const [PageMappingDataPageid, SetPageMappingDataPageid] = useState([]);

    const [modifiedScreenIds, setModifiedScreenIds] = useState([]);



    const colmun = [
        { field: "employeecode" },
        { field: "employeename" },
        { field: "ScreeenName", headerName: 'Screen Name' },
        { field: "userrole", headerName: 'Role Type' },
        {
            field: "status",
            cellRenderer: (params) => (
                <p className='text-success fw-normal bg-brown'>{params.value === 'a' ? 'Access' : "In Access"}</p>
            )
        },
    ];


    const defaultColDef = useMemo(() => ({
        filter: 'agTextColumnFilter',
        floatingFilter: true,
    }), []);


    const handleMappingPage = async () => {
        if (PageMappingDataRoleid === null) {
            swal({ text: 'Please Select One Role', icon: 'warning' });
            return;
        }

        if (UserRolePermissonData.length === 0) {
            swal({ text: 'No Permissions to Save', icon: 'warning' });
            return;
        }

        try {
            const alldata = {
                roleid: PageMappingDataRoleid,
                pageid: modifiedScreenIds,
                createby: auth.empid,
                branchid: auth.branchid,
                mood: 'I'
            };


            console.log(alldata);

            const response = await axios.post(`${API_URL}/RoleMapping`, alldata);
            if (response.status === 200) {
                swal({
                    text: 'Permissions Updated Successfully',
                    icon: 'success'
                });
            }
        } catch (error) {
            console.log(error);
        }
    };



    // const handleenable = (e, Screenid) => {
    //     const updatedStatus = e.target.checked ? 'a' : 'i'; // Assuming 'a' is for enabled and 'i' for disabled

    //     SetUserRolePermissonData(prevData => prevData.map(item => item.Screenid === Screenid ? { ...item, status: updatedStatus } : item));
    // };

    const handleenable = (e, Screenid) => {
        const updatedStatus = e.target.checked ? 'a' : 'i'; // Assuming 'a' is for enabled and 'i' for disabled
    
        // Update UserRolePermissonData
        SetUserRolePermissonData(prevData => {
            const updatedData = prevData.map(item =>
                item.Screenid === Screenid ? { ...item, status: updatedStatus } : item
            );
    
            // Update modifiedPermissions
            setModifiedScreenIds(prevModified => {
                const existingIndex = prevModified.findIndex(item => item.Screenid === Screenid);
                if (existingIndex > -1) {
                    // Update existing entry if status changes
                    if (updatedStatus !== prevModified[existingIndex].status) {
                        return [
                            ...prevModified.slice(0, existingIndex),
                            { Screenid, status: updatedStatus },
                            ...prevModified.slice(existingIndex + 1),
                        ];
                    } else {
                        // If status is the same as before, return the previous state
                        return prevModified;
                    }
                } else {
                    // Add new entry if status is updated
                    return [...prevModified, { Screenid, status: updatedStatus }];
                }
            });
    
            return updatedData;
        });
    };
    


    const FetchRoleDropdown = async () => {
        try {
            const alldata = { id: '', userrole: '', createdby: '', updateby: '', branchid: auth.branchid, mode: 'S' };
            const response = await axios.post(`${API_URL}/UserroleMaster`, alldata);
            if (response.status === 200) {
                SetRoleDropDownData(response.data);
            }
        } catch (err) {
            console.log(err);
        }
    };


    const ReportSearch = async () => {
        if (PageMappingDataRoleid === null) {
            swal({ text: 'Please Select One Role', icon: 'warning' });
            return;
        }

        try {
            const alldata = { pageid: '', roleid: PageMappingDataRoleid, createby: '', mood: 'R', branchid: auth.branchid };
            const response = await axios.post(`${API_URL}/RoleMapping`, alldata);
            if (response.status === 200) {
                SetReportGridData(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        FetchRoleDropdown();
    }, []);


    const handleRoleSelect = async (e) => {
        try {
            const roleid = e;
            SetPageMappingDataRoleid(roleid);

            if (e === 'Please Select Role') {
                SetUserRolePermissonData([]);
            } else {
                const alldata = { pageid: '', roleid: roleid, createby: '', mood: 'SD', branchid: auth.branchid };
                const response = await axios.post(`${API_URL}/RoleMapping`, alldata);
                if (response.status === 200) {
                    SetUserRolePermissonData(response.data);
                    console.log(response.data);
                }
            }
           
            
        } catch (error) {
            console.log(error);
        }
    };



    return (
        <>
            <CModal
                size="xl"
                alignment="center"
                visible={editvisible}
                onClose={() => setEditvisible(false)}
                aria-labelledby="VerticallyCenteredExample"
            >
                <CModalHeader> User Privilege Details</CModalHeader>
                <CModalBody>
                    <CCard className='m-3'>
                        <CCardBody>
                            <CRow className='my-3 d-flex justify-content-center'>
                                <CCol md={4}>
                                    <CFormSelect
                                        className='mt-3'
                                        aria-label="Default select example"
                                        options={['Please Select Role', ...RoleDropDownData.map(option => ({ label: option.userrole, value: option.roleid }))
                                        ]}
                                        onChange={(e) => handleRoleSelect(e.target.value)}
                                    />
                                </CCol>
                                <CCol md={4}>
                                    <CButton className="mt-3" type="clear" variant='outline' color="primary" onClick={ReportSearch}>
                                        <CIcon icon={cilClipboard} /> VIEW
                                    </CButton>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>

                    <div className="ag-theme-quartz" style={{ height: 500 }}>
                        <AgGridReact
                            rowData={ReportGridData}
                            columnDefs={colmun}
                            defaultColDef={defaultColDef}
                            rowSelection="multiple"
                            pagination={true}
                            paginationPageSize={10}
                            paginationPageSizeSelector={[10, 20, 30, 40, 50]}
                        />
                    </div>
                </CModalBody>
            </CModal>

            <div>
                <CCard className="mb-3">
                    <CCardBody>
                        <CRow className='mb-5 mt-3 d-flex justify-content-center'>
                            <CCol md={4}>
                                <CFormSelect
                                    aria-label="Default select example"
                                    options={['Please Select Role', ...RoleDropDownData.map(option => ({ label: option.userrole, value: option.roleid }))
                                    ]}
                                    onChange={(e) => handleRoleSelect(e.target.value)}
                                />

                            </CCol>
                            <CCol md={4}>
                                <CButton type="submit" variant='outline' color="success" onClick={handleMappingPage}>
                                    <CIcon icon={cilCheckAlt} /> SAVE
                                </CButton>
                                <CButton className="mx-2" type="clear" variant='outline' color="primary" onClick={() => setEditvisible(true)}>
                                    <CIcon icon={cilClipboard} /> VIEW
                                </CButton>
                            </CCol>
                        </CRow>




                        <CTable align="middle" className="mb-3 border-bottom" hover responsive>
                            <CTableHead color="dark">
                                <CTableRow>
                                    <CTableHeaderCell scope="col">S.no</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">SCREEN ID</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">NAME</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Permission</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {UserRolePermissonData.length > 0 ? (
                                    UserRolePermissonData.map((d, index) => (
                                        <CTableRow key={d.Screenid || index}> {/* Use a unique identifier if available */}
                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                            <CTableDataCell>{d.Screenid}</CTableDataCell>
                                            <CTableDataCell>{d.ScreeenName}</CTableDataCell>
                                            <CTableDataCell>
                                                <CFormSwitch id={`checkbox-${index}`} checked={d.status === 'a'}
                                                    onChange={(e) => handleenable(e, d.Screenid)} />
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))
                                ) : (
                                    <CTableRow>
                                        <CTableDataCell colSpan={4}>No Data Found</CTableDataCell>
                                    </CTableRow>
                                )}
                            </CTableBody>
                        </CTable>




                    </CCardBody>
                </CCard>
            </div>
        </>
    );
};

Userauth.propTypes = {
    auth: PropTypes.object.isRequired,
};

export default Userauth;
