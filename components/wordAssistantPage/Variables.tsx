import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon } from 'lucide-react';

import { Label } from '../ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { rentalVariables } from '@/shared/constanst';

type VariablesProps = {
  className?: string;
  handleAddData: (param: string) => void;
};

export function Variables({ className, handleAddData }: VariablesProps) {
  return (
    <>
      <div className={cn('flex h-48 w-48 flex-col gap-2', className)}>
        <Label className='text-sm leading-none font-normal'>Variables</Label>
        <ScrollArea className='h-full rounded-md border'>
          <div className='p-2'>
            {rentalVariables.map((variable) => (
              <React.Fragment key={variable.name}>
                <Button
                  type='button'
                  variant='ghost'
                  className='flex items-center gap-1'
                  onClick={() => handleAddData(variable.name)}
                >
                  <ChevronLeftIcon className='h-4 w-4' />
                  <span className='text-sm'>{variable.label}</span>
                </Button>
                <Separator className='my-0' />
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
