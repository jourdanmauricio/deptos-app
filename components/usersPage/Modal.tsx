import z from 'zod';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, useForm } from 'react-hook-form';

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from '@/components/ui/dialog';
import { User } from '@/shared/types';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/lib/generated/prisma';
import { userFormSchema } from '@/shared/schemas';
import { InputField } from '@/components/ui/custom/input-field';
import { SubmitButton } from '@/components/ui/custom/submit-button';
import { RolesDropdown } from '@/components/ui/dropdowns/RolesDropdown';
import { useCreateUser, useUpdateUserDetails } from '@/hooks/use-users';

interface ModalProps {
  open: boolean;
  closeModal: () => void;
  user: User | null;
}

const defaultValues = {
  email: '',
  name: '',
  role: 'USER' as UserRole,
  password: '',
  phone: '',
  address: '',
  cbu: '',
};

const Modal = ({ open, closeModal, user }: ModalProps) => {
  const mode = user ? 'EDIT' : 'CREATE';

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUserDetails();

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (user) {
      form.reset({
        email: user?.email || '',
        name: user?.name || '',
        role: user?.role || ('USER' as UserRole),
        password: '',
        phone: user?.userDetails?.phone || '',
        address: user?.userDetails?.address || '',
        cbu: user?.userDetails?.cbu || '',
        alias: user?.userDetails?.alias || '',
        bank: user?.userDetails?.bank || '',
        bankAccountNumber: user?.userDetails?.bankAccountNumber || '',
        avatar: user?.userDetails?.avatar || '',
      });
    } else {
      form.reset(defaultValues);
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
    if (mode === 'CREATE') {
      await createUserMutation.mutateAsync(values);
      closeModal();
    } else {
      await updateUserMutation.mutateAsync({
        id: user?.id || '',
        data: values,
      });
      closeModal();
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof userFormSchema>>) => {
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
              {mode === 'CREATE' ? 'Nuevo usuario' : `Editar usuario ${form.watch('name')}`}
            </DialogTitle>
            <DialogDescription />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                <div className='mt-4 grid grid-cols-2 gap-x-12 gap-y-8'>
                  <InputField
                    label='Nombre'
                    name='name'
                    placeholder='Nombre del usuario'
                    form={form}
                  />
                  <InputField label='Email' name='email' placeholder='Email' form={form} />

                  <RolesDropdown label='Rol' name='role' form={form} />

                  <InputField label='Password' name='password' placeholder='Password' form={form} />

                  <InputField label='Teléfono' name='phone' placeholder='Teléfono' form={form} />

                  <InputField
                    label='Dirección'
                    name='address'
                    placeholder='Dirección'
                    form={form}
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
                      text={mode === 'CREATE' ? 'Crear usuario' : 'Guardar'}
                      className='min-w-[150px]'
                      isLoading={form.formState.isSubmitting}
                      disabled={form.formState.isSubmitting || !form.formState.isDirty}
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
