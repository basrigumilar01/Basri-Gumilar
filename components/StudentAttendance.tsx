
import React, { useEffect, useState, useRef } from 'react';
import type { Student } from '../types';

interface StudentAttendanceProps {
  students: Student[];
  addAttendanceRecord: (studentId: string) => boolean;
}

const SCANNER_ID = "barcode-scanner";

const StudentAttendance: React.FC<StudentAttendanceProps> = ({ students, addAttendanceRecord }) => {
  const [scanResult, setScanResult] = useState<{ student: Student | null; message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    const startScanner = () => {
        if (scannerRef.current) return;
        
        // @ts-ignore Html5Qrcode is from a script tag
        const html5QrcodeScanner = new Html5Qrcode(SCANNER_ID);
        scannerRef.current = html5QrcodeScanner;

        const onScanSuccess = (decodedText: string, decodedResult: any) => {
            scannerRef.current?.pause();
            const student = students.find(s => s.nisn === decodedText);
            if (student) {
                const isNew = addAttendanceRecord(student.id);
                if (isNew) {
                    setScanResult({ student, message: `${student.name} berhasil diabsen.`, type: 'success' });
                } else {
                    setScanResult({ student, message: `${student.name} sudah diabsen hari ini.`, type: 'info' });
                }
            } else {
                setScanResult({ student: null, message: `Siswa dengan NISN ${decodedText} tidak ditemukan.`, type: 'error' });
            }
            
            setTimeout(() => {
                setScanResult(null);
                scannerRef.current?.resume();
            }, 3000);
        };

        const onScanError = (error: string) => {
           // console.warn(`Code scan error = ${error}`);
        };

        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        html5QrcodeScanner.start({ facingMode: "environment" }, config, onScanSuccess, onScanError)
            .catch((err: string) => console.log(`Unable to start scanning, error: ${err}`));
    };

    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop()
            .then(() => { scannerRef.current = null; })
            .catch((err: string) => console.error("Failed to stop scanner", err));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students, addAttendanceRecord]);

  const getAlertClasses = (type: 'success' | 'error' | 'info') => {
    switch(type) {
        case 'success': return 'bg-green-100 border-green-400 text-green-700';
        case 'error': return 'bg-red-100 border-red-400 text-red-700';
        case 'info': return 'bg-blue-100 border-blue-400 text-blue-700';
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Absensi Siswa</h1>
      <p className="text-center text-gray-600 mb-4">Arahkan kamera ke barcode siswa untuk mencatat kehadiran.</p>
      <div id={SCANNER_ID} className="w-full border-2 border-gray-300 rounded-md overflow-hidden"></div>
      {scanResult && (
        <div className={`mt-4 p-4 border rounded-md ${getAlertClasses(scanResult.type)}`} role="alert">
          <p className="font-bold">{scanResult.type === 'success' ? 'Berhasil' : scanResult.type === 'error' ? 'Gagal' : 'Info'}</p>
          <p>{scanResult.message}</p>
          {scanResult.student && (
              <p className="text-sm">NISN: {scanResult.student.nisn}, Kelas: {scanResult.student.class}</p>
          )}
        </div>
      )}
      {!scanResult && (
          <div className="mt-4 p-4 border rounded-md bg-gray-100 border-gray-200 text-center">
            <p className="text-gray-500">Menunggu scan barcode...</p>
          </div>
      )}
    </div>
  );
};

export default StudentAttendance;
