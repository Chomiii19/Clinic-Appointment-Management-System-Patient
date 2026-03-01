import Select from "react-select";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  DollarSign,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Archive,
  Upload,
  Trash2,
  File,
  X,
  Pen,
  CalendarClock,
} from "lucide-react";
import { BACKEND_DOMAIN } from "../../../configs/config";
import type { IAppointment, IService } from "../../../@types/interface";
import {
  statusColors,
  serviceColors,
} from "../../../components/admin/adminTable/data";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { Menu } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";

interface DoctorFormData {
  schedule: string;
  medicalDepartment: string[];
}

interface DoctorOption {
  value: string;
  label: string;
  specialization?: string;
}

interface DoctorResponse {
  _id: string;
  firstname: string;
  middlename: string;
  surname: string;
  specialization?: string;
}

function ViewAppointment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<IAppointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(
    () =>
      window.innerWidth >= 1024 &&
      localStorage.getItem("sidebarOpen") === "true",
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAuth();
  const [servicePrices, setServicePrices] = useState<{ [key: string]: number }>(
    {},
  );
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editFormState, setEditFormState] = useState<DoctorFormData>({
    schedule: "",
    medicalDepartment: [],
  });

  const [doctorOptions, setDoctorOptions] = useState<DoctorOption[]>([]);
  const [selectedDoctors, setSelectedDoctors] = useState<DoctorOption[]>([]);
  const [assigningDoctors, setAssigningDoctors] = useState(false);
  const [doctorsLoaded, setDoctorsLoaded] = useState(false);

  const [openRescheduleModal, setOpenRescheduleModal] = useState(false);
  const [rescheduleSchedule, setRescheduleSchedule] = useState("");

  const handleReschedule = async () => {
    if (!appointment) return;
    try {
      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/appointments/${appointment._id}`,
        {
          schedule: rescheduleSchedule,
          medicalDepartment: Array.isArray(appointment.medicalDepartment)
            ? appointment.medicalDepartment.map((s) =>
                typeof s === "string" ? s : s._id,
              )
            : [
                typeof appointment.medicalDepartment === "string"
                  ? appointment.medicalDepartment
                  : appointment.medicalDepartment._id,
              ],
        },
        { withCredentials: true },
      );
      setOpenRescheduleModal(false);
      await fetchAppointment();
    } catch (error) {
      console.error("Reschedule failed:", error);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  useEffect(() => {
    if (appointment?.medicalDepartment) {
      fetchServicePrices();
    }
  }, [appointment?.medicalDepartment]);

  useEffect(() => {
    if (appointment?.doctorId) {
      const current = Array.isArray(appointment.doctorId)
        ? appointment.doctorId
        : [appointment.doctorId];

      setSelectedDoctors(
        current.filter(Boolean).map((d) => ({
          value: d._id,
          label: `${d.firstname} ${d.middlename ?? ""} ${d.surname}`.trim(),
          specialization: d.specialization,
        })),
      );
    } else {
      setSelectedDoctors([]);
    }
  }, [appointment]);

  const loadDoctors = async () => {
    if (doctorsLoaded) return;
    try {
      const res = await axios.get(
        `${BACKEND_DOMAIN}/api/v1/appointments/${id}/doctors-available`,
        { withCredentials: true },
      );
      setDoctorOptions(
        res.data.data.map((d: DoctorResponse) => ({
          value: d._id,
          label: `${d.firstname} ${d.middlename ?? ""} ${d.surname}`,
          specialization: d.specialization,
        })),
      );
      setDoctorsLoaded(true);
    } catch (err) {
      console.error("Failed to load doctors", err);
    }
  };

  const handleAssignDoctors = async () => {
    if (!appointment) return;
    try {
      setAssigningDoctors(true);
      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/appointments/${appointment._id}/doctor`,
        { doctorIds: selectedDoctors.map((d) => d.value) },
        { withCredentials: true },
      );
      await fetchAppointment();
    } catch (err) {
      console.error("Failed to assign doctors", err);
    } finally {
      setAssigningDoctors(false);
    }
  };

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_DOMAIN}/api/v1/appointments/${id}`,
        { withCredentials: true },
      );
      setAppointment(response.data.data);
    } catch (error) {
      console.error("Failed to fetch appointment", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServicePrices = async () => {
    if (!appointment?.medicalDepartment) return;

    try {
      const departments = Array.isArray(appointment.medicalDepartment)
        ? appointment.medicalDepartment
        : [appointment.medicalDepartment];

      const serviceNames = departments
        .map((service) => {
          if (typeof service === "string") return service;
          if (typeof service === "object" && service !== null)
            return (service as IService).name;
          return "";
        })
        .filter(Boolean);

      const response = await axios.post(
        `${BACKEND_DOMAIN}/api/v1/services/prices`,
        { names: serviceNames },
        { withCredentials: true },
      );

      if (response.data.status === "success") {
        setServicePrices(response.data.data);
        if (response.data.notFound?.length > 0)
          console.warn("Services not found:", response.data.notFound);
      }
    } catch (error) {
      console.error("Failed to fetch service prices", error);
    }
  };

  const calculateTotalPrice = (): number => {
    if (!appointment?.medicalDepartment) return 0;

    const departments = Array.isArray(appointment.medicalDepartment)
      ? appointment.medicalDepartment
      : [appointment.medicalDepartment];

    return departments.reduce((sum, dept) => {
      if (typeof dept === "string") return sum + (servicePrices[dept] || 0);
      if (typeof dept === "object" && dept !== null)
        return sum + ((dept as IService).price || 0);
      return sum;
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  const handleArchive = async () => {
    if (!appointment) return;
    if (!confirm("Are you sure you want to archive this appointment?")) return;

    try {
      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/appointments/${appointment._id}/archive`,
        { archive: true },
        { withCredentials: true },
      );
      navigate("/appointments");
    } catch (error) {
      console.error("Failed to archive appointment", error);
    }
  };

  const handleAction = async (action: string) => {
    if (!appointment) return;
    try {
      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/appointments/${appointment._id}/${action}`,
        {},
        { withCredentials: true },
      );
      await fetchAppointment();
    } catch (error) {
      console.error("Failed to update appointment status", error);
    }
  };

  // --- File selection (staging) ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(event.target.files || []);
    if (!incoming.length) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 10 * 1024 * 1024;

    const invalid = incoming.find(
      (f) => !allowedTypes.includes(f.type) || f.size > maxSize,
    );

    if (invalid) {
      setUploadError(
        !allowedTypes.includes(invalid.type)
          ? `"${invalid.name}" has an invalid type. Allowed: PDF, Image, Word.`
          : `"${invalid.name}" exceeds the 10MB size limit.`,
      );
      return;
    }

    setUploadError("");
    setSelectedFiles((prev) => {
      // Deduplicate by name + size
      const existing = new Set(prev.map((f) => `${f.name}-${f.size}`));
      return [
        ...prev,
        ...incoming.filter((f) => !existing.has(`${f.name}-${f.size}`)),
      ];
    });

    // Reset input so the same file can be re-selected if removed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Upload staged files ---
  const handleUpload = async () => {
    if (!selectedFiles.length || !appointment) return;

    setUploadError("");
    setUploadSuccess(false);
    setUploading(true);

    const formData = new FormData();
    formData.append("appointmentId", appointment._id);
    selectedFiles.forEach((file) => formData.append("files", file));

    try {
      await axios.post(
        `${BACKEND_DOMAIN}/api/v1/medical-records/upload`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setUploadSuccess(true);
      setSelectedFiles([]);
      await fetchAppointment();

      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        setUploadError(
          axiosError.response?.data?.message ||
            "Failed to upload files. Please try again.",
        );
      } else {
        setUploadError("Failed to upload files. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  // --- Delete a single record ---
  const handleDeleteMedicalRecord = async (recordId: string) => {
    if (!appointment) return;
    if (
      !confirm(
        "Are you sure you want to delete this medical record? This action cannot be undone.",
      )
    )
      return;

    setDeletingRecordId(recordId);
    try {
      await axios.delete(
        `${BACKEND_DOMAIN}/api/v1/medical-records/${recordId}/appointments/${appointment._id}`,
        { withCredentials: true },
      );
      await fetchAppointment();
    } catch (error) {
      console.error("Failed to delete medical record", error);
      alert("Failed to delete medical record. Please try again.");
    } finally {
      setDeletingRecordId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="w-5 h-5" />;
      case "Cancelled":
      case "Declined":
      case "No Show":
        return <XCircle className="w-5 h-5" />;
      case "Approved":
        return <Clock className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf")
      return <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />;
    if (["jpg", "jpeg", "png", "gif"].includes(ext || ""))
      return <File className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    return <File className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />;
  };

  const getServicePrice = (service: string | IService): number => {
    if (typeof service === "string") return servicePrices[service] || 0;
    if (typeof service === "object" && service !== null)
      return service.price || 0;
    return 0;
  };

  const getServiceName = (service: string | IService): string => {
    if (typeof service === "string") return service;
    if (typeof service === "object" && service !== null) return service.name;
    return "";
  };

  const medicalRecords = appointment?.medicalRecords ?? [];

  const handleEditAppointment = async (formData: DoctorFormData) => {
    if (!appointment) return;
    try {
      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/appointments/${appointment._id}`,
        {
          schedule: formData.schedule,
          medicalDepartment: formData.medicalDepartment,
        },
        { withCredentials: true },
      );
      setOpenEditModal(false);
      setEditFormState({ schedule: "", medicalDepartment: [] });
      await fetchAppointment();
    } catch (error) {
      console.error("Appointment update failed:", error);
    }
  };

  if (loading) {
    return (
      <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden">
        {currentUser?.role === "admin" && (
          <Sidebar
            page="patients"
            openSidebar={openSidebar}
            setOpenSidebar={setOpenSidebar}
          />
        )}
        <div
          className={`w-full h-screen flex flex-col gap-4 p-5 overflow-y-auto ${currentUser?.role === "admin" && "lg:ml-58"}`}
        >
          <div className="flex items-center gap-1 w-full">
            <Menu
              onClick={() => setOpenSidebar(true)}
              className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
            />
            <Header headline="Appointment Details" />
          </div>
          <div className="flex items-center justify-center h-full">
            <div className="text-zinc-400 dark:text-zinc-600">
              Loading appointment details...
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!appointment) {
    return (
      <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden">
        {currentUser?.role === "admin" && (
          <Sidebar
            page="patients"
            openSidebar={openSidebar}
            setOpenSidebar={setOpenSidebar}
          />
        )}
        <div className="w-full h-screen flex flex-col gap-4 lg:ml-58 p-5 overflow-hidden">
          <div className="flex items-center gap-1 w-full">
            <Menu
              onClick={() => setOpenSidebar(true)}
              className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
            />
            <Header headline="Appointment Details" />
          </div>
          <div className="flex items-center justify-center h-full">
            <div className="text-zinc-400 dark:text-zinc-600">
              Appointment not found
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden">
      {currentUser?.role === "admin" && (
        <Sidebar
          page="appointments"
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
        />
      )}

      <div
        className={`w-full h-screen flex flex-col gap-4 p-5 overflow-y-auto ${currentUser?.role === "admin" && "lg:ml-58"}`}
      >
        {openEditModal && (
          <div
            onClick={() => setOpenEditModal(false)}
            className="fixed inset-0 z-60 flex justify-center items-center bg-black/15 dark:bg-black/25"
          >
            <ServiceModal
              formState={editFormState}
              setFormState={setEditFormState}
              onSubmit={() => handleEditAppointment(editFormState)}
              onClose={() => setOpenEditModal(false)}
              title="Edit Appointment"
            />
          </div>
        )}

        {openRescheduleModal && (
          <div
            onClick={() => setOpenRescheduleModal(false)}
            className="fixed inset-0 z-60 flex justify-center items-center bg-black/15 dark:bg-black/25"
          >
            <RescheduleModal
              schedule={rescheduleSchedule}
              setSchedule={setRescheduleSchedule}
              onSubmit={handleReschedule}
              onClose={() => setOpenRescheduleModal(false)}
            />
          </div>
        )}

        <div className="flex items-center gap-1 w-full">
          <Menu
            onClick={() => setOpenSidebar(true)}
            className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
          />
          <Header headline="Appointment Details" />
        </div>

        {/* Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Appointments</span>
          </button>

          <div className="flex items-center gap-2">
            {currentUser?.role === "user" && (
              <div className="flex items-center gap-2">
                {["Pending"].includes(appointment.status) && (
                  <button
                    onClick={() => {
                      setEditFormState({
                        schedule: dayjs(appointment.schedule).format(
                          "YYYY-MM-DDTHH:mm",
                        ),
                        medicalDepartment: Array.isArray(
                          appointment.medicalDepartment,
                        )
                          ? appointment.medicalDepartment.map((s) =>
                              typeof s === "string" ? s : s.name,
                            )
                          : [
                              typeof appointment.medicalDepartment === "string"
                                ? appointment.medicalDepartment
                                : appointment.medicalDepartment.name,
                            ],
                      });
                      setOpenEditModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-900 transition-colors duration-150"
                  >
                    <Pen className="w-5" /> Edit
                  </button>
                )}
                {["Approved", "Pending"].includes(appointment.status) && (
                  <button
                    onClick={() => handleAction("cancelled")}
                    className="flex items-center gap-2 px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors duration-150"
                  >
                    <span className="font-medium">Cancel</span>
                  </button>
                )}
              </div>
            )}

            {currentUser?.role === "admin" && (
              <div className="flex items-center gap-2">
                {appointment.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleAction("approve")}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-150"
                    >
                      <span className="font-medium">Approve</span>
                    </button>
                    <button
                      onClick={() => handleAction("decline")}
                      className="flex items-center gap-2 px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors duration-150"
                    >
                      <span className="font-medium">Decline</span>
                    </button>
                  </>
                )}

                {appointment.status === "Approved" && (
                  <>
                    <button
                      onClick={() => handleAction("completed")}
                      disabled={
                        !dayjs(appointment.schedule).isSame(dayjs(), "day")
                      }
                      title={
                        !dayjs(appointment.schedule).isSame(dayjs(), "day")
                          ? "Can only complete on the appointment date"
                          : ""
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => {
                        setRescheduleSchedule(
                          dayjs(appointment.schedule).format(
                            "YYYY-MM-DDTHH:mm",
                          ),
                        );
                        setOpenRescheduleModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors duration-150"
                    >
                      <CalendarClock className="w-4 h-4" />
                      <span className="font-medium">Reschedule</span>
                    </button>
                  </>
                )}

                {["Cancelled", "No Show", "Completed", "Declined"].includes(
                  appointment.status,
                ) && (
                  <button
                    onClick={handleArchive}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors duration-150"
                  >
                    <Archive className="w-4 h-4" />
                    <span className="font-medium">Archive</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-system-white dark:bg-system-black rounded-xl border border-zinc-300 dark:border-zinc-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                    Reference ID
                  </p>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {appointment._id.slice(0, 8).toUpperCase()}
                  </h2>
                </div>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium ${statusColors[appointment.status] || "bg-gray-400"}`}
                >
                  {getStatusIcon(appointment.status)}
                  <span>
                    {appointment.status === "Approved"
                      ? "On Queue"
                      : appointment.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Scheduled Date
                    </p>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {dayjs(appointment.schedule).format("MMMM DD, YYYY")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Scheduled Time
                    </p>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {dayjs(appointment.schedule).format("h:mm A")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="bg-system-white dark:bg-system-black rounded-xl border border-zinc-300 dark:border-zinc-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Patient Information
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/images/user-profile.jpg"
                    alt="Patient"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <Link
                      to={`/users/${appointment.patientId._id}`}
                      className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {appointment.patientName}
                    </Link>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Patient ID: {appointment.patientId._id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-zinc-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Email
                      </p>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {appointment.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-zinc-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Phone Number
                      </p>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {appointment.phoneNumber || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="bg-system-white dark:bg-system-black rounded-xl border border-zinc-300 dark:border-zinc-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Doctor Assigned
                </h3>
              </div>

              {currentUser?.role === "admin" &&
                appointment.status === "Approved" && (
                  <div className="mb-4">
                    <Select<DoctorOption, true>
                      isMulti
                      placeholder="Search and assign doctors..."
                      options={doctorOptions}
                      value={selectedDoctors}
                      onMenuOpen={loadDoctors}
                      onChange={(selected) => setSelectedDoctors([...selected])}
                      formatOptionLabel={(opt) => (
                        <div className="flex items-center gap-2">
                          <img
                            src="/assets/images/profile-doctor.jpg"
                            className="w-6 h-6 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium">{opt.label}</p>
                            {opt.specialization && (
                              <p className="text-xs text-zinc-400">
                                {opt.specialization}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    />
                    <button
                      onClick={handleAssignDoctors}
                      disabled={assigningDoctors}
                      className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      {assigningDoctors ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        "Save Assigned Doctors"
                      )}
                    </button>
                  </div>
                )}

              {selectedDoctors.length > 0 ? (
                <div className="space-y-3">
                  {selectedDoctors.map((doc) => (
                    <div key={doc.value} className="flex items-center gap-3">
                      <img
                        src="/assets/images/profile-doctor.jpg"
                        alt="Doctor"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                          {doc.label}
                        </p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {doc.specialization || "General Practitioner"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-zinc-500 dark:text-zinc-400 text-sm">
                  No doctor assigned yet
                </div>
              )}
            </div>

            {/* Medical Records */}
            <div className="bg-system-white dark:bg-system-black rounded-xl border border-zinc-300 dark:border-zinc-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Medical Records
                    {medicalRecords.length > 0 && (
                      <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
                        ({medicalRecords.length})
                      </span>
                    )}
                  </h3>
                </div>

                {/* Upload trigger */}
                {currentUser?.role === "admin" &&
                  appointment.status === "Completed" && (
                    <label
                      htmlFor="medical-record-upload"
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 cursor-pointer text-sm font-medium"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Add Files</span>
                      <input
                        id="medical-record-upload"
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        multiple
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
              </div>

              {/* Status Messages */}
              {uploadError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      Upload Failed
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                      {uploadError}
                    </p>
                  </div>
                  <button
                    onClick={() => setUploadError("")}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {uploadSuccess && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Upload Successful
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                      Medical records have been uploaded successfully.
                    </p>
                  </div>
                  <button
                    onClick={() => setUploadSuccess(false)}
                    className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Staged files preview */}
              {selectedFiles.length > 0 && (
                <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                    Ready to upload ({selectedFiles.length}{" "}
                    {selectedFiles.length === 1 ? "file" : "files"})
                  </p>

                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {getFileIcon(file.name)}
                        <span className="truncate text-zinc-700 dark:text-zinc-300">
                          {file.name}
                        </span>
                        <span className="shrink-0 text-xs text-zinc-400">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </div>
                      <button
                        onClick={() => removeSelectedFile(idx)}
                        className="shrink-0 text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>
                            Upload{" "}
                            {selectedFiles.length === 1
                              ? "File"
                              : `${selectedFiles.length} Files`}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Uploaded records list */}
              {medicalRecords.length > 0 ? (
                <div className="space-y-2">
                  {medicalRecords.map((record) => (
                    <div
                      key={record._id}
                      className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded shrink-0">
                            {getFileIcon(record.filename)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-zinc-900 dark:text-zinc-50 truncate text-sm">
                              {record.originalName}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {dayjs(record.uploadedAt).format(
                                "MMM DD, YYYY h:mm A",
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={record.fileUrl}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm font-medium"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </a>

                          {currentUser?.role === "admin" && (
                            <button
                              onClick={() =>
                                handleDeleteMedicalRecord(record._id)
                              }
                              disabled={deletingRecordId === record._id}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              title="Delete this record"
                            >
                              {deletingRecordId === record._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !uploading &&
                selectedFiles.length === 0 && (
                  <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No medical records uploaded yet</p>
                    <p className="text-xs mt-1">
                      Click "Add Files" to attach medical records
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Services */}
            <div className="bg-system-white dark:bg-system-black rounded-xl border border-zinc-300 dark:border-zinc-700 p-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                Services
              </h3>
              <div className="space-y-2">
                {Array.isArray(appointment.medicalDepartment) ? (
                  appointment.medicalDepartment.map((service, idx) => {
                    const serviceName = getServiceName(service);
                    return (
                      <div
                        key={idx}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          serviceColors[
                            serviceName as keyof typeof serviceColors
                          ] ||
                          "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                        }`}
                      >
                        {serviceName}
                      </div>
                    );
                  })
                ) : (
                  <div
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      serviceColors[
                        getServiceName(
                          appointment.medicalDepartment,
                        ) as keyof typeof serviceColors
                      ] ||
                      "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    }`}
                  >
                    {getServiceName(appointment.medicalDepartment)}
                  </div>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-system-white dark:bg-system-black rounded-xl border border-zinc-300 dark:border-zinc-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Payment Information
                </h3>
              </div>

              <div className="space-y-3">
                {Array.isArray(appointment.medicalDepartment) &&
                  appointment.medicalDepartment.length > 0 && (
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 font-medium">
                        Service Fees
                      </p>
                      <div className="space-y-1.5">
                        {appointment.medicalDepartment.map((service, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-zinc-600 dark:text-zinc-400">
                              {getServiceName(service)}
                            </span>
                            <span className="font-medium text-zinc-900 dark:text-zinc-50">
                              ₱
                              {Number(getServicePrice(service)).toLocaleString(
                                "en-PH",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-1 font-medium">
                    Total Amount
                  </p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    ₱
                    {Number(totalPrice).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-system-white dark:bg-system-black rounded-xl border border-zinc-300 dark:border-zinc-700 p-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                Timeline
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
                    <div className="w-0.5 h-full bg-zinc-200 dark:bg-zinc-700" />
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      Appointment Created
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {dayjs(appointment.createdAt).format(
                        "MMM DD, YYYY h:mm A",
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-2 h-2 rounded-full ${appointment.status === "Approved" || appointment.status === "Completed" ? "bg-green-600 dark:bg-green-400" : "bg-zinc-300 dark:bg-zinc-600"}`}
                    />
                    <div className="w-0.5 h-full bg-zinc-200 dark:bg-zinc-700" />
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      Scheduled Appointment
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {dayjs(appointment.schedule).format(
                        "MMM DD, YYYY h:mm A",
                      )}
                    </p>
                  </div>
                </div>

                {appointment.status === "Completed" && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        Appointment Completed
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Status updated
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ServiceModal({
  formState,
  setFormState,
  onSubmit,
  onClose,
  title,
}: {
  formState: DoctorFormData;
  setFormState: React.Dispatch<React.SetStateAction<DoctorFormData>>;
  onSubmit: () => void;
  onClose: () => void;
  title: string;
}) {
  // compute serviceOptions on render
  const serviceOptions = formState.medicalDepartment.map((dep) => ({
    value: dep,
    label: dep,
  }));

  const safeValue = serviceOptions; // same thing

  return (
    <form
      onClick={(e) => e.stopPropagation()}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="absolute z-70 bg-system-white dark:bg-system-black shadow-xl lg:w-[500px] h-auto rounded-2xl mx-5 lg:mx-0 md:max-h-[670px] no-scrollbar"
    >
      <header className="p-5 pb-2 border-b border-zinc-300 dark:border-zinc-700">
        <h1 className="font-bold text-lg">{title}</h1>
      </header>

      <section className="p-5 pt-2 flex flex-col gap-3.5 text-sm">
        <div className="flex flex-col gap-1 w-full">
          <label>
            Services <span className="text-red-500">*</span>
          </label>
          <Select<{ value: string; label: string }, true>
            isMulti
            options={serviceOptions}
            value={safeValue}
            onChange={(selected) =>
              setFormState((prev) => ({
                ...prev,
                medicalDepartment: selected.map((s) => s.value),
              }))
            }
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label>
            Schedule <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="datetime-local"
            value={formState.schedule}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, schedule: e.target.value }))
            }
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          />
        </div>

        <div className="flex items-center w-full justify-end gap-3">
          <button type="button" onClick={onClose} className="cursor-pointer">
            Cancel
          </button>
          <button
            type="submit"
            className="bg-zinc-900 text-zinc-100 px-3 py-1 rounded-full font-bold cursor-pointer"
          >
            Save
          </button>
        </div>
      </section>
    </form>
  );
}
function RescheduleModal({
  schedule,
  setSchedule,
  onSubmit,
  onClose,
}: {
  schedule: string;
  setSchedule: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <form
      onClick={(e) => e.stopPropagation()}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="absolute z-70 bg-system-white dark:bg-system-black shadow-xl lg:w-[400px] rounded-2xl mx-5 lg:mx-0"
    >
      <header className="p-5 pb-2 border-b border-zinc-300 dark:border-zinc-700">
        <h1 className="font-bold text-lg">Reschedule Appointment</h1>
        <p className="text-sm text-zinc-400">
          Select a new date and time for this appointment.
        </p>
      </header>
      <section className="p-5 pt-2 flex flex-col gap-3.5 text-sm">
        <div className="flex flex-col gap-1 w-full">
          <label>
            New Schedule <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="datetime-local"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          />
        </div>
        <div className="flex items-center w-full justify-end gap-3">
          <button type="button" onClick={onClose} className="cursor-pointer">
            Cancel
          </button>
          <button
            type="submit"
            className="bg-zinc-900 text-zinc-100 px-3 py-1 rounded-full font-bold cursor-pointer"
          >
            Confirm Reschedule
          </button>
        </div>
      </section>
    </form>
  );
}

export default ViewAppointment;
