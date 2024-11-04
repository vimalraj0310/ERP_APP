import React, { useEffect, useMemo, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { CRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilRecycle } from '@coreui/icons';
import axios from 'axios';
import { API_URL } from 'src/config';
import PropTypes from 'prop-types'; // Import PropTypes

import { RotatingLines } from 'react-loader-spinner';

const Logdetails = ({ auth }) => {

  const [loading, setLoading] = useState(false); // Loader state

  const [GridData, SetGridData] = useState([])
  const colmun = [
    { field: "employeecode", headerName: 'Employee Code' },
    { field: "employeename", headerName: 'Employee Name' },
    {
      field: "Date",
      cellRenderer: (params) => (
        <p> {params.value === null ? 'NA' : params.value}</p>
      )
    },
    {
      field: "LogIn",
      cellRenderer: (params) => (
        <p style={{ color: params.value === null ? "black" : "green" }}>{params.value === null ? 'NA' : params.value}</p>
      )

    },
    {
      field: "LogOut",

      cellRenderer: (params) => (
        <p style={{ color: params.value === null ? "black" : "red" }}>{params.value === null ? 'NA' : params.value}</p>
      )
    },
    {
      field: "SystemAborted", headerName: 'System Aborted',
      cellRenderer: (params) => (
        <p style={{ color: params.value === null ? "black" : "blue" }}>{params.value === null ? 'NA' : params.value}</p>
      )

    },
    { field: "ipaddress", headerName: 'IP Address' },
  ]

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    }
  }, []);


  const fetchGridData = async () => {
    try {
      setLoading(true)
      const alldata = { usercode: '', username: '', status: '', ipAddress: '', mood: 'G', branchid: auth.branchid }

      const response = await axios.post(`${API_URL}/loginhistory`, alldata)

      if (response.status === 200) {
        SetGridData(response.data)
        setLoading(false)
      }
      setLoading(false)
    } catch (error) {

      console.log(error);

      setLoading(false)

    }
  }

  useEffect(() => {
    fetchGridData()
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

      <CRow className='mb-3'>
        <div className="d-flex">
          <CIcon className="me-2" size={'xxl'} icon={cilRecycle} />
          <h3> Employee Log Details</h3>
        </div>
      </CRow>
      <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact
          rowData={GridData}
          columnDefs={colmun}
          defaultColDef={defaultColDef}
          // onGridReady={onGridReady}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 30, 40, 50]}
        />
      </div>
    </>

  )
}

Logdetails.propTypes = {
  auth: PropTypes.any.isRequired,
};

export default Logdetails