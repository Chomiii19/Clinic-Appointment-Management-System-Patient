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

export const medicalServicesStrings = medicalServices.map((s) => s.value);

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
  Consultation: "bg-blue-400/15 text-blue-400 border border-blue-400",
  Vaccine: "bg-green-400/15 text-green-400 border border-green-400",
  Vaccination: "bg-green-400/15 text-green-400 border border-green-400",
  "Medical Certificate":
    "bg-purple-400/15 text-purple-400 border border-purple-400",
  Laboratory: "bg-yellow-400/15 text-yellow-400 border border-yellow-400",
  "Holistic Care": "bg-pink-400/15 text-pink-400 border border-pink-400",
  Circumcission: "bg-red-400/15 text-red-400 border border-red-400",
  "Medical Check Up":
    "bg-indigo-400/15 text-indigo-400 border border-indigo-400",
  "Prenatal Check Up": "bg-rose-400/15 text-rose-400 border border-rose-400",
  "Family Planning": "bg-teal-400/15 text-teal-400 border border-teal-400",
  "X-ray": "bg-orange-400/15 text-orange-400 border border-orange-400",
};
