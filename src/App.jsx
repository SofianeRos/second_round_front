import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import SellLanding from "./pages/SellLanding";
import SellForm from "./pages/SellForm";
import Messagerie from "./pages/Messagerie";
import Catalogue from "./pages/Catalogue";
import Guides from "./pages/Guides";
import GuideTailles from "./pages/GuideTailles";
import AdminPanel from "./pages/AdminPanel";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import PaymentMockCheckout from "./pages/PaymentMockCheckout";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/articles/:id" element={<ProductDetail />} />
           <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/sell" element={<SellLanding />} />
          <Route path="/sell/form" element={<SellForm />} />
          <Route path="/messages" element={<Messagerie />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/guides/tailles" element={<GuideTailles />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          <Route path="/payment/mock-checkout" element={<PaymentMockCheckout />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
