import z from 'zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React, { useEffect } from 'react';
import { useWordTemplate } from '@/hooks/use-word-templates';
import { UseFormReturn, FormProvider } from 'react-hook-form';
import { rentalFormSchema } from '@/shared/schemas';
import TextareaField from '@/components/ui/custom/textarea-field';
import { indexationTypes, rentalVariables } from '@/shared/constanst';
import { useParties, usePartyById } from '@/hooks/use-parties';
import { useProperties, usePropertyById } from '@/hooks/use-properties';
import { numberToText } from '@/lib/utils/numberToText';
import { addMonths, format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ContractModalGenerateProps {
  open: boolean;
  onClose: () => void;
  form: UseFormReturn<z.infer<typeof rentalFormSchema>>;
}

const ContractModalGenerate = ({ open, onClose, form }: ContractModalGenerateProps) => {
  console.log('rental', form.getValues('wordTemplateId'));
  const wordTemplateId = form.getValues('wordTemplateId');

  const { data: wordTemplate } = useWordTemplate(wordTemplateId || '');
  const { data: tenant } = usePartyById(form.getValues('tenantId'));
  const { data: owner } = usePartyById(form.getValues('ownerId'));
  const { data: guarantors } = usePartyById(form.getValues('guarantors')[0]);
  const { data: guarantors2 } = usePartyById(form.getValues('guarantors')[1]);
  const { data: property } = usePropertyById(form.getValues('propertyId'));

  console.log('form values!!!!!!!', form.getValues());

  useEffect(() => {
    if (wordTemplate) {
      // console.log('wordTemplate', wordTemplate.variables);

      // Buscar variables en el contenido de la plantilla y reemplazar con el valor de la variable
      const variables = wordTemplate.content.match(/{{.*?}}/g);
      // console.log('variables!!!!!!!!!!!', variables);
      let variableValue = '';
      if (variables) {
        variables.forEach((variable) => {
          if (variable === '{{propietario_nombres}}') {
            variableValue = owner?.name || '';
          }

          if (variable === '{{propietario_apellidos}}') {
            variableValue = owner?.lastName || '';
          }

          if (variable === '{{propietario_dni}}') {
            variableValue = owner?.dni || '';
          }

          if (variable === '{{propietario_cuil}}') {
            variableValue = owner?.cuil || '';
          }

          if (variable === '{{propietario_domicilio}}') {
            variableValue = owner?.address || '';
          }

          if (variable === '{{inquilino_nombres}}') {
            variableValue = tenant?.name || '';
          }
          if (variable === '{{inquilino_apellidos}}') {
            variableValue = tenant?.lastName || '';
          }
          if (variable === '{{inquilino_dni}}') {
            variableValue = tenant?.dni || '';
          }

          if (variable === '{{inquilino_domicilio}}') {
            variableValue = tenant?.address || '';
          }

          if (variable === '{{inquilino_cuil}}') {
            variableValue = tenant?.cuil || '';
          }

          if (variable === '{{propiedad_domicilio}}') {
            variableValue = property?.address || '';
          }

          if (variable === '{{plazo_texto}}') {
            // pasar numero a texto. Ejemplo: 24 -> "VEINTICUATRO"
            variableValue = `${numberToText(+form.getValues('contractDurationYears') * 12)}` || '';
          }

          if (variable === '{{plazo_numero}}') {
            variableValue = `${+form.getValues('contractDurationYears') * 12}` || '';
          }

          if (variable === '{{monto_texto}}') {
            variableValue = `${numberToText(+form.getValues('initialRent'))}` || '';
          }

          if (variable === '{{monto_numero}}') {
            variableValue = `${+form.getValues('initialRent')}` || '';
          }

          if (variable === '{{deposito_texto}}') {
            variableValue = `${numberToText(+form.getValues('deposit'))}` || '';
          }

          if (variable === '{{deposito_numero}}') {
            variableValue = `${+form.getValues('deposit')}` || '';
          }

          if (variable === '{{primer_ajuste}}') {
            // fecha de inicio + rentUpdateMonths
            variableValue =
              `${format(addMonths(form.getValues('startDate'), +form.getValues('rentUpdateMonths')), "d 'de' MMMM 'de' yyyy", { locale: es })}` ||
              '';
          }

          if (variable === '{{indice}}') {
            variableValue = form.getValues('indexationType') || '';
          }

          if (variable === '{{indice_texto}}') {
            variableValue =
              indexationTypes.find(
                (type: { id: string; description: string }) =>
                  type.id === form.getValues('indexationType')
              )?.description || '';
          }

          if (variable === '{{penalidad}}') {
            variableValue = form.getValues('penaltyRate').replace('.', ',') || '';
          }

          if (variable === '{{penalidad_entrega_texto}}') {
            variableValue = `${numberToText(+form.getValues('rescissionRate'))}` || '';
          }

          if (variable === '{{penalidad_entrega_numero}}') {
            variableValue = form.getValues('rescissionRate').replace('.', ',') || '';
          }

          if (variable === '{{fecha_inicio}}') {
            // pasar fecha a texto. Ejemplo: 2025-11-17 -> "17 de noviembre de 2025"
            variableValue =
              `${format(form.getValues('startDate'), "d 'de' MMMM 'de' yyyy", { locale: es })}` ||
              '';
          }
          if (variable === '{{fecha_fin}}') {
            variableValue =
              `${format(form.getValues('endDate'), "d 'de' MMMM 'de' yyyy", { locale: es })}`.toUpperCase() ||
              '';
          }

          if (variable === '{{garante_nombres}}') {
            variableValue = guarantors?.name || '';
          }

          if (variable === '{{garante_apellidos}}') {
            variableValue = guarantors?.lastName || '';
          }

          if (variable === '{{garante_dni}}') {
            variableValue = guarantors?.dni || '';
          }

          if (variable === '{{garante_domicilio}}') {
            variableValue = guarantors?.address || '';
          }

          if (variable === '{{garante_cuil}}') {
            variableValue = guarantors?.cuil || '';
          }

          if (variable === '{{garante2_nombres}}') {
            variableValue = guarantors2?.name || '';
          }

          if (variable === '{{garante2_apellidos}}') {
            variableValue = guarantors2?.lastName || '';
          }

          if (variable === '{{garante2_dni}}') {
            variableValue = guarantors2?.dni || '';
          }

          if (variable === '{{garante2_domicilio}}') {
            variableValue = guarantors2?.address || '';
          }

          if (variable === '{{fecha_firma}}') {
            // pasar fecha a texto. Ejemplo: 2025-11-17 -> "17 de noviembre de 2025"
            variableValue =
              `${format(form.getValues('signedDate'), "d 'de' MMMM 'de' yyyy", { locale: es })}` ||
              '';
          }
          wordTemplate.content = wordTemplate.content.replace(variable, variableValue);
          variableValue = '';
        });
      }

      // console.log('wordTemplate', wordTemplate.content);

      form.setValue('content', wordTemplate.content);
    }
  }, [wordTemplate, form]);

  if (!wordTemplate) {
    return null;
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className='max-h-[95%] overflow-auto'
        style={{
          minWidth: '600px',
          maxWidth: '900px',
        }}
      >
        <FormProvider {...form}>
          <div style={{ minWidth: '600px' }}>
            <DialogHeader>
              <DialogTitle className='dialog-title'>Generar contrato para la alquiler</DialogTitle>
              <DialogDescription />
            </DialogHeader>
            {/* <Textarea>{wordTemplate?.content || 'No hay plantilla de word seleccionada'}</Textarea> */}
            <TextareaField
              label='Contrato'
              name='content'
              form={form}
              className='w-full'
              rows={20}
            />
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export { ContractModalGenerate };
