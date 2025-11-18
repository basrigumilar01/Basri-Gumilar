
import React, { useState } from 'react';
import type { Student } from '../types';

interface AddStudentProps {
  addStudent: (student: Omit<Student, 'id'>) => void;
}

const AddStudent: React.FC<AddStudentProps> = ({ addStudent }) => {
  const [formData, setFormData] = useState({
    nis: '',
    nisn: '',
    name: '',
    class: '6A',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nis || !formData.nisn || !formData.name || !formData.class) {
      setMessage('Semua kolom harus diisi.');
      return;
    }
    addStudent(formData);
    setMessage(`Siswa ${formData.name} berhasil ditambahkan.`);
    setFormData({ nis: '', nisn: '', name: '', class: '6A' });
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tambah Siswa</h1>
      {message && <div className="mb-4 p-3 rounded-md bg-green-100 text-green-800">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nis" className="block text-sm font-medium text-gray-700">NIS</label>
          <input type="text" name="nis" id="nis" value={formData.nis} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="nisn" className="block text-sm font-medium text-gray-700">NISN</label>
          <input type="text" name="nisn" id="nisn" value={formData.nisn} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="class" className="block text-sm font-medium text-gray-700">Kelas</label>
          <select name="class" id="class" value={formData.class} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option>6A</option>
            <option>6B</option>
            <option>6C</option>
          </select>
        </div>
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Tambah Siswa
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
