import { CalendarPlus2, GraduationCap, ShieldUser, Wand } from "lucide-react";
import { statusOption } from "../data";

export const tableHeaders = [
  {
    name: "First name",
    icon: <ShieldUser className="w-4" />,
    filter: false,
    singleValue: false,
    options: [],
    sortable: true,
  },
  {
    name: "Middle name",
    icon: <ShieldUser className="w-4" />,
    filter: false,
    singleValue: false,
    options: [],
    sortable: true,
  },
  {
    name: "Surname",
    icon: <ShieldUser className="w-4" />,
    filter: false,
    singleValue: false,
    options: [],
    sortable: true,
  },
  {
    name: "Specialization",
    icon: <GraduationCap className="w-4" />,
    filter: false,
    singleValue: true,
    options: [{ value: "", label: "" }],
    sortable: true,
  },
  {
    name: "Joined At",
    icon: <CalendarPlus2 className="w-4" />,
    filter: false,
    singleValue: false,
    options: statusOption,
    sortable: true,
  },
  {
    name: "Action",
    icon: <Wand className="w-4" />,
    filter: false,
    singleValue: false,
    options: [{ value: "", label: "" }],
    sortable: false,
  },
];
