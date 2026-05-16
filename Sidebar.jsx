import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, Users, Settings } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

export default function Sidebar() {
  const { user } = useAuthStore();

  const links = [
    { to: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
    ...(user?.role === 'Manager' || user?.role === 'Admin' ? [
      { to: '/team', icon: <Users className="h-5 w-5" />, label: 'Team Goals' }
    ] : []),
    ...(user?.role === 'Admin' ? [
      { to: '/analytics', icon: <Target className="h-5 w-5" />, label: 'Analytics' },
      { to: '/settings', icon: <Settings className="h-5 w-5" />, label: 'Settings' }
    ] : [])
  ];

  return (
    <div className="hidden border-r bg-muted/40 md:block md:w-64 flex-shrink-0">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <Target className="h-6 w-6 text-primary" />
            <span className="">GoalTracker Pro</span>
          </NavLink>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
