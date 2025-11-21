import z from 'zod';
import { useEffect } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from 'lucide-react';

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from '@/components/ui/dialog';
import { Variables } from './Variables';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { WordTemplate } from '@/shared/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { wordTemplateFormSchema } from '@/shared/schemas';
import { InputField } from '@/components/ui/custom/input-field';
import TextareaField from '@/components/ui/custom/textarea-field';
import { SubmitButton } from '@/components/ui/custom/submit-button';
import { useCreateWordTemplate, useUpdateWordTemplate } from '@/hooks/use-word-templates';
import { TypeWordTemplatesDropdown } from '@/components/ui/dropdowns/TypeWordTemplatesDropdown';
import { TextStyle } from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';

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
  const mode = template ? 'EDIT' : 'CREATE';

  const createWordTemplateMutation = useCreateWordTemplate();
  const updateWordTemplateMutation = useUpdateWordTemplate();

  const form = useForm<z.infer<typeof wordTemplateFormSchema>>({
    resolver: zodResolver(wordTemplateFormSchema),
    defaultValues,
  });

  // const editor = useEditor({
  //   extensions: [StarterKit, Underline],
  //   content: form.watch('content') || '',
  //   immediatelyRender: false,
  //   onUpdate: ({ editor }) => {
  //     form.setValue('content', editor.getHTML(), { shouldDirty: true });
  //   },
  //   editorProps: {
  //     attributes: {
  //       class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4',
  //     },
  //   },
  // });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle.extend({
        addAttributes() {
          return {
            fontSize: {
              default: '18px',
              parseHTML: (element) => element.style.fontSize || '18px',
              renderHTML: (attributes) => {
                if (!attributes.fontSize) return { style: 'font-size: 18px' };
                return {
                  style: `font-size: ${attributes.fontSize}`,
                };
              },
            },
          };
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: form.watch('content') || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      form.setValue('content', editor.getHTML(), { shouldDirty: true });
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  useEffect(() => {
    if (template) {
      form.reset({
        ...template,
        variables: template.variables as string[],
      });
      if (editor) {
        editor.commands.setContent(template.content);
      }
    } else {
      form.reset(defaultValues);
      if (editor) {
        editor.commands.setContent('');
      }
    }
  }, [template, form, editor]);

  const handleAddData = (param: string) => {
    const value = `{{${param}}}`;

    if (editor) {
      // Insertar la variable en la posición del cursor
      editor.chain().focus().insertContent(` ${value} `).run();
      form.clearErrors('content');
    }
  };

  const onSubmit = async (values: z.infer<typeof wordTemplateFormSchema>) => {
    // Extraer variables del contenido
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

      if (mode === 'CREATE') {
        await createWordTemplateMutation.mutateAsync(data);
      } else {
        await updateWordTemplateMutation.mutateAsync({
          id: String(template?.id || ''),
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

  if (!editor) {
    return null;
  }

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
                    <div className='h-[470px] w-3/4'>
                      <Label className='mb-1 block text-sm font-medium'>Contenido</Label>

                      <div className='border-input flex gap-1 rounded-t-md border p-2'>
                        <button
                          type='button'
                          onClick={() => editor.chain().focus().toggleBold().run()}
                          className={`bg-background hover:bg-primary/90 rounded border p-2 ${editor.isActive('bold') ? 'bg-muted-foreground' : ''}`}
                          title='Negrita'
                        >
                          <Bold size={18} />
                        </button>
                        <button
                          type='button'
                          onClick={() => editor.chain().focus().toggleItalic().run()}
                          className={`bg-background hover:bg-primary/90 rounded p-2 ${editor.isActive('italic') ? 'bg-muted-foreground' : ''}`}
                          title='Itálica'
                        >
                          <Italic size={18} />
                        </button>
                        <button
                          type='button'
                          onClick={() => editor.chain().focus().toggleUnderline().run()}
                          className={`bg-background hover:bg-primary/90 rounded p-2 ${editor.isActive('underline') ? 'bg-muted-foreground' : ''}`}
                          title='Subrayado'
                        >
                          <UnderlineIcon size={18} />
                        </button>
                        <div className='bg-border mx-1 w-px'></div>
                        <button
                          type='button'
                          onClick={() => editor.chain().focus().toggleBulletList().run()}
                          className={`bg-background hover:bg-primary/90 rounded p-2 ${editor.isActive('bulletList') ? 'bg-muted-foreground' : ''}`}
                          title='Lista con viñetas'
                        >
                          <List size={18} />
                        </button>
                        <button
                          type='button'
                          onClick={() => editor.chain().focus().toggleOrderedList().run()}
                          className={`bg-background hover:bg-primary/90 rounded p-2 ${editor.isActive('orderedList') ? 'bg-muted-foreground' : ''}`}
                          title='Lista numerada'
                        >
                          <ListOrdered size={18} />
                        </button>
                        <div className='bg-border mx-1 w-px'></div>
                        <button
                          type='button'
                          onClick={() => editor.chain().focus().setTextAlign('left').run()}
                          className={`bg-background hover:bg-primary/90 rounded p-2 ${editor.isActive({ textAlign: 'left' }) ? 'bg-muted-foreground' : ''}`}
                          title='Alinear a la izquierda'
                        >
                          <AlignLeft size={18} />
                        </button>
                        <button
                          type='button'
                          onClick={() => editor.chain().focus().setTextAlign('center').run()}
                          className={`bg-background hover:bg-primary/90 rounded p-2 ${editor.isActive({ textAlign: 'center' }) ? 'bg-muted-foreground' : ''}`}
                          title='Centrar'
                        >
                          <AlignCenter size={18} />
                        </button>
                        <button
                          type='button'
                          onClick={() => editor.chain().focus().setTextAlign('right').run()}
                          className={`bg-background hover:bg-primary/90 rounded p-2 ${editor.isActive({ textAlign: 'right' }) ? 'bg-muted-foreground' : ''}`}
                          title='Alinear a la derecha'
                        >
                          <AlignRight size={18} />
                        </button>
                        <button
                          type='button'
                          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                          className={`bg-background hover:bg-primary/90 rounded p-2 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-muted-foreground' : ''}`}
                          title='Justificar'
                        >
                          <AlignJustify size={18} />
                        </button>
                        <div className='bg-border mx-1 w-px'></div>
                        <select
                          onChange={(e) => {
                            const fontSize = e.target.value;
                            setTimeout(() => {
                              if (fontSize) {
                                editor.chain().focus().setMark('textStyle', { fontSize }).run();
                              } else {
                                editor.chain().focus().unsetMark('textStyle').run();
                              }
                            }, 0);
                          }}
                          className='bg-background hover:bg-primary/90 rounded border px-2 py-2 text-sm'
                          title='Tamaño de fuente'
                        >
                          <option value=''>Tamaño</option>
                          <option value='10px'>10px</option>
                          <option value='12px'>12px</option>
                          <option value='14px'>14px</option>
                          <option value='16px'>16px</option>
                          <option value='18px'>18px</option>
                          <option value='20px'>20px</option>
                          <option value='24px'>24px</option>
                          <option value='28px'>28px</option>
                          <option value='32px'>32px</option>
                        </select>
                      </div>

                      {/* Editor */}
                      <div className='border-input rounded-b-md border border-t-0'>
                        <ScrollArea className='h-[400px]'>
                          <EditorContent editor={editor} />
                        </ScrollArea>
                      </div>
                    </div>

                    <Variables className='h-[460px] w-1/4' handleAddData={handleAddData} />
                  </div>

                  <div className='col-span-2 flex justify-end gap-8 pt-6'>
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
