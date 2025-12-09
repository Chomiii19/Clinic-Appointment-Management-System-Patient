import Select from "react-select";
import { useEffect, useState } from "react";
import Table, {
  type Options,
} from "../components/appointmentTable/allAppointments/table";
import { BACKEND_DOMAIN } from "../configs/config";
import axios from "axios";
import type { SingleValue, MultiValue } from "react-select";
import type { IAppointment } from "../@types/interface";
import Filter from "../components/appointmentTable/allAppointments/filter";
import Header from "../components/Header";
import type { FiltersState } from "../@types/types";
import { medicalServicesStrings } from "../components/appointmentTable/data";

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
    medicalDepartment: [],
    schedule: "",
  });
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editFormState, setEditFormState] = useState<DoctorFormData>({
    medicalDepartment: [],
    schedule: "",
  });

  const tabs = ["All", "Today"];

  const handleEditDoctor = async (formData: DoctorFormData, id: string) => {
    try {
      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/appointments/${id}`,
        {
          schedule: formData.schedule,
          medicalDepartment: formData.medicalDepartment,
        },
        { withCredentials: true }
      );
      setLoading(true);

      setOpenEditModal(false);
      setEditFormState({ schedule: "", medicalDepartment: [] });
      setCurrentPage(1);
    } catch (err) {
      console.error("Doctor update failed:", err);
    } finally {
      setLoading(false);
      setRefresh((prev) => prev + 1);
    }
  };

  const handleAddService = async (formData: DoctorFormData) => {
    try {
      await axios.post(
        `${BACKEND_DOMAIN}/api/v1/appointments/create`,
        {
          schedule: formData.schedule,
          medicalDepartment: formData.medicalDepartment,
        },
        { withCredentials: true }
      );
      setLoading(true);
      setOpenAddModal(false);

      setFormState({
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
            servicesFilter.map((s) => s.value).join(",")
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
          params.append("doctorName", doctorFilter.value);
        }

        if (search.trim()) params.append("search", search.trim());
        params.append("page", String(currentPage));

        const response = await axios.get(
          `${BACKEND_DOMAIN}/api/v1/appointments?${params.toString()}`,
          { withCredentials: true }
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
    <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex justify-center items-center gap-3 overflow-hidden">
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

      {openEditModal && (
        <div
          onClick={() => setOpenEditModal(false)}
          className="fixed inset-0 z-60 flex justify-center items-center bg-black/15 dark:bg-black/25"
        >
          <ServiceModal
            formState={editFormState}
            setFormState={setEditFormState}
            onSubmit={() => {
              if (editServiceId) handleEditDoctor(editFormState, editServiceId);
            }}
            onClose={() => setOpenEditModal(false)}
            title="Edit Appointment"
          />
        </div>
      )}

      <div className="lg:w-[80vw] h-screen flex flex-col gap-4 p-5 overflow-hidden">
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
              setEditFormState({
                medicalDepartment: doctor.medicalDepartment,
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
  const [serviceOptions, setServiceOptions] = useState<Options[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${BACKEND_DOMAIN}/api/v1/services`, {
          withCredentials: true,
        });
        const services: Options[] = res.data.data.map(
          (svc: { name: string }) => ({
            value: svc.name,
            label: svc.name,
          })
        );
        setServiceOptions(services);
      } catch (err) {
        console.error("Failed to fetch services", err);
      }
    };

    fetchServices();
  }, []);

  const safeValue =
    formState.medicalDepartment?.map((dep) => ({
      value: dep,
      label: dep,
    })) || [];

  return (
    <form
      onClick={(e) => e.stopPropagation()}
      onSubmit={(e) => {
        e.preventDefault();
        handleAddAdmin(formState);
      }}
      className="absolute  bg-system-white dark:bg-system-black shadow-xl lg:w-[500px] h-auto rounded-2xl mx-5 lg:mx-0 md:max-h-[670px] no-scrollbar"
    >
      <header className="p-5 pb-2 border-b border-zinc-300 dark:border-zinc-700">
        <h1 className="font-bold text-lg">Create an Appointment</h1>
        <p className="text-sm text-zinc-400">
          Fill in the details below to record the appointment.
        </p>
      </header>

      <section className="p-5 pt-2 flex flex-col gap-3.5 text-sm">
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="name">
            Services <span className="text-red-500">*</span>
          </label>
          <Select<{ value: string; label: string }, true>
            isMulti
            options={serviceOptions}
            value={safeValue}
            onChange={(selected) => {
              if (selected.length <= 3) {
                setFormState((prev) => ({
                  ...prev,
                  medicalDepartment: selected.map((s) => s.value),
                }));
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="schedule">
            Schedule <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="datetime-local"
            name="schedule"
            id="schedule"
            value={formState.schedule}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, schedule: e.target.value }))
            }
            placeholder=""
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          />
        </div>

        <div className="flex items-center w-full justify-end gap-3">
          <button
            onClick={() => {
              setOpenAddModal(false);
              setFormState({
                medicalDepartment: [],
                schedule: "",
              });
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
  const medicalServiceOptions = medicalServicesStrings.map((s) => ({
    value: s,
    label: s,
  }));

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
          <label htmlFor="name">
            Services <span className="text-red-500">*</span>
          </label>
          <Select<{ value: string; label: string }, true>
            isMulti
            options={medicalServiceOptions}
            value={medicalServiceOptions.filter((o) =>
              formState.medicalDepartment.includes(o.value)
            )}
            onChange={(selected) => {
              if (selected.length <= 3) {
                setFormState((prev) => ({
                  ...prev,
                  medicalDepartment: selected.map((s) => s.value),
                }));
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="schedule">
            Schedule<span className="text-red-500">*</span>
          </label>
          <input
            required
            type="datetime-local"
            name="schedule"
            id="schedule"
            value={formState.schedule}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, schedule: e.target.value }))
            }
            placeholder=""
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
