import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getWordTemplates,
  createWordTemplate,
  updateWordTemplate,
  deleteWordTemplate,
} from '@/lib/actions/word-templates';
import { toast } from 'sonner';

export function useWordTemplates() {
  return useQuery({
    queryKey: ['wordTemplates'],
    queryFn: getWordTemplates,
  });
}

export function useCreateWordTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWordTemplate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['wordTemplates'] });
      toast.success('Plantilla de Word creada correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateWordTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateWordTemplate(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['wordTemplates'] });
      toast.success('Plantilla de Word actualizada correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteWordTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWordTemplate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['wordTemplates'] });
      toast.success('Plantilla de Word eliminada correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
