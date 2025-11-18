
import React from 'react';
import type { Student, AttendanceRecord } from '../types';
import { UsersIcon, QrCodeIcon } from './icons';

interface DashboardProps {
    students: Student[];
    attendance: AttendanceRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ students, attendance }) => {
    const today = new Date().toISOString().split('T')[0];
    const presentToday = attendance.filter(record => record.date === today && record.status === 'Hadir').length;
    const totalStudents = students.length;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-lg shadow-md flex items-center space-x-4">
                    <div className="p-3 bg-blue-500 rounded-full">
                        <UsersIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Siswa</p>
                        <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md flex items-center space-x-4">
                    <div className="p-3 bg-green-500 rounded-full">
                        <QrCodeIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Hadir Hari Ini</p>
                        <p className="text-3xl font-bold text-gray-900">{presentToday}</p>
                    </div>
                </div>
                 <div className="p-6 bg-white rounded-lg shadow-md flex items-center space-x-4">
                    <div className="p-3 bg-red-500 rounded-full">
                        <UsersIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Tidak Hadir</p>
                        <p className="text-3xl font-bold text-gray-900">{totalStudents - presentToday}</p>
                    </div>
                </div>
            </div>
             <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Selamat Datang</h2>
                <p className="text-gray-600">Selamat datang di sistem absensi SDN Pasar Rebo. Gunakan menu di sebelah kiri untuk mengelola data siswa dan mencatat kehadiran.</p>
            </div>
        </div>
    );
};

export default Dashboard;
