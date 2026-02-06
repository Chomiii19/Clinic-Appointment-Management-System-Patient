import { useEffect, useState, type JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  FileText,
  Clock,
  Heart,
  Users,
  Cake,
} from "lucide-react";
import { BACKEND_DOMAIN } from "../../configs/config";
import type { IUser, IAppointment } from "../../@types/interface";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { Menu } from "lucide-react";
import {
  statusColors,
  serviceColors,
} from "../../components/admin/adminTable/data";

type TabType = "account" | "appointments";

function ViewAccount() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(
    () =>
      window.innerWidth >= 1024 &&
      localStorage.getItem("sidebarOpen") === "true",
  );
  const [activeTab, setActiveTab] = useState<TabType>("account");

  useEffect(() => {
    fetchUser();
  }, [id]);

  useEffect(() => {
    if (activeTab === "appointments" && user?.role === "user") {
      fetchAppointments();
    }
  }, [activeTab, user]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_DOMAIN}/api/v1/users/${id}`, {
        withCredentials: true,
      });
      setUser(response.data.data);
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      const response = await axios.get(
        `${BACKEND_DOMAIN}/api/v1/appointments/users/${id}`,
        { withCredentials: true },
      );
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, JSX.Element> = {
      Completed: <FileText className="w-4 h-4" />,
      Pending: <Clock className="w-4 h-4" />,
      Approved: <Clock className="w-4 h-4" />,
      Cancelled: <FileText className="w-4 h-4" />,
      Declined: <FileText className="w-4 h-4" />,
      "No Show": <FileText className="w-4 h-4" />,
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  const calculateAge = (birthDate: string): number => {
    return dayjs().diff(dayjs(birthDate), "year");
  };

  if (loading) {
    return (
      <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden">
        <Sidebar
          page="patients"
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
        />
        <div className="w-full h-screen flex flex-col gap-4 lg:ml-58 p-5 overflow-hidden">
          <div className="flex items-center gap-1 w-full">
            <Menu
              onClick={() => setOpenSidebar(true)}
              className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
            />
            <Header headline="Account Details" />
          </div>
          <div className="flex items-center justify-center h-full">
            <div className="text-zinc-400 dark:text-zinc-600">
              Loading account details...
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden">
        <Sidebar
          page="patients"
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
        />
        <div className="w-full h-screen flex flex-col gap-4 lg:ml-58 p-5 overflow-hidden">
          <div className="flex items-center gap-1 w-full">
            <Menu
              onClick={() => setOpenSidebar(true)}
              className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
            />
            <Header headline="Account Details" />
          </div>
          <div className="flex items-center justify-center h-full">
            <div className="text-zinc-400 dark:text-zinc-600">
              Account not found
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden">
      <Sidebar
        page="patients"
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />

      <div className="w-full h-screen flex flex-col gap-4 lg:ml-58 p-5 overflow-y-auto">
        <div className="flex items-center gap-1 w-full">
          <Menu
            onClick={() => setOpenSidebar(true)}
            className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
          />
          <Header headline="Account Details" />
        </div>

        {/* Back Button & Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <button
            onClick={() => navigate(`/users/${id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-150"
          >
            <Edit className="w-4 h-4" />
            <span className="font-medium">Edit Account</span>
          </button>
        </div>

        {/* Profile Header */}
        <div className="bg-system-white dark:bg-system-black rounded-xl border border-zinc-300 dark:border-zinc-700 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <img
                src={user.profile_url || "/assets/images/user-profile.jpg"}
                alt={`${user.firstname} ${user.surname}`}
                className="w-24 h-24 rounded-full border-4 border-zinc-200 dark:border-zinc-700"
              />
              <div className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-full">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                {user.firstname} {user.surname}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-3">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Phone className="w-4 h-4" />
                  <span>{user.phoneNumber || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined {dayjs(user.createdAt).format("MMM DD, YYYY")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-300 dark:border-zinc-700">
          <button
            onClick={() => setActiveTab("account")}
            className={`px-4 py-2 font-medium text-sm transition-colors duration-150 border-b-2 ${
              activeTab === "account"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            Account Information
          </button>
          {user.role === "user" && (
            <button
              onClick={() => setActiveTab("appointments")}
              className={`px-4 py-2 font-medium text-sm transition-colors duration-150 border-b-2 ${
                activeTab === "appointments"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              Appointment Records
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="pb-8">
          {activeTab === "account" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-system-white dark:bg-system-black rounded-xl border border-zinc-300 dark:border-zinc-700 p-6">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                      Full Name
                    </p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {user.firstname} {user.surname}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                      Gender
                    </p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {user.gender || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                      Date of Birth
                    </p>
                    <div className="flex items-center gap-2">
                      <Cake className="w-4 h-4 text-zinc-400" />
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {user.birthDate
                          ? dayjs(user.birthDate).format("MMMM DD, YYYY")
                          : "Not provided"}
                      </p>
                      {user.birthDate && (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          ({calculateAge(user.birthDate)} years old)
                        </span>
                      )}
                    </div>
                  </div>

                  {user.maritalStatus && (
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                        Marital Status
                      </p>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-zinc-400" />
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          {user.maritalStatus}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-system-white dark:bg-system-black rounded-xl border border-zinc-300 dark:border-zinc-700 p-6">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                      Email Address
                    </p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-zinc-400" />
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                      Phone Number
                    </p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-zinc-400" />
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {user.phoneNumber || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                      Address
                    </p>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-zinc-400 mt-0.5" />
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {user.address || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-system-white dark:bg-system-black rounded-xl border border-zinc-300 dark:border-zinc-700 p-6">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Account Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                      Account ID
                    </p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 font-mono">
                      {user._id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                      Role
                    </p>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-zinc-400" />
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                            : user.role === "staff"
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                              : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                        }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                      Account Created
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-zinc-400" />
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {dayjs(user.createdAt).format("MMMM DD, YYYY h:mm A")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appointments" && user.role === "user" && (
            <div className="bg-system-white dark:bg-system-black rounded-xl border border-zinc-300 dark:border-zinc-700">
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Appointment History
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  All appointments for this patient
                </p>
              </div>

              {appointmentsLoading ? (
                <div className="p-12 text-center text-zinc-400 dark:text-zinc-600">
                  Loading appointments...
                </div>
              ) : appointments.length === 0 ? (
                <div className="p-12 text-center text-zinc-400 dark:text-zinc-600">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No appointments found for this patient</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-500 dark:text-zinc-400">
                      <tr>
                        <th className="px-6 py-3 text-left font-medium">
                          Reference
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                          Schedule
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                          Services
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                          Doctor
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {appointments.map((appointment) => (
                        <tr
                          key={appointment._id}
                          onClick={() =>
                            navigate(`/appointments/${appointment._id}`)
                          }
                          className="hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors duration-150"
                        >
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 font-mono">
                              {appointment._id.slice(0, 8).toUpperCase()}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-zinc-400" />
                              <div>
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                  {dayjs(appointment.schedule).format(
                                    "MMM DD, YYYY",
                                  )}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                  {dayjs(appointment.schedule).format("h:mm A")}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(appointment.medicalDepartment) ? (
                                appointment.medicalDepartment
                                  .slice(0, 2)
                                  .map((service, idx) => {
                                    const serviceName =
                                      typeof service === "object" &&
                                      service !== null
                                        ? service.name
                                        : service;
                                    return (
                                      <span
                                        key={idx}
                                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                                          serviceColors[serviceName] ||
                                          "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                        }`}
                                      >
                                        {serviceName}
                                      </span>
                                    );
                                  })
                              ) : (
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                  {typeof appointment.medicalDepartment ===
                                  "object"
                                    ? appointment.medicalDepartment.name
                                    : appointment.medicalDepartment}
                                </span>
                              )}
                              {Array.isArray(appointment.medicalDepartment) &&
                                appointment.medicalDepartment.length > 2 && (
                                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                    +{appointment.medicalDepartment.length - 2}
                                  </span>
                                )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-zinc-900 dark:text-zinc-50">
                              {appointment.doctorName || "Not assigned"}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white ${
                                statusColors[appointment.status] ||
                                "bg-gray-400"
                              }`}
                            >
                              {getStatusIcon(appointment.status)}
                              {appointment.status === "Approved"
                                ? "On Queue"
                                : appointment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default ViewAccount;
