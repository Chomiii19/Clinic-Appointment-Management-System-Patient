import type { FiltersState } from "./types";

export interface IAppointment {
  _id: string;
  patientId: number;
  doctorId: IDoctor;
  patientName: string;
  medicalDepartment: string[];
  medicalRecord: {
    _id: string;
    filename: string;
    fileUrl: string;
  };
  schedule: Date;
  email: string;
  phoneNumber: string;
  doctorName: string;
  status: string;
  isPaid: boolean;
  createdAt: Date;
  isDeleted: boolean;
}

export interface IUser {
  _id: string;
  firstname: string;
  surname: string;
  gender: string;
  birthDate: string;
  address: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  profile_url: string;
}

export interface INotifications {
  _id: string;
  text: string;
  createdAt: Date;
  seen: boolean;
}

export interface ITransactions {
  _id: string;
  appointmentId: string;
  amount: number;
  modeOfPayment: string;
  status: string;
  createdAt: Date;
}

export interface IUser {
  _id: string;
  firstname: string;
  surname: string;
  birthDate: string;
  gender: string;
  maritalStatus: string;
  address: string;
  email: string;
  phoneNumber: string;
  role: string;
  password: string;
  createdAt: Date;
}

export interface IMedicalRecord {
  _id: string;
  appointmentId: string;
  status: string;
  diagnosis: string;
  createdAt: Date;
}

export interface IDoctor {
  _id: string;
  name: string;
  specialization: string;
  schedule: Date;
  createdAt: Date;
}

export interface IService {
  _id: string;
  name: string;
  price: number;
  status: string;
  createdAt: Date;
}

export interface FilterProps {
  tabs: string[];
  currentTab: string;
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
}
