import { useQuery, useMutation, gql, Reference, ApolloCache, MutationUpdaterFunction } from '@apollo/client';
import { GET_USER_QUERY } from '@/graphql/user';
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

type PlaceOperation = 'create' | 'update' | 'remove';

const preparePlaceRefetchQueries = (operation: PlaceOperation, userId?: number) => {
  const refetchQueries = [];

  refetchQueries.push({
    query: GET_PLACES_QUERY,
    variables: { limit: 9, offset: 0 }
  });

  if (userId) {
    refetchQueries.push({
      query: GET_USER_QUERY,
      variables: { id: userId }
    });
  }

  return refetchQueries;
};

const getPlaceCacheUpdater = (
  operation: PlaceOperation,
  placeId?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): MutationUpdaterFunction<any, any, any, ApolloCache<any>> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (cache, { data }) => {
    const operationData = data?.[`${operation}Place`];
    if (!operationData && operation !== 'remove') return;

    switch (operation) {
      case 'create': {
        const newPlaceRef = cache.writeFragment({
          data: operationData,
          fragment: gql`
            fragment NewPlace on Place {
              id
              title
              city
              country
              description
              imageUrl
              tags
              createdBy {
                id
                name
                email
              }
            }
          `,
        });

        cache.modify({
          fields: {
            places(existingPlaceRefs = []) {
              return [newPlaceRef, ...existingPlaceRefs];
            },
          },
        });

        const userId = operationData.createdBy.id;
        if (userId) {
          cache.modify({
            id: cache.identify({ __typename: 'User', id: userId }),
            fields: {
              places(existingPlaceRefs = []) {
                return [newPlaceRef, ...existingPlaceRefs];
              },
            },
          });
        }
        break;
      }

      case 'update': {
        if (operationData) {
          cache.modify({
            id: cache.identify({ __typename: 'Place', id: operationData.id }),
            fields: {
              title: () => operationData.title,
              description: () => operationData.description,
              imageUrl: () => operationData.imageUrl,
              tags: () => operationData.tags,
            },
          });
        }
        break;
      }

      case 'remove': {
        if (operationData) {
          const id = placeId;
          if (!id) return;

          const cacheIds = cache.extract();
          const placeCacheId = `Place:${id}`;

          cache.evict({ id: placeCacheId });

          Object.keys(cacheIds).forEach(cacheId => {
            if (cacheId.startsWith('ROOT_QUERY') && cacheId.includes('places')) {
              cache.modify({
                id: cacheId,
                fields: {
                  places(existingPlaceRefs = [], { readField }) {
                    return existingPlaceRefs.filter(
                      (placeRef: Reference) => readField('id', placeRef) !== id
                    );
                  }
                }
              });
            }
          });

          cache.modify({
            fields: {
              user(existingUserData, { readField }) {
                if (existingUserData && readField('places', existingUserData)) {
                  const places = readField('places', existingUserData);
                  if (places && Array.isArray(places)) {
                    const updatedPlaces = places.filter(
                      (placeRef: Reference) => readField('id', placeRef) !== id
                    );
                    return {
                      ...existingUserData,
                      places: updatedPlaces
                    };
                  }
                }
                return existingUserData;
              }
            }
          });

          try {
            cache.modify({
              fields: {
                places(_, { INVALIDATE }) {
                  return INVALIDATE;
                }
              }
            });
          } catch (e) {
            console.error("Failed to invalidate places cache:", e);
          }

          cache.gc();
        }
        break;
      }
    }
  };
};

export const usePlaces = (
  limit = 9,
  offset = 0,
  search = '',
  tags: string[] = [],
) => {
  const {data, loading, error, refetch, fetchMore, networkStatus} = useQuery(GET_PLACES_QUERY, {
    variables: {limit, offset, search, tags},
    notifyOnNetworkStatusChange: true,
  });

  return {
    places: data?.places || [],
    loading,
    error,
    refetch,
    fetchMore,
    networkStatus,
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
  const [createPlaceMutation, createPlaceResult] = useMutation(CREATE_PLACE_MUTATION);

  const createPlace = async (input: CreatePlaceInput) => {
    const refetchQueries = preparePlaceRefetchQueries('create', input.createdById);

    const {data} = await createPlaceMutation({
      variables: {createPlaceInput: input},
      refetchQueries,
      awaitRefetchQueries: true,
      update: getPlaceCacheUpdater('create')
    });

    return data?.createPlace;
  };

  return {createPlace, createPlaceResult};
};

export const useUpdatePlace = () => {
  const [updatePlaceMutation, updatePlaceResult] = useMutation(UPDATE_PLACE_MUTATION);

  const updatePlace = async (id: number, input: UpdatePlaceInput, userId?: number) => {
    const refetchQueries = preparePlaceRefetchQueries('update', userId);

    const {data} = await updatePlaceMutation({
      variables: {id, updatePlaceInput: input},
      refetchQueries,
      awaitRefetchQueries: true,
      update: getPlaceCacheUpdater('update')
    });

    return data?.updatePlace;
  };

  return {updatePlace, updatePlaceResult};
};

export const useRemovePlace = () => {
  const [removePlaceMutation, removePlaceResult] = useMutation(REMOVE_PLACE_MUTATION);

  const removePlace = async (id: number, userId?: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const refetchQueries: Array<{ query: any; variables: any }> = [
      {
        query: GET_PLACES_QUERY,
        variables: { limit: 9, offset: 0 }
      }
    ];

    if (userId) {
      refetchQueries.push({
        query: GET_USER_QUERY,
        variables: { id: userId }
      });
    }

    const {data} = await removePlaceMutation({
      variables: {id},
      refetchQueries,
      awaitRefetchQueries: true,
      update: (cache, { data }) => {
        if (data?.removePlace) {
          const placeId = `Place:${id}`;
          cache.evict({ id: placeId });

          cache.modify({
            fields: {
              places: (_, { INVALIDATE }) => INVALIDATE
            }
          });

          cache.gc();
        }
      }
    });

    return data?.removePlace;
  };

  return {removePlace, removePlaceResult};
};
