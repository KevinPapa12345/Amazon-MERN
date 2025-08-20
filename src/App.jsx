import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import SharedLayout from "./layout/SharedLayout";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import ScrollToTop from "./components/Misc/ScrollToTop.jsx";
import LoadingSpinner from "./components/UI/LoadingSpinner.jsx";
import { useUser } from "./context/UserContext.jsx";

const Amazon = lazy(() => import("./pages/Amazon.jsx"));
const Error = lazy(() => import("./pages/Error"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const Tracking = lazy(() => import("./pages/Tracking.jsx"));
const LoginSignUp = lazy(() => import("./pages/LoginSignUp.jsx"));
const SearchResults = lazy(() => import("./pages/SearchResults.jsx"));
const ProductReview = lazy(() => import("./pages/ProductReview.jsx"));
const CancelCheckout = lazy(() => import("./pages/CancelCheckout.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));

const App = () => {
  const { user } = useUser();
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<Amazon />} />
            <Route path="product/:id" element={<ProductReview />} />
            <Route path="search" element={<SearchResults />} />

            <Route path="orders">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="tracking/:orderId"
                element={
                  <ProtectedRoute>
                    <Tracking />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="checkout">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route path="cancel" element={<CancelCheckout />} />
            </Route>

            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="login_register"
              element={user.username ? <Navigate to="/" /> : <LoginSignUp />}
            />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
