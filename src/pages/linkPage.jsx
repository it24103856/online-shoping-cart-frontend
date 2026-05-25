import { Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Importing page components
import HomePage from "./homePage";
import AboutPage from "./aboutPage";
import ContactPage from "./contactPage";
import ProductPage from "./productPage";
import OrderPage from "./orderPage";
import PaymentPage from "./paymentPage";
import ReviewPage from "./reviewPage";
import FeedbackPage from "./feedbackPage";
import MyOrderPage from "../components/MyOrderPage";
import MyPayment from "../components/MyPayment";
import ProfilePage from "./ProfilePage";
import ProductOverview from "./productOverview";
import Cartpage from "./cart";
import CheckOutPage from "./checkOut";


export default function LinkPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-[72px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-orders" element={<MyOrderPage />} />
          <Route path="/my-orders/:userId" element={<MyOrderPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/my-payments" element={<MyPayment />} />
          <Route path="/reviews" element={<ReviewPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/products/:productID" element={<ProductOverview />} />
          <Route path="/cart" element={<Cartpage />} />
          <Route path="/checkout" element={<CheckOutPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}