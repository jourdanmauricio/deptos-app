import z from 'zod';
import { useEffect, useRef, useState } from 'react';
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
import { wordTemplateFormSchema } from '@/shared/schemas';
import { WordTemplate } from '@/shared/types';
import { TypeWordTemplatesDropdown } from '@/components/ui/dropdowns/TypeWordTemplatesDropdown';
import { useCreateWordTemplate, useUpdateWordTemplate } from '@/hooks/use-word-templates';
import { Variables } from './Variables';

interface ModalProps {
  open: boolean;
  closeModal: () => void;
  template: WordTemplate | null;
}

const defaultValues = {
  name: '',
  description: '',
  type: 'RENTAL_CONTRACT_HOME' as WordTemplate['type'],
  content: '',
  variables: [],
};

const Modal = ({ open, closeModal, template }: ModalProps) => {
  const [textareaCursorPosition, setTextareaCursorPosition] = useState<number | undefined>(
    undefined
  );
  const mode = template ? 'EDIT' : 'CREATE';

  const cursorPositionRef = useRef<number>(-1);
  const originExpression = useRef<string | null>(null);

  const createWordTemplateMutation = useCreateWordTemplate();
  const updateWordTemplateMutation = useUpdateWordTemplate();

  const form = useForm<z.infer<typeof wordTemplateFormSchema>>({
    resolver: zodResolver(wordTemplateFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (template) {
      form.reset({
        ...template,
        variables: template.variables as string[],
      });
    }
  }, [template, form]);

  useEffect(() => {
    originExpression.current = form.getValues('content');
  }, [form.getValues('content')]);

  const handleAddData = (param: string) => {
    const value = `{{${param}}}`;

    form.clearErrors('content');

    const currentText = form.getValues('content') || '';
    let newText;

    if (cursorPositionRef.current === -1) cursorPositionRef.current = currentText.length;

    if (currentText.length === 0) {
      newText = value + ' ';
      cursorPositionRef.current = newText.length;
    } else {
      newText =
        currentText.substring(0, cursorPositionRef.current) +
        ' ' +
        value +
        ' ' +
        currentText.substring(cursorPositionRef.current);
      cursorPositionRef.current = cursorPositionRef.current + value.length + 2;
    }

    form.setValue('content', newText);
    setTextareaCursorPosition(cursorPositionRef.current);
    form.setFocus('content');
  };

  const onSubmit = async (values: z.infer<typeof wordTemplateFormSchema>) => {
    // TODO: Get variables from the content
    // Las variables comienzan con {{ y terminan con }}

    console.log('submit values', values);

    const variables = values.content.match(/{{.*?}}/g);
    let variablesArray: string[] = [];
    if (variables) {
      variablesArray = variables.map((variable) => variable.replace(/{{/g, '').replace(/}}/g, ''));
    }
    try {
      const data = {
        ...values,
        variables: variablesArray,
        description: values.description || '',
      };

      console.log(data);

      if (mode === 'CREATE') {
        await createWordTemplateMutation.mutateAsync(data);
      } else {
        await updateWordTemplateMutation.mutateAsync({
          id: template?.id || '',
          data,
        });
      }

      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof wordTemplateFormSchema>>) => {
    console.log('errors', errors);
  };

  // console.log("form", form.getValues());

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
              {mode === 'CREATE' ? 'Nuevo template' : `Editar template ${form.watch('name')}`}
            </DialogTitle>
            <DialogDescription />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                <div className='mt-4 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2'>
                  <InputField
                    label='Nombre'
                    name='name'
                    placeholder='Nombre'
                    form={form}
                    required
                  />

                  <TypeWordTemplatesDropdown label='Tipo de template' name='type' form={form} />

                  <TextareaField
                    label='Descripción'
                    name='description'
                    placeholder='Descripción'
                    form={form}
                    className='col-span-2'
                  />

                  <div className='col-span-2 flex w-full gap-4'>
                    <TextareaField
                      label='Contenido'
                      name='content'
                      placeholder='Contenido'
                      form={form}
                      className='w-3/4'
                      rows={20}
                      inputClassname='overflow-y-auto min-h-[300px]'
                      cursorPosition={textareaCursorPosition}
                      onBlur={(v) => (cursorPositionRef.current = v.target.selectionStart)}
                    />
                    <Variables className='h-[398px] w-1/4' handleAddData={handleAddData} />
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
                      text={mode === 'CREATE' ? 'Crear template' : 'Guardar'}
                      className='min-w-[150px]'
                      isLoading={
                        createWordTemplateMutation.isPending || updateWordTemplateMutation.isPending
                      }
                      disabled={
                        createWordTemplateMutation.isPending ||
                        updateWordTemplateMutation.isPending ||
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
