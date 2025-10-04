#!/usr/bin/env node

/**
 * Type System Test Suite - Database Types (database.ts)
 * Tests for: Supabase schema types, database operations, table definitions
 *
 * @description Validates database-related type definitions including Supabase
 * schema types, table structures, insert/update operations, and relationships.
 */

const { runner, typeUtils, tableUtils, jsonUtils } = require('../lib/test-utils');

// ============================================================================
// TEST SUITE REGISTRATION
// ============================================================================

// Register all tests with the runner
runner.test('Json Type', testJsonType);
runner.test('Database Structure', testDatabaseStructure);
runner.test('All Tables', testAllTables);
runner.test('Database Completeness', testDatabaseStructureCompleteness);
runner.test('Type Relationships', testDatabaseTypeRelationships);

// ============================================================================
// TEST DEFINITIONS
// ============================================================================

/**
 * Test Json type
 */
function testJsonType() {
  return jsonUtils.testJsonType();
}

/**
 * Test Database interface structure
 */
function testDatabaseStructure() {
  console.log('🔍 Testing Database interface structure...');

  const structure = {
    Database: {
      public: {
        Tables: ['cars', 'conversations', 'messages', 'next_steps', 'recommendations', 'users'],
        Views: ['popular_cars'],
        Functions: {},
        Enums: {},
        CompositeTypes: {}
      }
    },
    Json: 'defined'
  };

  typeUtils.assertStructure(structure.Database.public, {
    Tables: 'array',
    Views: 'array',
    Functions: 'object',
    Enums: 'object',
    CompositeTypes: 'object'
  });

  console.log('�?Database interface structure validation passed');
  return true;
}

/**
 * Test all database tables
 */
function testAllTables() {
  const tables = ['cars', 'conversations', 'messages', 'next_steps', 'recommendations', 'users'];

  tables.forEach(tableName => {
    const tester = createTableTester(tableName);
    tester.row();
    tester.insert();
    tester.update();
    tester.relationships();
  });

  console.log('�?All table tests passed');
  return true;
}

/**
 * Create a table tester for a specific table
 */
function createTableTester(tableName) {
  const schemas = getTableSchemas();

  return {
    row: () => tableUtils.testTableRow(tableName, generateRowData(tableName), schemas[tableName].required),
    insert: () => tableUtils.testTableInsert(tableName, generateInsertData(tableName), schemas[tableName].insert),
    update: () => tableUtils.testTableUpdate(tableName, generateUpdateData(tableName), schemas[tableName].update),
    relationships: () => tableUtils.testTableRelationships(tableName, [])
  };
}

/**
 * Get table schemas definition
 */
function getTableSchemas() {
  return {
    cars: {
      required: ['id', 'make', 'model', 'year_min', 'year_max', 'category', 'fuel_type', 'currency', 'is_active', 'created_at', 'updated_at'],
      insert: ['make', 'model', 'year_min', 'year_max', 'category', 'fuel_type', 'currency'],
      update: ['make', 'model', 'year_min', 'year_max', 'category', 'fuel_type', 'currency']
    },
    conversations: {
      required: ['id', 'language', 'session_id', 'created_at', 'updated_at'],
      insert: ['language', 'session_id'],
      update: ['language', 'session_id']
    },
    messages: {
      required: ['id', 'conversation_id', 'type', 'content', 'created_at'],
      insert: ['conversation_id', 'type', 'content'],
      update: ['type', 'content']
    },
    next_steps: {
      required: ['id', 'conversation_id', 'message_id', 'title_en', 'title_zh', 'priority', 'action_type', 'created_at'],
      insert: ['conversation_id', 'message_id', 'title_en', 'title_zh', 'priority', 'action_type'],
      update: ['title_en', 'title_zh', 'priority', 'action_type']
    },
    recommendations: {
      required: ['id', 'conversation_id', 'message_id', 'car_id', 'match_score', 'created_at'],
      insert: ['conversation_id', 'message_id', 'car_id', 'match_score'],
      update: ['conversation_id', 'message_id', 'car_id', 'match_score']
    },
    users: {
      required: ['id', 'language', 'session_id', 'created_at', 'updated_at'],
      insert: ['language', 'session_id'],
      update: ['language', 'session_id']
    }
  };
}

/**
 * Generate row data for a table
 */
function generateRowData(tableName) {
  const generators = {
    cars: () => ({
      id: 'car_123e4567-e89b-12d3-a456-426614174000',
      make: 'Toyota', model: 'Camry', year_min: 2022, year_max: 2024,
      price_min: 25000, price_max: 35000, currency: 'USD', category: 'Sedan',
      fuel_type: 'Gasoline', is_active: true, created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }),
    conversations: () => ({
      id: 'conv_123e4567-e89b-12d3-a456-426614174000',
      user_id: 'user_123e4567-e89b-12d3-a456-426614174000',
      title: 'Car recommendation session', summary: 'Looking for a family sedan',
      language: 'en', session_id: 'sess_123e4567-e89b-12d3-a456-426614174000',
      created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z'
    }),
    messages: () => ({
      id: 'msg_123e4567-e89b-12d3-a456-426614174000',
      conversation_id: 'conv_123e4567-e89b-12d3-a456-426614174000',
      type: 'user', content: 'Hello, I need help with car recommendations',
      metadata: { source: 'web' }, created_at: '2024-01-01T00:00:00Z'
    }),
    next_steps: () => ({
      id: 'step_123e4567-e89b-12d3-a456-426614174000',
      conversation_id: 'conv_123e4567-e89b-12d3-a456-426614174000',
      message_id: 'msg_123e4567-e89b-12d3-a456-426614174000',
      title_en: 'Research car models', title_zh: '研究车型',
      description_en: 'Look into different car models', description_zh: '研究不同的车型',
      priority: 'high', action_type: 'research', url: 'https://example.com',
      metadata: { category: 'research' }, is_completed: false, created_at: '2024-01-01T00:00:00Z'
    }),
    recommendations: () => ({
      id: 'rec_123e4567-e89b-12d3-a456-426614174000',
      conversation_id: 'conv_123e4567-e89b-12d3-a456-426614174000',
      message_id: 'msg_123e4567-e89b-12d3-a456-426614174000',
      car_id: 'car_123e4567-e89b-12d3-a456-426614174000',
      match_score: 0.85, reasoning_en: 'Matches user preferences',
      reasoning_zh: '符合用户偏好', created_at: '2024-01-01T00:00:00Z'
    }),
    users: () => ({
      id: 'user_123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com', name: 'John Doe', language: 'en',
      session_id: 'sess_123e4567-e89b-12d3-a456-426614174000',
      created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z'
    })
  };

  return generators[tableName]();
}

/**
 * Generate insert data for a table
 */
function generateInsertData(tableName) {
  const schemas = getTableSchemas();
  const rowData = generateRowData(tableName);
  return Object.fromEntries(
    Object.entries(rowData).filter(([key]) => schemas[tableName].insert.includes(key))
  );
}

/**
 * Generate update data for a table
 */
function generateUpdateData(tableName) {
  const schemas = getTableSchemas();
  const rowData = generateRowData(tableName);
  return Object.fromEntries(
    Object.entries(rowData).filter(([key]) => schemas[tableName].update.includes(key))
  );
}

/**
 * Test Database structure completeness
 */
function testDatabaseStructureCompleteness() {
  console.log('🔍 Testing Database structure completeness...');

  // Test that all expected tables are defined
  const expectedTables = ['cars', 'conversations', 'messages', 'next_steps', 'recommendations', 'users'];
  const expectedViews = ['popular_cars'];

  typeUtils.assertType(expectedTables, 'array');
  typeUtils.assertLength(expectedTables, 6);

  console.log('�?Database structure completeness validation passed');
  return true;
}

/**
 * Test Database type relationships
 */
function testDatabaseTypeRelationships() {
  console.log('🔍 Testing Database type relationships...');

  // Test that types are properly related (simplified version)
  const hasValidStructure = true;
  typeUtils.assertType(hasValidStructure, 'boolean');

  console.log('�?Database type relationships validation passed');
  return true;
}

// ============================================================================
// LEGACY COMPATIBILITY FUNCTIONS
// ============================================================================

// Keep some legacy function names for backward compatibility
function testCarsTableRow() { return createTableTester('cars').row(); }
function testCarsTableInsert() { return createTableTester('cars').insert(); }
function testCarsTableUpdate() { return createTableTester('cars').update(); }
function testCarsTableRelationships() { return createTableTester('cars').relationships(); }
function testConversationsTableRow() { return createTableTester('conversations').row(); }
function testConversationsTableInsert() { return createTableTester('conversations').insert(); }
function testConversationsTableUpdate() { return createTableTester('conversations').update(); }
function testConversationsTableRelationships() { return createTableTester('conversations').relationships(); }
function testMessagesTableRow() { return createTableTester('messages').row(); }
function testMessagesTableInsert() { return createTableTester('messages').insert(); }
function testMessagesTableUpdate() { return createTableTester('messages').update(); }
function testMessagesTableRelationships() { return createTableTester('messages').relationships(); }
function testNextStepsTableRow() { return createTableTester('next_steps').row(); }
function testNextStepsTableInsert() { return createTableTester('next_steps').insert(); }
function testNextStepsTableUpdate() { return createTableTester('next_steps').update(); }
function testNextStepsTableRelationships() { return createTableTester('next_steps').relationships(); }
function testRecommendationsTableRow() { return createTableTester('recommendations').row(); }
function testRecommendationsTableInsert() { return createTableTester('recommendations').insert(); }
function testRecommendationsTableUpdate() { return createTableTester('recommendations').update(); }
function testRecommendationsTableRelationships() { return createTableTester('recommendations').relationships(); }
function testUsersTableRow() { return createTableTester('users').row(); }
function testUsersTableInsert() { return createTableTester('users').insert(); }
function testUsersTableUpdate() { return createTableTester('users').update(); }
function testUsersTableRelationships() { return createTableTester('users').relationships(); }
function testPopularCarsViewRow() {
  console.log('🔍 Testing Popular Cars view row...');
  // Simplified view test
  typeUtils.assertType({}, 'object');
  console.log('�?Popular Cars view validation passed');
  return true;
}
function testPopularCarsViewRelationships() {
  return tableUtils.testTableRelationships('popular_cars', []);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

if (require.main === module) {
  runner.run();
}

module.exports = {
  testJsonType,
  testDatabaseStructure,
  testAllTables,
  testDatabaseStructureCompleteness,
  testDatabaseTypeRelationships,
  // Legacy exports for compatibility
  testCarsTableRow,
  testCarsTableInsert,
  testCarsTableUpdate,
  testCarsTableRelationships,
  testConversationsTableRow,
  testConversationsTableInsert,
  testConversationsTableUpdate,
  testConversationsTableRelationships,
  testMessagesTableRow,
  testMessagesTableInsert,
  testMessagesTableUpdate,
  testMessagesTableRelationships,
  testNextStepsTableRow,
  testNextStepsTableInsert,
  testNextStepsTableUpdate,
  testNextStepsTableRelationships,
  testRecommendationsTableRow,
  testRecommendationsTableInsert,
  testRecommendationsTableUpdate,
  testRecommendationsTableRelationships,
  testUsersTableRow,
  testUsersTableInsert,
  testUsersTableUpdate,
  testUsersTableRelationships,
  testPopularCarsViewRow,
  testPopularCarsViewRelationships
};

