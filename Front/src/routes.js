import React from "react";
import { element } from "prop-types";
const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"))
const SuperAdmin =React.lazy(()=> import('./views/branchmaster/Superusercreate'))
const Branches = React.lazy(()=> import('./views/branchmaster/config/Branches'))
const Allusers = React.lazy(()=> import('./views/usercreation/Allusers'))
const Allemployees = React.lazy(()=> import('./views/usercreation/Employee'))
const Adduser = React.lazy(()=> import('./views/usercreation/Adduser'))
const Edituser = React.lazy(()=> import('./views/usercreation/Edituser'))
const Userrole = React.lazy(()=> import('./views/usercreation/config/Userrole'))
const Department = React.lazy(()=> import('./views/usercreation/config/Department'))
const Userauth = React.lazy(()=> import('./views/userauth/Userauth'))
const Allmaster = React.lazy(()=> import('./views/master/Master'))
const Alltransaction =React.lazy(()=> import('./views/transaction/Alltransaction'))
const Logdetails = React.lazy(()=> import('./views/logdetails/Logdetails'))
const digitalprofile = React.lazy(()=> import('./views/digitalprofile/Digitalprofile'))
const Generalsetting = React.lazy(()=>import('./views/setting/Generalsetting'))



// Master
const Customer = React.lazy(()=> import('./views/master/Customer'))
const Supplier = React.lazy(()=> import('./views/master/Supplier'))
const Product = React.lazy(()=> import('./views/master/Product'))
const RawMaterial = React.lazy(()=> import('./views/master/RawMaterial'))
const CustomerRateMapping = React.lazy(()=> import('./views/master/CustomerRateMapping'))
const BillOfMaterials = React.lazy(()=> import('./views/master/BillOfMaterials'))
const SupplierFGRateMapping=React.lazy(()=>import(`./views/master/Supplier-FGRateMapping`))
const FGTransferMapping=React.lazy(()=>import(`./views/master/FGTransferMapping`))
const RMTransferMapping=React.lazy(()=>import(`./views/master/RMTransferMapping`))
const Operator=React.lazy(()=>import(`./views/master/Operator`))
const Machine=React.lazy(()=>import(`./views/master/Machine`))
const ToolsandSpares=React.lazy(()=>import(`./views/master/ToolsandSpares`))
const ToolsProductMapping=React.lazy(()=>import(`./views/master/Tools-Product-Mapping`))

const ProductMapping = React.lazy(() => import('./views/master/ProductMapping'))
const GSTSlabs = React.lazy(() => import('./views/master/GSTSlabs'))
const ProcessFlow = React.lazy(() => import('./views/master/ProcessFlow'))
const Correction = React.lazy(() => import("./views/master/Correction"))
const Reason = React.lazy(() => import("./views/master/Reason"))
const POBudjet = React.lazy(() => import('./views/master/POBudjet'))

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },
  { path: "/branchmaster/userperusercreate", name: "Super Admin", element: SuperAdmin},
  { path: "/branchmaster/config/branches", name: "Branches", element: Branches},
  { path: "/usercreation", name: "User Creation"},
  { path: "/usercreation/allusers", name: "All Users", element: Allusers},
  { path: "/usercreation/allemployees", name: "All Employees", element: Allemployees},
  { path: "/usercreation/adduser", name: "Add User", element: Adduser},
  { path: "/usercreation/edituser", name: "Edit User", element: Edituser},
  { path: "/usercreation/config", name: "User Config"},
  { path: "/usercreation/config/userrole", name: "User Role", element: Userrole},
  { path: "/usercreation/config/department", name: "Department", element: Department},
  { path: "/userauthenticate", name: "User Previleges"},
  { path: "/userauthenticate/userauth", name: "User Previlege", element: Userauth},
  { path: "/masters/allmaster", name: "All Masters", element: Allmaster},
  { path: "/Transaction", name: "Transaction"},
  { path: "/transaction/alltransaction", name: "All Transaction", element: Alltransaction},
  { path: "/reports", name: "Reports"},
  { path: "/log", name: "Log Details"},
  { path: "/log/logdetails", name: "Log-Details", element: Logdetails},
  { path: "/digitalprofile", name: "Digital-Profile", element: digitalprofile},
  { path: "/setting", name: "Settings"},
  { path: "/setting/generalsetup", name: "General Settings", element: Generalsetting},

    // Master

    { path: "/master", name: "Master"},
    { path: "/master/customer", name: "Customer", element: Customer},
    { path: "/master/supplier", name: "Supplier", element: Supplier},
    { path: "/master/product", name: "Product", element: Product},
    { path: "/master/rawmaterial", name: "RawMaterial", element: RawMaterial},
    { path: "/master/customerratemapping", name: "CustomerRateMapping", element: CustomerRateMapping},
    { path: "/master/billofmaterials", name: "BillOfMaterials", element: BillOfMaterials},
    { path:"/master/supplier-fgratemapping",name:'Supplier-FGRateMapping',element:SupplierFGRateMapping},
    { path:"/master/fgtransfermapping",name:'FGTransferMapping',element:FGTransferMapping},
    { path:"/master/rmtransfermapping",name:'RMTransferMapping',element:RMTransferMapping},
    { path:"/master/operator",name:'Operator',element:Operator},
    { path:"/master/machine",name:'Machine',element:Machine},
    { path:"/master/toolsandspares",name:'ToolsandSpares',element:ToolsandSpares},
    { path:"/master/toolsproductmapping",name:'ToolsProductMapping',element:ToolsProductMapping},
    { path: "/master/ProductMapping", name: "Product Mapping", element: ProductMapping },
    { path: "/master/GSTSlabs", name: "GST Slabs", element: GSTSlabs },
    { path: "/master/ProcessFlow", name: "Process Flow", element: ProcessFlow },
    { path: "/master/Correction", name: "Correction", element: Correction },
    { path: "/master/Reason", name: "Reason", element: Reason },
    { path: "/master/POBudjet", name: "PO Budget", element: POBudjet }

];

export default routes;
