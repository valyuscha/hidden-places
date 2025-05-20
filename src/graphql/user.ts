import { gql } from '@apollo/client';

export const GET_USERS_QUERY = gql`
  query GetUsers {
    users {
      id
      email
      name  
    }  
  }
`;

export const GET_USER_QUERY = gql`
  query GetUser($id: Int!) {
    user(id: $id) {
      id
      email
      name
      places {
        id
        title
        description
        imageUrl
      }
    }  
  }
`;

export const GET_CURRENT_USER_QUERY = gql`
  query GetCurrentUser {
    currentUser {
      id
      name
      email
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
      email
      name  
    }  
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id)  
  } 
`;
