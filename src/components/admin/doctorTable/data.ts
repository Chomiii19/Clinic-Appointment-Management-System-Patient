export const medicalServices = [
  { value: "Consultation", label: "Consultation" },
  { value: "Vaccination", label: "Vaccination" },
  { value: "Medical Certificate", label: "Medical Certificate" },
  { value: "Laboratory", label: "Laboratory" },
  { value: "Holistic Care", label: "Holistic Care" },
  { value: "Circumcision", label: "Circumcision" },
  { value: "Medical Check Up", label: "Medical Check Up" },
  { value: "Prenatal Check Up", label: "Prenatal Check Up" },
  { value: "Family Planning", label: "Family Planning" },
];

export const statusOption = [
  { value: "Pending", label: "Pending" },
  { value: "Completed", label: "Completed" },
  { value: "No Show", label: "No Show" },
  { value: "Declined", label: "Declined" },
  { value: "Approved", label: "Ongoing" },
];

export const Doctors = [
  { value: "Dr. Rose", label: "Dr. Rose" },
  { value: "Dr. Charlene", label: "Dr. Charlene" },
  { value: "Dr. Emm", label: "Dr. Emm" },
  { value: "Dr. Katrina", label: "Dr. Katrina" },
  { value: "Dr. Joms", label: "Dr. Chomi" },
];

export const statusColors: Record<string, string> = {
  Pending: "bg-yellow-500",
  Completed: "bg-green-500",
  "No Show": "bg-red-500",
  Declined: "bg-gray-500",
  Approved: "bg-blue-500",
  Cancelled: "bg-orange-500",
};

export const serviceColors: Record<string, string> = {
  Consultation: "bg-blue-50 text-blue-700 border border-blue-200",
  Vaccine: "bg-green-50 text-green-700 border border-green-200",
  Vaccination: "bg-green-50 text-green-700 border border-green-200",
  "Medical Certificate":
    "bg-purple-50 text-purple-700 border border-purple-200",
  Laboratory: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  "Holistic Care": "bg-pink-50 text-pink-700 border border-pink-200",
  Circumcission: "bg-red-50 text-red-700 border border-red-200",
  "Medical Check Up": "bg-indigo-50 text-indigo-700 border border-indigo-200",
  "Prenatal Check Up": "bg-rose-50 text-rose-700 border border-rose-200",
  "Family Planning": "bg-teal-50 text-teal-700 border border-teal-200",
  "X-ray": "bg-orange-50 text-orange-700 border border-orange-200",
};
