
import React, { useEffect, createRef } from 'react';
import type { Student } from '../types';

interface StudentDataProps {
  students: Student[];
}

const StudentData: React.FC<StudentDataProps> = ({ students }) => {
  const barcodeRefs = React.useMemo(() => 
    Array(students.length).fill(0).map(() => createRef<SVGSVGElement>()), 
    [students.length]
  );

  useEffect(() => {
    students.forEach((student, index) => {
      if (barcodeRefs[index].current) {
        // @ts-ignore JsBarcode is from a script tag
        JsBarcode(barcodeRefs[index].current, student.nisn, {
          format: "CODE128",
          displayValue: true,
          fontSize: 14,
          margin: 10,
          height: 50,
        });
      }
    });
  }, [students, barcodeRefs]);

  const downloadBarcode = (index: number, studentName: string) => {
    const svgElement = barcodeRefs[index].current;
    if (svgElement) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `barcode-${studentName.replace(/\s+/g, '-')}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgString);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Data Siswa</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIS</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NISN</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barcode</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.filter(s => s.class.startsWith('6')).map((student, index) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.nis}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.nisn}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.class}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <svg ref={barcodeRefs[index]}></svg>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => downloadBarcode(index, student.name)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Download Barcode
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentData;
