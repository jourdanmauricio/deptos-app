import { format } from 'date-fns';

interface IclData {
  initialRent: string;
  startDate: Date;
  rentUpdateMonths: string;
}

export async function getICL(data: IclData) {
  try {
    const { initialRent, startDate, rentUpdateMonths } = data;
    const today = new Date();
    today.setDate(1);
    today.setMonth(today.getMonth() - 1);
    console.log('today', today);
    console.log('startDate', startDate);
    const iclIndex = await fetch(
      `https://api.bcra.gob.ar/estadisticas/v4.0/monetarias/40?desde=${format(startDate, 'yyyy-MM-dd')}&hasta=${format(today, 'yyyy-MM-dd')}`
    );
    return iclIndex;
  } catch (error) {
    console.error('Error fetching tenants:', error);
    throw new Error('Error al obtener los inquilinos');
  }
}
