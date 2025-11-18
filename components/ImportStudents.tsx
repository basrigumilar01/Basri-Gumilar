
import React, { useState } from 'react';
import type { Student } from '../types';

interface ImportStudentsProps {
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const ImportStudents: React.FC<ImportStudentsProps> = ({ setStudents }) => {
  const [message, setMessage] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        // @ts-ignore XLSX is from a script tag
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // @ts-ignore XLSX is from a script tag
        const json = XLSX.utils.sheet_to_json<any>(worksheet);

        const newStudents = json.map((row: any) => ({
          id: Date.now().toString() + Math.random().toString(),
          nis: String(row.NIS || ''),
          nisn: String(row.NISN || ''),
          name: String(row.Nama || ''),
          class: String(row.Kelas || ''),
        }));
        
        setStudents(prev => [...prev, ...newStudents.filter(s => s.nis && s.nisn && s.name && s.class)]);
        setMessage(`${newStudents.length} siswa berhasil diimpor.`);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        setMessage('Gagal mengimpor file. Pastikan format file benar.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const templateData = [
      { NIS: '12345', NISN: '0012345678', Nama: 'Contoh Siswa', Kelas: '6A' },
    ];
    // @ts-ignore XLSX is from a script tag
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    // @ts-ignore XLSX is from a script tag
    const workbook = XLSX.utils.book_new();
    // @ts-ignore XLSX is from a script tag
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');
    // @ts-ignore XLSX is from a script tag
    XLSX.writeFile(workbook, 'template-impor-siswa.xlsx');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Impor Siswa</h1>
      {message && <div className="mb-4 p-3 rounded-md bg-blue-100 text-blue-800">{message}</div>}
      <div className="space-y-4">
        <p className="text-gray-600">
          Unduh template di bawah ini, isi data siswa, lalu unggah file untuk mengimpor data secara massal.
        </p>
        <button
          onClick={downloadTemplate}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Download Template Excel
        </button>
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">Unggah File Excel</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  <span>Pilih file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileUpload} accept=".xlsx, .xls" />
                </label>
                <p className="pl-1">atau seret dan lepas</p>
              </div>
              <p className="text-xs text-gray-500">XLSX, XLS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportStudents;
