import PropertyDetailPage from '@/pages/public/properties/detail/page';

interface PageProps {
  params: { id: string };
}

export default function PropertyDetailRoute({ params }: PageProps) {
  return <PropertyDetailPage />;
}