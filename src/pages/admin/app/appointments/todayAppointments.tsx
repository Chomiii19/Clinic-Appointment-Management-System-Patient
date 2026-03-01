import { Menu } from "lucide-react";
import Select from "react-select";
import Header from "../../../../components/Header";
import Sidebar from "../../../../components/Sidebar";
import { useEffect, useState } from "react";
import Table, {
  type Options,
} from "../../../../components/admin/appointmentTable/todayAppointments/table";
import { BACKEND_DOMAIN } from "../../../../configs/config";
import axios from "axios";
import type { SingleValue, MultiValue } from "react-select";
import type { IAppointment } from "../../../../@types/interface";
import Filter from "../../../../components/admin/appointmentTable/todayAppointments/filter";
import type { FiltersState } from "../../../../@types/types";

interface DoctorFormData {
  email: string;
  schedule: string;
  medicalDepartment: string[];
}

function TodayAppointments() {
  const [openSidebar, setOpenSidebar] = useState(
    () =>
      window.innerWidth >= 1024 &&
      localStorage.getItem("sidebarOpen") === "true",
  );
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [filters, setFilters] = useState<FiltersState>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [formState, setFormState] = useState<DoctorFormData>({
    email: "",
    medicalDepartment: [],
    schedule: "",
  });

  const tabs = ["All", "Today", "Archive"];

  const handleAddService = async (formData: DoctorFormData) => {
    try {
      await axios.post(
        `${BACKEND_DOMAIN}/api/v1/appointments/create`,
        {
          email: formData.email,
          schedule: formData.schedule,
          medicalDepartment: formData.medicalDepartment,
        },
        { withCredentials: true },
      );
      setLoading(true);
      setOpenAddModal(false);

      setFormState({
        email: "",
        schedule: "",
        medicalDepartment: [],
      });

      setCurrentPage(1);
      setFilters({});
      setSearch("");
    } catch (error) {
      console.error("Appointment creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        const statusFilter = filters["Status"] as SingleValue<Options> | null;
        if (statusFilter?.value) {
          params.append("status", statusFilter.value);
        }

        // Multi-value filter (Services)
        const servicesFilter = filters["Services"] as MultiValue<Options>;
        if (servicesFilter && servicesFilter.length > 0) {
          params.append(
            "service",
            servicesFilter.map((s) => s.value).join(","),
          );
        }

        const patientFilter = filters[
          "Patient Name"
        ] as SingleValue<Options> | null;
        if (patientFilter?.value) {
          params.append("patientName", patientFilter.value);
        }

        const doctorFilter = filters[
          "Doctor Assigned"
        ] as SingleValue<Options> | null;
        if (doctorFilter?.value) {
          params.append("doctorName", doctorFilter.label ?? "");
        }

        if (search.trim()) params.append("search", search.trim());
        params.append("page", String(currentPage));

        const response = await axios.get(
          `${BACKEND_DOMAIN}/api/v1/appointments/today/approved?${params.toString()}`,
          { withCredentials: true },
        );
        setLoading(false);
        setAppointments(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.total);
        setPerPage(response.data.limit);
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [filters, currentPage, refresh, search]);

  return (
    <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden">
      <Sidebar
        page="appointments"
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />

      {openAddModal && (
        <div
          onClick={() => setOpenAddModal(false)}
          className="absolute h-screen w-screen z-60 flex justify-center items-center bg-black/15 dark:bg-black/25"
        >
          <AddService
            handleAddAdmin={handleAddService}
            formState={formState}
            setFormState={setFormState}
            setOpenAddModal={setOpenAddModal}
          />
        </div>
      )}

      <div className="w-full h-screen flex flex-col gap-4 lg:ml-58 p-5 overflow-hidden">
        <div className="flex items-center gap-1 w-full">
          <Menu
            onClick={() => setOpenSidebar(true)}
            className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
          />
          <Header headline="Appointments" />
        </div>
        <section className="flex flex-col w-full h-full overflow-hidden">
          <Filter
            tabs={tabs}
            currentTab="Today"
            filters={filters}
            setFilters={setFilters}
            appointments={appointments}
            setCurrentPage={setCurrentPage}
            search={search}
            setSearch={setSearch}
            setOpenAddModal={setOpenAddModal}
          />

          <Table
            appointments={appointments}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            perPage={perPage}
            setRefresh={setRefresh}
            loading={loading}
          />
        </section>
      </div>
    </main>
  );
}

interface ServiceOption {
  value: string; // _id
  label: string; // name
  price: number;
}

function AddService({
  handleAddAdmin,
  formState,
  setFormState,
  setOpenAddModal,
}: {
  handleAddAdmin: (formData: DoctorFormData) => Promise<void>;
  formState: DoctorFormData;
  setFormState: React.Dispatch<React.SetStateAction<DoctorFormData>>;
  setOpenAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [selectedServices, setSelectedServices] = useState<ServiceOption[]>([]);

  const estimatedFee = selectedServices.reduce(
    (sum, svc) => sum + svc.price,
    0,
  );

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${BACKEND_DOMAIN}/api/v1/services`, {
          withCredentials: true,
        });
        const options: ServiceOption[] = res.data.data.map(
          (svc: { _id: string; name: string; price: number }) => ({
            value: svc._id,
            label: svc.name,
            price: svc.price,
          }),
        );
        setServiceOptions(options);
      } catch (err) {
        console.error("Failed to fetch services", err);
      }
    };
    fetchServices();
  }, []);

  return (
    <form
      onClick={(e) => e.stopPropagation()}
      onSubmit={(e) => {
        e.preventDefault();
        handleAddAdmin(formState);
      }}
      className="absolute bg-system-white dark:bg-system-black shadow-xl lg:w-[500px] h-auto rounded-2xl mx-5 lg:mx-0 md:max-h-[670px] no-scrollbar"
    >
      <header className="p-5 pb-2 border-b border-zinc-300 dark:border-zinc-700">
        <h1 className="font-bold text-lg">Create an Appointment</h1>
        <p className="text-sm text-zinc-400">
          Fill in the details below to record the appointment.
        </p>
      </header>

      <section className="p-5 pt-2 flex flex-col gap-3.5 text-sm">
        <div className="flex flex-col gap-1 w-full">
          <label>
            Patient Email <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="email"
            value={formState.email}
            placeholder="e.g. johndoe@example.com"
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, email: e.target.value }))
            }
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label>
            Services <span className="text-red-500">*</span>
          </label>
          <Select<ServiceOption, true>
            isMulti
            options={serviceOptions}
            value={selectedServices}
            onChange={(selected) => {
              if (selected.length <= 3) {
                const arr = [...selected];
                setSelectedServices(arr);
                setFormState((prev) => ({
                  ...prev,
                  medicalDepartment: arr.map((s) => s.value),
                }));
              }
            }}
          />
        </div>

        {selectedServices.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Service Breakdown
              </p>
              {selectedServices.map((svc) => (
                <div
                  key={svc.value}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {svc.label}
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    ₱{svc.price.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-blue-200 dark:border-blue-700 flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Estimated Total
                </span>
                <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  ₱{estimatedFee.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

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
          <button
            onClick={() => {
              setOpenAddModal(false);
              setFormState({ email: "", medicalDepartment: [], schedule: "" });
              setSelectedServices([]);
            }}
            type="button"
            className="cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-zinc-900 text-zinc-100 px-3 py-1 rounded-full font-bold cursor-pointer"
          >
            Create
          </button>
        </div>
      </section>
    </form>
  );
}

export default TodayAppointments;
