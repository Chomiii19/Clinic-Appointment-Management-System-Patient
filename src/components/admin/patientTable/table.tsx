import { ChevronsUpDown, Mars, Venus } from "lucide-react";
import { useState, type JSX } from "react";
import { CustomCheckbox } from "../../Checkbox";
import { tableHeaders } from "./headers/patients";
import type { IUser } from "../../../@types/interface";
import dayjs from "dayjs";
import Pagination from "./pagination";
import { Link } from "react-router-dom";

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
  patients,
  currentPage,
  setCurrentPage,
  totalPages,
  totalItems,
  perPage,
  loading,
}: {
  patients: IUser[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalItems: number;
  perPage: number;
  loading: boolean;
}) {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  const toggleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    const newSelected: Record<string, boolean> = {};
    patients.forEach((patient) => {
      newSelected[patient._id] = checked;
    });
    setSelectedRows(newSelected);
  };

  const onPageChange = (page: number) => setCurrentPage(page);

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
                      ID <ChevronsUpDown className="w-3" />
                    </div>
                  </th>
                  {tableHeaders.map((header, i) => (
                    <TableHeader key={i} header={header} />
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm text-zinc-600 dark:text-zinc-400">
                {!loading &&
                  patients.length !== 0 &&
                  patients
                    .filter((patient): patient is IUser => !!patient)
                    .map((patient, i) => (
                      <tr
                        key={i}
                        className={`border-b border-zinc-300 dark:border-zinc-700 transition-colors duration-150 ease-in-out ${
                          selectedRows[patient._id]
                            ? "bg-zinc-200/50 dark:bg-zinc-700/50"
                            : "hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                        }`}
                      >
                        <td className="py-2 px-5">
                          <div className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                            <CustomCheckbox
                              checked={!!selectedRows[patient._id]}
                              onChange={(checked) => {
                                setSelectedRows((prevSelected) => {
                                  const newSelected = {
                                    ...prevSelected,
                                    [patient._id]: checked,
                                  };

                                  if (!checked) setSelectAll(false);
                                  else {
                                    const allChecked = patients.every(
                                      (a) => newSelected[a._id],
                                    );
                                    if (allChecked) setSelectAll(true);
                                  }

                                  return newSelected;
                                });
                              }}
                            />
                            P-{patient._id.slice(0, 6)}
                          </div>
                        </td>
                        <td className="py-2 px-5 font-medium text-zinc-950 dark:text-zinc-50">
                          <Link
                            to={`/users/${patient._id}`}
                            className="flex items-center gap-2"
                          >
                            <img
                              src="/assets/images/user-profile.jpg"
                              alt="profile"
                              className="w-7 h-7 rounded-full"
                            />
                            <p className="cursor-pointer w-fit whitespace-nowrap">
                              {`${patient.firstname} ${patient.surname}`}
                            </p>
                          </Link>
                        </td>
                        <td className="py-2 px-5">
                          <div
                            className={`px-2 py-1 border rounded-lg w-fit flex items-center gap-2 ${
                              patient.gender === "male"
                                ? "border-blue-400 text-blue-400 bg-blue-400/20"
                                : "border-pink-400 text-pink-400 bg-pink-400/20"
                            }`}
                          >
                            {patient.gender === "male" ? (
                              <>
                                <Mars className="w-3.5" />
                                Male
                              </>
                            ) : (
                              <>
                                <Venus className="w-3.5" />
                                Female
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-5">
                          {patient.maritalStatus.charAt(0).toUpperCase() +
                            patient.maritalStatus.slice(1)}
                        </td>
                        <td className="py-2 px-5 whitespace-nowrap">
                          {dayjs(patient.birthDate).format("MM/DD/YY")}
                        </td>
                        <td className="py-2 px-5">{patient.email}</td>
                        <td className="py-2 px-5">{patient.phoneNumber}</td>
                        <td className="py-2 px-5 whitespace-nowrap">
                          {dayjs(patient.createdAt).format("MM/DD/YY, h:mm A")}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        {loading && (
          <div className="w-full h-96 flex justify-center items-center text-zinc-400 dark:text-zinc-600">
            Loading patients. Please wait.
          </div>
        )}

        {!loading && patients.length === 0 && (
          <div className="w-full h-96 flex justify-center items-center text-zinc-400 dark:text-zinc-600">
            No patients found.
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

export default Table;
