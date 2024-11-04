import React, { useEffect, useState } from "react";
import '../../scss/style.scss'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormSelect,
  CCarousel,
  CCarouselItem,
  CTableDataCell,
  CAvatar,
  CProgress,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPeople } from "@coreui/icons";
import { getStyle } from "@coreui/utils";
import WidgetsDropdown from "../widgets/WidgetsDropdown";
import Widgets from "../widgets/Widgets";
import Cards from "../cards/Cards";
import { CChart } from "@coreui/react-chartjs";
import avatar1 from 'src/assets/images/avatars/10.png'
import axios from "axios";
import { API_URL } from "src/config";
import PropTypes from 'prop-types'
import { RotatingLines } from 'react-loader-spinner';
import { useLocation } from "react-router-dom";

const Dashboard = ({ auth, ipAddress }) => {

  const [loading, setLoading] = useState(false); // Loader state

  const [TopcardCount, SetTopcardCount] = useState({})

  const [TopGriddata, SetTopGriddata] = useState([])



  const [firstCardChart, SetfirstCardChart] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

  const [SecondCardChart, SetSecondCardChart] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [ThirdCardChart, SetThirdCardChart] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

  const [FourthCardChart, SetFourthCardChart] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])


  //// top chart data

  const [AuthorizedInwardDocumentCount, SetAuthorizedInwardDocumentCount] = useState(null)

  const [AuthorizedOutwardDocumentCount, SetAuthorizedOutwardDocumentCount] = useState(null)

  const [AuthorizedTotaldDocumentCount, SetAuthorizedTotaldDocumentCount] = useState(null)


  //// top chart data end


  //// Bottom chart data

  const [UnAuthorizedgridData, SetUnAuthorizedgridData] = useState([])

  const [UnAuthorizedInwardDocumentCount, SetUnAuthorizedInwardDocumentCount] = useState(null)

  const [UnAuthorizedOutwardDocumentCount, SetUnAuthorizedOutwardDocumentCount] = useState(null)

  const [UnAuthorizedTotaldDocumentCount, SetUnAuthorizedTotaldDocumentCount] = useState(null)

  //// Bottom chart data end


  const [InwardOutwardTranscation, SetInwardOutwardTranscation] = useState([])


  const DashboardFetchdata = async () => {

    try {

      const response = await axios.post(`${API_URL}/DashboradDatas?branchid=${auth.branchid}`)

      if (response.status === 200) {

        /// top card and chart authorized doumnent data start
        SetTopcardCount(response.data.Topcard)

        SetTopGriddata(response.data.AuthorizedgridData)

        SetfirstCardChart([
          response.data.firstCardChart.January,
          response.data.firstCardChart.February,
          response.data.firstCardChart.March,
          response.data.firstCardChart.April,
          response.data.firstCardChart.May,
          response.data.firstCardChart.June,
          response.data.firstCardChart.July,
          response.data.firstCardChart.August,
          response.data.firstCardChart.September,
          response.data.firstCardChart.October,
          response.data.firstCardChart.November,
          response.data.firstCardChart.December,
        ])


        SetSecondCardChart([


          response.data.SecondCardChart === undefined ? 0 : response.data.SecondCardChart.January,

          response.data.SecondCardChart === undefined ? 0 : response.data.SecondCardChart.February,

          response.data.SecondCardChart === undefined ? 0 : response.data.SecondCardChart.March,
          response.data.SecondCardChart === undefined ? 0 : response.data.SecondCardChart.April,
          response.data.SecondCardChart === undefined ? 0 : response.data.SecondCardChart.May,


          response.data.SecondCardChart === undefined ? 0 : response.data.SecondCardChart.June,
          response.data.SecondCardChart === undefined ? 0 : response.data.SecondCardChart.July,
          response.data.SecondCardChart === undefined ? 0 : response.data.SecondCardChart.August,

          response.data.SecondCardChart === undefined ? 0 : response.data.SecondCardChart.September,
          response.data.SecondCardChart === undefined ? 0 : response.data.SecondCardChart.October,
          response.data.SecondCardChart === undefined ? 0 : response.data.SecondCardChart.November,

          response.data.SecondCardChart === undefined ? 0 : response.data.SecondCardChart.December,

        ])

        SetThirdCardChart([
          response.data.ThirdCardChart === undefined ? 0 : response.data.ThirdCardChart.January,

          response.data.ThirdCardChart === undefined ? 0 : response.data.ThirdCardChart.February,

          response.data.ThirdCardChart === undefined ? 0 : response.data.ThirdCardChart.March,
          response.data.ThirdCardChart === undefined ? 0 : response.data.ThirdCardChart.April,
          response.data.ThirdCardChart === undefined ? 0 : response.data.ThirdCardChart.May,


          response.data.ThirdCardChart === undefined ? 0 : response.data.ThirdCardChart.June,
          response.data.ThirdCardChart === undefined ? 0 : response.data.ThirdCardChart.July,
          response.data.ThirdCardChart === undefined ? 0 : response.data.ThirdCardChart.August,

          response.data.ThirdCardChart === undefined ? 0 : response.data.ThirdCardChart.September,
          response.data.ThirdCardChart === undefined ? 0 : response.data.ThirdCardChart.October,
          response.data.ThirdCardChart === undefined ? 0 : response.data.ThirdCardChart.November,

          response.data.ThirdCardChart === undefined ? 0 : response.data.ThirdCardChart.December,

        ])

        SetFourthCardChart([
          response.data.FourthCardChart.January,
          response.data.FourthCardChart.February,
          response.data.FourthCardChart.March,
          response.data.FourthCardChart.April,
          response.data.FourthCardChart.May,
          response.data.FourthCardChart.June,
          response.data.FourthCardChart.July,
          response.data.FourthCardChart.August,
          response.data.FourthCardChart.September,
          response.data.FourthCardChart.October,
          response.data.FourthCardChart.November,
          response.data.FourthCardChart.December,
        ])




        const InwardCount = response.data.Topcard.InwardCount
        SetAuthorizedInwardDocumentCount(InwardCount)

        const OutwardCount = response.data.Topcard.OutwardCount
        SetAuthorizedOutwardDocumentCount(OutwardCount)

        const TotalCount = response.data.Topcard.TotalDocument
        SetAuthorizedTotaldDocumentCount(TotalCount)



        /// top card and chart authorized doumnent data end


        /// Bottom chart and authorized doumnent data start

        const UnAuthorizedgridData = response.data.UnAuthorizedgridData

        console.log(UnAuthorizedgridData);

        SetUnAuthorizedgridData(UnAuthorizedgridData)

        // const UnAuthorizedChartData = response.data.UnAuthorizedChartData

        const UnAuthorizedInwardCount = response.data.UnAuthorizedChartData.InwardCount


        SetUnAuthorizedInwardDocumentCount(UnAuthorizedInwardCount)

        const UnAuthorizedOutwardCount = response.data.UnAuthorizedChartData.OutwardCount
        SetUnAuthorizedOutwardDocumentCount(UnAuthorizedOutwardCount)

        const UnAuthorizedTotalCount = response.data.UnAuthorizedChartData.TotalDocument
        SetUnAuthorizedTotaldDocumentCount(UnAuthorizedTotalCount)

        /// Bottom chart and authorized doumnent data end
        SetInwardOutwardTranscation(response.data.InOutTranscationGriddata)

      }

    } catch (err) {
      console.log(err);
    }
  }

  const location = useLocation()

  console.log(location.pathname);

  useEffect(() => {
    setLoading(true)
    DashboardFetchdata()
    const intervalLoop = () => {
      if (location.pathname.toLowerCase() === '/dashboard') {
        DashboardFetchdata()
        setLoading(false)
      }
    };
    const intervalId = setInterval(intervalLoop, 1000);
    return () => {
      DashboardFetchdata()
      setLoading(false)
      clearInterval(intervalId);
    };
  }, [])


  console.log(TopGriddata);




  // const date = '2024-06-23T19:51:01.620Z'

  // console.log(date);

  //

  // 2024-06-23 19:51:01.410
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

      <WidgetsDropdown TopcardCount={TopcardCount} firstCardChart={firstCardChart} SecondCardChart={SecondCardChart} ThirdCardChart={ThirdCardChart} FourthCardChart={FourthCardChart} auth={auth} />

      <CRow className="my-2">
        <CCol md={12} lg={12} className="my-2">
          <CCard className="mb-4" >
            <CCardHeader className="uppercase"> Document  Status</CCardHeader>
            <CCardBody>
              <CRow >
                <CCol md={4} className="my-2">
                  <CCard className="shadow-lg">
                    <CCardHeader className=" fw-bold">Authorized  Document Movement Chart</CCardHeader>
                    <CChart className="w-100 h-100 mt-4"
                      type="doughnut"
                      data={{
                        labels: ['Total Documents', 'Inward Documents', 'Outward Documents',],
                        datasets: [
                          {
                            backgroundColor: ['#3399ff', '#1b9e3e', '#e55353'],
                            data: [AuthorizedTotaldDocumentCount, AuthorizedInwardDocumentCount, AuthorizedOutwardDocumentCount],
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          legend: {
                            labels: {
                              color: getStyle('--cui-body-color'),
                            }
                          }
                        },
                      }}
                    />
                  </CCard>
                </CCol>
                <CCol md={8} className="my-2">
                  <CCard className="shadow-lg">
                    <CCardHeader className=" fw-bold text-center fs-5 text-primary">
                      <div className="marquee">
                        <div className="marquee-content">Top 5 Authorized Document Movement Details</div>
                      </div>
                    </CCardHeader>
                    <CTable className="" hover responsive>
                      <CTableHead color="dark">
                        <CTableRow>
                          <CTableHeaderCell scope="col" >Document No</CTableHeaderCell>
                          <CTableHeaderCell scope="col" >Document Name</CTableHeaderCell>
                          <CTableHeaderCell scope="col" >Date</CTableHeaderCell>
                          <CTableHeaderCell scope="col" className="text-center">Status</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {TopGriddata && TopGriddata.map((item, index) => (
                          <CTableRow key={index} style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>

                            <CTableDataCell style={{ maxWidth: '200px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                              {item.DocumentBatchno}
                            </CTableDataCell>
                            <CTableDataCell style={{ maxWidth: '200px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                              <p style={{ margin: 0, wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                                {item.DocumentName}
                              </p>
                            </CTableDataCell>
                            <CTableDataCell style={{ maxWidth: '200px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                              {item.Status === 'Inward' ? item.Indate : item.Outdate && item.Outdate}
                            </CTableDataCell>
                            <CTableDataCell style={{ maxWidth: '200px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                              <span className={`badge rounded-pill ms-3 fs-6 text-white ${item.Status === 'Inward' ? 'text-bg-success' : 'text-bg-danger'}`}>
                                {item.Status}
                              </span>
                            </CTableDataCell>
                          </CTableRow>
                        ))}

                      </CTableBody>
                    </CTable>
                  </CCard>
                </CCol>
              </CRow>
              <CRow className="my-2">
                <CCol md={8} className="">
                  <CCard className="shadow-lg ">
                    <CCardHeader className=" fw-bold">

                      Unauthorized Document Movement Details

                    </CCardHeader>
                    <CTable className="mt-3" hover responsive>
                      <CTableHead color="dark">
                        <CTableRow>
                          <CTableHeaderCell scope="col">Document No</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Document Name</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>


                        {UnAuthorizedgridData && UnAuthorizedgridData.map((item, index) => (

                          <CTableRow key={index} style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>

                            <CTableDataCell style={{ maxWidth: '200px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                              {item.DocumentBatchno}
                            </CTableDataCell>
                            <CTableDataCell style={{ maxWidth: '200px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                              <p style={{ margin: 0, wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                                {item.DocumentName}
                              </p>
                            </CTableDataCell>

                            <CTableDataCell style={{ maxWidth: '200px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                              {item.Affecteddate}
                            </CTableDataCell>

                            <CTableDataCell style={{ maxWidth: '200px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                              <span className={`badge rounded-pill  ms-3 fs-6 text-white ${item.Status === 'Inward' ? ' text-bg-danger' : 'text-bg-success'}`}>
                                {item.Status === 'Inward' ? 'Outward' : 'Inward'}
                              </span>
                            </CTableDataCell>
                          </CTableRow>
                        ))}


                      </CTableBody>
                    </CTable>
                  </CCard>
                </CCol>
                <CCol md={4}>
                  <CCard className="shadow-lg">
                    <CCardHeader className=" fw-bold">Unauthorized Document Chart</CCardHeader>
                    <CChart className="w-100 h-75 m-2"
                      type="pie"
                      data={{
                        labels: ['Total Documents', 'Unauthorized Documents',
                          // 'Outward Documents',
                        ],
                        datasets: [
                          {
                            backgroundColor: ['#3399ff', '#e55353', '#e55353'],
                            data: [UnAuthorizedTotaldDocumentCount, UnAuthorizedInwardDocumentCount,
                              // UnAuthorizedOutwardDocumentCount
                            ],
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          legend: {
                            labels: {
                              color: getStyle('--cui-body-color'),
                            }
                          }
                        },
                      }}
                    />
                  </CCard>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow className="my-2">
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead className="text-nowrap">
            <CTableRow>
              <CTableHeaderCell className="bg-body-tertiary text-center">
                <CIcon icon={cilPeople} />
              </CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">In-Out</CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Activity</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>

            {InwardOutwardTranscation.map((item, index) => (
              <CTableRow v-for="item in tableItems" key={index}>
                <CTableDataCell className="text-center">
                  <CAvatar size="md"
                    src={avatar1}
                  // status={item.avatar.status} 
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <p>{item.employeename}</p>
                </CTableDataCell>

                <CTableDataCell>
                  <div className="d-flex justify-content-between text-nowrap">
                    <div className="fw-semibold">
                      {/* {item.usage.value}% */}
                    </div>
                    <div className="ms-3">
                      <small className="text-body-secondary">
                        {/* {item.usage.period} */}
                      </small>
                    </div>
                  </div>
                  <CProgress value={item.inoutpercentage}>{item.inoutpercentage}%</CProgress>
                </CTableDataCell>

                <CTableDataCell>
                  <div className="small text-body-secondary text-nowrap">Last login</div>
                  <div className="fw-semibold text-nowrap">
                    <p>{item.LastLogin} Ago</p>
                  </div>
                </CTableDataCell>

              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CRow>
    </>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.any, // Replace 'any' with the appropriate type based on what 'auth' contains
  ipAddress: PropTypes.any,
};
export default Dashboard;
