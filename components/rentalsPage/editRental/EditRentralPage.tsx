'use client';

import z from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, useForm } from 'react-hook-form';
import { useEffect, useState, useTransition } from 'react';
import { LoaderIcon, PlusIcon, TrashIcon } from 'lucide-react';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { rentalFormSchema } from '@/shared/schemas';
import { Modal } from '@/components/partiesPage/Modal';
import { ContractModalGenerate } from '../ContractModalGenerate';
import TextareaField from '@/components/ui/custom/textarea-field';
import { SubmitButton } from '@/components/ui/custom/submit-button';
import BooleanCheckbox from '@/components/ui/custom/boolean-checkbox';
import InputNumberField from '@/components/ui/custom/input-number-field';
import ImageUpload from '@/components/ui/custom/image-upload/ImageUpload';
import { InputDatePicker } from '@/components/ui/custom/input-date-picker';
import { PartiesDropdown } from '@/components/ui/dropdowns/PartiesDropdown';
import { useCreateRental, useUpdateRental, useRental } from '@/hooks/use-rentals';
import { PropertiesDropdown } from '@/components/ui/dropdowns/PropertiesDropdown';
import { IndexationType, PaymentMethod, RentalStatus } from '@/lib/generated/prisma/client';
import { RentalStatusDropdown } from '@/components/ui/dropdowns/RentalStatusDropdown';
import { WordTemplatesDropdown } from '@/components/ui/dropdowns/WordTemplatesDropdown';
import { TypeIndexationDropdown } from '@/components/ui/dropdowns/TypeIndexationDropdown';
import { TypePaymentMethodDropdown } from '@/components/ui/dropdowns/TypePaymentMethodDropdown';

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
  startDate: (() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1, 1);
    return date;
  })(),
  endDate: (() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1, 1);
    date.setFullYear(date.getFullYear() + 2);
    return date;
  })(),
  terminationDate: undefined,
  initialRent: '',
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
  wordTemplateId: '1', // Sin plantilla
  contractContent: '',
};

const EditRentalPage = ({ rentalId }: EditRentalPageProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [contractModalIsOpen, setContractModalIsOpen] = useState(false);
  const [_, startTransition] = useTransition();

  const { data: rental, isLoading, isFetching, error } = useRental(rentalId);

  const mode = rentalId === 'new' ? 'NEW' : 'EDIT';

  const router = useRouter();

  const createRentalMutation = useCreateRental();
  const updateRentalMutation = useUpdateRental();

  const form = useForm<z.infer<typeof rentalFormSchema>>({
    resolver: zodResolver(rentalFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (error) {
      toast.error('Error al cargar el alquiler');
    }
  }, [error]);

  useEffect(() => {
    if (rental && !isLoading && !isFetching) {
      // Usar startTransition para manejar la actualización del estado de forma segura
      startTransition(() => {
        form.reset({
          propertyId: rental.propertyId,
          tenantId: rental.tenantId,
          guarantors: rental.guarantors?.map((guarantor: { id: string }) => guarantor.id) || [],
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
          wordTemplateId: rental.wordTemplateId?.toString() || '',
          contractContent: rental.contractContent || '',
        });
      });
    }
  }, [rental, isLoading, isFetching, form]);

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
      wordTemplateId: values.wordTemplateId ? Number(values.wordTemplateId) : null,
      contractContent: values.contractContent || '',
    };

    try {
      if (mode === 'NEW') {
        createRentalMutation.mutate(valuesToSubmit);
        router.push('/dashboard/rentals');
      } else {
        if (rental?.id) {
          updateRentalMutation.mutate({
            id: rental.id,
            data: valuesToSubmit,
          });
        }
        router.push('/dashboard/rentals');
      }
    } catch (error) {
      console.error('Error en submit:', error);
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof rentalFormSchema>>) => {
    console.log('errors', errors);
  };

  const handleViewContract = async () => {
    await form.trigger();
    let errorMessage = '';

    if (form.formState.errors.propertyId) {
      errorMessage += 'propiedad, ';
    }
    if (form.formState.errors.tenantId) {
      errorMessage += 'inquilino, ';
    }
    if (form.formState.errors.ownerId) {
      errorMessage += 'propietario, ';
    }
    if (form.formState.errors.initialRent) {
      errorMessage += 'precio inicial, ';
    }
    if (form.watch('wordTemplateId') === '') {
      errorMessage += 'plantilla de word, ';
    }

    if (errorMessage.length > 0) {
      errorMessage = 'Debe completar los siguientes campos: ' + errorMessage.slice(0, -2);
    }

    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    setContractModalIsOpen(true);
  };

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
            <div className='mt-8 grid grid-cols-2 gap-x-12 gap-y-8 px-10 lg:px-20'>
              <PropertiesDropdown
                label='Propiedad'
                name='propertyId'
                form={form}
                className='w-full'
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

              {form.watch('guarantors')?.length === 2 && <div className='h-[64px]'></div>}

              {(form.watch('guarantors')?.length || 0) < 3 && (
                <div className='mb-1 flex w-full items-end justify-center gap-4'>
                  <Button
                    className='w-full'
                    type='button'
                    onClick={() => handleAddGuarantor()}
                    disabled={
                      (form.getValues('guarantors')?.length || 0) >= 3 ||
                      (form.getValues('guarantors')?.includes('') ?? false)
                    }
                  >
                    Agregar garante
                  </Button>
                </div>
              )}
              {form.watch('guarantors')?.length === 3 && <div className='h-[64px]'></div>}

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
                  placeholder='Precio inicial'
                  regExp={/^(0|(0,\d{0,2})|([1-9]\d{0,8})(,\d{0,2})?)?$/}
                  onChangeInputNumberField={() => {
                    form.clearErrors('initialRent');
                  }}
                />

                <BooleanCheckbox
                  label='Factura?'
                  name='billing'
                  form={form}
                  className='ml-0 w-full pl-0'
                />
              </div>

              <ImageUpload label='Contrato' name='contractUrl' form={form} />

              <TextareaField
                label='Observaciones'
                name='observation'
                form={form}
                className='col-span-2 w-full'
              />

              <WordTemplatesDropdown
                label='Plantilla modelo (template)'
                name='wordTemplateId'
                form={form}
                className='w-full'
              />

              <Button type='button' className='mb-1 self-end' onClick={handleViewContract}>
                Editar contrato
              </Button>
            </div>

            <div className='col-span-2 flex justify-end gap-8 pt-10'>
              <Button
                type='button'
                onClick={() => router.back()}
                variant='outline'
                className='min-w-[150px]'
                disabled={createRentalMutation.isPending || updateRentalMutation.isPending}
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
