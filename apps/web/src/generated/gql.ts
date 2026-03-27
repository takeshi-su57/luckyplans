/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation CreateAward($input: CreateAwardInput!) {\n    createAward(input: $input) {\n      id\n      title\n      issuer\n      date\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.CreateAwardDocument,
    "\n  mutation CreateCertification($input: CreateCertificationInput!) {\n    createCertification(input: $input) {\n      id\n      name\n      issuer\n      issueDate\n      expiryDate\n      url\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.CreateCertificationDocument,
    "\n  mutation CreateEducation($input: CreateEducationInput!) {\n    createEducation(input: $input) {\n      id\n      school\n      degree\n      field\n      startDate\n      endDate\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.CreateEducationDocument,
    "\n  mutation CreateExperience($input: CreateExperienceInput!) {\n    createExperience(input: $input) {\n      id\n      company\n      role\n      description\n      startDate\n      endDate\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.CreateExperienceDocument,
    "\n  mutation CreateHobby($input: CreateHobbyInput!) {\n    createHobby(input: $input) {\n      id\n      name\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.CreateHobbyDocument,
    "\n  mutation CreateItem($name: String!, $description: String) {\n    createItem(name: $name, description: $description) {\n      id\n      name\n      description\n      createdAt\n    }\n  }\n": typeof types.CreateItemDocument,
    "\n  mutation CreateLanguage($input: CreateLanguageInput!) {\n    createLanguage(input: $input) {\n      id\n      name\n      proficiency\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.CreateLanguageDocument,
    "\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      id\n      title\n      description\n      images\n      liveUrl\n      repoUrl\n      tags\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.CreateProjectDocument,
    "\n  mutation CreateSkillCategory($input: CreateSkillCategoryInput!) {\n    createSkillCategory(input: $input) {\n      id\n      name\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.CreateSkillCategoryDocument,
    "\n  mutation CreateSkill($input: CreateSkillInput!) {\n    createSkill(input: $input) {\n      id\n      name\n      categoryId\n      category {\n        id\n        name\n      }\n      proficiency\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.CreateSkillDocument,
    "\n  mutation CreateSocialLink($input: CreateSocialLinkInput!) {\n    createSocialLink(input: $input) {\n      id\n      platform\n      url\n      label\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.CreateSocialLinkDocument,
    "\n  query Me {\n    me {\n      userId\n      email\n      name\n      roles\n      firstName\n      lastName\n      avatarUrl\n      bio\n      headline\n      location\n    }\n  }\n": typeof types.MeDocument,
    "\n  mutation DeleteAward($id: String!) {\n    deleteAward(id: $id) {\n      success\n    }\n  }\n": typeof types.DeleteAwardDocument,
    "\n  mutation DeleteCertification($id: String!) {\n    deleteCertification(id: $id) {\n      success\n    }\n  }\n": typeof types.DeleteCertificationDocument,
    "\n  mutation DeleteEducation($id: String!) {\n    deleteEducation(id: $id) {\n      success\n    }\n  }\n": typeof types.DeleteEducationDocument,
    "\n  mutation DeleteExperience($id: String!) {\n    deleteExperience(id: $id) {\n      success\n    }\n  }\n": typeof types.DeleteExperienceDocument,
    "\n  mutation DeleteHobby($id: String!) {\n    deleteHobby(id: $id) {\n      success\n    }\n  }\n": typeof types.DeleteHobbyDocument,
    "\n  mutation DeleteLanguage($id: String!) {\n    deleteLanguage(id: $id) {\n      success\n    }\n  }\n": typeof types.DeleteLanguageDocument,
    "\n  mutation DeleteProject($id: String!) {\n    deleteProject(id: $id) {\n      success\n    }\n  }\n": typeof types.DeleteProjectDocument,
    "\n  mutation DeleteSkillCategory($id: String!) {\n    deleteSkillCategory(id: $id) {\n      success\n    }\n  }\n": typeof types.DeleteSkillCategoryDocument,
    "\n  mutation DeleteSkill($id: String!) {\n    deleteSkill(id: $id) {\n      success\n    }\n  }\n": typeof types.DeleteSkillDocument,
    "\n  mutation DeleteSocialLink($id: String!) {\n    deleteSocialLink(id: $id) {\n      success\n    }\n  }\n": typeof types.DeleteSocialLinkDocument,
    "\n  query Health {\n    health\n  }\n": typeof types.HealthDocument,
    "\n  query GetItem($id: String!) {\n    getItem(id: $id) {\n      id\n      name\n      description\n      createdAt\n    }\n  }\n": typeof types.GetItemDocument,
    "\n  query GetItems($page: Float = 1, $limit: Float = 10) {\n    getItems(page: $page, limit: $limit) {\n      items {\n        id\n        name\n        description\n        createdAt\n      }\n      total\n    }\n  }\n": typeof types.GetItemsDocument,
    "\n  query GetPublicProfile($userId: String!) {\n    getPublicProfile(userId: $userId) {\n      userId\n      email\n      firstName\n      lastName\n      avatarUrl\n      bio\n      headline\n      location\n      socialLinks {\n        id\n        platform\n        url\n        label\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      projects {\n        id\n        title\n        description\n        images\n        liveUrl\n        repoUrl\n        tags\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      skillCategories {\n        id\n        name\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      skills {\n        id\n        name\n        categoryId\n        category {\n          id\n          name\n        }\n        proficiency\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      experiences {\n        id\n        company\n        role\n        description\n        startDate\n        endDate\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      education {\n        id\n        school\n        degree\n        field\n        startDate\n        endDate\n        description\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      certifications {\n        id\n        name\n        issuer\n        issueDate\n        expiryDate\n        url\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      languages {\n        id\n        name\n        proficiency\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      awards {\n        id\n        title\n        issuer\n        date\n        description\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      hobbies {\n        id\n        name\n        description\n        sortOrder\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": typeof types.GetPublicProfileDocument,
    "\n  mutation ReorderAwards($input: ReorderInput!) {\n    reorderAwards(input: $input) {\n      success\n    }\n  }\n": typeof types.ReorderAwardsDocument,
    "\n  mutation ReorderCertifications($input: ReorderInput!) {\n    reorderCertifications(input: $input) {\n      success\n    }\n  }\n": typeof types.ReorderCertificationsDocument,
    "\n  mutation ReorderEducation($input: ReorderInput!) {\n    reorderEducation(input: $input) {\n      success\n    }\n  }\n": typeof types.ReorderEducationDocument,
    "\n  mutation ReorderExperiences($input: ReorderInput!) {\n    reorderExperiences(input: $input) {\n      success\n    }\n  }\n": typeof types.ReorderExperiencesDocument,
    "\n  mutation ReorderHobbies($input: ReorderInput!) {\n    reorderHobbies(input: $input) {\n      success\n    }\n  }\n": typeof types.ReorderHobbiesDocument,
    "\n  mutation ReorderLanguages($input: ReorderInput!) {\n    reorderLanguages(input: $input) {\n      success\n    }\n  }\n": typeof types.ReorderLanguagesDocument,
    "\n  mutation ReorderProjects($input: ReorderInput!) {\n    reorderProjects(input: $input) {\n      success\n    }\n  }\n": typeof types.ReorderProjectsDocument,
    "\n  mutation ReorderSkills($input: ReorderInput!) {\n    reorderSkills(input: $input) {\n      success\n    }\n  }\n": typeof types.ReorderSkillsDocument,
    "\n  mutation ReorderSocialLinks($input: ReorderInput!) {\n    reorderSocialLinks(input: $input) {\n      success\n    }\n  }\n": typeof types.ReorderSocialLinksDocument,
    "\n  query GetSkillCategories {\n    getSkillCategories {\n      id\n      name\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetSkillCategoriesDocument,
    "\n  mutation UpdateAward($id: String!, $input: UpdateAwardInput!) {\n    updateAward(id: $id, input: $input) {\n      id\n      title\n      issuer\n      date\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.UpdateAwardDocument,
    "\n  mutation UpdateCertification($id: String!, $input: UpdateCertificationInput!) {\n    updateCertification(id: $id, input: $input) {\n      id\n      name\n      issuer\n      issueDate\n      expiryDate\n      url\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.UpdateCertificationDocument,
    "\n  mutation UpdateEducation($id: String!, $input: UpdateEducationInput!) {\n    updateEducation(id: $id, input: $input) {\n      id\n      school\n      degree\n      field\n      startDate\n      endDate\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.UpdateEducationDocument,
    "\n  mutation UpdateExperience($id: String!, $input: UpdateExperienceInput!) {\n    updateExperience(id: $id, input: $input) {\n      id\n      company\n      role\n      description\n      startDate\n      endDate\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.UpdateExperienceDocument,
    "\n  mutation UpdateHobby($id: String!, $input: UpdateHobbyInput!) {\n    updateHobby(id: $id, input: $input) {\n      id\n      name\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.UpdateHobbyDocument,
    "\n  mutation UpdateLanguage($id: String!, $input: UpdateLanguageInput!) {\n    updateLanguage(id: $id, input: $input) {\n      id\n      name\n      proficiency\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.UpdateLanguageDocument,
    "\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      userId\n      email\n      name\n      roles\n      firstName\n      lastName\n      avatarUrl\n      bio\n      headline\n      location\n    }\n  }\n": typeof types.UpdateProfileDocument,
    "\n  mutation UpdateProject($id: String!, $input: UpdateProjectInput!) {\n    updateProject(id: $id, input: $input) {\n      id\n      title\n      description\n      images\n      liveUrl\n      repoUrl\n      tags\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.UpdateProjectDocument,
    "\n  mutation UpdateSkill($id: String!, $input: UpdateSkillInput!) {\n    updateSkill(id: $id, input: $input) {\n      id\n      name\n      categoryId\n      category {\n        id\n        name\n      }\n      proficiency\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.UpdateSkillDocument,
    "\n  mutation UpdateSocialLink($id: String!, $input: UpdateSocialLinkInput!) {\n    updateSocialLink(id: $id, input: $input) {\n      id\n      platform\n      url\n      label\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.UpdateSocialLinkDocument,
};
const documents: Documents = {
    "\n  mutation CreateAward($input: CreateAwardInput!) {\n    createAward(input: $input) {\n      id\n      title\n      issuer\n      date\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreateAwardDocument,
    "\n  mutation CreateCertification($input: CreateCertificationInput!) {\n    createCertification(input: $input) {\n      id\n      name\n      issuer\n      issueDate\n      expiryDate\n      url\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreateCertificationDocument,
    "\n  mutation CreateEducation($input: CreateEducationInput!) {\n    createEducation(input: $input) {\n      id\n      school\n      degree\n      field\n      startDate\n      endDate\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreateEducationDocument,
    "\n  mutation CreateExperience($input: CreateExperienceInput!) {\n    createExperience(input: $input) {\n      id\n      company\n      role\n      description\n      startDate\n      endDate\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreateExperienceDocument,
    "\n  mutation CreateHobby($input: CreateHobbyInput!) {\n    createHobby(input: $input) {\n      id\n      name\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreateHobbyDocument,
    "\n  mutation CreateItem($name: String!, $description: String) {\n    createItem(name: $name, description: $description) {\n      id\n      name\n      description\n      createdAt\n    }\n  }\n": types.CreateItemDocument,
    "\n  mutation CreateLanguage($input: CreateLanguageInput!) {\n    createLanguage(input: $input) {\n      id\n      name\n      proficiency\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreateLanguageDocument,
    "\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      id\n      title\n      description\n      images\n      liveUrl\n      repoUrl\n      tags\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreateProjectDocument,
    "\n  mutation CreateSkillCategory($input: CreateSkillCategoryInput!) {\n    createSkillCategory(input: $input) {\n      id\n      name\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreateSkillCategoryDocument,
    "\n  mutation CreateSkill($input: CreateSkillInput!) {\n    createSkill(input: $input) {\n      id\n      name\n      categoryId\n      category {\n        id\n        name\n      }\n      proficiency\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreateSkillDocument,
    "\n  mutation CreateSocialLink($input: CreateSocialLinkInput!) {\n    createSocialLink(input: $input) {\n      id\n      platform\n      url\n      label\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreateSocialLinkDocument,
    "\n  query Me {\n    me {\n      userId\n      email\n      name\n      roles\n      firstName\n      lastName\n      avatarUrl\n      bio\n      headline\n      location\n    }\n  }\n": types.MeDocument,
    "\n  mutation DeleteAward($id: String!) {\n    deleteAward(id: $id) {\n      success\n    }\n  }\n": types.DeleteAwardDocument,
    "\n  mutation DeleteCertification($id: String!) {\n    deleteCertification(id: $id) {\n      success\n    }\n  }\n": types.DeleteCertificationDocument,
    "\n  mutation DeleteEducation($id: String!) {\n    deleteEducation(id: $id) {\n      success\n    }\n  }\n": types.DeleteEducationDocument,
    "\n  mutation DeleteExperience($id: String!) {\n    deleteExperience(id: $id) {\n      success\n    }\n  }\n": types.DeleteExperienceDocument,
    "\n  mutation DeleteHobby($id: String!) {\n    deleteHobby(id: $id) {\n      success\n    }\n  }\n": types.DeleteHobbyDocument,
    "\n  mutation DeleteLanguage($id: String!) {\n    deleteLanguage(id: $id) {\n      success\n    }\n  }\n": types.DeleteLanguageDocument,
    "\n  mutation DeleteProject($id: String!) {\n    deleteProject(id: $id) {\n      success\n    }\n  }\n": types.DeleteProjectDocument,
    "\n  mutation DeleteSkillCategory($id: String!) {\n    deleteSkillCategory(id: $id) {\n      success\n    }\n  }\n": types.DeleteSkillCategoryDocument,
    "\n  mutation DeleteSkill($id: String!) {\n    deleteSkill(id: $id) {\n      success\n    }\n  }\n": types.DeleteSkillDocument,
    "\n  mutation DeleteSocialLink($id: String!) {\n    deleteSocialLink(id: $id) {\n      success\n    }\n  }\n": types.DeleteSocialLinkDocument,
    "\n  query Health {\n    health\n  }\n": types.HealthDocument,
    "\n  query GetItem($id: String!) {\n    getItem(id: $id) {\n      id\n      name\n      description\n      createdAt\n    }\n  }\n": types.GetItemDocument,
    "\n  query GetItems($page: Float = 1, $limit: Float = 10) {\n    getItems(page: $page, limit: $limit) {\n      items {\n        id\n        name\n        description\n        createdAt\n      }\n      total\n    }\n  }\n": types.GetItemsDocument,
    "\n  query GetPublicProfile($userId: String!) {\n    getPublicProfile(userId: $userId) {\n      userId\n      email\n      firstName\n      lastName\n      avatarUrl\n      bio\n      headline\n      location\n      socialLinks {\n        id\n        platform\n        url\n        label\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      projects {\n        id\n        title\n        description\n        images\n        liveUrl\n        repoUrl\n        tags\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      skillCategories {\n        id\n        name\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      skills {\n        id\n        name\n        categoryId\n        category {\n          id\n          name\n        }\n        proficiency\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      experiences {\n        id\n        company\n        role\n        description\n        startDate\n        endDate\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      education {\n        id\n        school\n        degree\n        field\n        startDate\n        endDate\n        description\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      certifications {\n        id\n        name\n        issuer\n        issueDate\n        expiryDate\n        url\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      languages {\n        id\n        name\n        proficiency\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      awards {\n        id\n        title\n        issuer\n        date\n        description\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      hobbies {\n        id\n        name\n        description\n        sortOrder\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.GetPublicProfileDocument,
    "\n  mutation ReorderAwards($input: ReorderInput!) {\n    reorderAwards(input: $input) {\n      success\n    }\n  }\n": types.ReorderAwardsDocument,
    "\n  mutation ReorderCertifications($input: ReorderInput!) {\n    reorderCertifications(input: $input) {\n      success\n    }\n  }\n": types.ReorderCertificationsDocument,
    "\n  mutation ReorderEducation($input: ReorderInput!) {\n    reorderEducation(input: $input) {\n      success\n    }\n  }\n": types.ReorderEducationDocument,
    "\n  mutation ReorderExperiences($input: ReorderInput!) {\n    reorderExperiences(input: $input) {\n      success\n    }\n  }\n": types.ReorderExperiencesDocument,
    "\n  mutation ReorderHobbies($input: ReorderInput!) {\n    reorderHobbies(input: $input) {\n      success\n    }\n  }\n": types.ReorderHobbiesDocument,
    "\n  mutation ReorderLanguages($input: ReorderInput!) {\n    reorderLanguages(input: $input) {\n      success\n    }\n  }\n": types.ReorderLanguagesDocument,
    "\n  mutation ReorderProjects($input: ReorderInput!) {\n    reorderProjects(input: $input) {\n      success\n    }\n  }\n": types.ReorderProjectsDocument,
    "\n  mutation ReorderSkills($input: ReorderInput!) {\n    reorderSkills(input: $input) {\n      success\n    }\n  }\n": types.ReorderSkillsDocument,
    "\n  mutation ReorderSocialLinks($input: ReorderInput!) {\n    reorderSocialLinks(input: $input) {\n      success\n    }\n  }\n": types.ReorderSocialLinksDocument,
    "\n  query GetSkillCategories {\n    getSkillCategories {\n      id\n      name\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetSkillCategoriesDocument,
    "\n  mutation UpdateAward($id: String!, $input: UpdateAwardInput!) {\n    updateAward(id: $id, input: $input) {\n      id\n      title\n      issuer\n      date\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdateAwardDocument,
    "\n  mutation UpdateCertification($id: String!, $input: UpdateCertificationInput!) {\n    updateCertification(id: $id, input: $input) {\n      id\n      name\n      issuer\n      issueDate\n      expiryDate\n      url\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdateCertificationDocument,
    "\n  mutation UpdateEducation($id: String!, $input: UpdateEducationInput!) {\n    updateEducation(id: $id, input: $input) {\n      id\n      school\n      degree\n      field\n      startDate\n      endDate\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdateEducationDocument,
    "\n  mutation UpdateExperience($id: String!, $input: UpdateExperienceInput!) {\n    updateExperience(id: $id, input: $input) {\n      id\n      company\n      role\n      description\n      startDate\n      endDate\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdateExperienceDocument,
    "\n  mutation UpdateHobby($id: String!, $input: UpdateHobbyInput!) {\n    updateHobby(id: $id, input: $input) {\n      id\n      name\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdateHobbyDocument,
    "\n  mutation UpdateLanguage($id: String!, $input: UpdateLanguageInput!) {\n    updateLanguage(id: $id, input: $input) {\n      id\n      name\n      proficiency\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdateLanguageDocument,
    "\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      userId\n      email\n      name\n      roles\n      firstName\n      lastName\n      avatarUrl\n      bio\n      headline\n      location\n    }\n  }\n": types.UpdateProfileDocument,
    "\n  mutation UpdateProject($id: String!, $input: UpdateProjectInput!) {\n    updateProject(id: $id, input: $input) {\n      id\n      title\n      description\n      images\n      liveUrl\n      repoUrl\n      tags\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdateProjectDocument,
    "\n  mutation UpdateSkill($id: String!, $input: UpdateSkillInput!) {\n    updateSkill(id: $id, input: $input) {\n      id\n      name\n      categoryId\n      category {\n        id\n        name\n      }\n      proficiency\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdateSkillDocument,
    "\n  mutation UpdateSocialLink($id: String!, $input: UpdateSocialLinkInput!) {\n    updateSocialLink(id: $id, input: $input) {\n      id\n      platform\n      url\n      label\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdateSocialLinkDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateAward($input: CreateAwardInput!) {\n    createAward(input: $input) {\n      id\n      title\n      issuer\n      date\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateAward($input: CreateAwardInput!) {\n    createAward(input: $input) {\n      id\n      title\n      issuer\n      date\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCertification($input: CreateCertificationInput!) {\n    createCertification(input: $input) {\n      id\n      name\n      issuer\n      issueDate\n      expiryDate\n      url\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCertification($input: CreateCertificationInput!) {\n    createCertification(input: $input) {\n      id\n      name\n      issuer\n      issueDate\n      expiryDate\n      url\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateEducation($input: CreateEducationInput!) {\n    createEducation(input: $input) {\n      id\n      school\n      degree\n      field\n      startDate\n      endDate\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateEducation($input: CreateEducationInput!) {\n    createEducation(input: $input) {\n      id\n      school\n      degree\n      field\n      startDate\n      endDate\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateExperience($input: CreateExperienceInput!) {\n    createExperience(input: $input) {\n      id\n      company\n      role\n      description\n      startDate\n      endDate\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateExperience($input: CreateExperienceInput!) {\n    createExperience(input: $input) {\n      id\n      company\n      role\n      description\n      startDate\n      endDate\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateHobby($input: CreateHobbyInput!) {\n    createHobby(input: $input) {\n      id\n      name\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateHobby($input: CreateHobbyInput!) {\n    createHobby(input: $input) {\n      id\n      name\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateItem($name: String!, $description: String) {\n    createItem(name: $name, description: $description) {\n      id\n      name\n      description\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateItem($name: String!, $description: String) {\n    createItem(name: $name, description: $description) {\n      id\n      name\n      description\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateLanguage($input: CreateLanguageInput!) {\n    createLanguage(input: $input) {\n      id\n      name\n      proficiency\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateLanguage($input: CreateLanguageInput!) {\n    createLanguage(input: $input) {\n      id\n      name\n      proficiency\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      id\n      title\n      description\n      images\n      liveUrl\n      repoUrl\n      tags\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      id\n      title\n      description\n      images\n      liveUrl\n      repoUrl\n      tags\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateSkillCategory($input: CreateSkillCategoryInput!) {\n    createSkillCategory(input: $input) {\n      id\n      name\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateSkillCategory($input: CreateSkillCategoryInput!) {\n    createSkillCategory(input: $input) {\n      id\n      name\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateSkill($input: CreateSkillInput!) {\n    createSkill(input: $input) {\n      id\n      name\n      categoryId\n      category {\n        id\n        name\n      }\n      proficiency\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateSkill($input: CreateSkillInput!) {\n    createSkill(input: $input) {\n      id\n      name\n      categoryId\n      category {\n        id\n        name\n      }\n      proficiency\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateSocialLink($input: CreateSocialLinkInput!) {\n    createSocialLink(input: $input) {\n      id\n      platform\n      url\n      label\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateSocialLink($input: CreateSocialLinkInput!) {\n    createSocialLink(input: $input) {\n      id\n      platform\n      url\n      label\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      userId\n      email\n      name\n      roles\n      firstName\n      lastName\n      avatarUrl\n      bio\n      headline\n      location\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      userId\n      email\n      name\n      roles\n      firstName\n      lastName\n      avatarUrl\n      bio\n      headline\n      location\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteAward($id: String!) {\n    deleteAward(id: $id) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteAward($id: String!) {\n    deleteAward(id: $id) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCertification($id: String!) {\n    deleteCertification(id: $id) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteCertification($id: String!) {\n    deleteCertification(id: $id) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteEducation($id: String!) {\n    deleteEducation(id: $id) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteEducation($id: String!) {\n    deleteEducation(id: $id) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteExperience($id: String!) {\n    deleteExperience(id: $id) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteExperience($id: String!) {\n    deleteExperience(id: $id) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteHobby($id: String!) {\n    deleteHobby(id: $id) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteHobby($id: String!) {\n    deleteHobby(id: $id) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteLanguage($id: String!) {\n    deleteLanguage(id: $id) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteLanguage($id: String!) {\n    deleteLanguage(id: $id) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteProject($id: String!) {\n    deleteProject(id: $id) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteProject($id: String!) {\n    deleteProject(id: $id) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteSkillCategory($id: String!) {\n    deleteSkillCategory(id: $id) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteSkillCategory($id: String!) {\n    deleteSkillCategory(id: $id) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteSkill($id: String!) {\n    deleteSkill(id: $id) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteSkill($id: String!) {\n    deleteSkill(id: $id) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteSocialLink($id: String!) {\n    deleteSocialLink(id: $id) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteSocialLink($id: String!) {\n    deleteSocialLink(id: $id) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Health {\n    health\n  }\n"): (typeof documents)["\n  query Health {\n    health\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetItem($id: String!) {\n    getItem(id: $id) {\n      id\n      name\n      description\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query GetItem($id: String!) {\n    getItem(id: $id) {\n      id\n      name\n      description\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetItems($page: Float = 1, $limit: Float = 10) {\n    getItems(page: $page, limit: $limit) {\n      items {\n        id\n        name\n        description\n        createdAt\n      }\n      total\n    }\n  }\n"): (typeof documents)["\n  query GetItems($page: Float = 1, $limit: Float = 10) {\n    getItems(page: $page, limit: $limit) {\n      items {\n        id\n        name\n        description\n        createdAt\n      }\n      total\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPublicProfile($userId: String!) {\n    getPublicProfile(userId: $userId) {\n      userId\n      email\n      firstName\n      lastName\n      avatarUrl\n      bio\n      headline\n      location\n      socialLinks {\n        id\n        platform\n        url\n        label\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      projects {\n        id\n        title\n        description\n        images\n        liveUrl\n        repoUrl\n        tags\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      skillCategories {\n        id\n        name\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      skills {\n        id\n        name\n        categoryId\n        category {\n          id\n          name\n        }\n        proficiency\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      experiences {\n        id\n        company\n        role\n        description\n        startDate\n        endDate\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      education {\n        id\n        school\n        degree\n        field\n        startDate\n        endDate\n        description\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      certifications {\n        id\n        name\n        issuer\n        issueDate\n        expiryDate\n        url\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      languages {\n        id\n        name\n        proficiency\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      awards {\n        id\n        title\n        issuer\n        date\n        description\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      hobbies {\n        id\n        name\n        description\n        sortOrder\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPublicProfile($userId: String!) {\n    getPublicProfile(userId: $userId) {\n      userId\n      email\n      firstName\n      lastName\n      avatarUrl\n      bio\n      headline\n      location\n      socialLinks {\n        id\n        platform\n        url\n        label\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      projects {\n        id\n        title\n        description\n        images\n        liveUrl\n        repoUrl\n        tags\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      skillCategories {\n        id\n        name\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      skills {\n        id\n        name\n        categoryId\n        category {\n          id\n          name\n        }\n        proficiency\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      experiences {\n        id\n        company\n        role\n        description\n        startDate\n        endDate\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      education {\n        id\n        school\n        degree\n        field\n        startDate\n        endDate\n        description\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      certifications {\n        id\n        name\n        issuer\n        issueDate\n        expiryDate\n        url\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      languages {\n        id\n        name\n        proficiency\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      awards {\n        id\n        title\n        issuer\n        date\n        description\n        sortOrder\n        createdAt\n        updatedAt\n      }\n      hobbies {\n        id\n        name\n        description\n        sortOrder\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReorderAwards($input: ReorderInput!) {\n    reorderAwards(input: $input) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation ReorderAwards($input: ReorderInput!) {\n    reorderAwards(input: $input) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReorderCertifications($input: ReorderInput!) {\n    reorderCertifications(input: $input) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation ReorderCertifications($input: ReorderInput!) {\n    reorderCertifications(input: $input) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReorderEducation($input: ReorderInput!) {\n    reorderEducation(input: $input) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation ReorderEducation($input: ReorderInput!) {\n    reorderEducation(input: $input) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReorderExperiences($input: ReorderInput!) {\n    reorderExperiences(input: $input) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation ReorderExperiences($input: ReorderInput!) {\n    reorderExperiences(input: $input) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReorderHobbies($input: ReorderInput!) {\n    reorderHobbies(input: $input) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation ReorderHobbies($input: ReorderInput!) {\n    reorderHobbies(input: $input) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReorderLanguages($input: ReorderInput!) {\n    reorderLanguages(input: $input) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation ReorderLanguages($input: ReorderInput!) {\n    reorderLanguages(input: $input) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReorderProjects($input: ReorderInput!) {\n    reorderProjects(input: $input) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation ReorderProjects($input: ReorderInput!) {\n    reorderProjects(input: $input) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReorderSkills($input: ReorderInput!) {\n    reorderSkills(input: $input) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation ReorderSkills($input: ReorderInput!) {\n    reorderSkills(input: $input) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReorderSocialLinks($input: ReorderInput!) {\n    reorderSocialLinks(input: $input) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation ReorderSocialLinks($input: ReorderInput!) {\n    reorderSocialLinks(input: $input) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSkillCategories {\n    getSkillCategories {\n      id\n      name\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetSkillCategories {\n    getSkillCategories {\n      id\n      name\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateAward($id: String!, $input: UpdateAwardInput!) {\n    updateAward(id: $id, input: $input) {\n      id\n      title\n      issuer\n      date\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateAward($id: String!, $input: UpdateAwardInput!) {\n    updateAward(id: $id, input: $input) {\n      id\n      title\n      issuer\n      date\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCertification($id: String!, $input: UpdateCertificationInput!) {\n    updateCertification(id: $id, input: $input) {\n      id\n      name\n      issuer\n      issueDate\n      expiryDate\n      url\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCertification($id: String!, $input: UpdateCertificationInput!) {\n    updateCertification(id: $id, input: $input) {\n      id\n      name\n      issuer\n      issueDate\n      expiryDate\n      url\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateEducation($id: String!, $input: UpdateEducationInput!) {\n    updateEducation(id: $id, input: $input) {\n      id\n      school\n      degree\n      field\n      startDate\n      endDate\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateEducation($id: String!, $input: UpdateEducationInput!) {\n    updateEducation(id: $id, input: $input) {\n      id\n      school\n      degree\n      field\n      startDate\n      endDate\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateExperience($id: String!, $input: UpdateExperienceInput!) {\n    updateExperience(id: $id, input: $input) {\n      id\n      company\n      role\n      description\n      startDate\n      endDate\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateExperience($id: String!, $input: UpdateExperienceInput!) {\n    updateExperience(id: $id, input: $input) {\n      id\n      company\n      role\n      description\n      startDate\n      endDate\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateHobby($id: String!, $input: UpdateHobbyInput!) {\n    updateHobby(id: $id, input: $input) {\n      id\n      name\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateHobby($id: String!, $input: UpdateHobbyInput!) {\n    updateHobby(id: $id, input: $input) {\n      id\n      name\n      description\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateLanguage($id: String!, $input: UpdateLanguageInput!) {\n    updateLanguage(id: $id, input: $input) {\n      id\n      name\n      proficiency\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateLanguage($id: String!, $input: UpdateLanguageInput!) {\n    updateLanguage(id: $id, input: $input) {\n      id\n      name\n      proficiency\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      userId\n      email\n      name\n      roles\n      firstName\n      lastName\n      avatarUrl\n      bio\n      headline\n      location\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      userId\n      email\n      name\n      roles\n      firstName\n      lastName\n      avatarUrl\n      bio\n      headline\n      location\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProject($id: String!, $input: UpdateProjectInput!) {\n    updateProject(id: $id, input: $input) {\n      id\n      title\n      description\n      images\n      liveUrl\n      repoUrl\n      tags\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProject($id: String!, $input: UpdateProjectInput!) {\n    updateProject(id: $id, input: $input) {\n      id\n      title\n      description\n      images\n      liveUrl\n      repoUrl\n      tags\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateSkill($id: String!, $input: UpdateSkillInput!) {\n    updateSkill(id: $id, input: $input) {\n      id\n      name\n      categoryId\n      category {\n        id\n        name\n      }\n      proficiency\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateSkill($id: String!, $input: UpdateSkillInput!) {\n    updateSkill(id: $id, input: $input) {\n      id\n      name\n      categoryId\n      category {\n        id\n        name\n      }\n      proficiency\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateSocialLink($id: String!, $input: UpdateSocialLinkInput!) {\n    updateSocialLink(id: $id, input: $input) {\n      id\n      platform\n      url\n      label\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateSocialLink($id: String!, $input: UpdateSocialLinkInput!) {\n    updateSocialLink(id: $id, input: $input) {\n      id\n      platform\n      url\n      label\n      sortOrder\n      createdAt\n      updatedAt\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;