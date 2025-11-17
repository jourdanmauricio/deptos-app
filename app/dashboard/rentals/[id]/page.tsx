import { useParams } from 'next/navigation';
import { EditRentalPage } from '@/components/rentalsPage/editRental/EditRentralPage';
import { getServerSideProps } from 'next/dist/build/templates/pages';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <EditRentalPage rentalId={id} />;
}
