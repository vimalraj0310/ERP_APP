import React, { useEffect, useState } from "react";
import secureLocalStorage from 'react-secure-storage';
import PropTypes from 'prop-types';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import Cus_Img from '../../assets/images/master_images/Customer.png';
import Sup_Img from '../../assets/images/master_images/Supplier1.png';
import Prod_Img from '../../assets/images/master_images/Product.png';
import RM_Img from '../../assets/images/master_images/RawMaterial.png';
import CR_Img from '../../assets/images/master_images/CustomerRate.png';
import BOM_Img from '../../assets/images/master_images/BOM.png';
import SupFG_Img from '../../assets/images/master_images/SupplierFG.png';
import FGTrans_Img from '../../assets/images/master_images/FGTrans.png';
import RMTrans_Img from '../../assets/images/master_images/RMTrans.png';
import Operator_Img from '../../assets/images/master_images/Operator.png';
import Mechine_Img from '../../assets/images/master_images/Mechine.png';
import Tools_Img from '../../assets/images/master_images/Tools1.png';
import ToolsProd_Img from '../../assets/images/master_images/ToolsProd.png';
import ToolsSF_Img from '../../assets/images/master_images/ToolsSF.png';
import GSTSlab_Img from '../../assets/images/master_images/GST1.png';
import Processflow_Img from '../../assets/images/master_images/Processflow.png';
import Correction_Img from '../../assets/images/master_images/Correction.png';
import Reason_Img from '../../assets/images/master_images/Reason.png';
import PObudget_Img from '../../assets/images/master_images/POBudget.png';
import CIcon from '@coreui/icons-react';
import { cilArrowCircleRight } from '@coreui/icons';
import { Link } from 'react-router-dom';
import axios from "axios";
import { API_URL } from "src/config";

const Master = () => {
    const [auth, setAuth] = useState(secureLocalStorage.getItem("userData"));
    const [pagedata, setPagedata] = useState(secureLocalStorage.getItem("pageData"));
    const [ipAddress, setIPAddress] = useState(null);

    const userRole = auth?.userrole;
    const userStatus = auth?.UserStatus; // Get UserStatus

    // Debugging output
    console.log('User Role:', userRole);
    console.log('User Status:', userStatus); // Log UserStatus
    console.log('Page Data:', pagedata);

    // Ensure pageData is an object and lowercase the keys and values
    const lowerCasePageData = Object.fromEntries(
        Object.entries(pagedata || {}).map(([key, value]) => [key.toLowerCase(), value.toLowerCase()])
    );

    console.log('Lower Case Page Data:', lowerCasePageData);

    // Define all available master items with their respective images and routes
    const masterItems = [
        { name: 'CUSTOMER_MASTER', img: Cus_Img, label: 'CUSTOMER MASTER', link: '/master/customer', screenid: 'CUS001' },
        { name: 'SUPPLIER_MASTER', img: Sup_Img, label: 'SUPPLIER MASTER', link: '/master/supplier', screenid: 'SUP001' },
        { name: 'PRODUCT_MASTER', img: Prod_Img, label: 'PRODUCT MASTER', link: '/master/product', screenid: 'PROD001' },
        { name: 'RAW_MATERIAL', img: RM_Img, label: 'RAW MATERIAL', link: '/master/rawmaterial', screenid: 'RM001' },
        { name: 'CUSTOMER_RATE_MAPPING', img: CR_Img, label: 'CUSTOMER RATE MAPPING', link: '/master/customer-rate', screenid: 'CRM001' },
        { name: 'BILL_OF_MATERIALS', img: BOM_Img, label: 'BILL OF MATERIALS', link: '/master/billofmaterials', screenid: 'BOM001' },
        { name: 'SUPPLIER_FG_MAPPING', img: SupFG_Img, label: 'SUPPLIER FG MAPPING', link: '/master/supplier-fgratemapping', screenid: 'SFGM001' },
        { name: 'FINISHED_GOODS_TRANS', img: FGTrans_Img, label: 'FINISHED GOODS TRANS.', link: '/master/fgtransfermapping', screenid: 'FGT001' },
        { name: 'RAW_MATERIAL_TRANS', img: RMTrans_Img, label: 'RAW MATERIAL TRANS.', link: '/master/rmtransfermapping', screenid: 'RMT001' },
        { name: 'OPERATOR', img: Operator_Img, label: 'OPERATOR', link: '/master/operator', screenid: 'OPE001' },
        { name: 'MECHINE', img: Mechine_Img, label: 'MECHINE', link: '/master/machine', screenid: 'MEC001' },
        { name: 'TOOLS_MASTER', img: Tools_Img, label: 'TOOLS MASTER', link: '/master/toolsandspares', screenid: 'TOM001' },
        { name: 'TOOLS_PRODUCTION', img: ToolsProd_Img, label: 'TOOLS PRODUCTION', link: '/master/toolsproductmapping', screenid: 'TOP001' },
        { name: 'TOOLS_SF_MASTER', img: ToolsSF_Img, label: 'TOOLS SF MASTER', link: '/master/tools-sf', screenid: 'TSFT001' },
        { name: 'GST_SLABS', img: GSTSlab_Img, label: 'GST SLABS', link: '/master/GSTSlabs', screenid: 'GSTS001' },
        { name: 'PROCESS_FLOW', img: Processflow_Img, label: 'PROCESS FLOW', link: '/master/ProcessFlow', screenid: 'PF001' },
        { name: 'CORRECTION_TYPE', img: Correction_Img, label: 'CORRECTION TYPE', link: '/master/Correction', screenid: 'CT001' },
        { name: 'REASON_MASTER', img: Reason_Img, label: 'REASON MASTER', link: '/master/Reason', screenid: 'REM001' },
        { name: 'PO_BUDGET', img: PObudget_Img, label: 'PO BUDGET', link: '/master/POBudjet', screenid: 'POB001' },
        // Add more items as needed...
    ];

    // Generate role permissions based on the pageData
    const rolePermissions = {
        [userRole]: Object.keys(lowerCasePageData).filter(screenid => lowerCasePageData[screenid] === 'a')
    };

    console.log('Role Permissions:', rolePermissions[userRole]);

    // Check if user is a super admin
    const isSuperAdmin = userStatus === 'SA';

    // Filter the master items based on the user's role and page data
    const filteredItems = isSuperAdmin
        ? masterItems // Show all items for Super Admin
        : masterItems.filter(item => {
            const screenIdLower = item.screenid.toLowerCase(); // Convert screenid to lowercase
            const isAuthorized = lowerCasePageData[screenIdLower] === 'a';
            const userPermissions = rolePermissions[userRole] || [];

            // Normalize user permissions to lowercase
            const normalizedUserPermissions = userPermissions.map(permission => permission.toLowerCase());
            return normalizedUserPermissions.includes(screenIdLower) && isAuthorized; // Compare with normalized permissions
        });

    console.log('Filtered Items:', filteredItems);

    const CardStyle = {
        background: 'linear-gradient(90deg, rgba(233,233,233,1) 0%, rgba(242,242,242,1) 100%)'
    };

    useEffect(() => {
        const localData = () => {
            const isAuthenticated = secureLocalStorage.getItem("userData");
            setAuth(isAuthenticated);
            const pagedatas = secureLocalStorage.getItem("pageData");
            setPagedata(pagedatas);
        };
        localData();
    }, []);

    const fetchIPAddress = async () => {
        try {
            const response = await axios.get(`${API_URL}/user/ip`);
            const ipAddress = response.data.ip.split(':').pop(); // Extract only the IPv4 address
            setIPAddress(ipAddress);
        } catch (error) {
            console.error('Error fetching IP address:', error);
        }
    };

    useEffect(() => {
        fetchIPAddress();
    }, []);

    return (
        <div>
            <CCard className="mb-3">
                <CCardHeader className='bg-primary text-white'> All Masters</CCardHeader>
                <CCardBody>
                    <CRow>
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item, index) => (
                                <CCol md={3} className='mt-2' key={index}>
                                    <CCard className='Card-hover' style={CardStyle}>
                                        <Link className='d-flex text-decoration-none text-dark mb-2' to={item.link}>
                                            <div className='col-lg-4' id='Img2'>
                                                <img src={item.img} alt={item.label} className='ms-3 my-2 w-75 h-75' />
                                            </div>
                                            <div className='col-lg-8 mt-3 position-relative'>
                                                <h6 className='ms-2'>{item.label}</h6>
                                                <div className='position-absolute bottom-0 end-0 me-2'>
                                                    <CIcon icon={cilArrowCircleRight} size='xl' />
                                                </div>
                                            </div>
                                        </Link>
                                    </CCard>
                                </CCol>
                            ))
                        ) : (
                            <p>No items available to display.</p>
                        )}
                    </CRow>
                </CCardBody>
            </CCard>
        </div>
    );
};

Master.propTypes = {
    auth: PropTypes.any.isRequired,
    pagedata: PropTypes.object.isRequired,
};

export default Master;
