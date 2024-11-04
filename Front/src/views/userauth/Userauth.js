import React, { useState, useEffect, useMemo } from "react";
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  CButton,
  CCardBody,
  CCard,
  CFormSelect,
  CCol,
  CRow,
  CModal,
  CModalBody,
  CModalHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormSwitch,
  CPaginationItem,
  CPagination,
  CFormInput
} from '@coreui/react';
import { cilClipboard, cilCheckAlt, cilSearch } from '@coreui/icons';
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
  const [modifiedScreenIds, setModifiedScreenIds] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

      const response = await axios.post(`${API_URL}/RoleMapping`, alldata);
      if (response.status === 200) {
        swal({ text: 'Permissions Updated Successfully', icon: 'success' });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEnable = (e, Screenid) => {
    const updatedStatus = e.target.checked ? 'a' : 'i';

    SetUserRolePermissonData(prevData => {
      const updatedData = prevData.map(item =>
        item.Screenid === Screenid ? { ...item, status: updatedStatus } : item
      );

      setModifiedScreenIds(prevModified => {
        const existingIndex = prevModified.findIndex(item => item.Screenid === Screenid);
        if (existingIndex > -1) {
          if (updatedStatus !== prevModified[existingIndex].status) {
            return [
              ...prevModified.slice(0, existingIndex),
              { Screenid, status: updatedStatus },
              ...prevModified.slice(existingIndex + 1),
            ];
          } else {
            return prevModified;
          }
        } else {
          return [...prevModified, { Screenid, status: updatedStatus }];
        }
      });

      return updatedData;
    });
  };

  const fetchRoleDropdown = async () => {
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

  const reportSearch = async () => {
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
    fetchRoleDropdown();
  }, []);

  useEffect(() => {
    const totalItems = UserRolePermissonData.length;
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
    paginate(1); // Reset to the first page whenever data changes
  }, [UserRolePermissonData, itemsPerPage]);

  const paginate = (pageNumber) => {
    if (pageNumber > totalPages || pageNumber < 1) return;
    setCurrentPage(pageNumber);
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentItems(UserRolePermissonData.slice(startIndex, endIndex));
  };

  const getPageItems = () => {
    const items = [];
    const pageRange = 2;
    const startPage = Math.max(2, currentPage - pageRange);
    const endPage = Math.min(totalPages - 1, currentPage + pageRange);

    items.push(
      <CPaginationItem key={1} active={currentPage === 1} onClick={() => paginate(1)}>
        1
      </CPaginationItem>
    );

    if (startPage > 2) {
      items.push(<CPaginationItem key="start-ellipsis" disabled>...</CPaginationItem>);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <CPaginationItem key={i} active={i === currentPage} onClick={() => paginate(i)}>
          {i}
        </CPaginationItem>
      );
    }

    if (endPage < totalPages - 1) {
      items.push(<CPaginationItem key="end-ellipsis" disabled>...</CPaginationItem>);
    }

    items.push(
      <CPaginationItem key={totalPages} active={currentPage === totalPages} onClick={() => paginate(totalPages)}>
        {totalPages}
      </CPaginationItem>
    );

    return items;
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search

    const filteredData = UserRolePermissonData.filter((staffMember) =>
      Object.values(staffMember).some((value) =>
        value !== null && value !== undefined && value.toString().toLowerCase().includes(query)
      )
    );

    setCurrentItems(filteredData);
  };


  const handleRoleSelect = async (e) => {
    const roleid = e;
    SetPageMappingDataRoleid(roleid);

    if (roleid === '') {
      SetUserRolePermissonData([]);
      return;
    }

    try {
      const alldata = { pageid: '', roleid, createby: '', mood: 'SD', branchid: auth.branchid };
      const response = await axios.post(`${API_URL}/RoleMapping`, alldata);
      if (response.status === 200) {
        SetUserRolePermissonData(response.data);
        console.log("Fetched permissions data:", response.data); // Debugging
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
                    options={[
                      { label: 'Please Select Role', value: '' },
                      ...RoleDropDownData.map(option => ({ label: option.userrole, value: option.roleid }))
                    ]}
                    onChange={(e) => handleRoleSelect(e.target.value)}
                  />
                </CCol>
                <CCol md={4}>
                  <CButton className="mt-3" type="clear" variant='outline' color="primary" onClick={reportSearch}>
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
            />
          </div>
        </CModalBody>
      </CModal>

      <div>
        <CCard className="mb-3">
          <CCardBody>
            <CRow className='mb-3 mt-3 d-flex justify-content-center'>
              <CCol md={4}>
                <CFormSelect
                  aria-label="Default select example"
                  options={[
                    { label: 'Please Select Role', value: '' },
                    ...RoleDropDownData.map(option => ({ label: option.userrole, value: option.roleid }))
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
          </CCardBody>
        </CCard>
        <CCard>
          <CCardBody>
          <CCol sm={3}>
              <div className="position-relative">
                <CFormInput
                  type="search"
                  className="mb-3 border shadow-sm "
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearch}
                  style={{ paddingLeft: '40px' }} // Adjust input padding to accommodate the icon
                />
                <CIcon className="position-absolute top-50 start-0 translate-middle-y text-muted ms-1" icon={cilSearch} size='xxl' style={{ left: '10px' }} />
              </div>
            </CCol>
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
                {currentItems.length > 0 ? (
                  currentItems.map((d, index) => (
                    <CTableRow key={d.Screenid || index}>
                      <CTableDataCell>{(currentPage - 1) * itemsPerPage + index + 1}</CTableDataCell>
                      <CTableDataCell>{d.Screenid}</CTableDataCell>
                      <CTableDataCell>{d.ScreeenName}</CTableDataCell>
                      <CTableDataCell>
                        <CFormSwitch id={`checkbox-${index}`} checked={d.status === 'a'}
                          onChange={(e) => handleEnable(e, d.Screenid)} />
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

            {/* Pagination */}
            {totalPages > 0 && (
              <div>
                <div className="pagination-info">
                  Showing page {currentPage} of {totalPages} ({UserRolePermissonData.length} items)
                </div>
                <CPagination aria-label="Page navigation example" align="end">
                  <CPaginationItem
                    aria-label="Previous"
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </CPaginationItem>
                  {getPageItems()}
                  <CPaginationItem
                    aria-label="Next"
                    disabled={currentPage === totalPages}
                    onClick={() => paginate(currentPage + 1)}
                  >
                    <span aria-hidden="true">&raquo;</span>
                  </CPaginationItem>
                </CPagination>
              </div>
            )}
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
