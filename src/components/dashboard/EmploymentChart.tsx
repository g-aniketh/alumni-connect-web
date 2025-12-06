import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { BarChart3 } from "lucide-react";

// Employment chart with real data will be implemented when backend provides employment statistics
export const EmploymentChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Alumni Employment Distribution
        </CardTitle>
        <CardDescription>Employment statistics by department</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">
            Employment statistics will be displayed here
          </p>
          <p className="text-xs mt-2">
            This feature requires backend employment data
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
