
import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { Layers, Car, MessageSquare, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLogin from '@/components/admin/AdminLogin';

const AdminPage = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  if (!token) {
    return <AdminLogin onLoginSuccess={(newToken) => setToken(newToken)} />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="flex items-center px-4 py-2">
            <span className="text-xl font-semibold">3ansdz Admin</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Tableau de bord">
                  <a href="/admin/dashboard">
                    <Layers className="h-5 w-5" />
                    <span>Tableau de bord</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Véhicules">
                  <a href="/admin/vehicles">
                    <Car className="h-5 w-5" />
                    <span>Véhicules</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Messages">
                  <a href="/admin/messages">
                    <MessageSquare className="h-5 w-5" />
                    <span>Messages</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Configuration">
                  <a href="/admin/settings">
                    <Settings className="h-5 w-5" />
                    <span>Configuration</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarSeparator />
            <div className="p-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Déconnexion
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminPage;
