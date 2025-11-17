import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';

import data from './data.json';

const DashboardPage = () => {
  return (
    <div className='flex flex-col gap-4'>
      <ChartAreaInteractive />

      <DataTable data={data} />
    </div>
  );
};

export { DashboardPage };
