
import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { DashboardIcon, UsersIcon, QrCodeIcon, UserPlusIcon, UploadIcon, DocumentReportIcon, LogoutIcon } from './icons';

interface SidebarProps {
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { to: '/', text: 'Dashboard', icon: DashboardIcon },
  { to: '/data-siswa', text: 'Data Siswa', icon: UsersIcon },
  { to: '/absensi-siswa', text: 'Absensi Siswa', icon: QrCodeIcon },
  { to: '/tambah-siswa', text: 'Tambah Siswa', icon: UserPlusIcon },
  { to: '/impor-siswa', text: 'Impor Siswa', icon: UploadIcon },
  { to: '/rekap-kehadiran', text: 'Rekap Kehadiran', icon: DocumentReportIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ logoUrl, setLogoUrl, onLogout }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const activeLinkClass = "bg-indigo-800 text-white";
  const inactiveLinkClass = "text-indigo-100 hover:bg-indigo-600 hover:text-white";

  return (
    <aside className="flex flex-col w-64 h-screen text-white bg-indigo-700">
      <div className="flex flex-col items-center justify-center p-4 border-b border-indigo-800">
        <div className="relative group cursor-pointer" onClick={handleLogoClick}>
            <img src={logoUrl} alt="Logo" className="w-24 h-24 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-white">Ganti Logo</span>
            </div>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        <h1 className="mt-2 text-xl font-semibold">ABSENSI SDN PASARREBO</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => 
              `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.text}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-indigo-800">
          <button
              onClick={onLogout}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${inactiveLinkClass}`}
          >
              <LogoutIcon className="w-5 h-5 mr-3" />
              Logout
          </button>
      </div>
    </aside>
  );
};

export default Sidebar;
