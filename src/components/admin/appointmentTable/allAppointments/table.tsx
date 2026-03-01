import { Archive, ChevronsUpDown, Eye, Wand } from "lucide-react";
import { useState, type JSX } from "react";
import { CustomCheckbox } from "../../../Checkbox";
import { tableHeaders } from "./headers/appointments";
import type {
  IAppointment,
  IService,
  PopulatedDoctor,
} from "../../../../@types/interface";
import dayjs from "dayjs";
import Pagination from "../pagination";
import { serviceColors, statusColors } from "../data";
import { BACKEND_DOMAIN } from "../../../../configs/config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  const handleArchive = async (id: string) => {
    const confirmed = confirm(
      "Are you sure you want to archive this appointment?",
    );

    if (!confirmed) return;

    try {
      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/appointments/${id}/archive`,
        { archive: true },
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

  // Helper function to get service name from service object or string
  const getServiceName = (service: string | IService): string => {
    return typeof service === "string" ? service : service.name;
  };

  // Helper function to normalize medical department to array
  const normalizeMedicalDepartment = (
    dept: string | IService | (string | IService)[],
  ): (string | IService)[] => {
    return Array.isArray(dept) ? dept : [dept];
  };

  return (
    <div className="rounded-xl border border-zinc-300 dark:border-zinc-700 mt-3 bg-system-white dark:bg-system-black flex flex-col max-h-[80vh] overflow-hidden">
      <div className="overflow-x-auto w-full no-scrollbar">
        <div className="w-full">
          <div className="overflow-y-auto w-full">
            <table className="table-auto border-collapse w-full">
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
                {!loading &&
                  appointments.length !== 0 &&
                  appointments
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
                          <Link
                            to={`/users/${appt.patientId._id}`}
                            className="flex items-center gap-2"
                          >
                            <img
                              src="/assets/images/user-profile.jpg"
                              alt="profile"
                              className="w-7 h-7 rounded-full"
                            />
                            <p className="cursor-pointer w-fit whitespace-nowrap">
                              {appt.patientName}
                            </p>
                          </Link>
                        </td>
                        <td className="py-2 px-5">
                          <span
                            className={`px-2 py-0.5 rounded-sm text-white text-xs font-bold ${
                              statusColors[appt.status] || "bg-gray-400"
                            }`}
                          >
                            {appt.status === "Approved"
                              ? "On Queue"
                              : appt.status}
                          </span>
                        </td>
                        <td className="py-2 px-5 whitespace-nowrap">
                          {dayjs(appt.schedule).format("MM/DD/YY, h:mm A")}
                        </td>
                        <td className="py-2 px-5 text-zinc-950 dark:text-zinc-50 font-medium">
                          {Array.isArray(appt.doctorId) &&
                          appt.doctorId.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {(appt.doctorId as PopulatedDoctor[]).map(
                                (doc, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2"
                                  >
                                    <img
                                      src="/assets/images/profile-doctor.jpg"
                                      alt="profile"
                                      className="w-7 h-7 rounded-full"
                                    />
                                    <p className="w-fit whitespace-nowrap">
                                      {doc.firstname}{" "}
                                      {doc.middlename
                                        ? `${doc.middlename[0]}.`
                                        : ""}{" "}
                                      {doc.surname}
                                    </p>
                                  </div>
                                ),
                              )}
                            </div>
                          ) : (
                            <p className="w-fit whitespace-nowrap text-zinc-400">
                              No doctor assigned yet
                            </p>
                          )}
                        </td>
                        <td className="py-2 px-5 whitespace-nowrap">
                          <div className="flex flex-col gap-2 items-start">
                            {normalizeMedicalDepartment(appt.medicalDepartment)
                              .filter(Boolean)
                              .map((svc, idx) => {
                                const serviceName = getServiceName(svc);
                                return (
                                  <span
                                    key={idx}
                                    className={`px-3 py-1 rounded-full text-xs font-medium w-auto ${
                                      serviceColors[serviceName] ||
                                      "bg-gray-50 text-gray-700 border border-gray-200"
                                    }`}
                                  >
                                    {serviceName}
                                  </span>
                                );
                              })}
                          </div>
                        </td>
                        <td className="px-5 py-2 align-middle">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-3 text-white font-bold text-xs">
                              <button
                                title="View"
                                onClick={() =>
                                  navigate(`/appointments/${appt._id}`)
                                }
                                className="text-zinc-400 hover:text-zinc-500 duration-150 ease-in-out transition-colors cursor-pointer"
                              >
                                <Eye className="w-6" />
                              </button>
                            </div>

                            {[
                              "Cancelled",
                              "No Show",
                              "Completed",
                              "Declined",
                            ].includes(appt.status) && (
                              <div className="flex items-center gap-3 text-white font-bold text-xs">
                                <button
                                  title="Archive"
                                  onClick={() => handleArchive(appt._id)}
                                  className="text-zinc-400 hover:text-zinc-500 duration-150 ease-in-out transition-colors cursor-pointer"
                                >
                                  <Archive className="w-5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

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

export default Table;
