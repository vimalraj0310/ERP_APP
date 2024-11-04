import React, { useMemo, useState } from "react";
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  CModal,
  CModalHeader,
  CModalBody,
} from "@coreui/react";
import { getStyle } from "@coreui/utils";
import { CChartLine } from "@coreui/react-chartjs";
import CIcon from "@coreui/icons-react";
import { cilArrowBottom, cilArrowTop, cilOptions } from "@coreui/icons";
import PropTypes from 'prop-types';
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { API_URL } from "src/config";

const WidgetsDropdown = ({ TopcardCount, firstCardChart, SecondCardChart, ThirdCardChart, FourthCardChart, auth }) => {



  console.log(auth.branchid, 'WidgetsDropdown');


  const [visible, setVisible] = useState(false)

  const [GridData, SetGridData] = useState([])

  const formatDate = (date) => {

    const reversedDate = date.split("-").reverse().join("-");

    return `${reversedDate}`

  }

  const colmun = [
    { field: "DocumentBatchno", headerName: 'Document / Batch No' },
    { field: "DocumentName", headerName: 'Document Name' },
    { field: "documenttype", headerName: 'Document Type' },
    {
      field: "ManufactureDate", headerName: 'Manufacture Date',
      cellRenderer: (params) => (
        <p>{params.value === 'NA' ? 'NA' : formatDate(params.value)}</p>
      )
    },
    {
      field: "ExpiryDate", headerName: 'Expire Date',
      cellRenderer: (params) => (
        <p>{params.value === 'NA' ? 'NA' : formatDate(params.value)}</p>
      )
    },
    {
      field: "DestractionDate", headerName: 'Destruction Date',
      cellRenderer: (params) => (
        <p>{params.value === 'NA' ? 'NA' : formatDate(params.value)}</p>
      )
    },
    { field: "DocLocationName", headerName: 'Doc Location' },
    { field: "DocRackName", headerName: 'Doc Rack' },
    { field: "DocRowName", headerName: 'Doc Row' },
    { field: "DocNameRemarks", headerName: 'Doc Remarks' }


  ]

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true,
    }
  }, []);

  const handleCountClick = async (params) => {
    try {

      const alldata = { mood: params, branchid: auth.branchid }

      const response = await axios.post(`${API_URL}/DashbordModelData`, alldata)

      if (response.status === 200) {

        SetGridData(response.data)
        setVisible(true)
      }

    } catch (error) {
      console.log(error);
    }
  }




  return (

    <>
      <CRow>
        <CCol md={6} lg={3}>
          <CWidgetStatsA
          onClick={() => handleCountClick('T')}
            className="mb-4 card-blue-pink"
            color="info"
            value={
              < div>
                <span className='my-3' style={{ cursor: 'pointer'}}>
                  {TopcardCount && TopcardCount.TotalDocument}
                
                </span>
                <span className="fs-6 fw-normal ms-2">
                  ({TopcardCount && Math.round(TopcardCount.TotalDocument / TopcardCount.TotalDocument * 100)}% <CIcon icon={cilArrowTop} />)
                </span>
                {/* 26K{" "} */}
                
              </div>
            }
            title="TOTAL DOCUMENTS"
            // action={
            //   <CDropdown alignment="end">
            //     <CDropdownToggle
            //     color="transparent"
            //     caret={false}
            //     className="p-0"
            //   >
            //     <CIcon
            //       icon={cilOptions}
            //       className="text-high-emphasis-inverse"
            //     />
            //   </CDropdownToggle>
            //   <CDropdownMenu>
            //     <CDropdownItem>Day</CDropdownItem>
            //     <CDropdownItem>Month</CDropdownItem>
            //     <CDropdownItem>Year</CDropdownItem>
            //   </CDropdownMenu>
            //   </CDropdown>
            // }
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: "70px" }}
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                  ],
                  datasets: [
                    {
                      label: "Total Doc",
                      backgroundColor: "transparent",
                      borderColor: "rgba(255,255,255,.55)",
                      pointBackgroundColor: getStyle("--cui-info"),
                      data: firstCardChart,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawBorder: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      min: -9,
                      max: 39,
                      display: false,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 1,
                    },
                    point: {
                      radius: 4,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol md={6} lg={3}>
          <CWidgetStatsA
          onClick={() => handleCountClick('I')}
            className="mb-4 card-green-blue"
            color="success"
            value={
              <>
                <span style={{ cursor: 'pointer' }}>{TopcardCount && TopcardCount.InwardCount}{" "}</span>
                <span className="fs-6 fw-normal">
                  ({TopcardCount && Math.round(TopcardCount.InwardCount / TopcardCount.TotalDocument * 100).toFixed(2)}% <CIcon icon={cilArrowTop} />)
                </span>
              </>
            }
            title="INWARD DOCUMENTS"
            action={
              <CDropdown alignment="end">
                {/* <CDropdownToggle
                color="transparent"
                caret={false}
                className="p-0"
              >
                <CIcon
                  icon={cilOptions}
                  className="text-high-emphasis-inverse"
                />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Day</CDropdownItem>
                <CDropdownItem>Month</CDropdownItem>
                <CDropdownItem>Year</CDropdownItem>
              </CDropdownMenu> */}
              </CDropdown>
            }
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: "70px" }}
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                  ],
                  datasets: [
                    {
                      label: "Inward Doc",
                      backgroundColor: "transparent",
                      borderColor: "rgba(255,255,255,.55)",
                      pointBackgroundColor: getStyle("--cui-success"),
                      data: SecondCardChart,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawBorder: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      min: -9,
                      max: 39,
                      display: false,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 1,
                    },
                    point: {
                      radius: 4,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol md={6} lg={3}>
          <CWidgetStatsA
           onClick={() => handleCountClick('O')}
            className="mb-4 card-red-pink"
            color="danger"
            value={
              <>

                <span style={{ cursor: 'pointer' }}>{TopcardCount && TopcardCount.OutwardCount}{" "}</span>
                <span className="fs-6 fw-normal">
                  ({TopcardCount && Math.round(TopcardCount.OutwardCount / TopcardCount.TotalDocument * 100).toFixed(2)}% <CIcon icon={cilArrowBottom} />)
                </span>
              </>
            }
            title="OUTWARD DOCUMENTS"
            action={
              <CDropdown alignment="end">
                {/* <CDropdownToggle
                color="transparent"
                caret={false}
                className="p-0"
              >
                <CIcon
                  icon={cilOptions}
                  className="text-high-emphasis-inverse"
                />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Day</CDropdownItem>
                <CDropdownItem>Month</CDropdownItem>
                <CDropdownItem>Year</CDropdownItem>
              </CDropdownMenu> */}
              </CDropdown>
            }
            chart={
              <CChartLine
                className="mt-3"
                style={{ height: "70px" }}
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                  ],
                  datasets: [
                    {
                      label: "Outward Doc",
                      backgroundColor: "rgba(255,255,255,.2)",
                      borderColor: "rgba(255,255,255,.55)",
                      data: ThirdCardChart,
                      fill: true,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      display: false,
                    },
                    y: {
                      display: false,
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 2,
                      tension: 0.4,
                    },
                    point: {
                      radius: 0,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol md={6} lg={3}>
          <CWidgetStatsA
           onClick={() => handleCountClick('D')}
            className="mb-4 card-purple-blue"
            color="warning"
            value={
              <>
                <span style={{ cursor: 'pointer' }}>{TopcardCount && TopcardCount.DestractionCount}{' '}</span>
                <span className="fs-6 fw-normal">
                  ({TopcardCount && Math.round(TopcardCount.DestractionCount / TopcardCount.TotalDocument * 100).toFixed(2)}% <CIcon icon={cilArrowBottom} />)
                </span>
              </>
            }
            title="DESTRUCTION DOCUMENTS"
            action={
              <CDropdown alignment="end">
                {/* <CDropdownToggle
                color="transparent"
                caret={false}
                className="p-0"
              >
                <CIcon
                  icon={cilOptions}
                  className="text-high-emphasis-inverse"
                />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Day</CDropdownItem>
                <CDropdownItem>Month</CDropdownItem>
                <CDropdownItem>Year</CDropdownItem>
              </CDropdownMenu> */}
              </CDropdown>
            }
            chart={
              <CChartLine
                className="mt-3"
                style={{ height: "70px" }}
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                  ],
                  datasets: [
                    {
                      label: "Destruct Doc",
                      backgroundColor: "rgba(255,255,255,.2)",
                      borderColor: "rgba(255,255,255,.55)",
                      data: FourthCardChart,
                      fill: true,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      display: false,
                    },
                    y: {
                      display: false,
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 2,
                      tension: 0.4,
                    },
                    point: {
                      radius: 0,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
      </CRow>


      <CModal
        size='xl'
        backdrop="static"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel">
        <CModalHeader>Documents</CModalHeader>
        <CModalBody>

          <div className="ag-theme-quartz" style={{ height: 500 }}>
            <AgGridReact
              rowData={GridData}
              columnDefs={colmun}
              defaultColDef={defaultColDef}
              rowSelection="multiple"
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 15, 20]}
            />
          </div>

        </CModalBody>

      </CModal>
    </>

  );
};

WidgetsDropdown.propTypes = {
  TopcardCount: PropTypes.any,
  firstCardChart: PropTypes.any,
  SecondCardChart: PropTypes.any,
  ThirdCardChart: PropTypes.any,
  FourthCardChart: PropTypes.any,
  auth: PropTypes.any
};

export default WidgetsDropdown;
