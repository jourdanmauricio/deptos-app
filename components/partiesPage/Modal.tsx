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
import { partyFormSchema } from '@/shared/schemas';
import { Party } from '@/shared/types';
import { useCreateParty, useUpdateParty } from '@/hooks/use-parties';
import { TypePartiesDropdown } from '@/components/ui/dropdowns/TypePartiesDropdown';
import ImageUpload from '@/components/ui/custom/image-upload/ImageUpload';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '@/lib/actions/media';

interface ModalProps {
  open: boolean;
  closeModal: () => void;
  party: Party | null;
}

const defaultValues = {
  name: '',
  lastName: '',
  address: '',
  type: 'TENANT' as Party['type'],
  dni: '',
  cuil: '',
  phone: '',
  email: '',
  description: '',
  job: '',
  documentFront: '',
  documentBack: '',
  bank: '',
  accountNumber: '',
  cbu: '',
  alias: '',
};

const Modal = ({ open, closeModal, party }: ModalProps) => {
  const mode = party ? 'EDIT' : 'CREATE';

  const createPartyMutation = useCreateParty();
  const updatePartyMutation = useUpdateParty();

  const form = useForm<z.infer<typeof partyFormSchema>>({
    resolver: zodResolver(partyFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (party) {
      form.reset({
        ...party,
        cuil: party.cuil ?? '',
        lastName: party.lastName ?? '',
        documentFront: party.documentFront ?? '',
        documentBack: party.documentBack ?? '',
        bank: party.bank ?? '',
        accountNumber: party.accountNumber ?? '',
        cbu: party.cbu ?? '',
        alias: party.alias ?? '',
      });
    }
  }, [party, form]);

  const onSubmit = async (values: z.infer<typeof partyFormSchema>) => {
    try {
      const partyName = values.name.trim().toLowerCase().replace(/\s+/g, '-');
      const folderPath = `parties/${partyName}`;

      let documentFrontUrl: string | null = null;
      let documentBackUrl: string | null = null;
      let oldDocumentFrontUrl: string | null = null;
      let oldDocumentBackUrl: string | null = null;

      // Manejar documentFront
      if (values.documentFront instanceof File) {
        // Es un archivo nuevo, subirlo a Cloudinary
        documentFrontUrl = await uploadImageToCloudinary(values.documentFront, folderPath);
        // Si estamos editando y había una imagen anterior, eliminarla
        if (mode === 'EDIT' && party?.documentFront) {
          oldDocumentFrontUrl = party.documentFront;
        }
      } else if (typeof values.documentFront === 'string') {
        if (values.documentFront) {
          // Es una URL existente, mantenerla
          documentFrontUrl = values.documentFront;
        } else {
          // Campo vacío (eliminado por el usuario)
          if (mode === 'EDIT' && party?.documentFront) {
            oldDocumentFrontUrl = party.documentFront;
          }
          documentFrontUrl = null;
        }
      } else {
        // undefined - mantener la imagen existente si estamos editando
        if (mode === 'EDIT') {
          documentFrontUrl = party?.documentFront ?? null;
        } else {
          documentFrontUrl = null;
        }
      }

      // Manejar documentBack
      if (values.documentBack instanceof File) {
        // Es un archivo nuevo, subirlo a Cloudinary
        documentBackUrl = await uploadImageToCloudinary(values.documentBack, folderPath);
        // Si estamos editando y había una imagen anterior, eliminarla
        if (mode === 'EDIT' && party?.documentBack) {
          oldDocumentBackUrl = party.documentBack;
        }
      } else if (typeof values.documentBack === 'string') {
        if (values.documentBack) {
          // Es una URL existente, mantenerla
          documentBackUrl = values.documentBack;
        } else {
          // Campo vacío (eliminado por el usuario)
          if (mode === 'EDIT' && party?.documentBack) {
            oldDocumentBackUrl = party.documentBack;
          }
          documentBackUrl = null;
        }
      } else {
        // undefined - mantener la imagen existente si estamos editando
        if (mode === 'EDIT') {
          documentBackUrl = party?.documentBack ?? null;
        } else {
          documentBackUrl = null;
        }
      }

      const data = {
        ...values,
        email: values.email || '',
        description: values.description || '',
        job: values.job || '',
        documentFront: documentFrontUrl,
        documentBack: documentBackUrl,
        bank: values.bank || '',
        accountNumber: values.accountNumber || '',
        cbu: values.cbu || '',
        alias: values.alias || '',
        cuil: values.cuil || '',
      };

      if (mode === 'CREATE') {
        await createPartyMutation.mutateAsync(data);
      } else {
        await updatePartyMutation.mutateAsync({
          id: party?.id || '',
          data,
        });

        // Eliminar imágenes antiguas después de actualizar exitosamente
        if (oldDocumentFrontUrl && oldDocumentFrontUrl !== documentFrontUrl) {
          await deleteImageFromCloudinary(oldDocumentFrontUrl);
        }
        if (oldDocumentBackUrl && oldDocumentBackUrl !== documentBackUrl) {
          await deleteImageFromCloudinary(oldDocumentBackUrl);
        }
      }

      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof partyFormSchema>>) => {
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
              {mode === 'CREATE' ? 'Nuevo tercero' : `Editar tercero ${form.watch('name')}`}
            </DialogTitle>
            <DialogDescription />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                <div className='mt-4 grid grid-cols-2 gap-x-12 gap-y-8'>
                  <InputField label='Nombres' name='name' placeholder='Nombres' form={form} />
                  <InputField
                    label='Apellidos'
                    name='lastName'
                    placeholder='Apellidos'
                    form={form}
                  />
                  <InputField
                    label='Dirección'
                    name='address'
                    placeholder='Dirección'
                    form={form}
                  />

                  <div className='flex gap-8'>
                    <InputField label='DNI' name='dni' placeholder='DNI' form={form} />
                    <InputField label='CUIL' name='cuil' placeholder='CUIL' form={form} />
                  </div>

                  <InputField label='Teléfono' name='phone' placeholder='Teléfono' form={form} />

                  <InputField label='Email' name='email' placeholder='Email' form={form} />

                  <InputField label='Trabajo' name='job' placeholder='Trabajo' form={form} />

                  <TypePartiesDropdown label='Tipo de tercero' name='type' form={form} />

                  {form.watch('type') !== 'OWNER' && (
                    <>
                      <ImageUpload label='Documento frente' name='documentFront' form={form} />
                      <ImageUpload label='Documento dorso' name='documentBack' form={form} />
                    </>
                  )}

                  {form.watch('type') === 'OWNER' && (
                    <>
                      <InputField label='Banco' name='bank' placeholder='Banco' form={form} />
                      <InputField
                        label='Número de cuenta'
                        name='accountNumber'
                        placeholder='Número de cuenta'
                        form={form}
                      />
                      <InputField label='CBU' name='cbu' placeholder='CBU' form={form} />
                      <InputField label='Alias' name='alias' placeholder='Alias' form={form} />
                    </>
                  )}

                  <TextareaField
                    label='Descripción'
                    name='description'
                    placeholder='Descripción'
                    form={form}
                    className='col-span-2'
                  />

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
                      text={mode === 'CREATE' ? 'Crear tercero' : 'Guardar'}
                      className='min-w-[150px]'
                      isLoading={createPartyMutation.isPending || updatePartyMutation.isPending}
                      disabled={
                        createPartyMutation.isPending ||
                        updatePartyMutation.isPending ||
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
