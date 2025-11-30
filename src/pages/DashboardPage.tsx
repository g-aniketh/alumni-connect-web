import { DashboardStats } from '../components/dashboard/DashboardStats';
import { AlumniTable } from '../components/dashboard/AlumniTable';
import { EmploymentChart } from '../components/dashboard/EmploymentChart';
import { ActionArea } from '../components/dashboard/ActionArea';

const DashboardPage = () => {
  return (
    <div className="container py-10 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">College Dashboard</h2>
        <div className="flex items-center space-x-2">
          <ActionArea />
        </div>
      </div>
      
      <DashboardStats />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <EmploymentChart />
        </div>
        {/* We can add more widgets here later, like Recent Activities */}
      </div>

      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold tracking-tight">Alumni Directory</h3>
         </div>
        <AlumniTable />
      </div>
    </div>
  );
};

export default DashboardPage;

