
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import type { Student, AttendanceRecord } from './types';
// FIX: Import AttendanceStatus enum to use its members instead of string literals.
import { AttendanceStatus } from './types';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentData from './components/StudentData';
import AddStudent from './components/AddStudent';
import ImportStudents from './components/ImportStudents';
import StudentAttendance from './components/StudentAttendance';
import AttendanceRecap from './components/AttendanceRecap';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('isLoggedIn'));
  const [logoUrl, setLogoUrl] = useState<string>(() => localStorage.getItem('logoUrl') || 'https://picsum.photos/100');
  
  const [students, setStudents] = useState<Student[]>(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [
      { id: '1', nis: '12345', nisn: '0012345678', name: 'Budi Santoso', class: '6A' },
      { id: '2', nis: '12346', nisn: '0023456789', name: 'Siti Aminah', class: '6A' },
      { id: '3', nis: '12347', nisn: '0034567890', name: 'Ahmad Dahlan', class: '6B' },
    ];
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const savedAttendance = localStorage.getItem('attendance');
    return savedAttendance ? JSON.parse(savedAttendance) : [];
  });

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : '');
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('logoUrl', logoUrl);
  }, [logoUrl]);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };
  
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: Date.now().toString() };
    setStudents(prev => [...prev, newStudent]);
  };

  const addAttendanceRecord = useCallback((studentId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existingRecord = attendance.find(record => record.studentId === studentId && record.date === today);

    if (!existingRecord) {
      const newRecord: AttendanceRecord = {
        studentId,
        date: today,
        // FIX: Use AttendanceStatus enum member instead of a string literal for type safety.
        status: AttendanceStatus.Hadir,
      };
      setAttendance(prev => [...prev, newRecord]);
      return true;
    }
    return false;
  }, [attendance]);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar logoUrl={logoUrl} setLogoUrl={setLogoUrl} onLogout={handleLogout} />
      <main className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard students={students} attendance={attendance} />} />
          <Route path="/data-siswa" element={<StudentData students={students} />} />
          <Route path="/absensi-siswa" element={<StudentAttendance students={students} addAttendanceRecord={addAttendanceRecord} />} />
          <Route path="/tambah-siswa" element={<AddStudent addStudent={addStudent} />} />
          <Route path="/impor-siswa" element={<ImportStudents setStudents={setStudents} />} />
          <Route path="/rekap-kehadiran" element={<AttendanceRecap students={students} attendance={attendance} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;