import Navbar from "../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import "./general.css";
import Footer from "../components/Footer";

const SharedLayout = () => {
  const { pathname } = useLocation();

  const hideNavbarRoutes = [
    "/checkout",
    "/checkout/cancel",
    "/login_register",
    "/profile",
  ];
  const hideFooterRoutes = [
    "/",
    "/search",
    "/checkout/cancel",
    "/login_register",
  ];

  const shouldHideFooter = hideFooterRoutes.includes(pathname);
  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

  return (
    <div className="layout-wrapper">
      {!shouldHideNavbar && <Navbar />}
      <main className="main-content">
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default SharedLayout;
