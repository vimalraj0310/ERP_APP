import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLockLocked,
  cilPowerStandby,
  cilSettings,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/10.png'
import axios from "axios";
import { API_URL } from "src/config";
import PropTypes from 'prop-types'

const AppHeaderDropdown = ({ auth, ipAddress }) => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagedata, setimagedata] = useState(null);
  const role = auth.userrole.toLowerCase()



  useEffect(() => {
    fetchpaymentmode();
  }, []);

  const handleClearLocalStorage = async () => {

    const alldata = { usercode: auth.usercode, username: auth.employeename, status: 'logout', ipAddress, mood: 'I', branchid: auth.branchid }

    const response = await axios.post(`${API_URL}/loginhistory`, alldata)

    if (response.status === 200) {
      localStorage.clear();
      navigate('/');
    }

  };



  const fetchpaymentmode = async () => {
    try {
      // debugger;
      if (localStorage.getItem("profileimage") != "") {
        setimagedata(localStorage.getItem("profileimage"));
      }
      else {
        setimagedata(avatar8);
      }
    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  };





  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-secondary border text-white"><span className="text-uppercase">{auth.employeename}</span></CDropdownHeader>
        <CDropdownItem href="#/digitalprofile"
        >
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>

        <CDropdownItem href="#/setting/generalsetup" className={`${role !== 'admin' || auth.UserStatus === 'SA' ? "d-none" : "d-block"}`}>
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>

        <CDropdownItem onClick={handleClearLocalStorage}>
          <CIcon icon={cilPowerStandby} className="me-2" />
          Sign Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}


AppHeaderDropdown.propTypes = {
  auth: PropTypes.any, // Replace 'any' with the appropriate type based on what 'auth' contains
  ipAddress: PropTypes.any,
};

export default AppHeaderDropdown
