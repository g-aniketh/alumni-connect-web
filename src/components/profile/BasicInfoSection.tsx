import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { User, Mail } from "lucide-react";
import type { ProfileFormData } from "../../types/profile";

interface BasicInfoSectionProps {
  user: { name: string; email: string };
  isEditing: boolean;
  formData: ProfileFormData;
  onFormDataChange: (data: ProfileFormData) => void;
}

export const BasicInfoSection = ({
  user,
  isEditing,
  formData,
  onFormDataChange,
}: BasicInfoSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Your account and contact information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={"name" in formData ? formData.name : ""}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    name: e.target.value,
                  } as ProfileFormData)
                }
              />
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                {user.name}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={"email" in formData ? formData.email : ""}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    email: e.target.value,
                  } as ProfileFormData)
                }
              />
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {user.email}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
