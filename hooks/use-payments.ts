import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} from '@/lib/actions/payments';
import { toast } from 'sonner';

export function usePayments(propertyId?: string) {
  return useQuery({
    queryKey: ['payments', propertyId],
    queryFn: () => getPayments(propertyId),
    select: (data) =>
      data.filter((payment) => {
        // Menor o igual a hoy + 4 meses
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 4);
        return payment.paidDate && payment.paidDate <= threeMonthsFromNow;
      }),
    enabled: !!propertyId,
  });
}

export function usePayment(paymentId: string) {
  return useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => getPaymentById(paymentId),
    enabled: !!paymentId,
  });
}
export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPayment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Pago creado correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updatePayment(id, data),
    onSuccess: async () => {
      try {
        await Promise.all([queryClient.invalidateQueries({ queryKey: ['payments'] })]);
      } catch (error) {
        console.error('Error invalidating queries:', error);
      }
      toast.success('Pago actualizado correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePayment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Pago eliminado correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
