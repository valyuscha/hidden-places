import { EditPlaceWrapper } from '@/components/places/place/editPlaceWrapper';
import { EditPageProps } from '@/components/places/place/editPlaceWrapper/types';

const EditPlacePage = ({ params }: EditPageProps) => {
  return <EditPlaceWrapper params={params} />;
};

export default EditPlacePage;
