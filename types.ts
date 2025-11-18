
export interface Student {
  id: string;
  nis: string;
  nisn: string;
  name: string;
  class: string;
}

export enum AttendanceStatus {
  Hadir = "Hadir",
  Sakit = "Sakit",
  Izin = "Izin",
  Alpha = "Alpha",
}

export interface AttendanceRecord {
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}
