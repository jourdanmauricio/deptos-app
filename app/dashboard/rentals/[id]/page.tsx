import { EditRentalPage } from '@/components/rentalsPage/editRental/EditRentralPage';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <EditRentalPage rentalId={id} />;
}
