#!/usr/bin/env node

/**
 * Shared test utilities for type system tests
 * Provides common testing patterns and assertions
 */

const assert = require('assert');

/**
 * Test runner that executes tests and reports results
 */
class TestRunner {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  /**
   * Register a test function
   */
  test(name, testFn) {
    this.tests.push({ name, testFn });
  }

  /**
   * Run all registered tests
   */
  async run() {
    console.log('🧪 Starting test suite...\n');

    for (const { name, testFn } of this.tests) {
      try {
        console.log(`🔍 ${name}...`);
        await testFn();
        console.log(`✅ ${name} passed`);
        this.passed++;
      } catch (error) {
        console.error(`❌ ${name} failed:`, error.message);
        this.failed++;
      }
    }

    console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed`);

    if (this.failed > 0) {
      process.exit(1);
    }
  }
}

/**
 * Test utilities for type validation
 */
const typeUtils = {
  /**
   * Assert that a value has the expected type
   */
  assertType(value, expectedType, message = '') {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    assert.strictEqual(actualType, expectedType,
      `${message} Expected ${expectedType}, got ${actualType}`);
  },

  /**
   * Assert that a value is one of the allowed types
   */
  assertTypeIn(value, allowedTypes, message = '') {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    assert(allowedTypes.includes(actualType),
      `${message} Expected one of [${allowedTypes.join(', ')}], got ${actualType}`);
  },

  /**
   * Assert that a value is a valid JSON type (including arrays)
   */
  assertValidJsonType(value, message = '') {
    const validTypes = ['string', 'number', 'boolean', 'object', 'array'];
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    assert(validTypes.includes(actualType),
      `${message} Expected valid JSON type, got ${actualType}`);
  },

  /**
   * Assert that an object has all required properties
   */
  assertHasProperties(obj, requiredProps, message = '') {
    requiredProps.forEach(prop => {
      assert(obj.hasOwnProperty(prop),
        `${message} Missing required property: ${prop}`);
    });
  },

  /**
   * Assert that a value is within a range
   */
  assertInRange(value, min, max, message = '') {
    assert(value >= min && value <= max,
      `${message} Expected ${value} to be between ${min} and ${max}`);
  },

  /**
   * Assert that an array has the expected length
   */
  assertLength(arr, expectedLength, message = '') {
    assert(Array.isArray(arr), `${message} Expected array`);
    assert.strictEqual(arr.length, expectedLength,
      `${message} Expected length ${expectedLength}, got ${arr.length}`);
  },

  /**
   * Test that a structure matches expected shape
   */
  assertStructure(obj, expectedShape, message = '') {
    Object.entries(expectedShape).forEach(([key, expectedType]) => {
      assert(obj.hasOwnProperty(key), `${message} Missing property: ${key}`);

      const actualType = Array.isArray(obj[key]) ? 'array' : typeof obj[key];
      // Allow both 'array' and 'object' for array types since arrays are objects in JS
      const normalizedExpectedType = expectedType === 'object' ? ['object', 'array'] : [expectedType];
      assert(normalizedExpectedType.includes(actualType),
        `${message} Property ${key}: expected ${expectedType}, got ${actualType}`);
    });
  }
};

/**
 * Database table testing utilities
 */
const tableUtils = {
  /**
   * Test a table row structure
   */
  testTableRow(tableName, rowData, requiredFields) {
    console.log(`🔍 Testing ${tableName} table row structure...`);

    typeUtils.assertType(rowData, 'object', `${tableName} row should be object`);
    typeUtils.assertHasProperties(rowData, requiredFields, `${tableName} row`);

    return true;
  },

  /**
   * Test table insert operation structure
   */
  testTableInsert(tableName, insertData, requiredFields) {
    console.log(`🔍 Testing ${tableName} table insert structure...`);

    typeUtils.assertType(insertData, 'object', `${tableName} insert should be object`);
    typeUtils.assertHasProperties(insertData, requiredFields, `${tableName} insert`);

    return true;
  },

  /**
   * Test table update operation structure
   */
  testTableUpdate(tableName, updateData, allowedFields) {
    console.log(`🔍 Testing ${tableName} table update structure...`);

    typeUtils.assertType(updateData, 'object', `${tableName} update should be object`);

    // Check that all update fields are allowed
    Object.keys(updateData).forEach(field => {
      assert(allowedFields.includes(field),
        `${tableName} update: field '${field}' is not allowed for updates`);
    });

    return true;
  },

  /**
   * Test table relationships
   */
  testTableRelationships(tableName, relationships) {
    console.log(`🔍 Testing ${tableName} table relationships...`);

    typeUtils.assertType(relationships, 'array', `${tableName} relationships should be array`);
    typeUtils.assertLength(relationships, 0, `${tableName} should have no relationships`);

    return true;
  }
};

/**
 * JSON type testing utilities
 */
const jsonUtils = {
  /**
   * Test JSON type values
   */
  testJsonType() {
    console.log('🔍 Testing Json type...');

    const validJsonValues = [
      'string',
      42,
      true,
      null,
      { key: 'value' },
      [1, 2, 3],
      { nested: { object: 'value' }, array: [1, 2, { deep: 'nested' }] }
    ];

    validJsonValues.forEach((value, index) => {
      typeUtils.assertValidJsonType(value, `Json value ${index}`);
    });

    return true;
  }
};

/**
 * Create a test runner instance
 */
const runner = new TestRunner();

module.exports = {
  TestRunner,
  typeUtils,
  tableUtils,
  jsonUtils,
  runner
};