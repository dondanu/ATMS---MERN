import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  CalendarClock, 
  Building2, 
  Users, 
  ArrowRight
} from 'lucide-react';

const WelcomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const navigationItems = [
    {
      title: 'Dashboard',
      description: 'View key metrics and attendance statistics',
      icon: <LayoutDashboard size={32} className="text-primary-500" />,
      path: '/dashboard',
      color: 'bg-primary-50 border-primary-200',
    },
    {
      title: 'Attendance Management',
      description: 'Track employee attendance and manage records',
      icon: <CalendarClock size={32} className="text-secondary-500" />,
      path: '/attendance',
      color: 'bg-secondary-50 border-secondary-200',
    },
    {
      title: 'Organization',
      description: 'Manage departments, designations, and status types',
      icon: <Building2 size={32} className="text-accent-500" />,
      path: '/organization',
      color: 'bg-accent-50 border-accent-200',
    },
    {
      title: 'Employee',
      description: 'View and manage employee information',
      icon: <Users size={32} className="text-success-500" />,
      path: '/employee',
      color: 'bg-success-50 border-success-200',
    },
  ];
  
  const inspirationalQuotes = [
    "Attendance is not just about being physically present, but being mentally engaged.",
    "Success in business requires training, discipline, and hard work.",
    "The difference between ordinary and extraordinary is that little extra.",
    "The only way to do great work is to love what you do.",
    "Productivity is being able to do things that you were never able to do before.",
  ];
  
  // Randomly select a quote
  const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="relative h-80">
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
              backgroundBlendMode: "overlay"
            }}
          ></div>
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl leading-relaxed font-light">
              "{randomQuote}"
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Navigation</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {navigationItems.map((item) => (
          <div 
            key={item.title}
            onClick={() => navigate(item.path)}
            className={`${item.color} border rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg group animate-slide-up`}
          >
            <div className="flex flex-col h-full">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-4 flex-grow">{item.description}</p>
              <button className="flex items-center text-sm font-medium text-primary-600 group-hover:text-primary-700 transition-colors">
                Go to {item.title}
                <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Getting Started</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mr-3 mt-0.5">1</span>
            <div>
              <h3 className="font-medium text-gray-900">Check the dashboard</h3>
              <p className="text-gray-600 text-sm">View attendance metrics and statistics for your organization</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mr-3 mt-0.5">2</span>
            <div>
              <h3 className="font-medium text-gray-900">Manage employee attendance</h3>
              <p className="text-gray-600 text-sm">Record daily attendance, track leave requests, and generate reports</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mr-3 mt-0.5">3</span>
            <div>
              <h3 className="font-medium text-gray-900">Organize your company structure</h3>
              <p className="text-gray-600 text-sm">Set up departments, designations, and status types to reflect your organization</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mr-3 mt-0.5">4</span>
            <div>
              <h3 className="font-medium text-gray-900">Manage employee profiles</h3>
              <p className="text-gray-600 text-sm">Add new employees, update profiles, and track attendance history</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;