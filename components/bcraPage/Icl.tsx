import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import InputNumberField from '@/components/ui/custom/input-number-field';
import { InputDatePicker } from '@/components/ui/custom/input-date-picker';
import { getICL } from '@/lib/actions/bcra';

const formIclSchema = z.object({
  initialRent: z.string().min(1, 'Requerido'),
  startDate: z.date().min(1, 'Requerido'),
  rentUpdateMonths: z.string().min(1, 'Requerido'),
});

const Icl = () => {
  const form = useForm<z.infer<typeof formIclSchema>>({
    resolver: zodResolver(formIclSchema),
    defaultValues: {
      initialRent: '',
      startDate: new Date(),
      rentUpdateMonths: '3',
    },
  });

  const onSubmit = async (data: z.infer<typeof formIclSchema>) => {
    console.log(data);
    const iclIndex = await getICL(data);
    console.log(iclIndex);
  };

  const onError = (errors: FieldErrors<z.infer<typeof formIclSchema>>) => {
    console.log('errors', errors);
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <CardHeader>
            <CardTitle>Índice para Contratos de Locación</CardTitle>
            <CardDescription>
              Ingresa el valor inicial del alquiler, la fecha de inicio del contrato y la cantidad
              de meses entre ajustes.
            </CardDescription>
          </CardHeader>

          <CardContent className='mt-8 grid gap-6'>
            <InputNumberField
              label='Precio'
              name='initialRent'
              form={form}
              className='w-full'
              placeholder='Precio inicial'
              regExp={/^(0|(0,\d{0,2})|([1-9]\d{0,8})(,\d{0,2})?)?$/}
              onChangeInputNumberField={() => {
                form.clearErrors('initialRent');
              }}
            />

            <InputDatePicker
              label='Fecha de inicio'
              name='startDate'
              form={form}
              className='w-full'
            />

            <InputNumberField
              label='Actualización de precio (meses)'
              name='rentUpdateMonths'
              form={form}
              className='w-full'
              regExp={/^[1-6]$/}
            />
          </CardContent>
          <CardFooter className='mt-8 flex justify-end'>
            <Button type='submit'>Calcular</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export { Icl };
