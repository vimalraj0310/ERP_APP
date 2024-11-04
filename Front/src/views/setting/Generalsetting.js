import { cilArrowRight, cilChartLine, cilCheckAlt, cilDelete, cilMove, cilPencil, cilPlus, cilPrint, cilSave, cilSettings, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCard, CCardBody, CCol, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CModal, CModalBody, CModalFooter, CModalTitle, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane, CTooltip } from '@coreui/react'
import React, { useEffect, useMemo, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import swal from 'sweetalert';
import axios from 'axios';
import { API_URL } from 'src/config';
import PropTypes from 'prop-types'; // Import PropTypes

const Generalsetting = ({ auth }) => {
    const [deletevisible, setDeletevisible] = useState(false)
    const [activeKey, setActiveKey] = useState(1)

    const [editvisible, setEditvisible] = useState(false)

    const [Generalsettingeditvisible, SetGeneralsettingeditvisible] = useState(false)

    const [EmailConfigdata, setEmailConfigdata] = useState({
        frommail: '',
        apppassword: '',
        ServiceName: '',
        HostName: '',
        PortNumber: ''
    })

    const [EmailConfigUpdatedata, setEmailConfigUpdatedata] = useState({
        frommail: '',
        apppassword: '',
        ServiceName: '',
        HostName: '',
        PortNumber: ''
    })

    const [generalSettingData, SetgeneralSettingData] = useState({
        autologouttime: null,
        passwordexpireday: null
    })

    const [generalSettingUpdateData, SetgeneralSettingUpdateData] = useState({
        autologouttime: null,
        passwordexpireday: null
    })


    const [GridData, SetGridData] = useState([])

    const [GeneralSettingData, SetGeneralSettingData] = useState([])

    const [Editid, setEditid] = useState(null)  /// this for email and othersetting edit id store


    const colmun = [
        //{ field: "Email Type", checkboxSelection: true, },
        { field: "frommail", headerName: 'From Email' },
        { field: "apppassword", headerName: 'App Password' },
        { field: "ServiceName", headerName: 'Service Name' },
        { field: "HostName", headerName: 'Host Name' },
        { field: "PortNo", headerName: 'Port No' },
        {
            headerName: 'Edit',
            // field: 'Edit',
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
                        onClick={() => handleEdit(params.data.id)}
                        style={{ color: 'white', background: 'rgb(34,139,34)', borderRadius: '5px' }}
                    />
                </CTooltip>
            )
        },
        {
            headerName: 'Delete',
            // field: "Delete",
            width: 75,
            filter: false,
            sortable: false,
            floatingFilter: false,
            editable: false,
            cellRenderer: (params) => (
                <CTooltip content="Delete">
                    <CIcon
                        size='xl'
                        icon={cilTrash}
                        className='m-2'
                        onClick={() => handleDelete(params.data.id)}
                        style={{ color: 'white', background: 'rgb(237,28,36)', borderRadius: '5px' }}
                    />
                </CTooltip>
            )
        },

    ]


    const GeneralSettingcolmun = [
        { field: "AutoLogoutTime", headerName: 'Auto Logout Minutes' },
        { field: "PasswordExpireDay", headerName: 'Password Expire Days' },
        {
            headerName: 'Edit',
            // field: "Delete",
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
                        onClick={() => handleEditGeneralsetting(params.data.id)}
                        style={{ color: 'white', background: 'rgb(34,139,34)', borderRadius: '5px' }}
                    />
                </CTooltip>
            )
        },
        {
            headerName: 'Delete',
            // field: "Delete",
            width: 100,
            floatingFilter: false,
            cellRenderer: (params) => (
                <CTooltip content="Delete">
                    <CIcon
                        size='xl'
                        icon={cilTrash}
                        className='m-2'
                        onClick={() => handleDeleteGeneralsetting(params.data.id)}
                        style={{ color: 'white', background: 'rgb(237,28,36)', borderRadius: '5px' }}
                    />
                </CTooltip>
            )
        },

    ]

    const defaultColDef = useMemo(() => {
        return {
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            editable: true,
        }
    }, []);


    const handlecreateEmailConfig = async () => {
        if (EmailConfigdata.frommail === '') {
            swal({
                text: 'Please Enter From Email Address',
                icon: 'warning'
            })
            return
        }

        if (EmailConfigdata.apppassword === '') {
            swal({
                text: 'Please Enter App Password',
                icon: 'warning'
            })
            return
        }

        if (EmailConfigdata.ServiceName === '') {
            swal({
                text: 'Please Enter Service Name',
                icon: 'warning'
            })
            return
        }

        if (EmailConfigdata.HostName === '') {
            swal({
                text: 'Please Enter Host Name',
                icon: 'warning'
            })
            return
        }

        if (EmailConfigdata.PortNumber === '') {
            swal({
                text: 'Please Enter PortNumber',
                icon: 'warning'
            })
            return
        }

        try {

            const alldata = { ...EmailConfigdata, id: 0, createdby: auth.empid, updateby: auth.empid, branchid: auth.branchid, mode: 'I' }

            const response = await axios.post(`${API_URL}/emailconfigsettings`, alldata)

            if (response.status === 200) {
                swal({
                    text: 'Email Config Done SuccessFully',
                    icon: 'success'
                })
                FetchGridData()
            }


        } catch (error) {

            console.log(error);
        }
    }


    const FetchGridData = async () => {
        try {

            const alldata = { ...EmailConfigdata, id: 0, createdby: auth.empid, updateby: 0, branchid: auth.branchid, mode: 'S' }

            const response = await axios.post(`${API_URL}/emailconfigsettings`, alldata)

            if (response.status === 200) {

                SetGridData(response.data)
            }

        } catch (error) {

            console.log(error);
        }
    }

    const FetchGeneralSettingData = async () => {
        try {

            const alldata = { ...generalSettingData, id: 0, createdby: auth.empid, branchid: auth.branchid, mode: 'S' }

            const response = await axios.post(`${API_URL}/othersetting`, alldata)

            if (response.status === 200) {
                console.log(response.data);
                SetGeneralSettingData(response.data)
            }

        } catch (error) {

            console.log(error);
        }
    }

    const handleEdit = async (ids) => {
        try {
            setEditid(ids)
            const alldata = { ...EmailConfigdata, id: ids, createdby: auth.empid, updateby: 0, branchid: auth.branchid, mode: 'E' }

            const response = await axios.post(`${API_URL}/emailconfigsettings`, alldata)

            if (response.status === 200) {

                const { frommail, apppassword, ServiceName, HostName, PortNo } = response.data[0]
                setEmailConfigUpdatedata({
                    ...EmailConfigUpdatedata, frommail: frommail, apppassword: apppassword, ServiceName: ServiceName,
                    HostName: HostName, PortNumber: PortNo
                })
                setEditvisible(true)
            }

        } catch (error) {

            console.log(error);
        }
    }

    const handleEditGeneralsetting = async (ids) => {
        try {
            setEditid(ids)
            const alldata = { ...generalSettingData, id: ids, createdby: auth.empid, branchid: auth.branchid, mode: 'E' }

            const response = await axios.post(`${API_URL}/othersetting`, alldata)

            if (response.status === 200) {
                const { PasswordExpireDay, AutoLogoutTime } = response.data[0]
                SetgeneralSettingUpdateData({ ...generalSettingUpdateData, passwordexpireday: PasswordExpireDay, autologouttime: AutoLogoutTime })
                SetGeneralsettingeditvisible(true)
            }

        } catch (error) {
            console.log(error);
        }
    }



    const handleDelete = async (id) => {
        try {

            const alldata = { ...EmailConfigdata, id: id, createdby: auth.empid, updateby: auth.empid, branchid: auth.branchid, mode: 'D' }

            const response = await axios.post(`${API_URL}/emailconfigsettings`, alldata)

            if (response.status === 200) {
                setDeletevisible(false)
                SetGridData(response.data)
                FetchGridData()
            }

        } catch (error) {

            console.log(error);
        }
    }

    const handleDeleteGeneralsetting = async (id) => {
        try {

            const alldata = { ...generalSettingData, id: id, createdby: auth.empid, branchid: auth.branchid, mode: 'D' }

            const response = await axios.post(`${API_URL}/othersetting`, alldata)

            if (response.status === 200) {
                console.log(response.data);
                FetchGeneralSettingData()
            }

        } catch (error) {

            console.log(error);
        }
    }

    const handleupdateEmailConfig = async () => {

        if (EmailConfigUpdatedata.frommail === '') {
            swal({
                text: 'Please Enter From Email Address',
                icon: 'warning'
            })
            return
        }

        if (EmailConfigUpdatedata.apppassword === '') {
            swal({
                text: 'Please Enter App Password',
                icon: 'warning'
            })
            return
        }

        if (EmailConfigUpdatedata.ServiceName === '') {
            swal({
                text: 'Please Enter Service Name',
                icon: 'warning'
            })
            return
        }

        if (EmailConfigUpdatedata.HostName === '') {
            swal({
                text: 'Please Enter Host Name',
                icon: 'warning'
            })
            return
        }

        if (EmailConfigUpdatedata.PortNumber === '') {
            swal({
                text: 'Please Enter PortNumber',
                icon: 'warning'
            })
            return
        }

        try {

            const alldata = { ...EmailConfigUpdatedata, id: Editid, createdby: auth.empid, updateby: auth.empid, branchid: auth.branchid, mode: 'U' }

            const response = await axios.post(`${API_URL}/emailconfigsettings`, alldata)

            if (response.status === 200) {
                swal({
                    text: 'Email Config Done SuccessFully',
                    icon: 'success'
                })
                FetchGridData()
                setEditvisible(false)
            }
        } catch (error) {

            console.log(error);
        }
    }


    const handleSaveOtherSetting = async () => {
        if (generalSettingData.autologouttime === null) {
            swal({
                text: 'Please Enter Auto Logout Time',
                icon: 'warning'
            })
            return
        }

        if (generalSettingData.passwordexpireday === null) {
            swal({
                text: 'Please Enter Password Expire Day',
                icon: 'warning'
            })
            return
        }

        try {

            const alldata = { ...generalSettingData, id: 0, createdby: auth.empid, branchid: auth.branchid, mode: 'I' }

            const response = await axios.post(`${API_URL}/othersetting`, alldata)

            if (response.status === 200) {
                console.log(response.data);
                FetchGeneralSettingData()
            }

        } catch (error) {

            console.log(error);
        }
    }

    const handleUpdateOtherSetting = async () => {
        if (generalSettingUpdateData.autologouttime === null) {
            swal({
                text: 'Please Enter Auto Logout Time',
                icon: 'warning'
            })
            return
        }

        if (generalSettingUpdateData.passwordexpireday === null) {
            swal({
                text: 'Please Enter Password Expire Day',
                icon: 'warning'
            })
            return
        }
        try {


            const alldata = { ...generalSettingUpdateData, id: Editid, createdby: auth.empid, branchid: auth.branchid, mode: 'U' }

            console.log(alldata);

            const response = await axios.post(`${API_URL}/othersetting`, alldata)

            if (response.status === 200) {
                console.log(response.data);
                FetchGeneralSettingData()
                SetGeneralsettingeditvisible(false)
            }


        } catch (error) {


            console.log(error);
        }

    }

    useEffect(() => {
        FetchGridData()
        FetchGeneralSettingData()
    }, [])
    return (
        <div>

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
                    <CButton color="primary" onClick={() => handleDelete()}>CONFIRM</CButton>
                </CModalFooter>
            </CModal>
            {/* Delete model end*/}

            <CModal
                size="lg"
                alignment="center"
                visible={editvisible}
                onClose={() => setEditvisible(false)}
                aria-labelledby="VerticallyCenteredExample">

                <CModalBody>
                    <CCard className='mt-3'>
                        <CRow className='m-3'>
                            <CCol md={6}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="Email">From Email  <span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="email"
                                        id='Email'
                                        placeholder="example@gmail.com"
                                        onChange={(e) => setEmailConfigUpdatedata({ ...EmailConfigUpdatedata, frommail: e.target.value })}
                                        value={EmailConfigUpdatedata.frommail}
                                    // disabled={loading} // Disable input during loading
                                    />
                                </div>
                            </CCol>
                            <CCol md={6}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="apppassword">App Password  <span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='text'
                                        placeholder="App Password"
                                        onChange={(e) => setEmailConfigUpdatedata({ ...EmailConfigUpdatedata, apppassword: e.target.value })}
                                        value={EmailConfigUpdatedata.apppassword}

                                    // disabled={loading} // Disable input during loading
                                    />
                                </div>
                            </CCol>
                            <CCol md={6}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="service">Service Name  <span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='service'
                                        placeholder="Service"
                                        onChange={(e) => setEmailConfigUpdatedata({ ...EmailConfigUpdatedata, ServiceName: e.target.value })}
                                        value={EmailConfigUpdatedata.ServiceName}

                                    // disabled={loading} // Disable input during loading
                                    />
                                </div>
                            </CCol>
                            <CCol md={6}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="host">Host Name <span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='host'
                                        placeholder="Host Name"
                                        onChange={(e) => setEmailConfigUpdatedata({ ...EmailConfigUpdatedata, HostName: e.target.value })}
                                        value={EmailConfigUpdatedata.HostName}
                                    // disabled={loading} // Disable input during loading
                                    />
                                </div>
                            </CCol>
                            <CCol md={6}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="port">Port Number  <span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="number"
                                        id='Port'
                                        placeholder="Port Name"

                                        onChange={(e) => setEmailConfigUpdatedata({ ...EmailConfigUpdatedata, PortNumber: e.target.value })}
                                        value={EmailConfigUpdatedata.PortNumber}

                                    // disabled={loading} // Disable input during loading
                                    />
                                </div>
                            </CCol>
                            <div className='my-3 d-flex justify-content-end'>
                                <CButton className="mx-2" type="clear" color="danger">
                                    <CIcon icon={cilDelete} /> CLEAR
                                </CButton>
                                <CButton className='me-3' type="submit" color="success"
                                    onClick={handleupdateEmailConfig}
                                >
                                    <CIcon icon={cilCheckAlt} /> SAVE
                                </CButton>
                            </div >
                        </CRow>
                    </CCard>
                </CModalBody>
            </CModal>
            <CRow>
                <div className="d-flex">
                    <CIcon className="me-2" size={'xxl'} icon={cilSettings} />
                    <h3> General Settings</h3>
                </div>
            </CRow>
            <CNav variant="tabs border-info" className='border-3 border-bottom ' role="tablist">
                <CNavItem className="label-print-nav">
                    <CNavLink
                        href="/#/setting/generalsetup"
                        active={activeKey === 1}
                        onClick={() => {

                            setActiveKey(1)
                        }}
                    >
                        Email Format
                    </CNavLink>
                </CNavItem>
                <CNavItem className="label-print-nav text-dark">
                    <CNavLink
                        href="/#/setting/generalsetup"
                        active={activeKey === 2}
                        onClick={() => {
                            setActiveKey(2)
                            // GridDataFetch()

                        }}
                    >
                        Other Settings
                    </CNavLink>
                </CNavItem>
            </CNav>
            <CTabContent className="">

                <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 1} >
                    <CCard className='mt-3' style={{ display: GridData.length === 0 ? 'block' : 'none' }}>
                        <CRow className='m-3'>
                            <CCol md={4}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="Email">From Email  <span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="email"
                                        id='Email'
                                        placeholder="example@gmail.com"
                                        onChange={(e) => setEmailConfigdata({ ...EmailConfigdata, frommail: e.target.value })}
                                        value={EmailConfigdata.frommail}
                                    // disabled={loading} // Disable input during loading
                                    />
                                </div>
                            </CCol>
                            <CCol md={4}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="apppassword">App Password  <span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='text'
                                        placeholder="App Password"
                                        onChange={(e) => setEmailConfigdata({ ...EmailConfigdata, apppassword: e.target.value })}
                                        value={EmailConfigdata.apppassword}
                                    // disabled={loading} // Disable input during loading
                                    />
                                </div>
                            </CCol>
                            <CCol md={4}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="service">Service Name  <span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='service'
                                        placeholder="Service"
                                        onChange={(e) => setEmailConfigdata({ ...EmailConfigdata, ServiceName: e.target.value })}
                                        value={EmailConfigdata.ServiceName}

                                    // disabled={loading} // Disable input during loading
                                    />
                                </div>
                            </CCol>
                            <CCol md={4}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="host">Host Name <span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='host'
                                        placeholder="Host Name"
                                        onChange={(e) => setEmailConfigdata({ ...EmailConfigdata, HostName: e.target.value })}
                                        value={EmailConfigdata.HostName}
                                    // disabled={loading} // Disable input during loading
                                    />
                                </div>
                            </CCol>
                            <CCol md={4}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="port">Port Number  <span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="number"
                                        id='Port'
                                        placeholder="Port Name"
                                        onChange={(e) => setEmailConfigdata({ ...EmailConfigdata, PortNumber: e.target.value })}
                                        value={EmailConfigdata.PortNumber}
                                    // disabled={loading} // Disable input during loading
                                    />
                                </div>
                            </CCol>
                            <div className='my-3 d-flex justify-content-end'>
                                <CButton className="mx-2" type="clear" color="danger">
                                    <CIcon icon={cilDelete} /> CLEAR
                                </CButton>
                                <CButton className='me-3' type="submit" color="success"
                                    onClick={handlecreateEmailConfig}
                                >
                                    <CIcon icon={cilPlus} /> ADD
                                </CButton>
                            </div >
                        </CRow>
                    </CCard>
                    <div className="ag-theme-quartz mt-3    " style={{ height: 500 }}>
                        <AgGridReact
                            rowData={GridData}
                            columnDefs={colmun}
                            defaultColDef={defaultColDef}
                            // onGridReady={onGridReady}
                            rowSelection="multiple"
                            pagination={true}
                            paginationPageSize={10}
                            paginationPageSizeSelector={[10, 15, 20]}
                        />
                    </div>
                </CTabPane>

                <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
                    <CRow className='m-2'>
                        <CCard style={{ display: GeneralSettingData.length === 0 ? 'block' : 'none' }}>
                            <CCardBody>
                                <CRow>
                                    <CCol md={4}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="logoutidle">Logout Iddle Minutes  <span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='logoutidle'
                                                placeholder="Logout Iddle Minutes"
                                                onChange={(e) => SetgeneralSettingData({ ...generalSettingData, autologouttime: e.target.value })}
                                            // value={NewUserregister.employeename}
                                            // disabled={loading} // Disable input during loading
                                            />
                                        </div>
                                    </CCol>
                                    <CCol md={4}>
                                        <div className="mb-3">
                                            <CFormLabel htmlFor="logoutidle">Password Expire Days  <span style={{ color: 'red' }}>*</span></CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id='passexpire'
                                                placeholder="Password Expire Days"
                                                onChange={(e) => SetgeneralSettingData({ ...generalSettingData, passwordexpireday: e.target.value })}
                                            // value={NewUserregister.employeename}
                                            // disabled={loading} // Disable input during loading
                                            />
                                        </div>
                                    </CCol>
                                </CRow>

                                <CButton className='me-3' type="submit" color="success"
                                    onClick={handleSaveOtherSetting}
                                >
                                    <CIcon icon={cilSave} /> SAVE
                                </CButton>
                            </CCardBody>
                        </CCard>


                        <div className="ag-theme-quartz mt-3    " style={{ height: 500 }}>
                            <AgGridReact
                                rowData={GeneralSettingData}
                                columnDefs={GeneralSettingcolmun}
                                defaultColDef={defaultColDef}
                                // onGridReady={onGridReady}
                                rowSelection="multiple"
                                pagination={true}
                                paginationPageSize={10}
                                paginationPageSizeSelector={[10, 15, 20]}
                            />
                        </div>

                    </CRow>
                </CTabPane>
            </CTabContent>


            <CModal
                size="lg"
                alignment="center"
                visible={Generalsettingeditvisible}
                onClose={() => SetGeneralsettingeditvisible(false)}
                aria-labelledby="VerticallyCenteredExample">
                <CModalBody>
                    <CCard className='mt-3'>
                        <CRow className='m-3'>
                            <CCol md={4}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="logoutidle">Logout Iddle Minutes  <span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='logoutidle'
                                        placeholder="Logout Iddle Minutes"
                                        onChange={(e) => SetgeneralSettingUpdateData({ ...generalSettingUpdateData, autologouttime: e.target.value })}
                                        value={generalSettingUpdateData.autologouttime}
                                    // disabled={loading} // Disable input during loading
                                    />
                                </div>
                            </CCol>
                            <CCol md={4}>
                                <div className="mb-3">
                                    <CFormLabel htmlFor="logoutidle">Password Expire Days  <span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id='passexpire'
                                        placeholder="Password Expire Days"
                                        onChange={(e) => SetgeneralSettingUpdateData({ ...generalSettingUpdateData, passwordexpireday: e.target.value })}
                                        value={generalSettingUpdateData.passwordexpireday}
                                    // disabled={loading} // Disable input during loading
                                    />
                                </div>
                            </CCol>

                        </CRow>

                        <CModalFooter>
                            <CButton color="secondary" onClick={() => SetGeneralsettingeditvisible(false)}>
                                CANCEL
                            </CButton>
                            <CButton className='me-3' type="submit" color="success" onClick={handleUpdateOtherSetting}>
                                <CIcon icon={cilPlus} /> Save
                            </CButton>
                        </CModalFooter>

                    </CCard>
                </CModalBody>
            </CModal>


        </div>
    )
}

Generalsetting.propTypes = {
    auth: PropTypes.any.isRequired,
};

export default Generalsetting