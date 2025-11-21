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
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/custom/input-field';
import { SubmitButton } from '@/components/ui/custom/submit-button';
import TextareaField from '@/components/ui/custom/textarea-field';
import BooleanCheckbox from '@/components/ui/custom/boolean-checkbox';
import InputNumberField from '@/components/ui/custom/input-number-field';
import { propertyFormSchema } from '@/shared/schemas';
import { Property } from '@/shared/types';
import { PropertyStatus } from '@/lib/generated/prisma/client';
import { useCreateProperty, useUpdateProperty } from '@/hooks/use-properties';
import { TypePropertyStatusDropdown } from '@/components/ui/dropdowns/TypePropertyStatusDropdown';

interface ModalProps {
  open: boolean;
  closeModal: () => void;
  property: Property | null;
}

const defaultValues = {
  parcelId: '',
  name: '',
  status: 'ACTIVE' as PropertyStatus,
  nisElektrik: '',
  gas: '',
  abl: '',
  absa: '',
  address: '',
  bedrooms: '1',
  bathrooms: '1',
  hasPool: false,
  hasGarage: false,
  hasGarden: false,
  hasKitchen: false,
  hasExpenses: false,
  squareMeters: '',
  owner: '',
  description: '',
  refaccionYear: '',
};

const Modal = ({ open, closeModal, property }: ModalProps) => {
  const mode = property ? 'EDIT' : 'CREATE';

  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();

  const form = useForm<z.infer<typeof propertyFormSchema>>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (property) {
      const newProperty = {
        ...property,
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        squareMeters: property.squareMeters.toString(),
        refaccionYear: property.refaccionYear.toString(),
      };
      form.reset(newProperty);
    }
  }, [property, form]);

  const onSubmit = async (values: z.infer<typeof propertyFormSchema>) => {
    const valuesToSubmit = {
      ...values,
      bedrooms: parseInt(values.bedrooms),
      bathrooms: parseInt(values.bathrooms),
      squareMeters: parseInt(values.squareMeters),
      refaccionYear: parseInt(values.refaccionYear),
      nisElektrik: values.nisElektrik || '',
      gas: values.gas || '',
      abl: values.abl || '',
      absa: values.absa || '',
    };
    if (mode === 'CREATE') {
      await createPropertyMutation.mutateAsync(valuesToSubmit);
      closeModal();
    } else {
      await updatePropertyMutation.mutateAsync({
        id: property?.id || '',
        data: valuesToSubmit,
      });
      closeModal();
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof propertyFormSchema>>) => {
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
              {mode === 'CREATE' ? 'Nueva propiedad' : `Editar propiedad ${form.watch('name')}`}
            </DialogTitle>
            <DialogDescription />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                <div className='mt-4 grid grid-cols-2 gap-x-12 gap-y-8'>
                  <InputField
                    label='Nombre'
                    name='name'
                    placeholder='Nombre de la propiedad'
                    form={form}
                  />

                  <TypePropertyStatusDropdown label='Estado' name='status' form={form} />

                  <InputField label='Partida' name='parcelId' placeholder='Parcela' form={form} />

                  <InputField
                    label='Dirección'
                    name='address'
                    placeholder='Dirección'
                    form={form}
                  />

                  <InputField
                    label='Propietario'
                    name='owner'
                    placeholder='Propietario'
                    form={form}
                  />

                  <InputField
                    label='NIS'
                    name='nisElektrik'
                    placeholder='NIS (Electricidad)'
                    form={form}
                  />

                  <InputField label='Gas' name='gas' placeholder='Gas' form={form} />

                  <InputField label='ABL' name='abl' placeholder='ABL' form={form} />

                  <InputField label='ABSA' name='absa' placeholder='ABSA' form={form} />

                  <TextareaField
                    label='Descripción'
                    name='description'
                    placeholder='Descripción'
                    form={form}
                    className='col-span-2'
                  />

                  <InputNumberField
                    label='Número de habitaciones'
                    name='bedrooms'
                    placeholder='Número de habitaciones'
                    form={form}
                    integerDigits={10}
                  />

                  <InputNumberField
                    label='Año de refacción'
                    name='refaccionYear'
                    placeholder='Año de refacción'
                    form={form}
                    integerDigits={4}
                  />

                  <InputNumberField
                    label='Número de baños'
                    name='bathrooms'
                    placeholder='Número de baños'
                    form={form}
                    integerDigits={10}
                    decimalDigits={2}
                  />

                  <InputNumberField
                    label='Superficie'
                    name='squareMeters'
                    placeholder='Superficie'
                    form={form}
                    integerDigits={10}
                    decimalDigits={2}
                  />

                  <div className='flex gap-4'>
                    <BooleanCheckbox label='Tiene piscina' name='hasPool' form={form} />
                    <BooleanCheckbox label='Tiene garaje' name='hasGarage' form={form} />
                  </div>
                  <div className='flex gap-4'>
                    <BooleanCheckbox label='Tiene jardín' name='hasGarden' form={form} />
                    <BooleanCheckbox label='Tiene cocina' name='hasKitchen' form={form} />
                  </div>
                  <div className='flex gap-4'>
                    <BooleanCheckbox label='Tiene expensas' name='hasExpenses' form={form} />
                  </div>

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
                      text={mode === 'CREATE' ? 'Crear propiedad' : 'Guardar'}
                      className='min-w-[150px]'
                      isLoading={
                        createPropertyMutation.isPending || updatePropertyMutation.isPending
                      }
                      disabled={
                        createPropertyMutation.isPending ||
                        updatePropertyMutation.isPending ||
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
