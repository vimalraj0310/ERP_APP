import { cilLayers, cilPlus, cilDelete, cilPencil, cilTrash, cilPeople, cilCloudDownload, cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CPaginationItem, CCardBody, CPagination, CCard, CFormLabel, CCol, CForm, CFormCheck, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CTooltip } from '@coreui/react'
import React, { useState, useEffect, useRef } from "react";
import apiService from '../../../apiService';
import swal from 'sweetalert';
import * as XLSX from 'xlsx';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { API_URL } from 'src/config';
import PropTypes from 'prop-types'; // Import PropTypes
const Branches = ({ auth }) => {
  const navigate = useNavigate();

  const [editvisible, setEditvisible] = useState(false)

  const [deletevisible, setDeletevisible] = useState(false)

  const [TableDatas, SetTableDatas] = useState([])


  const [Name, SetName] = useState('')

  const [UpdateName, SetUpdateName] = useState('')

  const [editid, Seteditid] = useState('')

  const [Status, setStatus] = useState('')



  const adddata = async () => {
    setStatus('Add')
    setEditvisible(true)
    SetName('')
    SetUpdateName('')
  };


  const onchangeRole = async (e) => {
    const name = e.target.value
    SetName(name)
    SetUpdateName(name)
  }


  const handleCreateRole = async () => {
    if (Name === '') {
      swal({
        text: 'Please Enter The Branch',
        icon: "warning"
      })
      return
    }

    const isValidationSuccess = TableDatas.some((item) => {
      return (
        item.branchName.toLowerCase() === Name.toLowerCase()
      )
    })
    if (isValidationSuccess) {
      swal({
        text: "This Branch Name is Already Exitsing",
        icon: "warning"
      });
      return;
    }

    try {

      const name = Name.toLocaleLowerCase().trim()

      const alldata = { id: 0, branchName: name, createdby: 0, updateby: 0, mood: 'I' }

      const response = await axios.post(`${API_URL}/BranchMaster`, alldata)

      if (response.status === 200) {
        fetchGridData()
        setEditvisible(false)
        SetName('')
        swal({
          text: "Branches Created SuccessFully",
          icon: "success"
        })
      }

    } catch (err) {

      console.log(err);
    }




  }


  const fetchGridData = async () => {

    try {

      const alldata = { id: 0, branchName: '', createdby: 0, updateby: 0, mood: 'S' }

      const response = await axios.post(`${API_URL}/BranchMaster`, alldata)

      if (response.status === 200) {
        SetTableDatas(response.data)
      }


    } catch (err) {

      console.log(err);
    }

  }


  const handleedit = async (id) => {
    try {

      const alldata = { id: id, branchName: '', createdby: 0, updateby: 0, mood: 'E' }

      const response = await axios.post(`${API_URL}/BranchMaster`, alldata)

      if (response.status === 200) {

        SetUpdateName(response.data[0].branchName)

        Seteditid(id)

        setStatus('edit')

        setEditvisible(true)


      }


    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  };


  const handleupdate = async () => {
    try {

      if (UpdateName === '') {
        swal({
          text: 'Please Enter The Branch Name',
          icon: 'warning'
        })
        return
      }

      const alldata = { id: editid, branchName: UpdateName, createdby: 0, updateby: 0, mood: 'U' }

      const response = await axios.post(`${API_URL}/BranchMaster`, alldata)



      if (response.status === 200) {

        setEditvisible(false)

        fetchGridData()

        swal({
          text: 'Branch Name Update SuccessFully',
          icon: 'success'
        })
      }


    } catch (err) {

      console.log(err);

    }

  }

  const handledelete = async (id) => {
    try {
      setDeletevisible(true)
      Seteditid(id)
    } catch (err) {
      console.log(err);
    }


  };


  const confirmDelete = async () => {
    try {

      const alldata = { id: editid, branchName: '', createdby: 0, updateby: 0, mood: 'D' }

      const response = await axios.post(`${API_URL}/BranchMaster`, alldata)


      if (response.status === 200) {

        swal({
          text: 'Branch Name Deleted SuccessFully',
          icon: 'success'
        })
        setDeletevisible(false)
        fetchGridData()
      }

    } catch (err) {
      console.log(err);
    }

  }

  useEffect(() => {
    fetchGridData()
  }, [])


  const [filteredData, setFilteredData] = useState([]);

  const handlesearch = async (e) => {
    try {
      const input = e.target.value.toLowerCase();

      const filterdata = TableDatas.filter((data) =>
        data.branchName.toLowerCase().includes(input)
      );

      setFilteredData(filterdata);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      {/* Edit Model start*/}
      <CModal
        size='sm'
        alignment="center"
        visible={editvisible}
        onClose={() => setEditvisible(false)}
        aria-labelledby="VerticallyCenteredExample"
      >
        <CModalTitle id="VerticallyCenteredExample" className='ms-3'>{Status === 'Add' ? 'Create New Branch' : 'Edit Branch'}</CModalTitle>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="hsn">Branches <span style={{ color: 'red' }}>*</span></CFormLabel>
            <CFormInput
              className='mb-3'
              type="text"
              id='name'
              placeholder="Source"
             onChange={(e) => onchangeRole(e)}
             value={UpdateName}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditvisible(false)}>
            CANCEL
          </CButton>
          <CButton color="primary"
            onClick={() => Status === 'Add' ? handleCreateRole() : handleupdate()} >{Status === 'Add' ? 'ADD' : 'SAVE'}
          </CButton>
        </CModalFooter>
      </CModal>


      {/* Edit model end*/}



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
          <CButton color="primary" onClick={() => confirmDelete()}>CONFIRM</CButton>
        </CModalFooter>
      </CModal>
      {/* Delete model end*/}
      <div>
        <CRow className='mb-3'>
          <div className="d-flex">
            <CIcon className="me-2" size={'xxl'} icon={cilLayers} />
            <h3> All Branches</h3>
          </div>
        </CRow>
        <CRow className='d-flex mb-3'>
          <CCol className='d-flex justify-content-end'>
            <CTooltip content="select members to export">
              <CButton type="submit" color="danger" variant="outline" className='me-2'>
                <CIcon icon={cilCloudDownload} /> EXPORT
              </CButton>
            </CTooltip>
            <CButton type="submit" color="success" variant="outline" onClick={() => adddata()}>
              <CIcon icon={cilPlus} /> ADD
            </CButton>
          </CCol>
        </CRow>
        <CCard className="mb-3">
          <CCardBody>
            <CCol sm={4}>
              <CFormInput type="search" className="mb-3 border border-bottom flex-direction-start" placeholder="Search Department"
                onChange={handlesearch}
              />
            </CCol>

            <CTable align="middle" className="mb-3 border-bottom" hover responsive >
              <CTableHead color="dark">
                <CTableRow>
                  {/* <CTableHeaderCell scope="col"><CFormCheck /> </CTableHeaderCell> */}
                  <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">BRANCH</CTableHeaderCell>
                  <CTableHeaderCell scope="col">ACTION</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {/* Map over clientData to dynamically render rows */}

                {(filteredData.length > 0 ? filteredData : TableDatas).map((d, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{d.branchName}</CTableDataCell>
                    <CTableDataCell className='col-sm-2'>
                      <CTooltip content="Edit">
                        <CIcon icon={cilPencil} size='xl' className='mx-2' onClick={() => handleedit(d.branchid)}  style={{ color: 'white', background: 'green', borderRadius: '5px' }}/>
                      </CTooltip>
                      <CTooltip content="Delete">
                        <CIcon icon={cilTrash} size='xl' className='ms-2' onClick={() => handledelete(d.branchid)}  style={{ color: 'white', background: 'red', borderRadius: '5px' }}/>
                      </CTooltip>
                    </CTableDataCell>
                  </CTableRow>
                ))}

              </CTableBody>
            </CTable>
            {/* Pagination */}

            {/* <CPagination aria-label="Page navigation example" align="end">
              <CPaginationItem
                aria-label="Previous"
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
              >
                <span aria-hidden="true">&laquo;</span>
              </CPaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <CPaginationItem
                  key={i}
                  active={i + 1 === currentPage}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                aria-label="Next"
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
              >
                <span aria-hidden="true">&raquo;</span>
              </CPaginationItem>
            </CPagination> */}


          </CCardBody>
        </CCard>
      </div>



    </div>
  )
}
Branches.propTypes = {
  auth: PropTypes.any.isRequired,
};
export default Branches