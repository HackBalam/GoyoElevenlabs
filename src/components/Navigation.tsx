import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '⌂' },
    { path: '/contacts', label: 'Contacts', icon: '⚬' },
    { path: '/debug', label: 'Debug', icon: '⚬' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#1CC5B8]/20 shadow-lg z-50 md:static md:border-t-0 md:shadow-none md:bg-transparent">
      <div className="flex justify-center md:justify-start">
        <div className="flex space-x-1 md:space-x-2 p-2 md:p-0">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col md:flex-row items-center justify-center px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-full transition-all duration-300 min-w-[80px] md:min-w-[120px]
                ${isActive(item.path) 
                  ? 'bg-gradient-to-r from-[#1CC5B8] to-[#7D4AE8] text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#1CC5B8]/10 hover:to-[#7D4AE8]/10 hover:text-[#1CC5B8]'
                }
              `}
            >
              <span className="text-lg md:text-xl mb-1 md:mb-0 md:mr-2">{item.icon}</span>
              <span className="text-xs md:text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};