import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { User } from 'lucide-react';

export const RoleSwitcher = () => {
  const { login, user } = useAuth();

  const handleRoleSwitch = (role: UserRole) => {
    login(role);
  };

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            Demo Login
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleRoleSwitch(UserRole.Student)}>
            Login as Student
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRoleSwitch(UserRole.Alumni)}>
            Login as Alumni
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRoleSwitch(UserRole.College)}>
            Login as College
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return null;
};

