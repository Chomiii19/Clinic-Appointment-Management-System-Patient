import Select from "react-select";
import { useEffect, useState } from "react";
import axios from "axios";
import Table, {
  type Options,
} from "../../components/patient/appointmentTable/allAppointments/table";
import Filter from "../../components/patient/appointmentTable/allAppointments/filter";
import Header from "./Header";
import { BACKEND_DOMAIN } from "../../configs/config";
import type { SingleValue, MultiValue } from "react-select";
import type { IAppointment } from "../../@types/interface";
import type { FiltersState } from "../../@types/types";

// Form data type
interface DoctorFormData {
  schedule: string;
  medicalDepartment: string[];
}

function Home() {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [filters, setFilters] = useState<FiltersState>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(0);
  const [refresh, setRefresh] = useState(0);

  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [formState, setFormState] = useState<DoctorFormData>({
    schedule: "",
    medicalDepartment: [],
  });
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editFormState, setEditFormState] = useState<DoctorFormData>({
    schedule: "",
    medicalDepartment: [],
  });

  const tabs = ["All", "Today"];

  // Add Appointment
  const handleAddAppointment = async (formData: DoctorFormData) => {
    try {
      await axios.post(
        `${BACKEND_DOMAIN}/api/v1/appointments/create`,
        {
          schedule: formData.schedule,
          medicalDepartment: formData.medicalDepartment,
        },
        { withCredentials: true },
      );
      setLoading(true);
      setOpenAddModal(false);
      setFormState({ schedule: "", medicalDepartment: [] });
      setCurrentPage(1);
      setFilters({});
      setSearch("");
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Appointment creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Edit Appointment
  const handleEditAppointment = async (
    formData: DoctorFormData,
    id: string,
  ) => {
    try {
      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/appointments/${id}`,
        {
          schedule: formData.schedule,
          medicalDepartment: formData.medicalDepartment,
        },
        { withCredentials: true },
      );
      setLoading(true);
      setOpenEditModal(false);
      setEditFormState({ schedule: "", medicalDepartment: [] });
      setCurrentPage(1);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Appointment update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        const statusFilter = filters["Status"] as SingleValue<Options> | null;
        if (statusFilter?.value) params.append("status", statusFilter.value);

        const servicesFilter = filters["Services"] as MultiValue<Options>;
        if (servicesFilter && servicesFilter.length > 0)
          params.append(
            "service",
            servicesFilter.map((s) => s.value).join(","),
          );

        const patientFilter = filters[
          "Patient Name"
        ] as SingleValue<Options> | null;
        if (patientFilter?.value)
          params.append("patientName", patientFilter.value);

        const doctorFilter = filters[
          "Doctor Assigned"
        ] as SingleValue<Options> | null;
        if (doctorFilter?.value)
          params.append("doctorName", doctorFilter.value);

        if (search.trim()) params.append("search", search.trim());
        params.append("page", String(currentPage));

        const response = await axios.get(
          `${BACKEND_DOMAIN}/api/v1/appointments?${params.toString()}`,
          { withCredentials: true },
        );

        // Normalize medicalDepartment to string[]
        const normalizedData = response.data.data.map((appt: IAppointment) => {
          let medicalDepartment: string[] = [];
          if (Array.isArray(appt.medicalDepartment)) {
            medicalDepartment = appt.medicalDepartment.map(
              (dep) => (typeof dep === "string" ? dep : dep.name), // <-- here
            );
          } else if (typeof appt.medicalDepartment === "string") {
            medicalDepartment = [appt.medicalDepartment];
          } else if (
            appt.medicalDepartment &&
            "name" in appt.medicalDepartment
          ) {
            medicalDepartment = [appt.medicalDepartment.name];
          }
          return { ...appt, medicalDepartment };
        });

        setAppointments(normalizedData);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.total);
        setPerPage(response.data.limit);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [filters, currentPage, refresh, search]);

  return (
    <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex justify-center items-center gap-3 overflow-hidden">
      {/* Add Appointment Modal */}
      {openAddModal && (
        <div
          onClick={() => setOpenAddModal(false)}
          className="absolute h-screen w-screen z-60 flex justify-center items-center bg-black/15 dark:bg-black/25"
        >
          <AddService
            handleAddAdmin={handleAddAppointment}
            formState={formState}
            setFormState={setFormState}
            setOpenAddModal={setOpenAddModal}
          />
        </div>
      )}

      {/* Edit Appointment Modal */}
      {openEditModal && (
        <div
          onClick={() => setOpenEditModal(false)}
          className="fixed inset-0 z-60 flex justify-center items-center bg-black/15 dark:bg-black/25"
        >
          <ServiceModal
            formState={editFormState}
            setFormState={setEditFormState}
            onSubmit={() => {
              if (editServiceId)
                handleEditAppointment(editFormState, editServiceId);
            }}
            onClose={() => setOpenEditModal(false)}
            title="Edit Appointment"
          />
        </div>
      )}

      <div className="lg:w-full h-screen flex flex-col gap-4 p-5 overflow-hidden">
        <div className="flex items-center gap-1 w-full">
          <Header headline="Appointments" />
        </div>
        <section className="flex flex-col w-full h-full overflow-hidden">
          <Filter
            tabs={tabs}
            currentTab="All"
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
            onEditClick={(doctor) => {
              // Normalize medicalDepartment before setting
              const safeMedicalDepartments: string[] = Array.isArray(
                doctor.medicalDepartment,
              )
                ? doctor.medicalDepartment.map((dep) =>
                    typeof dep === "string" ? dep : dep.name,
                  )
                : typeof doctor.medicalDepartment === "string"
                  ? [doctor.medicalDepartment]
                  : doctor.medicalDepartment
                    ? [doctor.medicalDepartment.name]
                    : [];

              setEditFormState({
                medicalDepartment: safeMedicalDepartments,
                schedule: new Date(doctor.schedule).toISOString().slice(0, 16),
              });

              setOpenEditModal(true);
              setEditServiceId(doctor._id);
            }}
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

/* ------------------- AddService Component ------------------- */
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

  // Fetch available services — now store _id as value and price directly
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
            Services <span className="text-red-500">*</span>
          </label>
          <Select<ServiceOption, true>
            isMulti
            options={serviceOptions}
            value={selectedServices}
            onChange={(selected) => {
              const arr = [...selected];
              setSelectedServices(arr);
              setFormState((prev) => ({
                ...prev,
                medicalDepartment: arr.map((s) => s.value),
              }));
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
              <div className="pt-2 mt-2 border-t border-blue-200 dark:border-blue-700 flex justify-between">
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
              setFormState({ schedule: "", medicalDepartment: [] });
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

/* ------------------- ServiceModal Component ------------------- */
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
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);

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

  // Map current _ids back to full option objects for display
  const selectedValues = serviceOptions.filter((opt) =>
    formState.medicalDepartment.includes(opt.value),
  );

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
          <Select<ServiceOption, true>
            isMulti
            options={serviceOptions}
            value={selectedValues}
            onChange={(selected) =>
              setFormState((prev) => ({
                ...prev,
                medicalDepartment: selected.map((s) => s.value), // _ids
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

export default Home;
