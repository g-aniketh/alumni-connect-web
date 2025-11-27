import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Department } from '../../types';

const data = [
  { name: 'CS', rate: 95 },
  { name: 'EE', rate: 88 },
  { name: 'Mech', rate: 82 },
  { name: 'Civil', rate: 75 },
  { name: 'Business', rate: 90 },
  { name: 'Arts', rate: 70 },
  { name: 'Science', rate: 78 },
];

export const EmploymentChart = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Alumni Employment Rates by Department</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px' }}
            />
            <Bar
              dataKey="rate"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

