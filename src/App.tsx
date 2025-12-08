import { Route, Routes } from "react-router-dom";
import "./global.css";
import Landing from "./pages/landing";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import ForgotPassword from "./pages/auth/forgotPassword";
import Home from "./pages/home";
import ViewAccount from "./pages/viewAccount";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import Today from "./pages/today";

function App() {
  return (
    <DarkModeProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/appointments" element={<Home />} />
        <Route path="/appointments/today" element={<Today />} />
        <Route path="/users/:id" element={<ViewAccount />} />
      </Routes>
    </DarkModeProvider>
  );
}

export default App;
