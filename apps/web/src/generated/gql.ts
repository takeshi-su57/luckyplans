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
    "\n  mutation CreateItem($name: String!, $description: String) {\n    createItem(name: $name, description: $description) {\n      id\n      name\n      description\n      createdAt\n    }\n  }\n": typeof types.CreateItemDocument,
    "\n  query Health {\n    health\n  }\n": typeof types.HealthDocument,
    "\n  query GetItem($id: String!) {\n    getItem(id: $id) {\n      id\n      name\n      description\n      createdAt\n    }\n  }\n": typeof types.GetItemDocument,
    "\n  query GetItems($page: Float = 1, $limit: Float = 10) {\n    getItems(page: $page, limit: $limit) {\n      items {\n        id\n        name\n        description\n        createdAt\n      }\n      total\n    }\n  }\n": typeof types.GetItemsDocument,
    "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      success\n      message\n      token\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Register($email: String!, $password: String!, $name: String!) {\n    register(email: $email, password: $password, name: $name) {\n      success\n      message\n      token\n    }\n  }\n": typeof types.RegisterDocument,
    "\n  query ValidateToken($token: String!) {\n    validateToken(token: $token) {\n      success\n      message\n      token\n    }\n  }\n": typeof types.ValidateTokenDocument,
};
const documents: Documents = {
    "\n  mutation CreateItem($name: String!, $description: String) {\n    createItem(name: $name, description: $description) {\n      id\n      name\n      description\n      createdAt\n    }\n  }\n": types.CreateItemDocument,
    "\n  query Health {\n    health\n  }\n": types.HealthDocument,
    "\n  query GetItem($id: String!) {\n    getItem(id: $id) {\n      id\n      name\n      description\n      createdAt\n    }\n  }\n": types.GetItemDocument,
    "\n  query GetItems($page: Float = 1, $limit: Float = 10) {\n    getItems(page: $page, limit: $limit) {\n      items {\n        id\n        name\n        description\n        createdAt\n      }\n      total\n    }\n  }\n": types.GetItemsDocument,
    "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      success\n      message\n      token\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Register($email: String!, $password: String!, $name: String!) {\n    register(email: $email, password: $password, name: $name) {\n      success\n      message\n      token\n    }\n  }\n": types.RegisterDocument,
    "\n  query ValidateToken($token: String!) {\n    validateToken(token: $token) {\n      success\n      message\n      token\n    }\n  }\n": types.ValidateTokenDocument,
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
export function graphql(source: "\n  mutation CreateItem($name: String!, $description: String) {\n    createItem(name: $name, description: $description) {\n      id\n      name\n      description\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateItem($name: String!, $description: String) {\n    createItem(name: $name, description: $description) {\n      id\n      name\n      description\n      createdAt\n    }\n  }\n"];
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
export function graphql(source: "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      success\n      message\n      token\n    }\n  }\n"): (typeof documents)["\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      success\n      message\n      token\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register($email: String!, $password: String!, $name: String!) {\n    register(email: $email, password: $password, name: $name) {\n      success\n      message\n      token\n    }\n  }\n"): (typeof documents)["\n  mutation Register($email: String!, $password: String!, $name: String!) {\n    register(email: $email, password: $password, name: $name) {\n      success\n      message\n      token\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ValidateToken($token: String!) {\n    validateToken(token: $token) {\n      success\n      message\n      token\n    }\n  }\n"): (typeof documents)["\n  query ValidateToken($token: String!) {\n    validateToken(token: $token) {\n      success\n      message\n      token\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;