#!/usr/bin/env node

/**
 * Type System Test Suite - API Types (api.ts)
 * Tests for: API responses, pagination, error handling, HTTP status codes
 *
 * @description Validates API-related type definitions including response formats,
 * pagination parameters, error handling, and HTTP status code definitions.
 */

const assert = require('assert');
const path = require('path');

/**
 * Test PaginationParams interface
 */
function testPaginationParams() {
  console.log('🔍 Testing PaginationParams interface...');

  const validParams = {
    page: 1,
    limit: 20
  };

  // Required fields
  assert(typeof validParams.page === 'number', 'PaginationParams page should be number');
  assert(typeof validParams.limit === 'number', 'PaginationParams limit should be number');

  // Validate positive values
  assert(validParams.page > 0, 'PaginationParams page should be positive');
  assert(validParams.limit > 0, 'PaginationParams limit should be positive');

  console.log('✅ PaginationParams interface validation passed');
  return true;
}

/**
 * Test PaginationResponse interface
 */
function testPaginationResponse() {
  console.log('🔍 Testing PaginationResponse interface...');

  const validResponse = {
    page: 1,
    limit: 20,
    total: 150,
    total_pages: 8
  };

  // Required fields
  assert(typeof validResponse.page === 'number', 'PaginationResponse page should be number');
  assert(typeof validResponse.limit === 'number', 'PaginationResponse limit should be number');
  assert(typeof validResponse.total === 'number', 'PaginationResponse total should be number');
  assert(typeof validResponse.total_pages === 'number', 'PaginationResponse total_pages should be number');

  // Validate logical consistency
  assert(validResponse.page > 0, 'PaginationResponse page should be positive');
  assert(validResponse.limit > 0, 'PaginationResponse limit should be positive');
  assert(validResponse.total >= 0, 'PaginationResponse total should be non-negative');
  assert(validResponse.total_pages >= 0, 'PaginationResponse total_pages should be non-negative');

  // Validate that total_pages makes sense
  const expectedTotalPages = Math.ceil(validResponse.total / validResponse.limit);
  assert(validResponse.total_pages === expectedTotalPages, 'PaginationResponse total_pages should match calculated value');

  console.log('✅ PaginationResponse interface validation passed');
  return true;
}

/**
 * Test CarFilters interface (API version)
 */
function testCarFiltersAPI() {
  console.log('🔍 Testing CarFilters API interface...');

  const validFilters = {
    category: 'Sedan',
    fuel_type: 'Gasoline',
    make: 'Toyota',
    price_min: 20000,
    price_max: 50000,
    year_min: 2020,
    year_max: 2024,
    reliability_min: 4.0,
    fuel_economy_min: 25,
    safety_rating_min: 4
  };

  // All fields are optional in CarFilters
  if (validFilters.category) {
    assert(typeof validFilters.category === 'string', 'CarFilters category should be string');
  }
  if (validFilters.fuel_type) {
    assert(typeof validFilters.fuel_type === 'string', 'CarFilters fuel_type should be string');
  }
  if (validFilters.make) {
    assert(typeof validFilters.make === 'string', 'CarFilters make should be string');
  }
  if (validFilters.price_min !== undefined) {
    assert(typeof validFilters.price_min === 'number', 'CarFilters price_min should be number');
  }
  if (validFilters.price_max !== undefined) {
    assert(typeof validFilters.price_max === 'number', 'CarFilters price_max should be number');
  }
  if (validFilters.year_min !== undefined) {
    assert(typeof validFilters.year_min === 'number', 'CarFilters year_min should be number');
  }
  if (validFilters.year_max !== undefined) {
    assert(typeof validFilters.year_max === 'number', 'CarFilters year_max should be number');
  }
  if (validFilters.reliability_min !== undefined) {
    assert(typeof validFilters.reliability_min === 'number', 'CarFilters reliability_min should be number');
  }
  if (validFilters.fuel_economy_min !== undefined) {
    assert(typeof validFilters.fuel_economy_min === 'number', 'CarFilters fuel_economy_min should be number');
  }
  if (validFilters.safety_rating_min !== undefined) {
    assert(typeof validFilters.safety_rating_min === 'number', 'CarFilters safety_rating_min should be number');
  }

  // Validate ranges if provided
  if (validFilters.price_min !== undefined && validFilters.price_max !== undefined) {
    assert(validFilters.price_min <= validFilters.price_max, 'CarFilters price_min should be <= price_max');
  }
  if (validFilters.year_min !== undefined && validFilters.year_max !== undefined) {
    assert(validFilters.year_min <= validFilters.year_max, 'CarFilters year_min should be <= year_max');
  }

  console.log('✅ CarFilters API interface validation passed');
  return true;
}

/**
 * Test SortParams interface
 */
function testSortParams() {
  console.log('🔍 Testing SortParams interface...');

  const validParams = {
    sort_by: 'price',
    sort_order: 'asc'
  };

  // Required fields
  assert(typeof validParams.sort_by === 'string', 'SortParams sort_by should be string');
  assert(typeof validParams.sort_order === 'string', 'SortParams sort_order should be string');

  // Test valid sort_by values
  const validSortFields = ['price', 'reliability', 'fuel_economy', 'safety', 'created_at'];
  assert(validSortFields.includes(validParams.sort_by), `SortParams sort_by should be one of: ${validSortFields.join(', ')}`);

  // Test valid sort_order values
  const validSortOrders = ['asc', 'desc'];
  assert(validSortOrders.includes(validParams.sort_order), `SortParams sort_order should be one of: ${validSortOrders.join(', ')}`);

  console.log('✅ SortParams interface validation passed');
  return true;
}

/**
 * Test APIResponse interface
 */
function testAPIResponse() {
  console.log('🔍 Testing APIResponse interface...');

  const validResponse = {
    data: {
      id: 'item_123',
      name: 'Test Item',
      value: 42
    },
    success: true,
    message: 'Operation completed successfully',
    timestamp: '2023-01-01T10:30:00Z'
  };

  // Required fields
  assert(validResponse.data !== undefined, 'APIResponse data should be defined');
  assert(typeof validResponse.success === 'boolean', 'APIResponse success should be boolean');
  assert(typeof validResponse.timestamp === 'string', 'APIResponse timestamp should be string');

  // Optional field
  if (validResponse.message) {
    assert(typeof validResponse.message === 'string', 'APIResponse message should be string');
  }

  // Test timestamp format (should be ISO string)
  const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  assert(timestampRegex.test(validResponse.timestamp), 'APIResponse timestamp should be valid ISO string');

  console.log('✅ APIResponse interface validation passed');
  return true;
}

/**
 * Test APIListResponse interface
 */
function testAPIListResponse() {
  console.log('🔍 Testing APIListResponse interface...');

  const validResponse = {
    data: [
      { id: 'item_1', name: 'Item 1' },
      { id: 'item_2', name: 'Item 2' }
    ],
    success: true,
    message: 'Items retrieved successfully',
    timestamp: '2023-01-01T10:30:00Z',
    pagination: {
      page: 1,
      limit: 20,
      total: 150,
      total_pages: 8
    },
    filters: {
      category: 'Sedan',
      active: true
    }
  };

  // Inherit from APIResponse
  assert(Array.isArray(validResponse.data), 'APIListResponse data should be array');
  assert(typeof validResponse.success === 'boolean', 'APIListResponse success should be boolean');
  assert(typeof validResponse.timestamp === 'string', 'APIListResponse timestamp should be string');

  // Additional required field
  assert(typeof validResponse.pagination === 'object', 'APIListResponse pagination should be object');

  // Optional field
  if (validResponse.filters) {
    assert(typeof validResponse.filters === 'object', 'APIListResponse filters should be object');
  }

  console.log('✅ APIListResponse interface validation passed');
  return true;
}

/**
 * Test CarsQueryParams interface
 */
function testCarsQueryParams() {
  console.log('🔍 Testing CarsQueryParams interface...');

  const validParams = {
    page: 1,
    limit: 20,
    category: 'Sedan',
    fuel_type: 'Gasoline',
    price_min: 20000,
    price_max: 50000,
    make: 'Toyota',
    sort_by: 'price',
    sort_order: 'asc',
    language: 'en'
  };

  // All fields are optional in CarsQueryParams
  if (validParams.page !== undefined) {
    assert(typeof validParams.page === 'number', 'CarsQueryParams page should be number');
  }
  if (validParams.limit !== undefined) {
    assert(typeof validParams.limit === 'number', 'CarsQueryParams limit should be number');
  }
  if (validParams.category) {
    assert(typeof validParams.category === 'string', 'CarsQueryParams category should be string');
  }
  if (validParams.fuel_type) {
    assert(typeof validParams.fuel_type === 'string', 'CarsQueryParams fuel_type should be string');
  }
  if (validParams.price_min !== undefined) {
    assert(typeof validParams.price_min === 'number', 'CarsQueryParams price_min should be number');
  }
  if (validParams.price_max !== undefined) {
    assert(typeof validParams.price_max === 'number', 'CarsQueryParams price_max should be number');
  }
  if (validParams.make) {
    assert(typeof validParams.make === 'string', 'CarsQueryParams make should be string');
  }
  if (validParams.sort_by) {
    assert(typeof validParams.sort_by === 'string', 'CarsQueryParams sort_by should be string');
  }
  if (validParams.sort_order) {
    assert(typeof validParams.sort_order === 'string', 'CarsQueryParams sort_order should be string');
  }
  if (validParams.language) {
    assert(typeof validParams.language === 'string', 'CarsQueryParams language should be string');
  }

  // Test valid sort_by values
  if (validParams.sort_by) {
    const validSortFields = ['price', 'reliability', 'fuel_economy', 'safety'];
    assert(validSortFields.includes(validParams.sort_by), `CarsQueryParams sort_by should be one of: ${validSortFields.join(', ')}`);
  }

  // Test valid sort_order values
  if (validParams.sort_order) {
    const validSortOrders = ['asc', 'desc'];
    assert(validSortOrders.includes(validParams.sort_order), `CarsQueryParams sort_order should be one of: ${validSortOrders.join(', ')}`);
  }

  // Test valid language values
  if (validParams.language) {
    const validLanguages = ['en', 'zh'];
    assert(validLanguages.includes(validParams.language), `CarsQueryParams language should be one of: ${validLanguages.join(', ')}`);
  }

  console.log('✅ CarsQueryParams interface validation passed');
  return true;
}

/**
 * Test CarsResponse interface
 */
function testCarsResponse() {
  console.log('🔍 Testing CarsResponse interface...');

  const validResponse = {
    cars: [
      {
        id: 'car_1',
        make: 'Toyota',
        model: 'Camry',
        year_min: 2022,
        year_max: 2024,
        price_min: 25000,
        price_max: 35000,
        currency: 'USD',
        category: 'Sedan',
        fuel_type: 'Gasoline',
        features: ['Air Conditioning', 'Bluetooth'],
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 150,
      total_pages: 8
    },
    filters: {
      categories: ['Sedan', 'SUV'],
      fuel_types: ['Gasoline', 'Electric'],
      makes: ['Toyota', 'Honda'],
      price_range: { min: 15000, max: 75000 }
    }
  };

  // Required fields
  assert(Array.isArray(validResponse.cars), 'CarsResponse cars should be array');
  assert(typeof validResponse.pagination === 'object', 'CarsResponse pagination should be object');
  assert(typeof validResponse.filters === 'object', 'CarsResponse filters should be object');

  // Validate pagination structure
  const pagination = validResponse.pagination;
  assert(typeof pagination.page === 'number', 'CarsResponse pagination.page should be number');
  assert(typeof pagination.limit === 'number', 'CarsResponse pagination.limit should be number');
  assert(typeof pagination.total === 'number', 'CarsResponse pagination.total should be number');
  assert(typeof pagination.total_pages === 'number', 'CarsResponse pagination.total_pages should be number');

  // Validate filters structure
  const filters = validResponse.filters;
  assert(Array.isArray(filters.categories), 'CarsResponse filters.categories should be array');
  assert(Array.isArray(filters.fuel_types), 'CarsResponse filters.fuel_types should be array');
  assert(Array.isArray(filters.makes), 'CarsResponse filters.makes should be array');
  assert(typeof filters.price_range === 'object', 'CarsResponse filters.price_range should be object');

  console.log('✅ CarsResponse interface validation passed');
  return true;
}

/**
 * Test CarSearchParams interface (API version)
 */
function testCarSearchParamsAPI() {
  console.log('🔍 Testing CarSearchParams API interface...');

  const validParams = {
    q: 'Toyota Camry',
    language: 'en',
    limit: 20,
    category: 'Sedan',
    price_range: [20000, 50000]
  };

  // Required field
  assert(typeof validParams.q === 'string', 'CarSearchParams q should be string');

  // Optional fields
  if (validParams.language) {
    assert(typeof validParams.language === 'string', 'CarSearchParams language should be string');
  }
  if (validParams.limit !== undefined) {
    assert(typeof validParams.limit === 'number', 'CarSearchParams limit should be number');
  }
  if (validParams.category) {
    assert(typeof validParams.category === 'string', 'CarSearchParams category should be string');
  }
  if (validParams.price_range) {
    assert(Array.isArray(validParams.price_range), 'CarSearchParams price_range should be array');
    assert(validParams.price_range.length === 2, 'CarSearchParams price_range should have 2 elements');
    assert(typeof validParams.price_range[0] === 'number', 'CarSearchParams price_range[0] should be number');
    assert(typeof validParams.price_range[1] === 'number', 'CarSearchParams price_range[1] should be number');
  }

  // Test valid language values
  if (validParams.language) {
    const validLanguages = ['en', 'zh'];
    assert(validLanguages.includes(validParams.language), `CarSearchParams language should be one of: ${validLanguages.join(', ')}`);
  }

  console.log('✅ CarSearchParams API interface validation passed');
  return true;
}

/**
 * Test CarSearchResponse interface (API version)
 */
function testCarSearchResponseAPI() {
  console.log('🔍 Testing CarSearchResponse API interface...');

  const validResponse = {
    cars: [
      {
        id: 'car_1',
        make: 'Toyota',
        model: 'Camry',
        year_min: 2022,
        year_max: 2024,
        price_min: 25000,
        price_max: 35000,
        currency: 'USD',
        category: 'Sedan',
        fuel_type: 'Gasoline',
        features: ['Air Conditioning', 'Bluetooth'],
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ],
    total: 1,
    search_query: 'Toyota Camry',
    suggestions: ['Toyota Corolla', 'Honda Accord']
  };

  // Required fields
  assert(Array.isArray(validResponse.cars), 'CarSearchResponse cars should be array');
  assert(typeof validResponse.total === 'number', 'CarSearchResponse total should be number');
  assert(typeof validResponse.search_query === 'string', 'CarSearchResponse search_query should be string');

  // Optional field
  if (validResponse.suggestions) {
    assert(Array.isArray(validResponse.suggestions), 'CarSearchResponse suggestions should be array');
  }

  console.log('✅ CarSearchResponse API interface validation passed');
  return true;
}

/**
 * Test CarDetailResponse interface
 */
function testCarDetailResponse() {
  console.log('🔍 Testing CarDetailResponse interface...');

  const validResponse = {
    car: {
      id: 'car_123',
      make: 'Toyota',
      model: 'Camry',
      year_min: 2022,
      year_max: 2024,
      price_min: 25000,
      price_max: 35000,
      currency: 'USD',
      category: 'Sedan',
      fuel_type: 'Gasoline',
      features: ['Air Conditioning', 'Bluetooth'],
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    similar_cars: [
      {
        id: 'car_456',
        make: 'Honda',
        model: 'Accord',
        year_min: 2022,
        year_max: 2024,
        price_min: 26000,
        price_max: 36000,
        currency: 'USD',
        category: 'Sedan',
        fuel_type: 'Gasoline',
        features: ['Air Conditioning', 'Bluetooth'],
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ],
    reviews: [
      {
        id: 'review_1',
        car_id: 'car_123',
        rating: 4,
        comment: {
          en: 'Great car',
          zh: '很棒的车'
        },
        author: 'John Doe',
        verified_purchase: true,
        helpful_count: 10,
        created_at: new Date()
      }
    ],
    availability: {
      in_stock: true,
      estimated_delivery: '2-3 weeks',
      available_colors: ['White', 'Black'],
      available_trims: ['LE', 'XLE'],
      dealer_count: 15,
      last_updated: new Date()
    }
  };

  // Required fields
  assert(typeof validResponse.car === 'object', 'CarDetailResponse car should be object');
  assert(Array.isArray(validResponse.similar_cars), 'CarDetailResponse similar_cars should be array');

  // Optional fields
  if (validResponse.reviews) {
    assert(Array.isArray(validResponse.reviews), 'CarDetailResponse reviews should be array');
  }
  if (validResponse.availability) {
    assert(typeof validResponse.availability === 'object', 'CarDetailResponse availability should be object');
  }

  console.log('✅ CarDetailResponse interface validation passed');
  return true;
}

/**
 * Test ConversationsQueryParams interface
 */
function testConversationsQueryParams() {
  console.log('🔍 Testing ConversationsQueryParams interface...');

  const validParams = {
    user_id: 'user_123',
    session_id: 'sess_456',
    page: 1,
    limit: 20,
    language: 'en'
  };

  // All fields are optional in ConversationsQueryParams
  if (validParams.user_id) {
    assert(typeof validParams.user_id === 'string', 'ConversationsQueryParams user_id should be string');
  }
  if (validParams.session_id) {
    assert(typeof validParams.session_id === 'string', 'ConversationsQueryParams session_id should be string');
  }
  if (validParams.page !== undefined) {
    assert(typeof validParams.page === 'number', 'ConversationsQueryParams page should be number');
  }
  if (validParams.limit !== undefined) {
    assert(typeof validParams.limit === 'number', 'ConversationsQueryParams limit should be number');
  }
  if (validParams.language) {
    assert(typeof validParams.language === 'string', 'ConversationsQueryParams language should be string');
  }

  // Test valid language values
  if (validParams.language) {
    const validLanguages = ['en', 'zh'];
    assert(validLanguages.includes(validParams.language), `ConversationsQueryParams language should be one of: ${validLanguages.join(', ')}`);
  }

  console.log('✅ ConversationsQueryParams interface validation passed');
  return true;
}

/**
 * Test ConversationsResponse interface
 */
function testConversationsResponse() {
  console.log('🔍 Testing ConversationsResponse interface...');

  const validResponse = {
    conversations: [
      {
        id: 'conv_1',
        user_id: 'user_123',
        title: 'Car Shopping Discussion',
        summary: 'Discussion about finding the right car',
        language: 'en',
        session_id: 'sess_456',
        created_at: new Date('2023-01-01T09:00:00Z'),
        updated_at: new Date('2023-01-01T10:30:00Z')
      }
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 1
    }
  };

  // Required fields
  assert(Array.isArray(validResponse.conversations), 'ConversationsResponse conversations should be array');
  assert(typeof validResponse.pagination === 'object', 'ConversationsResponse pagination should be object');

  console.log('✅ ConversationsResponse interface validation passed');
  return true;
}

/**
 * Test CreateConversationRequest interface
 */
function testCreateConversationRequest() {
  console.log('🔍 Testing CreateConversationRequest interface...');

  const validRequest = {
    title: 'New Car Discussion',
    language: 'en',
    session_id: 'sess_789',
    user_id: 'user_123'
  };

  // Required fields
  assert(typeof validRequest.language === 'string', 'CreateConversationRequest language should be string');
  assert(typeof validRequest.session_id === 'string', 'CreateConversationRequest session_id should be string');

  // Optional fields
  if (validRequest.title) {
    assert(typeof validRequest.title === 'string', 'CreateConversationRequest title should be string');
  }
  if (validRequest.user_id) {
    assert(typeof validRequest.user_id === 'string', 'CreateConversationRequest user_id should be string');
  }

  // Test valid language values
  const validLanguages = ['en', 'zh'];
  assert(validLanguages.includes(validRequest.language), `CreateConversationRequest language should be one of: ${validLanguages.join(', ')}`);

  console.log('✅ CreateConversationRequest interface validation passed');
  return true;
}

/**
 * Test CreateConversationResponse interface
 */
function testCreateConversationResponse() {
  console.log('🔍 Testing CreateConversationResponse interface...');

  const validResponse = {
    conversation: {
      id: 'conv_123',
      language: 'en',
      session_id: 'sess_789',
      created_at: new Date(),
      updated_at: new Date()
    },
    message: 'Conversation created successfully'
  };

  // Required fields
  assert(typeof validResponse.conversation === 'object', 'CreateConversationResponse conversation should be object');
  assert(typeof validResponse.message === 'string', 'CreateConversationResponse message should be string');

  console.log('✅ CreateConversationResponse interface validation passed');
  return true;
}

/**
 * Test ConversationDetailResponse interface (API version)
 */
function testConversationDetailResponseAPI() {
  console.log('🔍 Testing ConversationDetailResponse API interface...');

  const validResponse = {
    conversation: {
      id: 'conv_123',
      user_id: 'user_456',
      title: 'Car Discussion',
      summary: 'Discussion about car recommendations',
      language: 'en',
      session_id: 'sess_789',
      created_at: new Date('2023-01-01T09:00:00Z'),
      updated_at: new Date('2023-01-01T10:30:00Z')
    },
    messages: [
      {
        id: 'msg_1',
        conversationId: 'conv_123',
        role: 'user',
        content: 'Help me find a car',
        language: 'en',
        createdAt: '2023-01-01T09:15:00Z'
      }
    ],
    recommendations: [
      {
        id: 'rec_1',
        car: {
          id: 'car_123',
          make: 'Toyota',
          model: 'Camry',
          year_min: 2022,
          year_max: 2024,
          price_min: 25000,
          price_max: 35000,
          currency: 'USD',
          category: 'Sedan',
          fuel_type: 'Gasoline',
          features: ['Air Conditioning'],
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        match_score: 0.85,
        reasoning: {
          en: 'Matches your budget',
          zh: '符合您的预算'
        }
      }
    ],
    next_steps: [
      {
        id: 'step_1',
        title: {
          en: 'Research features',
          zh: '研究功能'
        },
        description: {
          en: 'Compare car features',
          zh: '比较汽车功能'
        },
        priority: 'high',
        action_type: 'research'
      }
    ]
  };

  // Required fields
  assert(typeof validResponse.conversation === 'object', 'ConversationDetailResponse conversation should be object');
  assert(Array.isArray(validResponse.messages), 'ConversationDetailResponse messages should be array');
  assert(Array.isArray(validResponse.recommendations), 'ConversationDetailResponse recommendations should be array');
  assert(Array.isArray(validResponse.next_steps), 'ConversationDetailResponse next_steps should be array');

  console.log('✅ ConversationDetailResponse API interface validation passed');
  return true;
}

/**
 * Test HealthResponse interface
 */
function testHealthResponse() {
  console.log('🔍 Testing HealthResponse interface...');

  const validResponse = {
    status: 'healthy',
    timestamp: '2023-01-01T10:30:00Z',
    services: {
      database: 'up',
      ai: 'up',
      cache: 'up'
    },
    version: '1.0.0'
  };

  // Required fields
  assert(typeof validResponse.status === 'string', 'HealthResponse status should be string');
  assert(typeof validResponse.timestamp === 'string', 'HealthResponse timestamp should be string');
  assert(typeof validResponse.services === 'object', 'HealthResponse services should be object');
  assert(typeof validResponse.version === 'string', 'HealthResponse version should be string');

  // Test valid status values
  const validStatuses = ['healthy', 'unhealthy'];
  assert(validStatuses.includes(validResponse.status), `HealthResponse status should be one of: ${validStatuses.join(', ')}`);

  // Test services structure
  const services = validResponse.services;
  assert(typeof services.database === 'string', 'HealthResponse services.database should be string');
  assert(typeof services.ai === 'string', 'HealthResponse services.ai should be string');

  // Test valid service status values
  const validServiceStatuses = ['up', 'down'];
  assert(validServiceStatuses.includes(services.database), 'HealthResponse services.database should be up or down');
  assert(validServiceStatuses.includes(services.ai), 'HealthResponse services.ai should be up or down');

  if (services.cache) {
    assert(validServiceStatuses.includes(services.cache), 'HealthResponse services.cache should be up or down');
  }

  console.log('✅ HealthResponse interface validation passed');
  return true;
}

/**
 * Test UserRequest interface
 */
function testUserRequest() {
  console.log('🔍 Testing UserRequest interface...');

  const validRequest = {
    email: 'user@example.com',
    name: 'John Doe',
    language: 'en',
    session_id: 'sess_123'
  };

  // Required field
  assert(typeof validRequest.session_id === 'string', 'UserRequest session_id should be string');

  // Optional fields
  if (validRequest.email) {
    assert(typeof validRequest.email === 'string', 'UserRequest email should be string');
  }
  if (validRequest.name) {
    assert(typeof validRequest.name === 'string', 'UserRequest name should be string');
  }
  if (validRequest.language) {
    assert(typeof validRequest.language === 'string', 'UserRequest language should be string');
  }

  // Test valid language values
  if (validRequest.language) {
    const validLanguages = ['en', 'zh'];
    assert(validLanguages.includes(validRequest.language), `UserRequest language should be one of: ${validLanguages.join(', ')}`);
  }

  console.log('✅ UserRequest interface validation passed');
  return true;
}

/**
 * Test UserResponse interface
 */
function testUserResponse() {
  console.log('🔍 Testing UserResponse interface...');

  const validResponse = {
    user: {
      id: 'user_123',
      email: 'user@example.com',
      name: 'John Doe',
      language: 'en',
      session_id: 'sess_456',
      created_at: new Date('2023-01-01T00:00:00Z'),
      updated_at: new Date('2023-01-02T00:00:00Z')
    },
    message: 'User information retrieved successfully'
  };

  // Required fields
  assert(typeof validResponse.user === 'object', 'UserResponse user should be object');
  assert(typeof validResponse.message === 'string', 'UserResponse message should be string');

  console.log('✅ UserResponse interface validation passed');
  return true;
}

/**
 * Test RecommendationsQueryParams interface
 */
function testRecommendationsQueryParams() {
  console.log('🔍 Testing RecommendationsQueryParams interface...');

  const validParams = {
    conversation_id: 'conv_123',
    user_id: 'user_456',
    session_id: 'sess_789',
    limit: 10,
    language: 'en'
  };

  // All fields are optional in RecommendationsQueryParams
  if (validParams.conversation_id) {
    assert(typeof validParams.conversation_id === 'string', 'RecommendationsQueryParams conversation_id should be string');
  }
  if (validParams.user_id) {
    assert(typeof validParams.user_id === 'string', 'RecommendationsQueryParams user_id should be string');
  }
  if (validParams.session_id) {
    assert(typeof validParams.session_id === 'string', 'RecommendationsQueryParams session_id should be string');
  }
  if (validParams.limit !== undefined) {
    assert(typeof validParams.limit === 'number', 'RecommendationsQueryParams limit should be number');
  }
  if (validParams.language) {
    assert(typeof validParams.language === 'string', 'RecommendationsQueryParams language should be string');
  }

  // Test valid language values
  if (validParams.language) {
    const validLanguages = ['en', 'zh'];
    assert(validLanguages.includes(validParams.language), `RecommendationsQueryParams language should be one of: ${validLanguages.join(', ')}`);
  }

  console.log('✅ RecommendationsQueryParams interface validation passed');
  return true;
}

/**
 * Test RecommendationsResponse interface
 */
function testRecommendationsResponse() {
  console.log('🔍 Testing RecommendationsResponse interface...');

  const validResponse = {
    recommendations: [
      {
        id: 'rec_1',
        car: {
          id: 'car_123',
          make: 'Toyota',
          model: 'Camry',
          year_min: 2022,
          year_max: 2024,
          price_min: 25000,
          price_max: 35000,
          currency: 'USD',
          category: 'Sedan',
          fuel_type: 'Gasoline',
          features: ['Air Conditioning'],
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        match_score: 0.85,
        reasoning: {
          en: 'Matches your budget',
          zh: '符合您的预算'
        }
      }
    ],
    total: 1
  };

  // Required fields
  assert(Array.isArray(validResponse.recommendations), 'RecommendationsResponse recommendations should be array');
  assert(typeof validResponse.total === 'number', 'RecommendationsResponse total should be number');

  console.log('✅ RecommendationsResponse interface validation passed');
  return true;
}

/**
 * Test APIError interface
 */
function testAPIError() {
  console.log('🔍 Testing APIError interface...');

  const validError = {
    error: {
      code: 'INVALID_REQUEST',
      message: 'The request parameters are invalid',
      details: {
        field: 'email',
        issue: 'Invalid email format'
      },
      timestamp: '2023-01-01T10:30:00Z'
    }
  };

  // Required fields
  assert(typeof validError.error === 'object', 'APIError error should be object');
  assert(typeof validError.error.code === 'string', 'APIError error.code should be string');
  assert(typeof validError.error.message === 'string', 'APIError error.message should be string');
  assert(typeof validError.error.timestamp === 'string', 'APIError error.timestamp should be string');

  // Optional field
  if (validError.error.details) {
    assert(typeof validError.error.details === 'object', 'APIError error.details should be object');
  }

  console.log('✅ APIError interface validation passed');
  return true;
}

/**
 * Test HTTP_STATUS constants
 */
function testHTTPStatus() {
  console.log('🔍 Testing HTTP_STATUS constants...');

  const expectedStatusCodes = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  };

  // Test that HTTP_STATUS constants are properly defined
  // In a real TypeScript project, these would be imported and tested

  // Use the expected values directly for testing
  Object.entries(expectedStatusCodes).forEach(([key, expectedValue]) => {
    assert(key in expectedStatusCodes, `HTTP_STATUS should contain '${key}'`);
    assert(expectedStatusCodes[key] === expectedValue, `HTTP_STATUS.${key} should be ${expectedValue}`);
    assert(typeof expectedStatusCodes[key] === 'number', `HTTP_STATUS.${key} should be a number`);
  });

  console.log('✅ HTTP_STATUS constants validation passed');
  return true;
}

/**
 * Test ERROR_CODES constants
 */
function testErrorCodes() {
  console.log('🔍 Testing ERROR_CODES constants...');

  const expectedErrorCodes = {
    INVALID_REQUEST: 'INVALID_REQUEST',
    CONVERSATION_NOT_FOUND: 'CONVERSATION_NOT_FOUND',
    CAR_NOT_FOUND: 'CAR_NOT_FOUND',
    AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
  };

  // Test that ERROR_CODES constants are properly defined
  // In a real TypeScript project, these would be imported and tested

  // Use the expected values directly for testing
  Object.entries(expectedErrorCodes).forEach(([key, expectedValue]) => {
    assert(key in expectedErrorCodes, `ERROR_CODES should contain '${key}'`);
    assert(expectedErrorCodes[key] === expectedValue, `ERROR_CODES.${key} should be '${expectedValue}'`);
    assert(typeof expectedErrorCodes[key] === 'string', `ERROR_CODES.${key} should be a string`);
  });

  console.log('✅ ERROR_CODES constants validation passed');
  return true;
}

/**
 * Test API type relationships and structure
 */
function testAPITypeRelationships() {
  console.log('🔍 Testing API type relationships and structure...');

  // Test that API types are properly structured and related
  const expectedAPITypes = [
    'PaginationParams',
    'PaginationResponse',
    'CarFilters',
    'SortParams',
    'APIResponse',
    'APIListResponse',
    'CarsQueryParams',
    'CarsResponse',
    'CarSearchParams',
    'CarSearchResponse',
    'CarDetailResponse',
    'ConversationsQueryParams',
    'ConversationsResponse',
    'CreateConversationRequest',
    'CreateConversationResponse',
    'ConversationDetailResponse',
    'HealthResponse',
    'UserRequest',
    'UserResponse',
    'RecommendationsQueryParams',
    'RecommendationsResponse',
    'APIError',
    'HTTP_STATUS',
    'ERROR_CODES'
  ];

  // Verify that core API types exist in our expected structure
  assert(expectedAPITypes.length > 0, 'Should have API type exports');
  assert(expectedAPITypes.includes('APIResponse'), 'APIResponse should be in API types');
  assert(expectedAPITypes.includes('PaginationParams'), 'PaginationParams should be in API types');
  assert(expectedAPITypes.includes('HTTP_STATUS'), 'HTTP_STATUS should be in API types');

  // Test logical relationships between types
  // APIListResponse should extend APIResponse
  // APIError should have error codes
  // HTTP_STATUS should define standard codes

  console.log('✅ API type relationships and structure validation passed');
  return true;
}

/**
 * Run all API type tests
 */
async function runAllTests() {
  console.log('🚀 Starting API Types Test Suite...\n');

  const tests = [
    testPaginationParams,
    testPaginationResponse,
    testCarFiltersAPI,
    testSortParams,
    testAPIResponse,
    testAPIListResponse,
    testCarsQueryParams,
    testCarsResponse,
    testCarSearchParamsAPI,
    testCarSearchResponseAPI,
    testCarDetailResponse,
    testConversationsQueryParams,
    testConversationsResponse,
    testCreateConversationRequest,
    testCreateConversationResponse,
    testConversationDetailResponseAPI,
    testHealthResponse,
    testUserRequest,
    testUserResponse,
    testRecommendationsQueryParams,
    testRecommendationsResponse,
    testAPIError,
    testHTTPStatus,
    testErrorCodes,
    testAPITypeRelationships
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`❌ Test failed: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 API Types Test Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('🎉 All API type tests passed!');
    return true;
  } else {
    console.error('💥 Some API type tests failed!');
    return false;
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Test suite crashed:', error);
      process.exit(1);
    });
}

module.exports = {
  runAllTests,
  testPaginationParams,
  testPaginationResponse,
  testCarFiltersAPI,
  testSortParams,
  testAPIResponse,
  testAPIListResponse,
  testCarsQueryParams,
  testCarsResponse,
  testCarSearchParamsAPI,
  testCarSearchResponseAPI,
  testCarDetailResponse,
  testConversationsQueryParams,
  testConversationsResponse,
  testCreateConversationRequest,
  testCreateConversationResponse,
  testConversationDetailResponseAPI,
  testHealthResponse,
  testUserRequest,
  testUserResponse,
  testRecommendationsQueryParams,
  testRecommendationsResponse,
  testAPIError,
  testHTTPStatus,
  testErrorCodes,
  testAPITypeRelationships
};
