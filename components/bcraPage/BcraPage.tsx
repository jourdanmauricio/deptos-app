'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icl } from './Icl';
import { Ipc } from '@/components/bcraPage/Ipc';

const BcraPage = () => {
  return (
    <div className='flex w-full max-w-sm flex-col gap-6'>
      <Tabs defaultValue='icl'>
        <TabsList>
          <TabsTrigger value='icl'>ICL</TabsTrigger>
          <TabsTrigger value='ipc'>IPC</TabsTrigger>
        </TabsList>
        <TabsContent value='icl'>
          <Icl />
        </TabsContent>
        <TabsContent value='ipc'>
          <Ipc />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { BcraPage };
