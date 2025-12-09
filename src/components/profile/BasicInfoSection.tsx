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
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Basic Information</CardTitle>
        <CardDescription>Your account and contact information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-semibold">
              Full Name
            </Label>
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
                className="h-11"
              />
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold">
              Email Address
            </Label>
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
                className="h-11"
              />
            ) : (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50 min-w-0">
                <div className="flex-shrink-0 p-2 rounded-full bg-primary/10 mt-0.5">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium break-all break-words overflow-wrap-anywhere min-w-0">
                  {user.email}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
