import { useQuery } from '@apollo/client/react';
import { graphql } from '@/generated';

const GetPublicProfileQuery = graphql(`
  query GetPublicProfile($userId: String!) {
    getPublicProfile(userId: $userId) {
      userId
      email
      firstName
      lastName
      avatarUrl
      bio
      headline
      location
      socialLinks {
        id
        platform
        url
        label
        sortOrder
        createdAt
        updatedAt
      }
      projects {
        id
        title
        description
        images
        liveUrl
        repoUrl
        tags
        sortOrder
        createdAt
        updatedAt
      }
      skillCategories {
        id
        name
        sortOrder
        createdAt
        updatedAt
      }
      skills {
        id
        name
        categoryId
        category {
          id
          name
        }
        proficiency
        sortOrder
        createdAt
        updatedAt
      }
      experiences {
        id
        company
        role
        description
        startDate
        endDate
        sortOrder
        createdAt
        updatedAt
      }
      education {
        id
        school
        degree
        field
        startDate
        endDate
        description
        sortOrder
        createdAt
        updatedAt
      }
      certifications {
        id
        name
        issuer
        issueDate
        expiryDate
        url
        sortOrder
        createdAt
        updatedAt
      }
      languages {
        id
        name
        proficiency
        sortOrder
        createdAt
        updatedAt
      }
      awards {
        id
        title
        issuer
        date
        description
        sortOrder
        createdAt
        updatedAt
      }
      hobbies {
        id
        name
        description
        sortOrder
        createdAt
        updatedAt
      }
    }
  }
`);

export function usePublicProfile(userId: string) {
  return useQuery(GetPublicProfileQuery, { variables: { userId } });
}
