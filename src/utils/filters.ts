import type { IAppointment } from "../@types/interface";
import type { Options } from "../components/patient/appointmentTable/allAppointments/table";

export const getUniquePatientOptions = (
  appointments: IAppointment[],
): Options[] => {
  const unique = Array.from(new Set(appointments.map((a) => a.patientName)));
  return unique.map((name) => ({ value: name, label: name }));
};
