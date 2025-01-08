import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Category from "./pages/Category/Category.js";
import Feedback from "./pages/Feedback/Feedback.js";
import SendFeedbackPage from "./pages/Feedback/SendFeedbackPage.js";
import ShopDetails from "./pages/ShopDetails/ShopDetails.js";
import EditCategory from "./pages/Category/EditCategory.js";
import AddCategory from "./pages/Category/AddCategory.js";
import ShopApplication from "./pages/ShopApplication/ShopApplication.js";
import DetailApplication from "./pages/DetailApplication/DetailApplication.js";
import ShopOverview from "./pages/ShopOverview/ShopOverview.js";
import NotificationManagement from "./pages/NotificationManagement/NotificationManagement.js";
import ShopDetail from "./pages/ShopDetail/ShopDetail.js";
import UserDetail from "./pages/UserInformation/UserDetail.js";
import UserList from "./pages/UserInformation/UserList.js";
import DashboardStaff from "./pages/DashboardStaff/DashboardStaff.js";

import DashboardPage from "./pages/DashboardPage/index.jsx";
import OrdersPage from "./pages/OrderPage/index.jsx";
import LoginPage from "./pages/LoginPage/index.jsx";
import RegisterPage from "./pages/RegisterPage/index.jsx";
import ProtectedRoute from "./ProtectedRoute.js";
import MainLayout from "./components/MainLayout/index.jsx";
import ProfilePage from "./pages/ProfilePage/index.jsx";
import FeedbackPage from "./pages/FeedbackPage/FeedbackPage.jsx";
import CouponPage from "./pages/CouponPage/CouponPage.jsx";
import ProductPage from "./pages/ProductPage/ProductPage.jsx";
import StaffPage from "./pages/StaffPage/StaffPage.jsx";
import AddProduct from "./pages/ProductPage/AddProduct.jsx"; // Import AddProduct
import UserDetails from "./pages/CustomerPage/UserDetails.jsx";
import AddCoupon from "./pages/CouponPage/AddCoupon.jsx";
import FeedBackShop from './pages/FeedbackPage/FeedbackShop.jsx';
import OrderShop from './pages/OrderPage/OrderShop.jsx';
import PackageAdmin from './pages/PackagePage/PackageAdmin.jsx';
import { AuthProvider } from "./auth/AuthProvider.js";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ShopRegister from "./pages/ShopRegister/index.jsx";
import ForgotPassword from "./pages/ForgotPassword/index.jsx";
import ShopProfile from "./pages/ShopProfile/index.jsx";
import ShopPackagePage from "./pages/ShopPackagePage/ShopPackagePage.jsx";
import PackagePayment from "./pages/ShopPackagePage/PackagePayment.jsx";
import PackagePaymentReturn from "./pages/PackagePaymentReturn/PackagePaymentReturn.jsx";
import OrderDetailPage from "./pages/OrderDetailPage/OrderDetailPage.jsx";
import ShopLocation from "./pages/ShopLocation/ShopLocation.jsx";
import ProductApplication from "./pages/ProductApplication/ProductApplication.js";
import DetailShopApplication from "./pages/ProductApplication/DetailProductApplication.js";
import DashboardShop from "./pages/DashboardShop/index.jsx";
import ShopOperatingHours from "./pages/ShopOperatingHours/index.jsx";
import ShopPrepList from "./pages/ShopPrepList/index.jsx";
import StaffStudentConfirm from "./pages/StaffStudentConfirm/index.jsx";
import ShopWallet from "./pages/ShopWallet/index.jsx";
import ShopReport from "./pages/ShopReport/index.jsx";
import { WalletProvider } from "./context/WalletProvider.js";

import UniversityList from './pages/University/UniversityList';
import AddUniversity from './pages/University/AddUniversity';
import EditUniversity from './pages/University/EditUniversity';


function App() {
  return (
    <AuthProvider>
      <WalletProvider>

        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/join-shop" element={<ShopRegister />} />

            {/* Admin Routes */}
            <Route element={<MainLayout />} path="/admin">
              <Route
                path="/admin"
                element={<ProtectedRoute element={<DashboardPage />} requiredRole={"Admin"} />}
              />
              <Route
                path="/admin/manage-staff"
                element={<ProtectedRoute element={<StaffPage />} requiredRole={"Admin"} />}
              />
              <Route
                path="/admin/customer-details"
                element={<ProtectedRoute element={<UserDetails />} requiredRole={"Admin"} />}
              />
              <Route
                path="/admin/package"
                element={<ProtectedRoute element={<PackageAdmin />} requiredRole={"Admin"} />}
              />
              <Route
                path="/admin/orders"
                element={<ProtectedRoute element={<OrdersPage />} requiredRole={"Admin"} />}
              />
              <Route
                path="/admin/profile"
                element={<ProtectedRoute element={<ProfilePage />} requiredRole={"Admin"} />}
              />
              <Route
                path="/admin/feedback"
                element={<ProtectedRoute element={<FeedbackPage />} requiredRole={"Admin"} />}
              />
            </Route>

            {/* Shop Routes */}
            <Route element={<MainLayout />} path="/shop">
              <Route
                path="/shop"
                element={<ProtectedRoute element={<ShopPackagePage />} requiredRole={"Shop"} />}
              />
              <Route
                path="/shop/package"
                element={<ProtectedRoute element={<ShopPackagePage />} requiredRole={"Shop"} />}
              />
              <Route
                path="/shop/dashboard"
                element={<ProtectedRoute element={<DashboardShop />} requiredRole={"Shop"} />}
              />
              <Route
                path="/shop/package/payment"
                element={<ProtectedRoute element={<PackagePayment />} requiredRole={"Shop"} />}
              />
              <Route
                path="/shop/package/payment/return"
                element={<ProtectedRoute element={<PackagePaymentReturn />} requiredRole={"Shop"} />}
              />
              <Route
                path="/shop/feedback-shop"
                element={<ProtectedRoute element={<FeedBackShop />} requiredRole={"Shop"} />}
              />
              <Route
                path="/shop/operating-hours"
                element={<ProtectedRoute element={<ShopOperatingHours />} requiredRole={"Shop"} />}
              />
              <Route
                path="/shop/prep-list"
                element={<ProtectedRoute element={<ShopPrepList />} requiredRole={"Shop"} />}
              />
              <Route
                path="/shop/wallet"
                element={<ProtectedRoute element={<ShopWallet />} requiredRole={"Shop"} />}
              />
              <Route
                path="/shop/report"
                element={<ProtectedRoute element={<ShopReport />} requiredRole={"Shop"} />}
              />
              <Route
                path="/shop/coupon-page"
                element={<ProtectedRoute element={<CouponPage />} requiredRole={"Shop"} />}
              />
              <Route
                path="/shop/add-Coupon"
                element={<ProtectedRoute element={<AddCoupon />} requiredRole={"Shop"} />}
              />
              <Route
                path="/shop/orders"
                element={<ProtectedRoute element={<OrderShop />} requiredRole={"Shop"} />}
              />
              <Route
                path="/shop/orders/detail"
                element={<ProtectedRoute element={<OrderDetailPage />} requiredRole={"Shop"} />}
              />
              <Route
                path="/shop/profile"
                element={<ProtectedRoute element={<ProfilePage />} requiredRole={"Shop"} />}
              />
              <Route
                path="/shop/about-shop"
                element={<ProtectedRoute element={<ShopProfile />} requiredRole={"Shop"} />}
              />
              <Route
                path="/shop/menu"
                element={<ProtectedRoute element={<ProductPage />} requiredRole={"Shop"} />}
              />
              <Route
                path="/shop/add-product"
                element={<ProtectedRoute element={<AddProduct />} requiredRole={"Shop"} />} // Add route for AddProduct
              />

              <Route
                path="/shop/location"
                element={
                  <ProtectedRoute
                    element={<ShopLocation />}
                    requiredRole={"Shop"}
                  />
                } // Add route for AddProduct
              />
            </Route>

            {/* Staff Routes */}
            <Route element={<MainLayout />} path="/">
              <Route
                path="/category"
                element={
                  <ProtectedRoute element={<Category />} requiredRole={"Staff"} />
                }
              />
              <Route
                path="/feedback"
                element={
                  <ProtectedRoute element={<Feedback />} requiredRole={"Staff"} />
                }
              />
              <Route
                path="/send-feedback"
                element={
                  <ProtectedRoute
                    element={<SendFeedbackPage />}
                    requiredRole={"Staff"}
                  />
                }
              />
              <Route
                path="/shop-details"
                element={
                  <ProtectedRoute
                    element={<ShopDetails />}
                    requiredRole={"Staff"}
                  />
                }
              />
              <Route
                path="/edit-category/:id/:name/:description"
                element={
                  <ProtectedRoute
                    element={<EditCategory />}
                    requiredRole={"Staff"}
                  />
                }
              />
              <Route
                path="/add-category"
                element={
                  <ProtectedRoute
                    element={<AddCategory />}
                    requiredRole={"Staff"}
                  />
                }
              />
              <Route
                path="/shop-application"
                element={
                  <ProtectedRoute
                    element={<ShopApplication />}
                    requiredRole={"Staff"}
                  />
                }
              />
              <Route
                path="/student-confirm"
                element={
                  <ProtectedRoute
                    element={<StaffStudentConfirm />}
                    requiredRole={"Staff"}
                  />
                }
              />
              <Route
                path="/detail-application/:id"
                element={
                  <ProtectedRoute
                    element={<DetailApplication />}
                    requiredRole={"Staff"}
                  />
                }
              />
              <Route
                path="/detail-product-application/:id"
                element={
                  <ProtectedRoute
                    element={<DetailShopApplication />}
                    requiredRole={"Staff"}
                  />
                }
              />
              <Route
                path="/shop-details/:id"
                element={
                  <ProtectedRoute
                    element={<ShopDetail />}
                    requiredRole={"Staff"}
                  />
                }
              />

              <Route
                path="/shopOverview"
                element={
                  <ProtectedRoute
                    element={<ShopOverview />}
                    requiredRole={"Staff"}
                  />
                }
              />
              <Route
                path="/notificationManagement"
                element={
                  <ProtectedRoute
                    element={<NotificationManagement />}
                    requiredRole={"Staff"}
                  />
                }
              />
              <Route
                path="/user-information/:userId"
                element={
                  <ProtectedRoute
                    element={<UserDetail />}
                    requiredRole={"Staff"}
                  />
                }
              />
              <Route
                path="/user-list"
                element={
                  <ProtectedRoute element={<UserList />} requiredRole={"Staff"} />
                }
              />

              <Route
                path="/dashboardStaff"
                element={
                  <ProtectedRoute
                    element={<DashboardStaff />}
                    requiredRole={"Staff"}
                  />
                }
              />
   <Route
                path="/university"
                element={
                  <ProtectedRoute
                    element={<UniversityList />}
                    requiredRole={"Staff"}
                  />
                }
              />
            <Route
                path="/add-university"
                element={
                  <ProtectedRoute
                    element={<AddUniversity />}
                    requiredRole={"Staff"}
                  />
                }
              />
            <Route
                path="/edit-university/:id/:name"
                element={
                  <ProtectedRoute
                    element={<EditUniversity />}
                    requiredRole={"Staff"}
                  />
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute
                    element={<ProfilePage />}
                    requiredRole={"Staff"}
                  />
                }
              />
              <Route
                path="/productApplication"
                element={
                  <ProtectedRoute
                    element={<ProductApplication />}
                    requiredRole={"Staff"}
                  />
                }
              />
            </Route>


              </Routes>
        </Router>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;
