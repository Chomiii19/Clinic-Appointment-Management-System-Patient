import Select from "react-select";
import { Menu } from "lucide-react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { useEffect, useState } from "react";
import Table, {
  type Options,
} from "../../../components/admin/scheduleTable/table";
import { BACKEND_DOMAIN } from "../../../configs/config";
import axios from "axios";
import type { SingleValue } from "react-select";
import type { ISchedule } from "../../../@types/interface";
import Filter from "../../../components/admin/scheduleTable/filter";
import type { FiltersState } from "../../../@types/types";
import dayjs from "dayjs";

interface ScheduleFormData {
  doctorId: string;
  start: string;
  end: string;
}

function ManageTodaySchedules() {
  const [openSidebar, setOpenSidebar] = useState(
    () =>
      window.innerWidth >= 1024 &&
      localStorage.getItem("sidebarOpen") === "true",
  );
  const [data, setData] = useState<ISchedule[]>([]);
  const [filters, setFilters] = useState<FiltersState>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(0);
  const [formState, setFormState] = useState<ScheduleFormData>({
    doctorId: "",
    start: "",
    end: "",
  });

  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editFormState, setEditFormState] = useState<ScheduleFormData>({
    doctorId: "",
    start: "",
    end: "",
  });

  const tabs = ["All", "Today"];

  const handleEditService = async (formData: ScheduleFormData, id: string) => {
    try {
      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/schedules/${id}`,
        {
          doctorId: formData.doctorId,
          start: formData.start,
          end: formData.end,
        },
        { withCredentials: true },
      );
      setLoading(true);

      setOpenEditModal(false);
      setEditFormState({ doctorId: "", start: "", end: "" });
      setCurrentPage(1);
    } catch (err) {
      console.error("Service update failed:", err);
    } finally {
      setLoading(false);
      setRefresh((prev) => prev + 1);
    }
  };

  const handleAddService = async (formData: ScheduleFormData) => {
    try {
      await axios.post(
        `${BACKEND_DOMAIN}/api/v1/schedules`,
        {
          doctorId: formData.doctorId,
          start: formData.start,
          end: formData.end,
        },
        { withCredentials: true },
      );
      setLoading(true);
      setOpenAddModal(false);

      setFormState({
        doctorId: "",
        start: "",
        end: "",
      });

      setCurrentPage(1);
      setFilters({});
      setSearch("");
    } catch (error) {
      console.error("Service creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        const statusFilter = filters["Status"] as SingleValue<Options> | null;
        if (statusFilter?.value) params.append("status", statusFilter.value);

        if (search.trim()) params.append("search", search.trim());
        params.append("page", String(currentPage));

        const response = await axios.get(
          `${BACKEND_DOMAIN}/api/v1/schedules/today?${params.toString()}`,
          { withCredentials: true },
        );
        setLoading(false);
        setData(response.data.data);
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

    fetchData();
  }, [filters, currentPage, search, refresh]);

  return (
    <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden relative">
      <Sidebar
        page="manageSchedules"
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
                handleEditService(editFormState, editServiceId);
            }}
            onClose={() => setOpenEditModal(false)}
            title="Edit Schedule"
          />
        </div>
      )}

      <div className="w-full h-screen flex flex-col gap-4 lg:ml-58 p-5 overflow-hidden">
        <div className="flex items-center gap-1 w-full">
          <Menu
            onClick={() => setOpenSidebar(true)}
            className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
          />
          <Header headline="Schedules" />
        </div>
        <section className="flex flex-col w-full h-full overflow-hidden">
          <Filter
            tabs={tabs}
            currentTab="Today"
            filters={filters}
            setFilters={setFilters}
            setCurrentPage={setCurrentPage}
            search={search}
            setSearch={setSearch}
            setOpenAddModal={setOpenAddModal}
          />

          <Table
            data={data}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            perPage={perPage}
            loading={loading}
            onEditClick={(schedule) => {
              setEditFormState({
                doctorId: schedule.doctorId._id,
                start: dayjs(schedule.start)
                  .subtract(8, "hour")
                  .format("YYYY-MM-DDTHH:mm"),
                end: dayjs(schedule.end)
                  .subtract(8, "hour")
                  .format("YYYY-MM-DDTHH:mm"),
              });
              setOpenEditModal(true);
              setEditServiceId(schedule._id);
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
  handleAddAdmin: (formData: ScheduleFormData) => Promise<void>;
  formState: ScheduleFormData;
  setFormState: React.Dispatch<React.SetStateAction<ScheduleFormData>>;
  setOpenAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [doctorOptions, setDoctorOptions] = useState<Options[]>([]);

  const selectedDoctor =
    doctorOptions.find((opt) => opt.value === formState.doctorId) || null;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${BACKEND_DOMAIN}/api/v1/doctors`, {
          withCredentials: true,
        });
        const doctors: Options[] = res.data.data.map(
          (svc: { _id: string; name: string }) => ({
            value: svc._id,
            label: svc.name,
          }),
        );
        setDoctorOptions(doctors);
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <form
      onClick={(e) => e.stopPropagation()}
      onSubmit={(e) => {
        e.preventDefault();
        handleAddAdmin(formState);
      }}
      className="absolute  bg-system-white dark:bg-system-black shadow-xl lg:w-[500px] h-auto rounded-2xl mx-5 lg:mx-0 md:max-h-[670px] overflow-auto no-scrollbar"
    >
      <header className="p-5 pb-2 border-b border-zinc-300 dark:border-zinc-700">
        <h1 className="font-bold text-lg">Add New Schedule</h1>
        <p className="text-sm text-zinc-400">
          Fill in the details below to record the schedule.
        </p>
      </header>

      <section className="p-5 pt-2 flex flex-col gap-3.5 text-sm">
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="name">
            Doctor <span className="text-red-500">*</span>
          </label>
          <Select<Options, false>
            placeholder="Doctor Name"
            isClearable={true}
            options={doctorOptions}
            value={selectedDoctor}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                doctorId: val ? val.value : "",
              }))
            }
            className="w-28 lg:w-auto"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="start">
            Start <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="datetime-local"
            name="start"
            id="start"
            value={formState.start}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, start: e.target.value }))
            }
            placeholder=""
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="end">
            End <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="datetime-local"
            name="end"
            id="end"
            value={formState.end}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, end: e.target.value }))
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
                doctorId: "",
                start: "",
                end: "",
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
  formState: ScheduleFormData;
  setFormState: React.Dispatch<React.SetStateAction<ScheduleFormData>>;
  onSubmit: () => void;
  onClose: () => void;
  title: string;
}) {
  const [doctorOptions, setDoctorOptions] = useState<Options[]>([]);

  const selectedDoctor =
    doctorOptions.find((opt) => opt.value === formState.doctorId) || null;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${BACKEND_DOMAIN}/api/v1/doctors`, {
          withCredentials: true,
        });
        const doctors: Options[] = res.data.data.map(
          (svc: { _id: string; name: string }) => ({
            value: svc._id,
            label: svc.name,
          }),
        );
        setDoctorOptions(doctors);
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <form
      onClick={(e) => e.stopPropagation()}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="absolute z-70 bg-system-white dark:bg-system-black shadow-xl lg:w-[500px] h-auto rounded-2xl mx-5 lg:mx-0 md:max-h-[670px] overflow-auto no-scrollbar"
    >
      <header className="p-5 pb-2 border-b border-zinc-300 dark:border-zinc-700">
        <h1 className="font-bold text-lg">{title}</h1>
      </header>

      <section className="p-5 pt-2 flex flex-col gap-3.5 text-sm">
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="name">
            Doctor <span className="text-red-500">*</span>
          </label>
          <Select<Options, false>
            placeholder="Doctor Name"
            isClearable={true}
            options={doctorOptions}
            value={selectedDoctor}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                doctorId: val ? val.value : "",
              }))
            }
            className="w-28 lg:w-auto"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="start">
            Start <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="datetime-local"
            name="start"
            id="start"
            value={formState.start}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, start: e.target.value }))
            }
            placeholder=""
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="end">
            End <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="datetime-local"
            name="end"
            id="end"
            value={formState.end}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, end: e.target.value }))
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

export default ManageTodaySchedules;
