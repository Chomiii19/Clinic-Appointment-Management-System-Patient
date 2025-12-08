import Select, {
  components,
  type OptionProps,
  type SingleValueProps,
} from "react-select";
import { ChevronsUpDown, Wand } from "lucide-react";
import { useEffect, useState, type JSX } from "react";
import { CustomCheckbox } from "../../Checkbox";
import { tableHeaders } from "./headers/archiveAppointments";
import type { IAppointment, IDoctor } from "../../../@types/interface";
import dayjs from "dayjs";
import Pagination from "../pagination";
import { serviceColors, statusColors } from "../data";
import { BACKEND_DOMAIN } from "../../../configs/config";
import axios from "axios";
import { doctorSelectStyles } from "./styles";
import { useDarkMode } from "../../../hooks/useDarkMode";

export type Options = {
  value: string;
  label: string;
};

export interface ITableHeaders {
  name: string;
  icon: JSX.Element;
  filter: boolean;
  singleValue: boolean;
  options: Options[];
  sortable: boolean;
}

function Table({
  appointments,
  currentPage,
  setCurrentPage,
  totalPages,
  totalItems,
  perPage,
  setRefresh,
  loading,
}: {
  appointments: IAppointment[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalItems: number;
  perPage: number;
  setRefresh: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
}) {
  const { darkMode } = useDarkMode();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [doctors, setDoctors] = useState<DoctorOptionType[]>([]);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await axios.get(`${BACKEND_DOMAIN}/api/v1/doctors`, {
          withCredentials: true,
        });
        setDoctors(
          res.data.data.map((d: IDoctor) => ({
            value: d._id,
            label: d.name,
            image: "/assets/images/profile-doctor.jpg",
          })),
        );
      } catch (err) {
        console.error("Failed to load doctors:", err);
      }
    };

    loadDoctors();
  }, []);

  const handleDoctorUpdate = async (apptId: string, doctorId: string) => {
    try {
      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/appointments/${apptId}/doctor`,
        { doctorId },
        { withCredentials: true },
      );

      setRefresh((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to update doctor:", err);
    }
  };

  const handleAction = async (id: string, action: string) => {
    try {
      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/appointments/${id}/${action}`,
        {},
        { withCredentials: true },
      );

      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to mark appointment as no-show", error);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/appointments/${id}/archive`,
        { archive: false },
        { withCredentials: true },
      );

      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to archive appointment", error);
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    const newSelected: Record<string, boolean> = {};
    appointments.forEach((appt) => {
      newSelected[appt._id] = checked;
    });
    setSelectedRows(newSelected);
  };

  const onPageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="rounded-xl border border-zinc-300 dark:border-zinc-700 mt-3 bg-system-white dark:bg-system-black flex flex-col max-h-[80vh] overflow-hidden">
      <div className="overflow-x-auto overflow-y-auto flex-1 no-scrollbar">
        <table className="w-full table-auto border-collapse">
          <thead className="text-sm text-zinc-500 sticky top-0 bg-system-white dark:bg-system-black z-10">
            <tr>
              <th className="w-36 px-5 py-2 z-20 border-b border-zinc-300 dark:border-zinc-700">
                <div className="flex items-center gap-2 cursor-pointer w-fit">
                  <CustomCheckbox
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                  REF <ChevronsUpDown className="w-3" />
                </div>
              </th>
              {tableHeaders.map((header, i) => (
                <TableHeader key={i} header={header} />
              ))}
              <th className="w-36 px-5 py-2 border-b border-zinc-300 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <Wand className="w-4" /> Actions
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-zinc-600 dark:text-zinc-400">
            {appointments
              .filter((appt): appt is IAppointment => !!appt)
              .map((appt, i) => (
                <tr
                  key={i}
                  className={`border-b border-zinc-300 dark:border-zinc-700 transition-colors duration-150 ease-in-out ${
                    selectedRows[appt._id]
                      ? "bg-zinc-200/50 dark:bg-zinc-700/50"
                      : "hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                  }`}
                >
                  <td className="py-2 px-5">
                    <div className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                      <CustomCheckbox
                        checked={!!selectedRows[appt._id]}
                        onChange={(checked) => {
                          setSelectedRows((prevSelected) => {
                            const newSelected = {
                              ...prevSelected,
                              [appt._id]: checked,
                            };

                            if (!checked) setSelectAll(false);
                            else {
                              const allChecked = appointments.every(
                                (a) => newSelected[a._id],
                              );
                              if (allChecked) setSelectAll(true);
                            }

                            return newSelected;
                          });
                        }}
                      />

                      {appt._id.slice(0, 6)}
                    </div>
                  </td>
                  <td className="py-2 px-5 font-medium text-zinc-950 dark:text-zinc-50">
                    <div className="flex items-center gap-2">
                      <img
                        src="/assets/images/user-profile.jpg"
                        alt="profile"
                        className="w-7 h-7 rounded-full"
                      />
                      <p className="cursor-pointer w-fit whitespace-nowrap">
                        {appt.patientName}
                      </p>
                    </div>
                  </td>
                  <td className="py-2 px-5">{appt.email}</td>
                  <td className="py-2 px-5">
                    <span
                      className={`px-2 py-0.5 rounded-sm text-white text-xs font-bold ${
                        statusColors[appt.status] || "bg-gray-400"
                      }`}
                    >
                      {appt.status === "Approved" ? "Ongoing" : appt.status}
                    </span>
                  </td>
                  <td className="py-2 px-5 whitespace-nowrap">
                    {dayjs(appt.schedule).format("h:mm A")}
                  </td>
                  <td className="py-2 px-5 text-zinc-950 dark:text-zinc-50 font-medium">
                    <div
                      title={
                        appt.status !== "Approved"
                          ? "Doctor can only be assigned if status is Ongoing"
                          : ""
                      }
                      className={`${
                        appt.status !== "Approved"
                          ? "cursor-not-allowed opacity-70"
                          : "cursor-pointer"
                      }`}
                    >
                      <Select<DoctorOptionType, false>
                        placeholder="Select Doctor"
                        isDisabled={appt.status !== "Approved"}
                        options={doctors}
                        onChange={(opt) => {
                          if (!opt) return;
                          handleDoctorUpdate(appt._id, opt.value);
                        }}
                        value={
                          appt.doctorId
                            ? doctors.find(
                                (d) => d.value === appt.doctorId._id,
                              ) || null
                            : null
                        }
                        className="w-40"
                        styles={doctorSelectStyles(darkMode)}
                        components={{
                          IndicatorSeparator: () => null,
                          Option: DoctorOption,
                          SingleValue: DoctorSingleValue,
                        }}
                      />
                    </div>
                  </td>
                  <td className="py-2 px-5 whitespace-nowrap">
                    <div className="flex gap-2 flex-nowrap">
                      {Array.isArray(appt.medicalDepartment) ? (
                        appt.medicalDepartment.map((svc, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              serviceColors[svc] ||
                              "bg-gray-50 text-gray-700 border border-gray-200"
                            }`}
                          >
                            {svc}
                          </span>
                        ))
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            serviceColors[appt.medicalDepartment] ||
                            "bg-gray-50 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {appt.medicalDepartment}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5">
                    {appt.status === "Pending" && (
                      <div className="flex items-center gap-3 text-white font-bold text-xs">
                        <button
                          onClick={() => handleAction(appt._id, "approve")}
                          className="bg-green-500 rounded-sm px-2 py-0.5 cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(appt._id, "decline")}
                          className="bg-red-400 rounded-sm px-2 py-0.5 cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {appt.status === "Approved" && (
                      <div className="flex items-center gap-3 text-white font-bold text-xs">
                        <button
                          onClick={() => handleAction(appt._id, "completed")}
                          className="bg-green-500 rounded-sm px-2 py-0.5 cursor-pointer"
                        >
                          Completed
                        </button>
                        <button
                          onClick={() => handleAction(appt._id, "noshow")}
                          className="bg-red-400 rounded-sm px-2 py-0.5 cursor-pointer whitespace-nowrap"
                        >
                          No Show
                        </button>
                      </div>
                    )}

                    {["Cancelled", "No Show", "Completed", "Declined"].includes(
                      appt.status,
                    ) && (
                      <div className="flex items-center gap-3 text-white font-bold text-xs">
                        <button
                          onClick={() => handleArchive(appt._id)}
                          className="bg-orange-400 rounded-sm px-2 py-0.5 cursor-pointer whitespace-nowrap"
                        >
                          Archive
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {loading && (
          <div className="w-full h-96 flex justify-center items-center text-zinc-400 dark:text-zinc-600">
            Loading appointments. Please wait.
          </div>
        )}

        {!loading && appointments.length === 0 && (
          <div className="w-full h-96 flex justify-center items-center text-zinc-400 dark:text-zinc-600">
            No appointments found.
          </div>
        )}
      </div>

      {/* Pagination stays visible */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        perPage={perPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}

function TableHeader({ header }: { header: ITableHeaders }) {
  return (
    <th className="min-w-[120px] py-2 px-5 z-20 border-b border-zinc-300 dark:border-zinc-700">
      <div
        className={`flex items-center gap-2 w-fit ${
          header.sortable && "cursor-pointer"
        }`}
      >
        {header.icon}
        <span className="truncate">{header.name}</span>
        {header.sortable && <ChevronsUpDown className="w-3" />}
      </div>
    </th>
  );
}

export interface DoctorOptionType {
  value: string;
  label: string;
  image?: string;
}

const DoctorOption = (props: OptionProps<DoctorOptionType, false>) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        <img
          src={props.data.image || "/assets/images/user-profile.jpg"}
          alt="profile"
          className="w-7 h-7 rounded-full"
        />
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );
};

const DoctorSingleValue = (
  props: SingleValueProps<DoctorOptionType, false>,
) => {
  return (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        <img
          src={props.data.image || "/assets/images/profile-doctor.jpg"}
          alt="profile"
          className="w-7 h-7 rounded-full"
        />
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );
};

export default Table;
