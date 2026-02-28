import { Menu } from "lucide-react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { useEffect, useState } from "react";
import Table, {
  type Options,
} from "../../../components/admin/appointmentTable/records/table";
import { BACKEND_DOMAIN } from "../../../configs/config";
import axios from "axios";
import type { SingleValue, MultiValue } from "react-select";
import type { IAppointment } from "../../../@types/interface";
import Filter from "../../../components/admin/appointmentTable/records/filter";
import type { FiltersState } from "../../../@types/types";

function Appointments() {
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

  const tabs = ["All"];

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
          params.append("doctorName", doctorFilter.value);
        }

        if (search.trim()) params.append("search", search.trim());
        params.append("page", String(currentPage));

        const response = await axios.get(
          `${BACKEND_DOMAIN}/api/v1/appointments/with-medical-record?${params.toString()}`,
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
        page="records"
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />

      <div className="w-full h-screen flex flex-col gap-4 lg:ml-58 p-5 overflow-hidden">
        <div className="flex items-center gap-1 w-full">
          <Menu
            onClick={() => setOpenSidebar(true)}
            className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
          />
          <Header headline="Records" />
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
export default Appointments;
