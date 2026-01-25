import {
  AtSign,
  Cake,
  CirclePlus,
  CircleUser,
  Phone,
  VenusAndMars,
} from "lucide-react";
import { statusOption } from "../data";

export const tableHeaders = [
  {
    name: "Admin Name",
    icon: <CircleUser className="w-4" />,
    filter: false,
    singleValue: false,
    options: [],
    sortable: true,
  },
  {
    name: "Gender",
    icon: <VenusAndMars className="w-4" />,
    filter: true,
    singleValue: true,
    options: [{ value: "", label: "" }],
    sortable: true,
  },
  {
    name: "Birth Date",
    icon: <Cake className="w-4" />,
    filter: false,
    singleValue: false,
    options: [{ value: "", label: "" }],
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
    name: "Phone Number",
    icon: <Phone className="w-4" />,
    filter: false,
    singleValue: false,
    options: statusOption,
    sortable: false,
  },
  {
    name: "Joined At",
    icon: <CirclePlus className="w-4" />,
    filter: false,
    singleValue: true,
    options: [],
    sortable: true,
  },
];
