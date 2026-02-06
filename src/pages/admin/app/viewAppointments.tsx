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
  Edit,
  Archive,
  Upload,
  Trash2,
  File,
  X,
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [servicePrices, setServicePrices] = useState<{ [key: string]: number }>(
    {},
  );

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  // Fetch service prices when appointment data is loaded
  useEffect(() => {
    if (appointment?.medicalDepartment) {
      fetchServicePrices();
    }
  }, [appointment?.medicalDepartment]);

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
      // Extract service names from medicalDepartment
      const departments = Array.isArray(appointment.medicalDepartment)
        ? appointment.medicalDepartment
        : [appointment.medicalDepartment];

      const serviceNames = departments
        .map((service) => {
          if (typeof service === "string") {
            return service;
          } else if (typeof service === "object" && service !== null) {
            return (service as IService).name;
          }
          return "";
        })
        .filter(Boolean);

      // Fetch prices from the API
      const response = await axios.post(
        `${BACKEND_DOMAIN}/api/v1/services/prices`,
        { names: serviceNames },
        { withCredentials: true },
      );

      if (response.data.status === "success") {
        setServicePrices(response.data.data);

        // Log if any services were not found
        if (response.data.notFound && response.data.notFound.length > 0) {
          console.warn("Services not found:", response.data.notFound);
        }
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
      // If department is a string, use the price from servicePrices state
      if (typeof dept === "string") {
        const price = servicePrices[dept] || 0;
        return sum + price;
      }

      // If department is an IService object with price
      if (typeof dept === "object" && dept !== null) {
        const service = dept as IService;
        return sum + (service.price || 0);
      }

      return sum;
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  const handleArchive = async () => {
    if (!appointment) return;

    const confirmed = confirm(
      "Are you sure you want to archive this appointment?",
    );
    if (!confirmed) return;

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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !appointment) return;

    // Validate file type (PDFs, images, documents)
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "Invalid file type. Please upload PDF, Image, or Word document.",
      );
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadError("File size exceeds 10MB limit.");
      return;
    }

    setUploadError("");
    setUploadSuccess(false);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("appointmentId", appointment._id);

    try {
      await axios.post(
        `${BACKEND_DOMAIN}/api/v1/medical-records/upload`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setUploadSuccess(true);
      // Refresh appointment data to show new medical record
      await fetchAppointment();

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        setUploadError(
          axiosError.response?.data?.message ||
            "Failed to upload file. Please try again.",
        );
      } else {
        setUploadError("Failed to upload file. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedicalRecord = async () => {
    if (!appointment?.medicalRecord) return;

    const confirmed = confirm(
      "Are you sure you want to delete this medical record? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      await axios.delete(
        `${BACKEND_DOMAIN}/api/v1/medical-records/${appointment.medicalRecord._id}/appointments/${appointment._id}`,
        { withCredentials: true },
      );

      // Refresh appointment data
      await fetchAppointment();
    } catch (error) {
      console.error("Failed to delete medical record", error);
      alert("Failed to delete medical record. Please try again.");
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
    if (ext === "pdf") {
      return <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />;
    } else if (["jpg", "jpeg", "png", "gif"].includes(ext || "")) {
      return <File className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
    return <File className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />;
  };

  const getServicePrice = (service: string | IService): number => {
    // If service is a string, get price from servicePrices state
    if (typeof service === "string") {
      return servicePrices[service] || 0;
    }

    // If service is an IService object with price property
    if (typeof service === "object" && service !== null) {
      return service.price || 0;
    }

    return 0;
  };

  const getServiceName = (service: string | IService): string => {
    if (typeof service === "string") {
      return service;
    }
    if (typeof service === "object" && service !== null) {
      return service.name;
    }
    return "";
  };

  if (loading) {
    return (
      <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden">
        <Sidebar
          page="appointments"
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
        />
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
        <Sidebar
          page="appointments"
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
        />
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
      <Sidebar
        page="appointments"
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />

      <div className="w-full h-screen flex flex-col gap-4 lg:ml-58 p-5 overflow-y-auto">
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
            <button
              disabled={appointment.status === "completed"}
              onClick={() => navigate(`/appointments/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-150"
            >
              <Edit className="w-4 h-4" />
              <span className="font-medium">Edit</span>
            </button>

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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium ${
                    statusColors[appointment.status] || "bg-gray-400"
                  }`}
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

              {appointment.doctorId ? (
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/images/profile-doctor.jpg"
                    alt="Doctor"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {`${appointment.doctorId.firstname} ${appointment.doctorId.surname}`}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {appointment.doctorId.specialization ||
                        "General Practitioner"}
                    </p>
                  </div>
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
                  </h3>
                </div>

                {!appointment.medicalRecord && (
                  <label
                    htmlFor="medical-record-upload"
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 cursor-pointer text-sm font-medium"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Record</span>
                    <input
                      id="medical-record-upload"
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              {/* Upload Status Messages */}
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
                      Medical record has been uploaded successfully.
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

              {uploading && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent" />
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                      Uploading medical record...
                    </p>
                  </div>
                </div>
              )}

              {appointment.medicalRecord ? (
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                        {getFileIcon(appointment.medicalRecord.filename)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-zinc-900 dark:text-zinc-50 truncate">
                          {appointment.medicalRecord.filename}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Medical Record Document
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-3">
                      <a
                        href={appointment.medicalRecord.fileUrl}
                        download
                        className="flex items-center gap-2 px-3 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-150"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Download</span>
                      </a>

                      <button
                        onClick={handleDeleteMedicalRecord}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-150"
                        title="Delete medical record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                !uploading && (
                  <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No medical record uploaded yet</p>
                    <p className="text-xs mt-1">
                      Click "Upload Record" to add a medical record
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

            {/* Payment Status */}
            <div className="bg-system-white dark:bg-system-black rounded-xl border border-zinc-300 dark:border-zinc-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Payment Information
                </h3>
              </div>

              <div className="space-y-3">
                {/* Service Breakdown */}
                {Array.isArray(appointment.medicalDepartment) &&
                  appointment.medicalDepartment.length > 0 && (
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 font-medium">
                        Service Fees
                      </p>
                      <div className="space-y-1.5">
                        {appointment.medicalDepartment.map((service, idx) => {
                          const serviceName = getServiceName(service);
                          const servicePrice = getServicePrice(service);

                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-zinc-600 dark:text-zinc-400">
                                {serviceName}
                              </span>
                              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                                ₱
                                {Number(servicePrice).toLocaleString("en-PH", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* Total Price Display */}
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
                      className={`w-2 h-2 rounded-full ${
                        appointment.status === "Approved" ||
                        appointment.status === "Completed"
                          ? "bg-green-600 dark:bg-green-400"
                          : "bg-zinc-300 dark:bg-zinc-600"
                      }`}
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

export default ViewAppointment;
