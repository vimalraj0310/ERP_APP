import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilSpeedometer,
  cilPeople,
  cibMyspace,
  cibQuantopian,
  cilUserFollow,
  cilCog,
  cilGroup,
  cilObjectGroup,
  cilSettings,
  cilChartPie,
  cilChartLine,
  cilBarChart,
  cilFolderOpen,
  cilNotes,
  cilTransfer,
  cilExitToApp,
  cilShare,
  cibArchLinux,
  cilSearch,
  cilInstitution,
  cilHouse,
  cilListRich,
} from "@coreui/icons";
import { CNavGroup, CNavItem } from "@coreui/react";
const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    screenid: 'DA001',
    to: "/dashboard",

    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    roles: ['admin', 'user'],
  },
  {
    component: CNavGroup,
    name: "Branch Master",
    screenid: 'BM001',
    to: "/branchmaster",
    icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Super Admin",
        screenid: 'SA001',
        to: "/branchmaster/userperusercreate",
        icon: <CIcon icon={cilPeople} className="me-2" />,
      },
      {
        component: CNavGroup,
        name: "Branch Config",
        screenid: 'BC001',
        to: "/branchmaster/config",
        icon: <CIcon icon={cilCog} className="me-2" />,
        items: [
          {
            component: CNavItem,
            name: "Branches",
            screenid: 'BC002',
            to: "/branchmaster/config/branches",
            icon: <CIcon icon={cilObjectGroup} className="ms-4 me-2" />,
          },
        ]
      },
    ]
  },

  {
    component: CNavGroup,
    name: "User Creation",
    screenid: 'UC001',
    to: "/usercreation",
    icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "All Users",
        screenid: 'UC002',
        to: "/usercreation/allusers",
        icon: <CIcon icon={cilPeople} className="ms-3" />,
      },
      {
        component: CNavItem,
        name: "User Privilege",
        screenid: 'UA002',
        to: "/userauthenticate/userauth",
        icon: <CIcon icon={cilPeople} className="ms-3" />,
      },
      {
        component: CNavGroup,
        name: "User Config",
        screenid: 'UC004',
        to: "/usercreation/config",
        icon: <CIcon icon={cilCog} className="ms-3" />,
        items: [
          {
            component: CNavItem,
            name: "User Role",
            screenid: 'UC005',
            to: "/usercreation/config/userrole",
            icon: <CIcon icon={cilObjectGroup} className="ms-4 me-2" />,
          },
          {
            component: CNavItem,
            name: "Department",
            screenid: 'UC006',
            to: "/usercreation/config/department",
            icon: <CIcon icon={cilObjectGroup} className="ms-4 me-2" />,
          },

        ],
      },
    ],
  },
  // {
  //   component: CNavGroup,
  //   name: "User Privileges",
  //   to: "/usercreation",
  //   screenid: 'UA001',
  //   icon: <CIcon icon={cilLockUnlocked} customClassName="nav-icon" />,
  //   items: [
      
  //   ]
  // },
  {
    component: CNavGroup,
    name: "Masters",
    screenid: 'MAS001',
    to: "/documentregister",
    icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "All Master",
        screenid: 'MAS002',
        to: "/masters/allmaster",
        icon: <CIcon icon={cilNotes} className="ms-3" />,
      },
      {
        component: CNavItem,
        name: "All Config",
        screenid: 'MAS003',
        to: "/config/allconfig",
        icon: <CIcon icon={cilNotes} className="ms-3" />,
      },
    ],
  },

  {
    component: CNavGroup,
    name: "Transaction",
    screenid: 'TR001',
    to: "/transaction",
    icon: <CIcon icon={cilTransfer} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "All Transaction",
        screenid: 'TR002',
        to: "/transaction/alltransaction",
        icon: <CIcon icon={cilExitToApp} className="ms-3" />,
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Accounts",
    screenid: 'DD001',
    to: "/accounts",
    icon: <CIcon icon={cilInstitution} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Accounts Update",
        screenid: 'DD002',
        to: "/accounts/accountupdate",
        icon: <CIcon icon={cilNotes} className="ms-3" />,
      },
    ],
  },


  {
    component: CNavGroup,
    name: "Approval",
    screenid: 'AT001',
    to: "/approval",
    icon: <CIcon icon={cibArchLinux} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "FG Transfer Note",
        screenid: 'AT002',
        to: "/approval/fgtransfernote",
        icon: <CIcon icon={cilShare} className="ms-3" />,
      },


    ],
  },
  {
    component: CNavGroup,
    name: "QC Modules",
    screenid: 'IN001',
    to: "/qcmodule",
    icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,
    items: [

      {
        component: CNavItem,
        name: "GRN",
        screenid: 'IN002',
        to: "/qcmodule/GRN",
        icon: <CIcon icon={cilChartPie} className="ms-3" />,
      },
      {
        component: CNavItem,
        name: "FG",
        screenid: 'IN002',
        to: "/qcmodule/FG",
        icon: <CIcon icon={cilChartPie} className="ms-3" />,
      },
      {
        component: CNavItem,
        name: "Semi Finished",
        screenid: 'IN002',
        to: "/qcmodule/semifinished",
        icon: <CIcon icon={cilChartPie} className="ms-3" />,
      },
    ],
  },

  {
    component: CNavGroup,
    name: "Stores",
    screenid: 'IN001',
    to: "/stores",
    icon: <CIcon icon={cilHouse} customClassName="nav-icon" />,
    items: [

      {
        component: CNavItem,
        name: "Bulk Issues",
        screenid: 'IN002',
        to: "/stores/bulkissues",
        icon: <CIcon icon={cilChartPie} className="ms-3" />,
      },

    ],
  },

  {
    component: CNavGroup,
    name: "Sub-Contract",
    screenid: 'IN001',
    to: "/subcontract",
    icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
    items: [

      {
        component: CNavItem,
        name: "Work Order",
        screenid: 'IN002',
        to: "/subcontract/workorder",
        icon: <CIcon icon={cilChartPie} className="ms-3" />,
      },
      {
        component: CNavItem,
        name: "Delivery Chellan",
        screenid: 'IN002',
        to: "/subcontract/deliverychellan",
        icon: <CIcon icon={cilChartPie} className="ms-3" />,
      },
      {
        component: CNavItem,
        name: "GRN",
        screenid: 'IN002',
        to: "/subcontract/GRN",
        icon: <CIcon icon={cilChartPie} className="ms-3" />,
      },

    ],
  },
  // {
  //   component: CNavGroup,
  //   name: "Reports",
  //   screenid: 'RE001',
  //   icon: <CIcon icon={cibQuantopian} customClassName="nav-icon" />,
  //   items: [

  //     {
  //       component: CNavItem,
  //       name: "InWard Report",
  //       screenid: 'RE002',
  //       to: "/reports/inwardreport",
  //       icon: <CIcon icon={cilChartPie} className="ms-3" />,
  //     },
  //     {
  //       component: CNavItem,
  //       name: "OutWard Report",
  //       screenid: 'RE003',
  //       to: "/reports/outwardreport",
  //       icon: <CIcon icon={cilChartLine} className="ms-3" />,
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Document Report",
  //       screenid: 'RE004',
  //       to: "/reports/documentstatusreport",
  //       icon: <CIcon icon={cilBarChart} className="ms-3" />,
  //     },
  //     {
  //       component: CNavItem,
  //       name: "DestrucDoc Report",
  //       screenid: 'RE005',
  //       to: "/reports/destrucdocreport",
  //       icon: <CIcon icon={cilBarChart} className="ms-3" />,
  //     },

  //     {
  //       component: CNavItem,
  //       name: "UnAuthorized Report",
  //       screenid: 'RE006',
  //       to: "/reports/DocumentUnAuthorizedReport",
  //       icon: <CIcon icon={cilBarChart} className="ms-3" />,
  //     },
  //   ],
  // },

  {
    component: CNavGroup,
    name: "Settings",
    screenid: 'SE001',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "General Settings",
        screenid: 'SE002',
        to: "/setting/generalsetup",
        icon: <CIcon icon={cilSettings} className="ms-3" />,
      },

    ],
  },
  {
    component: CNavGroup,
    name: "Log Details",
    screenid: 'LD001',
    to: "/log",
    icon: <CIcon icon={cibMyspace} customClassName="nav-icon" />,
    items: [

      {
        component: CNavItem,
        name: "Log-Details",
        screenid: 'LD002',
        to: "/log/logdetails",
        icon: <CIcon icon={cilGroup} className="ms-3" />,
      },
    ],
  },
  // {
  //   component: CNavItem,
  //   name: "Digital Profile",
  //   screenid: 'DP001',
  //   to: "/digitalprofile",
  //   icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
  // },
];

export default _nav;
