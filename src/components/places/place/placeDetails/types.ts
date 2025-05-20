interface Place {
  id: number;
  createdBy: {
    id: number;
  };
  title: string;
  description?: string;
  country: string;
  city: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
}

export interface PlaceDetailsProps {
  place: Place;
}
