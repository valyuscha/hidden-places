import { gql } from '@apollo/client';

export const GET_PLACES_QUERY = gql`
  query GetPlaces($limit: Int, $offset: Int, $search: String, $tags: [String!]) {
    places(limit: $limit, offset: $offset, search: $search, tags: $tags) {
      id
      title
      description
      country
      city
      imageUrl
      tags
    }
  }
`;

export const GET_PLACE_QUERY = gql`
  query GetPlace($id: Int!) {
    place(id: $id) {
      id
      title
      description
      country
      city
      latitude
      longitude
      imageUrl
      createdAt
      tags
      createdBy {
        id
        name
        email  
      }
      comments {
        id
        text
        likes
        dislikes
        createdAt
        user {
          id
          name
          email  
        }
        replies {
          id
          text
          likes
          dislikes
          createdAt
          user {
            id
            name
            email  
          }  
        }  
      }  
    }  
  }
`;

export const CREATE_PLACE_MUTATION = gql`
  mutation CreatePlace($createPlaceInput: CreatePlaceInput!) {
    createPlace(createPlaceInput: $createPlaceInput) {
      id
      title
      description
      country
      city
      latitude
      longitude
      imageUrl
      tags  
      createdBy {
        id
        name
        email
      }
    }
  }
`;

export const UPDATE_PLACE_MUTATION = gql`
  mutation UpdatePlace($id: Int!, $updatePlaceInput: UpdatePlaceInput!) {
    updatePlace(id: $id, updatePlaceInput: $updatePlaceInput) {
      id
      title
      description
      imageUrl
      tags  
    }
  }
`;

export const REMOVE_PLACE_MUTATION = gql`
  mutation RemovePlace($id: Int!) {
    removePlace(id: $id)
  }
`;
