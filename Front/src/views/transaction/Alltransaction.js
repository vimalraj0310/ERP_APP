import React from 'react'
import PropTypes from 'prop-types';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import Proc_Img from '../../assets/images/transaction_images/Procurment.png'
import Sale_Img from '../../assets/images/transaction_images/Sales.png'
import Inv_Img from '../../assets/images/transaction_images/Invoice.png'
import PO_Img from '../../assets/images/transaction_images/PO.png'
import WSch_Img from '../../assets/images/transaction_images/WeekSch.png'
import WO_Img from '../../assets/images/transaction_images/WO.png'
import Dev_Img from '../../assets/images/transaction_images/Develop.png'
import DC_Img from '../../assets/images/transaction_images/DC.png'
import MatRec_Img from '../../assets/images/transaction_images/MRC.png'
import MatRecp_Img from '../../assets/images/transaction_images/Receipt.png'
import GRN_Img from '../../assets/images/transaction_images/GRN.png'
import MRS_Img from '../../assets/images/transaction_images/MRS.png'
import SaleRet_Img from '../../assets/images/transaction_images/SaleReturn.png'
import SaleRej_Img from '../../assets/images/transaction_images/SaleReject.png'
import MaterialIssue_Img from '../../assets/images/transaction_images/MaterialIssue.png'
import LineRej_Img from '../../assets/images/transaction_images/Reject.png'
import WorkOrder_Img from '../../assets/images/transaction_images/WorkOrder.png'
import ProductionEntry_Img from '../../assets/images/transaction_images/ProductionEntry.png'
import TransferNote_Img from '../../assets/images/transaction_images/TransferNote.png'
import Nonmove_Img from '../../assets/images/transaction_images/NonmoveFG.png'
import TransFG_Img from '../../assets/images/transaction_images/TransferFG.png'
import Breakdown_Img from '../../assets/images/transaction_images/Breakdown.png'
import Dailyplan_Img from '../../assets/images/transaction_images/DailyPlan.png'
import Dailyproplan_Img from '../../assets/images/transaction_images/DailyProPlan.png'

import CIcon from '@coreui/icons-react';
import { cilArrowCircleRight, cilListRich } from '@coreui/icons';
import { Link } from 'react-router-dom';
const Alltransaction = () => {
    const CardStyle = {
        background: 'linear-gradient(90deg, rgba(233,233,233,1) 0%, rgba(242,242,242,1) 100%)'
    }
    return (
        <div>
            <CCard>
                <CCardHeader className='bg-primary text-white'> All Transaction</CCardHeader>
                <CCardBody>
                    <CRow>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/sustomer'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={Proc_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>PROCURMENT PLAN</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/supplier'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={Sale_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>SALE ORDER</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={Inv_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>INVOICE ENTRY</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={PO_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>PURCHASE ODER</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={WSch_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>WEEKLY SCHEDULE</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={WO_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>WO SHORTAGE</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={Dev_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>DEVELOPMENT</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={DC_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>DELIVERY CHELLAN</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={MatRec_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>MATERIAL RECEIVED FROM CUSTOMER</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={MatRecp_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>MATERIAL RECEIPTS</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={GRN_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>GRN ACCOUNTS UPDATE</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={MRS_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>MATERIAL RETURN (SUB-CONTRACT)</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={SaleRet_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>SALES RETURN</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={SaleRej_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>STORES REJECTION</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={MaterialIssue_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>MATERIAL ISSUES</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={LineRej_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>LINE REJECTION</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={WorkOrder_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>WORK ORDER</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={ProductionEntry_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>PRODUCTION ENTRY-HOURLY</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={TransferNote_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>TRANSFER NOTE</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={Nonmove_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>NON MOVE STOCK(FG)</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={TransFG_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>TRANSFER TO FG(MR FROM CUTOMER)</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={Breakdown_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>BREAKDOWN</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={Dailyplan_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>DAILY PLAN (RAW MATERIAL)</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                        <CCol md={3} className='mt-2'>
                            <CCard className='Card-hover' style={CardStyle}>
                                <Link className='d-flex text-decoration-none text-dark mb-2' to='/master/product'>
                                    <div className='col-lg-4' id='Img2'>
                                        <img src={Dailyproplan_Img} alt='Supplier' className='ms-3 my-2 w-75 h-75' />
                                    </div>
                                    <div className='col-lg-8 mt-3 position-relative'>
                                        <h6 className='ms-2'>DAILY PRODCTION PLAN (SALES)</h6>
                                        <div className='position-absolute bottom-0 end-0 me-2'>
                                            <CIcon icon={cilArrowCircleRight} size='xl' />
                                        </div>
                                    </div>
                                </Link>
                            </CCard>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>

        </div>


    )
}
Alltransaction.propTypes = {
    auth: PropTypes.any.isRequired,
    ipAddress: PropTypes.any.isRequired,
};
export default Alltransaction