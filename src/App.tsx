import { Route, Routes } from "react-router-dom";
import "./global.css";
import Landing from "./pages/patient/landing";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import ForgotPassword from "./pages/auth/forgotPassword";
import Home from "./pages/patient/home";
import ViewAccount from "./pages/patient/viewAccount";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import Today from "./pages/patient/today";
import Dashboard from "./pages/admin/app/dashboard";
import ArchiveAppointments from "./pages/admin/app/appointments/archiveAppointments";
import Appointments from "./pages/admin/app/appointments/appointments";
import TodayAppointments from "./pages/admin/app/appointments/todayAppointments";
import Patients from "./pages/admin/app/patients";
import ManageAdmins from "./pages/admin/settings/manageAdmins";
import EditAccount from "./pages/admin/app/editAccount";
import ManageDoctors from "./pages/admin/settings/manageDoctors";
import ManageSchedules from "./pages/admin/settings/manageSchedules";
import ManageTodaySchedules from "./pages/admin/settings/manageTodaySchedules";
import ManageServices from "./pages/admin/settings/manageServices";
import PolictyTerms from "./pages/admin/settings/policyTerms";
import ViewAppointment from "./pages/admin/app/viewAppointments";
import { AuthProvider } from "./contexts/AuthContext";
import ManagePrices from "./pages/admin/settings/ManagePrices";

function App() {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Patient */}
          <Route path="/users/:id/appointments" element={<Home />} />
          <Route path="/users/:id/appointments/today" element={<Today />} />

          {/* Admin */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route
            path="/appointments/archive"
            element={<ArchiveAppointments />}
          />
          <Route path="/appointments/today" element={<TodayAppointments />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/admins" element={<ManageAdmins />} />
          <Route path="/users/:id/edit" element={<EditAccount />} />
          <Route path="/doctors" element={<ManageDoctors />} />
          <Route path="/schedules" element={<ManageSchedules />} />
          <Route path="/schedules/today" element={<ManageTodaySchedules />} />
          <Route path="/services" element={<ManageServices />} />
          <Route path="/prices" element={<ManagePrices />} />

          {/* Both */}
          <Route path="/users/:id" element={<ViewAccount />} />
          <Route path="/appointments/:id" element={<ViewAppointment />} />
          <Route path="/policies-and-terms" element={<PolictyTerms />} />
        </Routes>
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default App;
