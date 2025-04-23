import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  CalendarClock, 
  Building2, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  Settings,
  User as UserIcon
} from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'Attendance Management',
      path: '/attendance',
      icon: <CalendarClock size={20} />,
      submenu: [
        { name: 'View Attendance', path: '/attendance' },
        { name: 'Add Attendance', path: '/attendance/add' },
        { name: 'Attendance Report', path: '/attendance/report' },
      ],
    },
    {
      name: 'Organization',
      path: '/organization',
      icon: <Building2 size={20} />,
      submenu: [
        { name: 'Overview', path: '/organization' },
        { name: 'Designations', path: '/organization/designations' },
        { name: 'Status', path: '/organization/status' },
      ],
    },
    {
      name: 'Employee',
      path: '/employee',
      icon: <Users size={20} />,
      submenu: [
        { name: 'View Employees', path: '/employee' },
        { name: 'Add Employee', path: '/employee/add' },
      ],
    },
  ];

  const LogoutModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"></div>
        
        <div className="relative bg-white rounded-lg max-w-md w-full p-6 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-error-100 text-error-600">
              <LogOut size={32} />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Sign Out</h3>
            <p className="mt-2 text-gray-600">
              Are you sure you want to sign out of your account?
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleLogout();
                setShowLogoutModal(false);
              }}
              className="btn btn-error"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const LogoutButton = () => (
    <button
      onClick={() => setShowLogoutModal(true)}
      className="flex items-center w-full px-3 py-2 text-left rounded-md text-primary-200 hover:bg-primary-800 hover:text-white transition-colors"
    >
      <LogOut size={20} className="mr-3" />
      {isSidebarOpen && <span>Sign Out</span>}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside 
        className={`bg-primary-900 text-white transition-all duration-300 ease-in-out hidden md:flex md:flex-col ${
          isSidebarOpen ? 'md:w-64' : 'md:w-20'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-800">
          <h1 className={`font-bold text-xl ${isSidebarOpen ? 'block' : 'hidden'}`}>
            ATMS
          </h1>
          <button 
            onClick={toggleSidebar}
            className="rounded-full p-1 hover:bg-primary-800 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.path} className="mb-2">
              <button
                onClick={() => item.submenu 
                  ? toggleSubmenu(item.name) 
                  : navigate(item.path)
                }
                className={`flex items-center w-full px-3 py-2 text-left rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-800 text-white'
                    : 'text-primary-100 hover:bg-primary-800 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {isSidebarOpen && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.submenu && (
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform ${
                          openSubmenu === item.name ? 'rotate-180' : ''
                        }`} 
                      />
                    )}
                  </>
                )}
              </button>
              
              {isSidebarOpen && item.submenu && openSubmenu === item.name && (
                <div className="pl-11 mt-1 space-y-1">
                  {item.submenu.map((subitem) => (
                    <button
                      key={subitem.path}
                      onClick={() => navigate(subitem.path)}
                      className={`block w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${
                        location.pathname === subitem.path
                          ? 'bg-primary-700 text-white'
                          : 'text-primary-200 hover:bg-primary-700 hover:text-white'
                      }`}
                    >
                      {subitem.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-primary-800">
          <LogoutButton />
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="md:hidden rounded-full p-1 hover:bg-gray-100 transition-colors"
              >
                <Menu size={24} />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-800">
                {navItems.find((item) => 
                  location.pathname === item.path || 
                  location.pathname.startsWith(`${item.path}/`))?.name || 'Welcome'}
              </h1>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={toggleMobileMenu}
            ></div>
            
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-primary-900 text-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={toggleMobileMenu}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
              
              <div className="flex items-center h-16 px-4 border-b border-primary-800">
                <h1 className="font-bold text-xl">ATMS</h1>
              </div>
              
              <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <div key={item.path} className="mb-2">
                    <button
                      onClick={() => item.submenu 
                        ? toggleSubmenu(item.name) 
                        : (navigate(item.path), toggleMobileMenu())
                      }
                      className={`flex items-center w-full px-3 py-2 text-left rounded-md transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary-800 text-white'
                          : 'text-primary-100 hover:bg-primary-800 hover:text-white'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span className="flex-1">{item.name}</span>
                      {item.submenu && (
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform ${
                            openSubmenu === item.name ? 'rotate-180' : ''
                          }`} 
                        />
                      )}
                    </button>
                    
                    {item.submenu && openSubmenu === item.name && (
                      <div className="pl-11 mt-1 space-y-1">
                        {item.submenu.map((subitem) => (
                          <button
                            key={subitem.path}
                            onClick={() => {
                              navigate(subitem.path);
                              toggleMobileMenu();
                            }}
                            className={`block w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${
                              location.pathname === subitem.path
                                ? 'bg-primary-700 text-white'
                                : 'text-primary-200 hover:bg-primary-700 hover:text-white'
                            }`}
                          >
                            {subitem.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              
              <div className="p-4 border-t border-primary-800">
                <button
                  onClick={() => {
                    setShowLogoutModal(true);
                    toggleMobileMenu();
                  }}
                  className="flex items-center w-full px-3 py-2 text-left rounded-md text-primary-200 hover:bg-primary-800 hover:text-white transition-colors"
                >
                  <LogOut size={20} className="mr-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
      
      {showLogoutModal && <LogoutModal />}
    </div>
  );
};

export default Layout;