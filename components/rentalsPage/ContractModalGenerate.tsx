import z from 'zod';
import { es } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { addMonths, format } from 'date-fns';
import { UseFormReturn, FormProvider } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePartyById } from '@/hooks/use-parties';
import { rentalFormSchema } from '@/shared/schemas';
import { indexationTypes } from '@/shared/constanst';
import { numberToText } from '@/lib/utils/numberToText';
import { usePropertyById } from '@/hooks/use-properties';
import { useWordTemplate } from '@/hooks/use-word-templates';
import { EditorTiptap } from '@/components/ui/custom/editor-tiptap';
import { LoaderIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContractModalGenerateProps {
  open: boolean;
  onClose: () => void;
  form: UseFormReturn<z.infer<typeof rentalFormSchema>>;
}

const ContractModalGenerate = ({ open, onClose, form }: ContractModalGenerateProps) => {
  const [isContentReady, setIsContentReady] = useState(false);

  const wordTemplateId = form.getValues('wordTemplateId');

  const { data: wordTemplate, isLoading: isLoadingWordTemplate } = useWordTemplate(
    wordTemplateId || ''
  );
  const { data: tenant, isLoading: isLoadingTenant } = usePartyById(form.getValues('tenantId'));
  const { data: owner, isLoading: isLoadingOwner } = usePartyById(form.getValues('ownerId'));
  const { data: guarantors, isLoading: isLoadingGuarantors } = usePartyById(
    form.getValues('guarantors')[0]
  );
  const { data: guarantors2, isLoading: isLoadingGuarantors2 } = usePartyById(
    form.getValues('guarantors')[1]
  );
  const { data: property, isLoading: isLoadingProperty } = usePropertyById(
    form.getValues('propertyId')
  );

  const isLoading =
    isLoadingWordTemplate ||
    isLoadingTenant ||
    isLoadingOwner ||
    isLoadingGuarantors ||
    isLoadingGuarantors2 ||
    isLoadingProperty;

  useEffect(() => {
    if (form.getValues('contractContent')) {
      setIsContentReady(true);
      return;
    }

    if (isLoading || !wordTemplate || !tenant || !owner || !property) {
      return;
    }

    if (wordTemplate) {
      const variables = wordTemplate.content.match(/{{.*?}}/g);
      let variableValue = '';

      if (variables) {
        variables.forEach((variable) => {
          if (variable === '{{propietario_nombres}}') {
            variableValue = `${owner?.name || ''}`;
          }
          if (variable === '{{propietario_apellidos}}') {
            variableValue = `${owner?.lastName || ''}`;
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
            variableValue = `${tenant?.name || ''}`;
          }
          if (variable === '{{inquilino_apellidos}}') {
            variableValue = `${tenant?.lastName || ''}`;
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
            variableValue = `<strong>${guarantors?.name || ''}</strong>`;
          }
          if (variable === '{{garante_apellidos}}') {
            variableValue = `<strong>${guarantors?.lastName || ''}</strong>`;
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
            variableValue = `<strong>${guarantors2?.name || ''}</strong>`;
          }
          if (variable === '{{garante2_apellidos}}') {
            variableValue = `<strong>${guarantors2?.lastName || ''}</strong>`;
          }
          if (variable === '{{garante2_dni}}') {
            variableValue = guarantors2?.dni || '';
          }
          if (variable === '{{garante2_domicilio}}') {
            variableValue = guarantors2?.address || '';
          }
          if (variable === '{{fecha_firma}}') {
            variableValue =
              `${format(form.getValues('signedDate'), "d 'de' MMMM 'de' yyyy", { locale: es })}` ||
              '';
          }

          wordTemplate.content = wordTemplate.content.replace(variable, variableValue);
          variableValue = '';
        });
      }

      const finalContent = wordTemplate.content;
      form.setValue('contractContent', finalContent, { shouldDirty: true });
      setIsContentReady(true);
    }
  }, [isLoading, wordTemplate, tenant, owner, guarantors, guarantors2, property, form]);

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

            {!isContentReady ? (
              <div className='flex items-center justify-center py-20'>
                <LoaderIcon className='h-8 w-8 animate-spin' />
              </div>
            ) : (
              <FormProvider {...form}>
                <div style={{ minWidth: '600px' }}>
                  <EditorTiptap
                    key={`editor-${isContentReady}`}
                    name='contractContent'
                    label='Contrato'
                    form={form}
                  />
                </div>
              </FormProvider>
            )}
            <div className='flex justify-end'>
              <Button type='button' onClick={onClose}>
                Cerrar
              </Button>
            </div>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export { ContractModalGenerate };
