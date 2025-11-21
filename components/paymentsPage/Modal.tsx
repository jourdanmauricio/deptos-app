import z from 'zod';
import { useEffect } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from '@/components/ui/dialog';
import { PaymentConcept, PaymentMethod, PaymentStatus } from '@/lib/generated/prisma/client';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Payment } from '@/shared/types/payment';
import { paymentFormSchema } from '@/shared/schemas';
import { InputField } from '@/components/ui/custom/input-field';
import TextareaField from '@/components/ui/custom/textarea-field';
import { SubmitButton } from '@/components/ui/custom/submit-button';
import TenantsCombobox from '@/components/ui/combobox/tenants-combobox';
import InputNumberField from '@/components/ui/custom/input-number-field';
import ImageUpload from '@/components/ui/custom/image-upload/ImageUpload';
import { useCreatePayment, useUpdatePayment } from '@/hooks/use-payments';
import { InputDatePicker } from '@/components/ui/custom/input-date-picker';
import { PropertiesDropdown } from '@/components/ui/dropdowns/PropertiesDropdown';
import { PaymentConceptsDropdown } from '@/components/ui/dropdowns/PaymentConceptsDropdown';
import { TypePaymentStatusDropdown } from '@/components/ui/dropdowns/TypePaymentStatusDropdown';
import { TypePaymentMethodDropdown } from '@/components/ui/dropdowns/TypePaymentMethodDropdown';
import { endOfMonth } from 'date-fns';
import { uploadImageToCloudinary } from '@/lib/actions/media';

interface ModalProps {
  open: boolean;
  closeModal: () => void;
  payment: Payment | null;
}

const defaultValues = {
  propertyId: '',
  tenantId: '',
  rentalId: '',
  amount: '',
  penalty: '',
  total: '',
  concept: 'RENT' as PaymentConcept,
  paidDate: new Date(),
  status: 'PENDING' as PaymentStatus,
  paymentMethod: 'CASH' as PaymentMethod,
  referenceNumber: '',
  imageUrl: '',
  notes: '',
  // primer dia del mes actual
  periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  // ultimo dia del mes actual
  periodEnd: endOfMonth(new Date()),
  periodMonth: (new Date().getMonth() + 1).toString(),
};

const Modal = ({ open, closeModal, payment }: ModalProps) => {
  const mode = payment ? 'EDIT' : 'CREATE';

  const createPaymentMutation = useCreatePayment();
  const updatePaymentMutation = useUpdatePayment();

  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (payment) {
      const newPayment = {
        propertyId: payment.rental?.propertyId || '',
        tenantId: payment.rental?.tenantId || '',
        rentalId: payment.rentalId,
        amount: payment.amount?.toString() || '',
        penalty: payment.penalty ? payment.penalty.toString() : '0',
        total: payment.total
          ? (+payment.total + (payment?.penalty ? payment.penalty : 0)).toString()
          : '0',
        concept: payment.concept,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        paidDate: payment.paidDate || new Date(),
        periodStart:
          payment.periodStart || new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        periodEnd: payment.periodEnd || endOfMonth(new Date()),
        periodMonth: (payment.periodMonth || new Date().getMonth() + 1).toString(),
        imageUrl: payment.imageUrl || '',
        notes: payment.notes || undefined,
        referenceNumber: payment.referenceNumber || undefined,
      };
      form.reset(newPayment);
    }
  }, [payment, form]);

  const onSubmit = async (values: z.infer<typeof paymentFormSchema>) => {
    try {
      const folderPath = `parties/${payment?.rental?.tenant?.name}-${payment?.rental?.tenant?.lastName}/pagos`;

      let imageUrl: string | null = null;
      // let oldImageUrl: string | null = null;

      if (values.imageUrl instanceof File) {
        // Es un archivo nuevo, subirlo a Cloudinary
        imageUrl = await uploadImageToCloudinary(values.imageUrl, folderPath);
        // Si estamos editando y había una imagen anterior, eliminarla
        if (mode === 'EDIT' && payment?.imageUrl) {
          // oldImageUrl = payment.imageUrl;
        }
      } else if (typeof values.imageUrl === 'string') {
        if (values.imageUrl) {
          // Es una URL existente, mantenerla
          imageUrl = values.imageUrl;
        } else {
          // Campo vacío (eliminado por el usuario)
          if (mode === 'EDIT' && payment?.imageUrl) {
            // oldImageUrl = payment.imageUrl;
          }
          imageUrl = null;
        }
      } else {
        // undefined - mantener la imagen existente si estamos editando
        if (mode === 'EDIT') {
          imageUrl = payment?.imageUrl ?? null;
        } else {
          imageUrl = null;
        }
      }

      const valuesToSubmit = {
        rentalId: values.rentalId,
        amount: parseFloat(values.amount),
        penalty: values.penalty ? parseFloat(values.penalty) : null,
        total: values.total ? parseFloat(values.total) : null,
        concept: values.concept as PaymentConcept,
        status: values.status as PaymentStatus,
        paymentMethod: values.paymentMethod as PaymentMethod,
        paidDate: values.paidDate,
        referenceNumber: values.referenceNumber || '',
        imageUrl,
        receiptUrl: null,
        notes: values.notes || '',
        periodStart: values.periodStart || '',
        periodEnd: values.periodEnd || '',
        periodMonth: +values.periodMonth || new Date().getMonth() + 1,
      };
      // Si se sube un archivo, se sube a Cloudinary y se guarda la URL en imageUrl

      if (mode === 'CREATE') {
        await createPaymentMutation.mutateAsync(valuesToSubmit);
        closeModal();
      } else {
        await updatePaymentMutation.mutateAsync({
          id: payment?.id || '',
          data: valuesToSubmit,
        });
        closeModal();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof paymentFormSchema>>) => {
    console.log(errors);
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent
        className='max-h-[95%] overflow-auto'
        style={{
          minWidth: '600px',
          maxWidth: '900px',
        }}
      >
        <div style={{ minWidth: '600px' }}>
          <DialogHeader>
            <DialogTitle className='dialog-title'>
              {mode === 'CREATE'
                ? 'Nuevo pago'
                : `Editar pago ${form.getValues('periodStart')?.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })} 
                - ${form.getValues('periodEnd')?.toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}`}
            </DialogTitle>
            <DialogDescription />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                <div className='mt-4 grid grid-cols-2 gap-x-12 gap-y-8'>
                  <PropertiesDropdown
                    label='Propiedad'
                    name='propertyId'
                    form={form}
                    className='w-full'
                    placeholder='Seleccione una propiedad'
                    disabled={mode === 'EDIT'}
                  />
                  <TenantsCombobox
                    label='Inquilino'
                    name='tenantId'
                    form={form}
                    className='w-full'
                    placeholder='Seleccione un inquilino'
                    disabled={mode === 'EDIT'}
                  />

                  <PaymentConceptsDropdown
                    label='Concepto'
                    name='concept'
                    form={form}
                    className='w-full'
                    placeholder='Seleccione un concepto'
                    disabled={mode === 'EDIT'}
                  />

                  <TypePaymentStatusDropdown label='Estado' name='status' form={form} />

                  <InputNumberField label='Monto' name='amount' form={form} className='w-full' />

                  <InputNumberField
                    label='Penalidad'
                    name='penalty'
                    form={form}
                    className='w-full'
                  />

                  <InputNumberField label='Total' name='total' form={form} className='w-full' />

                  <InputDatePicker
                    label='Fecha de pago'
                    name='paidDate'
                    form={form}
                    className='w-full'
                  />
                  <TypePaymentMethodDropdown
                    label='Método de pago'
                    name='paymentMethod'
                    form={form}
                    className='w-full'
                  />

                  <InputField
                    label='Número de referencia'
                    name='referenceNumber'
                    form={form}
                    className='w-full'
                  />

                  <InputNumberField
                    label='Mes'
                    name='periodMonth'
                    form={form}
                    className='w-full'
                    regExp={/^[1-9]$|^1[0-2]$/}
                    disabled={mode === 'EDIT'}
                  />

                  <div className='flex gap-4'>
                    <InputDatePicker
                      label='Fecha de inicio'
                      name='periodStart'
                      form={form}
                      className='w-full'
                      disabled={mode === 'EDIT'}
                    />
                    <InputDatePicker
                      label='Fecha de fin'
                      name='periodEnd'
                      form={form}
                      className='w-full'
                      disabled={mode === 'EDIT'}
                    />
                  </div>

                  <TextareaField
                    label='Observaciones'
                    name='notes'
                    form={form}
                    className='col-span-2 w-full'
                  />

                  <ImageUpload label='Recibo' name='imageUrl' form={form} />

                  <div className='col-span-2 flex justify-end gap-8 pt-10'>
                    <Button
                      type='button'
                      onClick={closeModal}
                      variant='outline'
                      className='min-w-[150px]'
                    >
                      Cancelar
                    </Button>
                    <SubmitButton
                      text={mode === 'CREATE' ? 'Crear pago' : 'Guardar'}
                      className='min-w-[150px]'
                      isLoading={createPaymentMutation.isPending || updatePaymentMutation.isPending}
                      disabled={
                        createPaymentMutation.isPending ||
                        updatePaymentMutation.isPending ||
                        !form.formState.isDirty
                      }
                    />
                  </div>
                </div>
              </form>
            </Form>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { Modal };
