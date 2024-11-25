// src/routes/CustomRoutes.jsx
import React, { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import LoadingSpinner from "../components/common/ui/LoadingSpinner";
import RouteGuard from "../routes/RouteGuard";



const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const UserRegistration = lazy(() => import("../pages/Users/UserRegistration"));
const CustomeremailList = lazy(() => import("../pages/Master/Customeremail/CustomeremailList"));
const AddCustomeremail = lazy(() => import("../pages/Master/Customeremail/AddCustomerEmail"));
const UpdateCustomeremail = lazy(() => import("../pages/Master/Customeremail/UpdateCustomerEmail"));
const UserPermissions = lazy(() => import("../pages/Users/UserPermissions"));
const NewUserRegistration = lazy(() =>
  import("../pages/Users/NewUserRegistration")
);
const ProfileList = lazy(() =>
  import("../pages/Master/Profile/ProfileList")
);
const UpdateProfile = lazy(() =>
  import("../pages/Master/Profile/EditProfile")
);
const ArticleList = lazy(() => import("../pages/Master/Articles/ArticleList"));
const AddArticle = lazy(() => import("../pages/Master/Articles/AddArticle"));
const PlaceList = lazy(() => import("../pages/Master/Places/PlaceList"));
const AddPlace = lazy(() => import("../pages/Master/Places/AddPlace"));
const BranchesList = lazy(() =>
  import("../pages/Master/Branches/BranchesList")
);
const AddBranches = lazy(() => import("../pages/Master/Branches/AddBranches"));
const UpdateArticle = lazy(() =>
  import("../pages/Master/Articles/UpdateArticle")
);
const UpdatePlace = lazy(() => import("../pages/Master/Places/UpdatePlace"));
const UpdateBranches = lazy(() =>
  import("../pages/Master/Branches/UpdateBranches")
);
const BankList = lazy(() => import("../pages/Master/Bank-List/BankList"));
const AddBank = lazy(() => import("../pages/Master/Bank-List/AddBank"));
const UpdateBank = lazy(() => import("../pages/Master/Bank-List/UpdateBank"));
const BankAccountList = lazy(() =>
  import("../pages/Master/Bank-Account-List/BankAccountList")
);
const AddAccount = lazy(() =>
  import("../pages/Master/Bank-Account-List/AddAccount")
);
const UpdateAccount = lazy(() =>
  import("../pages/Master/Bank-Account-List/UpdateAccount")
);

const CustomersList = lazy(() =>
  import("../pages/Master/Customers/CustomersList")
);
const AddCustomers = lazy(() =>
  import("../pages/Master/Customers/AddCustomers")
);
const UpdateCustomers = lazy(() =>
  import("../pages/Master/Customers/UpdateCustomers")
);
const DriversList = lazy(() => import("../pages/Master/Drivers/DriversList"));
const AddDriver = lazy(() => import("../pages/Master/Drivers/AddDriver"));
const UpdateDriver = lazy(() => import("../pages/Master/Drivers/UpdateDriver"));
const EmployeeList = lazy(() =>
  import("../pages/Master/Employee/EmployeeList")
);
const AddEmployee = lazy(() => import("../pages/Master/Employee/AddEmployee"));
const UpdateEmployee = lazy(() =>
  import("../pages/Master/Employee/UpdateEmployee")
);
const VehicleList = lazy(() => import("../pages/Master/Vehicle/VehicleList"));
const AddVehicle = lazy(() => import("../pages/Master/Vehicle/AddVehicle"));
const UpdateVechicle = lazy(() =>
  import("../pages/Master/Vehicle/UpdateVechicle")
);
const RateMasterList = lazy(() =>
  import("../pages/Master/Rate-Master-List/RateMasterList")
);
const AddRateMaster = lazy(() =>
  import("../pages/Master/Rate-Master-List/AddRateMaster")
);
const UpdaterateMaster = lazy(() =>
  import("../pages/Master/Rate-Master-List/UpdaterateMaster")
);
const VehicleOwnerList = lazy(() =>
  import("../pages/Master/VehicleOwner/VehicleOwnerList")
);
const AddVehicleOwner = lazy(() =>
  import("../pages/Master/VehicleOwner/AddVehicleOwner")
);
const UpdateVehicleOwner = lazy(() =>
  import("../pages/Master/VehicleOwner/UpdateVehicleOwner")
);
const VehicleTypeList = lazy(() =>
  import("../pages/Master/VehicleType/VehicleTypeList")
);
const AddVehicleType = lazy(() =>
  import("../pages/Master/VehicleType/AddVehicleType")
);
const UpdateVehicleType = lazy(() =>
  import("../pages/Master/VehicleType/UpdateVehicleType")
);

const TyreSupplierList = lazy(() =>
  import("../pages/Master/TyreSupplier/TyreSupplierList")
);
const AddTyreSupplier = lazy(() =>
  import("../pages/Master/TyreSupplier/AddTyreSupplier")
);
const UpdateTyreSupplier = lazy(() =>
  import("../pages/Master/TyreSupplier/UpdateTyreSupplier")
);

const PetrolPumpList = lazy(() =>
  import("../pages/Master/PetrolPump/PetrolPumpList")
);
const AddPetrolPump = lazy(() =>
  import("../pages/Master/PetrolPump/AddPetrolPump")
);
const UpdatePetrolPump = lazy(() =>
  import("../pages/Master/PetrolPump/UpdatePetrolPump")
);
const LorryRecipt = lazy(() =>
  import("../pages/Transactions/LorryRecipt/LorryRecipt")
);
const BillList = lazy(() =>
  import("../pages/Transactions/BillList/BillList")
);
const LodingTripList = lazy(() =>
  import("../pages/Transactions/LodingTripList/LodingTripList")
);
const PaymentAdviceVehicle  = lazy(() =>
  import("../pages/Transactions/PaymentAdviceVehicle/PaymentAdviceVehicle")
);
const DeliveryStatus  = lazy(() =>
  import("../pages/Transactions/DeliveryStatus/DeliveryStatus")
);
const NewLr  = lazy(() =>
  import("../pages/Transactions/LorryRecipt/NewLr")
);

const NewLoadingTrip  = lazy(() =>
  import("../pages/Transactions/LodingTripList/NewLoadingTrip")
);
const NewBill  = lazy(() =>
  import("../pages/Transactions/BillList/NewBill")
);
const EditLR  = lazy(() =>
  import("../pages/Transactions/LorryRecipt/EditLR")
);
const EditLodingTrip  = lazy(() =>
  import("../pages/Transactions/LodingTripList/EditLodingTrip")
);
const EditBill  = lazy(() =>
  import("../pages/Transactions/BillList/EditBill")
);
const BillRegister  = lazy(() =>
  import("../pages/Reports/BillRegister/BillRegister")
);
const DeliveryStatusReport  = lazy(() =>
  import("../pages/Reports/DeliveryStatusReport/DeliveryStatusReport")
);
const LoadingTripRegister  = lazy(() =>
  import("../pages/Reports/LoadingTripRegister/LoadingTripRegister")
);
const LorryReceiptRegister  = lazy(() =>
  import("../pages/Reports/LorryReceiptRegister/LorryReceiptRegister")
);
const NotBilledLRStatus  = lazy(() =>
  import("../pages/Reports/NotBilledLRStatus/NotBilledLRStatus")
);
const PendingLRStatus  = lazy(() =>
  import("../pages/Reports/PendingLRStatus/PendingLRStatus")
);
const VehiclePayAdviceReport  = lazy(() =>
  import("../pages/Reports/VehiclePayAdviceReport/VehiclePayAdviceReport")
);

const Login = lazy(() => import("../components/common/Login/Login"));

const CustomRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        <Route
          path="/home"
          element={
            <RouteGuard>
              <Home />
            </RouteGuard>
          }
        />
        <Route
          path="/about"
          element={
            <RouteGuard>
              <About />
            </RouteGuard>
          }
        />
        <Route
          path="/user-registration"
          element={
            <RouteGuard>
              <UserRegistration />
            </RouteGuard>
          }
        />
        <Route
          path="/user-permissions"
          element={
            <RouteGuard>
              <UserPermissions />
            </RouteGuard>
          }
        />
        <Route
          path="/new-user-registration"
          element={
            <RouteGuard>
              <NewUserRegistration />
            </RouteGuard>
          }
        />
        <Route
          path="/Articles-List"
          element={
            <RouteGuard>
              <ArticleList />
            </RouteGuard>
          }
        />
        <Route
          path="/CustomerEmail-List"
          element={
            <RouteGuard>
              <CustomeremailList/>
            </RouteGuard>
          }
        />
        <Route
          path="/Add-CustomerEmail"
          element={
            <RouteGuard>
              <AddCustomeremail/>
            </RouteGuard>
          }
        />
            <Route
          path="/Update-CustomerEmail/:id"
          element={
            <RouteGuard>
              <UpdateCustomeremail/>
            </RouteGuard>
          }
        />
        
        <Route
          path="/new-Articles"
          element={
            <RouteGuard>
              <AddArticle />
            </RouteGuard>
          }
        />
        <Route
          path="/Place-List"
          element={
            <RouteGuard>
              <PlaceList />
            </RouteGuard>
          }
        />
        <Route
          path="/new-Places"
          element={
            <RouteGuard>
              <AddPlace />
            </RouteGuard>
          }
        />
        <Route
          path="/Branches-List"
          element={
            <RouteGuard>
              <BranchesList />
            </RouteGuard>
          }
        />
        <Route
          path="/new-Branches"
          element={
            <RouteGuard>
              <AddBranches />
            </RouteGuard>
          }
        />
        <Route
          path="/update-article/:id"
          element={
            <RouteGuard>
              <UpdateArticle />
            </RouteGuard>
          }
        />
        <Route
          path="/update-place/:id"
          element={
            <RouteGuard>
              <UpdatePlace />
            </RouteGuard>
          }
        />
        <Route
          path="/update-Branch/:id"
          element={
            <RouteGuard>
              <UpdateBranches />
            </RouteGuard>
          }
        />
        <Route
          path="/Bank-List"
          element={
            <RouteGuard>
              <BankList />
            </RouteGuard>
          }
        />
        <Route
          path="/new-Bank"
          element={
            <RouteGuard>
              <AddBank />
            </RouteGuard>
          }
        />
        <Route
          path="/update-bank/:id"
          element={
            <RouteGuard>
              <UpdateBank />
            </RouteGuard>
          }
        />
        <Route
          path="/Bank-Account-List"
          element={
            <RouteGuard>
              <BankAccountList />
            </RouteGuard>
          }
        />
        
        <Route
          path="/new-Bank-Account"
          element={
            <RouteGuard>
              <AddAccount />
            </RouteGuard>
          }
        />
        <Route
          path="/Update-Bank-Account/:id"
          element={
            <RouteGuard>
              <UpdateAccount />
            </RouteGuard>
          }
        />
        <Route
          path="/Customers-List"
          element={
            <RouteGuard>
              <CustomersList />
            </RouteGuard>
          }
        />
        <Route
          path="/new-Customers"
          element={
            <RouteGuard>
              <AddCustomers />
            </RouteGuard>
          }
        />
        <Route
          path="/update-Customers/:id"
          element={
            <RouteGuard>
              <UpdateCustomers />
            </RouteGuard>
          }
        />
        <Route
          path="/Drivers-List"
          element={
            <RouteGuard>
              <DriversList />
            </RouteGuard>
          }
        />
        <Route
          path="/new-Drivers"
          element={
            <RouteGuard>
              <AddDriver />
            </RouteGuard>
          }
        />
        <Route
          path="/update-Driver/:id"
          element={
            <RouteGuard>
              <UpdateDriver />
            </RouteGuard>
          }
        />
        <Route
          path="/Employees-List"
          element={
            <RouteGuard>
              <EmployeeList />
            </RouteGuard>
          }
        />
        <Route
          path="/new-Employees"
          element={
            <RouteGuard>
              <AddEmployee />
            </RouteGuard>
          }
        />
        <Route
          path="/update-Employee/:id"
          element={
            <RouteGuard>
              <UpdateEmployee />
            </RouteGuard>
          }
        />
        <Route
          path="/Vehicle-List"
          element={
            <RouteGuard>
              <VehicleList />
            </RouteGuard>
          }
        />
        <Route
          path="/new-Vechicle"
          element={
            <RouteGuard>
              <AddVehicle />
            </RouteGuard>
          }
        />
        <Route
          path="/update-Vechicle/:id"
          element={
            <RouteGuard>
              <UpdateVechicle />
            </RouteGuard>
          }
        />
        <Route
          path="/Rate-Master-List"
          element={
            <RouteGuard>
              <RateMasterList />
            </RouteGuard>
          }
        />
        <Route
          path="/new-RateMaster"
          element={
            <RouteGuard>
              <AddRateMaster />
            </RouteGuard>
          }
        />
        <Route
          path="/update-Rate-Master/:id"
          element={
            <RouteGuard>
              <UpdaterateMaster />
            </RouteGuard>
          }
        />
        <Route
          path="/Vehicle-Owner-List"
          element={
            <RouteGuard>
              <VehicleOwnerList />
            </RouteGuard>
          }
        />
        <Route
          path="/new-AddVehivleOwner"
          element={
            <RouteGuard>
              <AddVehicleOwner />
            </RouteGuard>
          }
        />
        <Route
          path="/update-Vehicle-Owner/:id"
          element={
            <RouteGuard>
              <UpdateVehicleOwner />
            </RouteGuard>
          }
        />
        <Route
          path="/Vehicle-Type-List"
          element={
            <RouteGuard>
              <VehicleTypeList />
            </RouteGuard>
          }
        />
        <Route
          path="/new-Vehicle-Type"
          element={
            <RouteGuard>
              <AddVehicleType />
            </RouteGuard>
          }
        />
        <Route
          path="/update-vehicle-type/:id"
          element={
            <RouteGuard>
              <UpdateVehicleType />
            </RouteGuard>
          }
        />
        <Route
          path="/Tyre-Supplier-List"
          element={
            <RouteGuard>
              <TyreSupplierList />
            </RouteGuard>
          }
        />
        <Route
          path="/new-Supplier"
          element={
            <RouteGuard>
              <AddTyreSupplier />
            </RouteGuard>
          }
        />
        <Route
          path="/update-Supplier/:id"
          element={
            <RouteGuard>
              <UpdateTyreSupplier />
            </RouteGuard>
          }
        />

        <Route
          path="/Petrol-Pump-List"
          element={
            <RouteGuard>
              <PetrolPumpList />
            </RouteGuard>
          }
        />
        <Route
          path="/new-pertol-pump"
          element={
            <RouteGuard>
              <AddPetrolPump />
            </RouteGuard>
          }
        />
        <Route
          path="/update-petrol-pump/:id"
          element={
            <RouteGuard>
              <UpdatePetrolPump />
            </RouteGuard>
          }
        />
         <Route
          path="/LR"
          element={
            <RouteGuard>
              <LorryRecipt />
            </RouteGuard>
          }
        />
         <Route
          path="/Profile"
          element={
            <RouteGuard>
              <ProfileList/>
            </RouteGuard>
          }
        />
        <Route
          path="/UpdateProfile/:id"
          element={
            <RouteGuard>
              <UpdateProfile/>
            </RouteGuard>
          }
        />
        
   <Route
          path="/Bill-List"
          element={
            <RouteGuard>
              <BillList />
            </RouteGuard>
          }
        />
          <Route
          path="/loading_trip"
          element={
            <RouteGuard>
              <LodingTripList />
            </RouteGuard>
          }
        />
          <Route
          path="/Payment-Advice-Vehicle"
          element={
            <RouteGuard>
              <PaymentAdviceVehicle />
            </RouteGuard>
          }
        />
           <Route
          path="/delivery-status"
          element={
            <RouteGuard>
              <DeliveryStatus />
            </RouteGuard>
          }
        />
          <Route
          path="/Add-LR"
          element={
            <RouteGuard>
              <NewLr />
            </RouteGuard>
          }
        />
          <Route
          path="/Add-Loading-Trip"
          element={
            <RouteGuard>
              <NewLoadingTrip />
            </RouteGuard>
          }
        />
           <Route
          path="/Add-Bill"
          element={
            <RouteGuard>
              <NewBill />
            </RouteGuard>
          }
        />
          <Route
          path="/edit-LR/:id"
          element={
            <RouteGuard>
              <EditLR />
            </RouteGuard>
          }
        />
           <Route
          path="/edit-Loading-Trip/:id"
          element={
            <RouteGuard>
              <EditLodingTrip />
            </RouteGuard>
          }
        />
          <Route
          path="/edit-Bill/:id"
          element={
            <RouteGuard>
              <EditBill />
            </RouteGuard>
          }
        />
         <Route
          path="/reports/Bill-Register"
          element={
            <RouteGuard>
              <BillRegister />
            </RouteGuard>
          }
        />
  <Route
          path="/reports/Delivery-Status-Report"
          element={
            <RouteGuard>
              <DeliveryStatusReport />
            </RouteGuard>
          }
        />
          <Route
          path="/reports/Loading-Trip-Register"
          element={
            <RouteGuard>
              <LoadingTripRegister />
            </RouteGuard>
          }
        />
          <Route
          path="/reports/Lorry-Receipt-Register"
          element={
            <RouteGuard>
              <LorryReceiptRegister />
            </RouteGuard>
          }
        />
           <Route
          path="/reports/Not-Billed-LR-Status"
          element={
            <RouteGuard>
              <NotBilledLRStatus />
            </RouteGuard>
          }
        />
           <Route
          path="/reports/Pending-LR-Status"
          element={
            <RouteGuard>
              <PendingLRStatus />
            </RouteGuard>
          }
        />
          <Route
          path="/reports/Vehicle-Pay-Advice-Report"
          element={
            <RouteGuard>
              <VehiclePayAdviceReport />
            </RouteGuard>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default CustomRoutes;
