import { PaymentsPage } from '@/components/paymentsPage/PaymentsPage';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <PaymentsPage propertyId={id} />;
}
