import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Navbar, Sidebar, ThemeSettings } from './components';
import {
  Ecommerce, Statistik, DownloadCSV, SemuaDataAlat, DaftarAlat, Orders, Calendar, Employees, Customers,
  Kanban, Line, Area, Logout, Login
} from './pages';
import "./App.css";
import { useStateContext } from './contexts/ContextProvider';
import AuthLayout from './layouts/AuthLayout';

const MainLayout = () => {
  const { activeMenu, themeSettings, setThemeSettings, currentColor } = useStateContext();

  return (
    <div className='flex relative dark:bg-main-dark-bg'>
      {/* Settings button */}
      <div className='fixed right-4 bottom-4' style={{ zIndex: "1000" }}>
        <TooltipComponent content="Settings" position='Top'>
          <button
            type='button'
            className='text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white'
            style={{ background: currentColor, borderRadius: "50%" }}
            onClick={() => setThemeSettings(true)}
          >
            <FiSettings />
          </button>
        </TooltipComponent>
      </div>

      {/* Sidebar */}
      {
        activeMenu ? (
          <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white'>
            <Sidebar />
          </div>
        ) : (
          <div className='w-0 dark:bg-secondary-dark-bg'>
            <Sidebar />
          </div>
        )
      }

      {/* Main content */}
      <div className={`dark:bg-main-dark-bg min-h-screen w-full ${activeMenu ? "md:ml-72" : "flex-2"}`}>
        <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
          <Navbar />
        </div>

        {/* Page content */}
        <div>
          <Outlet /> {/* <- ini penting! */}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const { currentMode } = useStateContext();

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <BrowserRouter>
        <Routes>
          {/* Login Page */}
          <Route path="/login" element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          } />

          {/* Layout untuk semua halaman utama */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Statistik />} />
            <Route path="ecommerce" element={<Ecommerce />} />
            <Route path="statistik" element={<Statistik />} />
            <Route path="downloadcsv" element={<DownloadCSV />} />
            <Route path="semuadataalat" element={<SemuaDataAlat />} />
            <Route path="daftar-alat" element={<DaftarAlat />} />
            <Route path="orders" element={<Orders />} />
            <Route path="employees" element={<Employees />} />
            <Route path="customers" element={<Customers />} />
            <Route path="kanban" element={<Kanban />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="line" element={<Line />} />
            <Route path="area" element={<Area />} />
            <Route path="logout" element={<Logout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
