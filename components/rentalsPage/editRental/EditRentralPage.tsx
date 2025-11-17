'use client';

import z from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { useCreateRental, useUpdateRental, useRental } from '@/hooks/use-rentals';
import { rentalFormSchema } from '@/shared/schemas';
import { PropertiesDropdown } from '@/components/ui/dropdowns/PropertiesDropdown';
import { PartiesDropdown } from '@/components/ui/dropdowns/PartiesDropdown';
import { Button } from '@/components/ui/button';
import { Loader2Icon, LoaderIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { Modal } from '@/components/partiesPage/Modal';
import { InputDatePicker } from '@/components/ui/custom/input-date-picker';
import InputNumberField from '@/components/ui/custom/input-number-field';
import { TypeIndexationDropdown } from '@/components/ui/dropdowns/TypeIndexationDropdown';
import { IndexationType, PaymentMethod, RentalStatus } from '@/lib/generated/prisma';
import { RentalStatusDropdown } from '@/components/ui/dropdowns/RentalStatusDropdown';
import { TypePaymentMethodDropdown } from '@/components/ui/dropdowns/TypePaymentMethodDropdown';
import BooleanCheckbox from '@/components/ui/custom/boolean-checkbox';
import TextareaField from '@/components/ui/custom/textarea-field';
import { SubmitButton } from '@/components/ui/custom/submit-button';
import ImageUpload from '@/components/ui/custom/image-upload/ImageUpload';
import { TypeWordTemplatesDropdown } from '@/components/ui/dropdowns/TypeWordTemplatesDropdown';
import { WordTemplatesDropdown } from '@/components/ui/dropdowns/WordTemplatesDropdown';
import { ContractModalGenerate } from '../ContractModalGenerate';

type EditRentalPageProps = {
  rentalId: string;
};

const defaultValues = {
  propertyId: '',
  tenantId: '',
  guarantors: [''],
  ownerId: '',
  signedDate: new Date(),
  contractDurationYears: '2',
  // startDate es la fecha 01 del siguiente mes
  startDate: (() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1, 1);
    return date;
  })(),
  // endDate es la fecha startDate + 2 años
  endDate: (() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1, 1);
    date.setFullYear(date.getFullYear() + 2);
    return date;
  })(),
  terminationDate: undefined,
  initialRent: '0',
  rentUpdateMonths: '3',
  penaltyRate: '0,5',
  rescissionRate: '2,5',
  currency: 'ARS',
  indexationType: 'IPC' as IndexationType,
  status: 'ACTIVE' as RentalStatus,
  deposit: '300',
  paymentMethod: 'CASH' as PaymentMethod,
  billing: false,
  contractUrl: '',
  observation: '',
  wordTemplateId: '',
};
// terminationDate

const EditRentalPage = ({ rentalId }: EditRentalPageProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [_, startTransition] = useTransition();
  const { data: rental, isLoading, isFetching, error } = useRental(rentalId);
  const [contractModalIsOpen, setContractModalIsOpen] = useState(false);

  const mode = rentalId === 'new' ? 'NEW' : 'EDIT';

  const router = useRouter();

  // Callback para redirigir después de crear/actualizar
  const handleSuccess = () => {
    router.push('/dashboard/rentals');
  };

  const createRentalMutation = useCreateRental(handleSuccess);
  const updateRentalMutation = useUpdateRental(handleSuccess);

  const form = useForm<z.infer<typeof rentalFormSchema>>({
    resolver: zodResolver(rentalFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (rental && !isLoading && !isFetching) {
      // Usar startTransition para manejar la actualización del estado de forma segura
      startTransition(() => {
        form.reset({
          propertyId: rental.propertyId,
          tenantId: rental.tenantId,
          guarantors: rental.guarantors?.map((guarantor) => guarantor.id) || [],
          ownerId: rental.ownerId,
          signedDate: rental.signedDate || new Date(),
          contractDurationYears: rental.contractDurationYears.toString(),
          startDate: rental.startDate,
          endDate: rental.endDate,
          initialRent: rental.initialRent?.toString() || '',
          rentUpdateMonths: rental.rentUpdateMonths?.toString() || '',
          penaltyRate: rental.penaltyRate?.toString() || '',
          rescissionRate: rental.rescissionRate?.toString() || '',
          indexationType: rental.indexationType || 'IPC',
          status: rental.status || 'ACTIVE',
          deposit: rental.deposit?.toString() || '0',
          paymentMethod: rental.paymentMethod || 'CASH',
          billing: rental.billing || false,
          contractUrl: rental.contractUrl || '',
          observation: rental.observation || '',
          currency: rental.currency || 'ARS',
          wordTemplateId: rental.wordTemplateId || '',
        });
      });
    }
  }, [rental, isLoading, isFetching, form]);

  // console.log("rental", rental);

  const handleAddGuarantor = () => {
    // agregar un elemento al array de garantes
    const currentGuarantors = form.getValues('guarantors') || [];
    form.setValue('guarantors', [...currentGuarantors, '']);
  };

  const handleDeleteGuarantor = (index: number) => {
    const currentGuarantors = form.getValues('guarantors') || [];
    form.setValue(
      'guarantors',
      currentGuarantors.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (values: z.infer<typeof rentalFormSchema>) => {
    console.log('values onSubmit', values);
    const valuesToSubmit = {
      ...values,
      contractDurationYears: Number(values.contractDurationYears),
      initialRent: parseFloat(values.initialRent),
      rentUpdateMonths: Number(values.rentUpdateMonths),
      penaltyRate: parseFloat(values.penaltyRate),
      rescissionRate: parseFloat(values.rescissionRate),
      deposit: parseFloat(values.deposit),
      indexationType: values.indexationType as IndexationType,
      signedDate: values.signedDate ?? '',
      terminationDate: values.terminationDate ?? null,
      contractUrl: values.contractUrl ?? '',
      observation: values.observation ?? '',
      currency: values.currency ?? 'ARS',
      guarantors: {
        connect: values.guarantors
          .filter((id) => id) // Filtrar strings vacíos
          .map((id) => ({ id })),
      },
      wordTemplateId: values.wordTemplateId || null,
    };

    // La navegación se maneja automáticamente en el callback onSuccess del hook
    if (mode === 'NEW') {
      console.log('valuesToSubmit', valuesToSubmit);
      await createRentalMutation.mutateAsync(valuesToSubmit);
    } else {
      console.log('valuesToSubmit', valuesToSubmit);
      await updateRentalMutation.mutateAsync({
        id: rental?.id!,
        data: valuesToSubmit,
      });
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof rentalFormSchema>>) => {
    console.log('errors', errors);
  };

  // Observa todos los cambios del formulario en tiempo real
  // const formValues = form.watch();

  // useEffect(() => {
  //   console.log("CustomDatePicker - form values changed:", formValues);
  // }, [formValues]);

  //if (isLoading || isFetching) return;

  return (
    <div>
      <h1 className='text-2xl font-bold'>
        {mode === 'NEW' ? 'Nuevo alquiler' : 'Editar alquiler'}
      </h1>
      {isLoading || isFetching ? (
        <div className='mt-20 flex items-center justify-center'>
          <LoaderIcon className='h-8 w-8 animate-spin' />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            <div className='mt-8 grid grid-cols-2 gap-x-12 gap-y-8 px-20'>
              <PropertiesDropdown
                label='Propiedad'
                name='propertyId'
                form={form}
                className='w-full'
                onChange={(e) => {
                  console.log('e', e);
                }}
              />

              <InputDatePicker
                label='Fecha de firma'
                name='signedDate'
                form={form}
                className='w-full'
              />

              <div className='flex items-end justify-center gap-4'>
                <PartiesDropdown
                  label='Inquilino'
                  name='tenantId'
                  typePartie='TENANT'
                  form={form}
                  className='w-full'
                />

                <Button type='button' className='mb-1' onClick={() => setModalIsOpen(true)}>
                  <PlusIcon className='h-4 w-4' />
                </Button>
              </div>

              <PartiesDropdown
                label='Propietario'
                name='ownerId'
                typePartie='OWNER'
                form={form}
                className='w-full'
              />

              {(form.watch('guarantors')?.length || 0) === 0 && <div className='h-[64px]'></div>}

              {form.watch('guarantors')?.map((guarantor, index) => (
                <div key={index} className='flex items-end justify-center gap-4'>
                  <PartiesDropdown
                    label='Garante'
                    name={`guarantors[${index}]`}
                    typePartie='GUARANTOR'
                    form={form}
                    className='w-full'
                  />
                  <Button type='button' className='mb-1' onClick={() => setModalIsOpen(true)}>
                    <PlusIcon className='h-4 w-4' />
                  </Button>
                  <Button
                    type='button'
                    className='mb-1'
                    variant='destructive'
                    onClick={() => handleDeleteGuarantor(index)}
                  >
                    <TrashIcon className='h-4 w-4' />
                  </Button>
                </div>
              ))}

              {(form.watch('guarantors')?.length || 0) < 2 && (
                <div className='mb-1 flex w-full items-end justify-center gap-4'>
                  <Button
                    className='w-full'
                    type='button'
                    onClick={() => handleAddGuarantor()}
                    disabled={
                      (form.getValues('guarantors')?.length || 0) >= 2 ||
                      (form.getValues('guarantors')?.includes('') ?? false)
                    }
                  >
                    Agregar garante
                  </Button>
                </div>
              )}

              <WordTemplatesDropdown
                label='Plantilla de Word'
                name='wordTemplateId'
                form={form}
                className='w-full'
              />

              <Button type='button' className='mb-1' onClick={() => setContractModalIsOpen(true)}>
                Generar contrato
              </Button>

              <InputNumberField
                label='Duración del contrato (años)'
                name='contractDurationYears'
                form={form}
                className='w-full'
                regExp={/^[1-3]$/}
                onChangeInputNumberField={(e) => {
                  const value = e.target.value;
                  const endDate = new Date(form.getValues('startDate'));
                  endDate.setFullYear(endDate.getFullYear() + Number(value));
                  form.setValue('endDate', endDate);
                }}
              />

              <div className='flex items-end justify-center gap-4'>
                <InputDatePicker
                  label='Fecha de inicio'
                  name='startDate'
                  form={form}
                  className='w-full'
                  onChangeDatePickerField={(e) => {
                    const value = e;
                    const endDate = new Date(value);
                    endDate.setFullYear(
                      endDate.getFullYear() + Number(form.getValues('contractDurationYears'))
                    );
                    form.setValue('endDate', endDate);
                  }}
                />

                <InputDatePicker
                  label='Fecha de fin'
                  name='endDate'
                  form={form}
                  className='w-full'
                />
              </div>

              <InputNumberField
                label='Actualización de precio (meses)'
                name='rentUpdateMonths'
                form={form}
                className='w-full'
                regExp={/^[1-6]$/}
              />

              <div className='flex items-end justify-center gap-4'>
                <InputNumberField
                  label='Tasa de penalización (%)'
                  name='penaltyRate'
                  form={form}
                  className='w-full'
                  regExp={/^(0|(0,\d{0,2})|([1-9]\d{0,2})(,\d{0,2})?)?$/}
                />
                <InputNumberField
                  label='Tasa de rescisión (%)'
                  name='rescissionRate'
                  form={form}
                  className='w-full'
                  regExp={/^(0|(0,\d{0,2})|([1-9]\d{0,2})(,\d{0,2})?)?$/}
                />
              </div>

              <TypeIndexationDropdown
                label='Tipo de indexación'
                name='indexationType'
                form={form}
                className='w-full'
              />

              <RentalStatusDropdown label='Estado' name='status' form={form} className='w-full' />

              <div className='flex flex-col items-start justify-start gap-4'>
                <InputNumberField
                  name='deposit'
                  className='w-full'
                  label='Depósito'
                  labelClassName='font-normal text-neutral-900'
                  placeholder='Depósito'
                  form={form}
                  regExp={/^(0|(0,\d{0,2})|([1-9]\d{0,8})(,\d{0,2})?)?$/}
                />

                <TypePaymentMethodDropdown
                  label='Método de pago'
                  name='paymentMethod'
                  form={form}
                  className='w-full'
                />

                <InputNumberField
                  label='Precio'
                  name='initialRent'
                  form={form}
                  className='w-full'
                  regExp={/^(0|(0,\d{0,2})|([1-9]\d{0,8})(,\d{0,2})?)?$/}
                />
                <BooleanCheckbox
                  label='Factura?'
                  name='billing'
                  form={form}
                  className='ml-0 w-full pl-0'
                  labelClassName='font-normal text-neutral-900'
                />
              </div>

              <ImageUpload label='Contrato' name='contractUrl' form={form} />

              <TextareaField
                label='Observaciones'
                name='observation'
                form={form}
                className='col-span-2 w-full'
              />
            </div>

            <div className='col-span-2 flex justify-end gap-8 pt-10'>
              <Button
                type='button'
                onClick={() => router.back()}
                variant='outline'
                className='min-w-[150px]'
                disabled={
                  createRentalMutation.isPending ||
                  updateRentalMutation.isPending ||
                  !form.formState.isDirty
                }
              >
                Cancelar
              </Button>
              <SubmitButton
                text={mode === 'NEW' ? 'Generar alquiler' : 'Guardar'}
                className='min-w-[150px]'
                isLoading={createRentalMutation.isPending || updateRentalMutation.isPending}
                disabled={
                  createRentalMutation.isPending ||
                  updateRentalMutation.isPending ||
                  !form.formState.isDirty
                }
              />
            </div>
          </form>
        </Form>
      )}
      {modalIsOpen && (
        <Modal open={modalIsOpen} closeModal={() => setModalIsOpen(false)} party={null} />
      )}

      {contractModalIsOpen && (
        <ContractModalGenerate
          open={contractModalIsOpen}
          onClose={() => setContractModalIsOpen(false)}
          form={form}
        />
      )}
    </div>
  );
};

export { EditRentalPage };
