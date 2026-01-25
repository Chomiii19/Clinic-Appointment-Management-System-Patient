import {
  AtSign,
  CircleUser,
  ClipboardClock,
  FileBox,
  Hospital,
  ShieldUser,
  Sparkles,
} from "lucide-react";
import { statusOption, Doctors } from "../../data";

export const tableHeaders = [
  {
    name: "Patient Name",
    icon: <CircleUser className="w-4" />,
    filter: false,
    singleValue: true,
    options: [],
    sortable: true,
  },
  {
    name: "Email",
    icon: <AtSign className="w-4" />,
    filter: false,
    singleValue: false,
    options: [{ value: "", label: "" }],
    sortable: true,
  },
  {
    name: "Status",
    icon: <Sparkles className="w-4" />,
    filter: true,
    singleValue: true,
    options: statusOption,
    sortable: false,
  },
  {
    name: "Schedule",
    icon: <ClipboardClock className="w-4" />,
    filter: true,
    singleValue: true,
    options: [{ value: "", label: "" }],
    sortable: true,
  },
  {
    name: "Doctor Assigned",
    icon: <ShieldUser className="w-4" />,
    filter: true,
    singleValue: true,
    options: Doctors,
    sortable: true,
  },
  {
    name: "Services",
    icon: <Hospital className="w-4" />,
    filter: true,
    singleValue: false,
    options: [],
    sortable: false,
  },
  {
    name: "Medical Record",
    icon: <FileBox className="w-4" />,
    filter: false,
    singleValue: false,
    options: [],
    sortable: false,
  },
];
