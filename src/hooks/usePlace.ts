import { useQuery, useMutation, gql } from '@apollo/client';
import {
  GET_PLACES_QUERY,
  GET_PLACE_QUERY,
  CREATE_PLACE_MUTATION,
  UPDATE_PLACE_MUTATION,
  REMOVE_PLACE_MUTATION,
} from '@/graphql/place';

interface CreatePlaceInput {
  title: string;
  description: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  createdById: number;
  tags: ('hidden' | 'explore' | 'historic' | 'nature' | undefined)[];
}

interface UpdatePlaceInput {
  title?: string;
  description?: string;
  imageUrl?: string;
  tags?: ('hidden' | 'explore' | 'historic' | 'nature' | undefined)[];
}

export const usePlaces = (
  limit = 9,
  offset = 0,
  search = '',
  tags: string[] = [],
) => {
  const {data, loading, error, refetch, fetchMore} = useQuery(GET_PLACES_QUERY, {
    variables: {limit, offset, search, tags},
  });

  return {
    places: data?.places || [],
    loading,
    error,
    refetch,
    fetchMore,
  };
};

export const usePlace = (id: number) => {
  const {data, loading, error, refetch} = useQuery(GET_PLACE_QUERY, {
    variables: {id},
    skip: !id,
  });
  return {
    place: data?.place,
    loading,
    error,
    refetch,
  };
};

export const useCreatePlace = () => {
  const [createPlaceMutation, createPlaceResult] = useMutation(CREATE_PLACE_MUTATION, {
    update(cache, {data: {createPlace}}) {
      cache.modify({
        fields: {
          places(existingPlaceRefs = []) {
              const newPlaceRef = cache.writeFragment({
                data: createPlace,
                  fragment: gql`
                    fragment NewPlace on Place {
                      id
                      title
                      city
                      country
                      description
                      imageUrl
                      tags
                    }
                  `,
              });

            return [newPlaceRef, ...existingPlaceRefs];
          },
        },
      });
    },
  });

  const createPlace = async (input: CreatePlaceInput) => {
    const {data} = await createPlaceMutation({
      variables: {createPlaceInput: input},
    });
    return data?.createPlace;
  };

  return {createPlace, createPlaceResult};
};

export const useUpdatePlace = () => {
  const [updatePlaceMutation, updatePlaceResult] = useMutation(UPDATE_PLACE_MUTATION);

  const updatePlace = async (id: number, input: UpdatePlaceInput) => {
    const {data} = await updatePlaceMutation({
      variables: {id, updatePlaceInput: input},
    });
    return data?.updatePlace;
  };

  return {updatePlace, updatePlaceResult};
};

export const useRemovePlace = () => {
  const [removePlaceMutation, removePlaceResult] = useMutation(REMOVE_PLACE_MUTATION);

  const removePlace = async (id: number) => {
    const {data} = await removePlaceMutation({
      variables: {id},
    });
    return data?.removePlace;
  };

  return {removePlace, removePlaceResult};
};
