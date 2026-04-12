/**
 * Repository instances for the application.
 *
 * Uses DynamoDB implementations for persistent storage.
 */

import { docClient, tableName } from './dynamodb/client';
import { DynamoDBStudentRepository } from './dynamodb/DynamoDBStudentRepository';
import { DynamoDBBenchmarkProgressRepository } from './dynamodb/DynamoDBBenchmarkProgressRepository';
import { DynamoDBStaffRepository } from './dynamodb/DynamoDBStaffRepository';
import { DynamoDBUserAccountRepository } from './dynamodb/DynamoDBUserAccountRepository';

// Singleton instances using DynamoDB
export const studentRepository = new DynamoDBStudentRepository(docClient, tableName);
export const progressRepository = new DynamoDBBenchmarkProgressRepository(docClient, tableName);
export const staffRepository = new DynamoDBStaffRepository(docClient, tableName);
export const userAccountRepository = new DynamoDBUserAccountRepository(docClient, tableName);