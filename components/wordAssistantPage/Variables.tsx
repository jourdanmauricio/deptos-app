import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon } from 'lucide-react';

import { Label } from '../ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

type VariablesProps = {
  className?: string;
  handleAddData: (param: string) => void;
};

const variables = [
  'propiedad_direccion',
  'nombre_del_inquilino',
  'dni_del_inquilino',
  'nombre_del_propietario',
  'dni_del_propietario',
  'nombre_del_garante',
  'dni_del_garante',
  'fecha_de_firma',
  'fecha_de_inicio',
  'fecha_de_finalizacion',
];

export function Variables({ className, handleAddData }: VariablesProps) {
  return (
    <>
      <div className={cn('flex h-48 w-48 flex-col gap-2', className)}>
        <Label className='text-sm leading-none font-normal'>Variables</Label>
        <ScrollArea className='h-full rounded-md border'>
          <div className='p-2'>
            {variables.map((variable) => (
              <React.Fragment key={variable}>
                <Button
                  type='button'
                  variant='ghost'
                  className='flex items-center gap-1'
                  onClick={() => handleAddData(variable)}
                >
                  <ChevronLeftIcon className='h-4 w-4' />
                  <span className='text-sm'>{variable}</span>
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
