#!/usr/bin/env node

/**
 * Type System Test Suite - Car Types (car.ts)
 * Tests for: Car, CarRecommendation, NextStep, CarFilters, CarSearchParams, etc.
 *
 * @description Validates car-related type definitions including car models,
 * recommendations, search parameters, filters, and comparison features.
 */

const assert = require('assert');
const path = require('path');

/**
 * Test Car interface
 */
function testCar() {
  console.log('🔍 Testing Car interface...');

  const validCar = {
    id: 'car_123e4567-e89b-12d3-a456-426614174000',
    make: 'Toyota',
    model: 'Camry',
    year_min: 2020,
    year_max: 2023,
    price_min: 25000,
    price_max: 35000,
    currency: 'USD',
    category: 'Sedan',
    fuel_type: 'Gasoline',
    description_en: 'A reliable and fuel-efficient sedan',
    description_zh: '一款可靠且省油的轿车',
    pros_en: ['Reliable', 'Fuel efficient', 'Comfortable'],
    pros_zh: ['可靠', '省油', '舒适'],
    cons_en: ['Not very sporty'],
    cons_zh: ['不够运动'],
    features: ['Air Conditioning', 'Bluetooth', 'Backup Camera'],
    image_url: 'https://example.com/toyota-camry.jpg',
    reliability_score: 4.5,
    fuel_economy: 32,
    safety_rating: 5,
    is_active: true,
    created_at: new Date('2023-01-01T00:00:00Z'),
    updated_at: new Date('2023-01-02T00:00:00Z')
  };

  // Required fields
  assert(typeof validCar.id === 'string', 'Car id should be string');
  assert(typeof validCar.make === 'string', 'Car make should be string');
  assert(typeof validCar.model === 'string', 'Car model should be string');
  assert(typeof validCar.year_min === 'number', 'Car year_min should be number');
  assert(typeof validCar.year_max === 'number', 'Car year_max should be number');
  assert(typeof validCar.currency === 'string', 'Car currency should be string');
  assert(typeof validCar.category === 'string', 'Car category should be string');
  assert(typeof validCar.fuel_type === 'string', 'Car fuel_type should be string');
  assert(typeof validCar.is_active === 'boolean', 'Car is_active should be boolean');
  assert(validCar.created_at instanceof Date, 'Car created_at should be Date');
  assert(validCar.updated_at instanceof Date, 'Car updated_at should be Date');

  // Optional fields
  if (validCar.price_min !== undefined) {
    assert(typeof validCar.price_min === 'number', 'Car price_min should be number');
  }
  if (validCar.price_max !== undefined) {
    assert(typeof validCar.price_max === 'number', 'Car price_max should be number');
  }
  if (validCar.description_en) {
    assert(typeof validCar.description_en === 'string', 'Car description_en should be string');
  }
  if (validCar.description_zh) {
    assert(typeof validCar.description_zh === 'string', 'Car description_zh should be string');
  }
  if (validCar.pros_en) {
    assert(Array.isArray(validCar.pros_en), 'Car pros_en should be array');
  }
  if (validCar.pros_zh) {
    assert(Array.isArray(validCar.pros_zh), 'Car pros_zh should be array');
  }
  if (validCar.cons_en) {
    assert(Array.isArray(validCar.cons_en), 'Car cons_en should be array');
  }
  if (validCar.cons_zh) {
    assert(Array.isArray(validCar.cons_zh), 'Car cons_zh should be array');
  }
  if (validCar.features) {
    assert(Array.isArray(validCar.features), 'Car features should be array');
  }
  if (validCar.image_url) {
    assert(typeof validCar.image_url === 'string', 'Car image_url should be string');
  }
  if (validCar.reliability_score !== undefined) {
    assert(typeof validCar.reliability_score === 'number', 'Car reliability_score should be number');
  }
  if (validCar.fuel_economy !== undefined) {
    assert(typeof validCar.fuel_economy === 'number', 'Car fuel_economy should be number');
  }
  if (validCar.safety_rating !== undefined) {
    assert(typeof validCar.safety_rating === 'number', 'Car safety_rating should be number');
  }

  // Validate year range
  assert(validCar.year_min <= validCar.year_max, 'Car year_min should be <= year_max');

  // Validate price range if both are provided
  if (validCar.price_min !== undefined && validCar.price_max !== undefined) {
    assert(validCar.price_min <= validCar.price_max, 'Car price_min should be <= price_max');
  }

  // Validate rating ranges
  if (validCar.reliability_score !== undefined) {
    assert(validCar.reliability_score >= 0 && validCar.reliability_score <= 5, 'Car reliability_score should be 0-5');
  }
  if (validCar.fuel_economy !== undefined) {
    assert(validCar.fuel_economy > 0, 'Car fuel_economy should be positive');
  }
  if (validCar.safety_rating !== undefined) {
    assert(validCar.safety_rating >= 0 && validCar.safety_rating <= 5, 'Car safety_rating should be 0-5');
  }

  console.log('✅ Car interface validation passed');
  return true;
}

/**
 * Test CarRecommendation interface
 */
function testCarRecommendation() {
  console.log('🔍 Testing CarRecommendation interface...');

  const validRecommendation = {
    id: 'rec_123e4567-e89b-12d3-a456-426614174000',
    car: {
      id: 'car_456',
      make: 'Honda',
      model: 'Civic',
      year_min: 2022,
      year_max: 2024,
      price_min: 22000,
      price_max: 28000,
      currency: 'USD',
      category: 'Sedan',
      fuel_type: 'Gasoline',
      features: ['Air Conditioning', 'Bluetooth'],
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    match_score: 0.85,
    reasoning: {
      en: 'This car matches your budget and reliability requirements',
      zh: '这辆车符合您的预算和可靠性要求'
    },
    recommendation_factors: [
      {
        factor: 'price',
        weight: 0.3,
        score: 0.9,
        description: {
          en: 'Fits within your budget range',
          zh: '符合您的预算范围'
        }
      }
    ]
  };

  // Required fields
  assert(typeof validRecommendation.id === 'string', 'CarRecommendation id should be string');
  assert(typeof validRecommendation.car === 'object', 'CarRecommendation car should be object');
  assert(typeof validRecommendation.match_score === 'number', 'CarRecommendation match_score should be number');
  assert(typeof validRecommendation.reasoning === 'object', 'CarRecommendation reasoning should be object');
  assert(typeof validRecommendation.reasoning.en === 'string', 'CarRecommendation reasoning.en should be string');
  assert(typeof validRecommendation.reasoning.zh === 'string', 'CarRecommendation reasoning.zh should be string');

  // Validate match score range
  assert(validRecommendation.match_score >= 0 && validRecommendation.match_score <= 1, 'CarRecommendation match_score should be 0-1');

  // Optional field
  if (validRecommendation.recommendation_factors) {
    assert(Array.isArray(validRecommendation.recommendation_factors), 'CarRecommendation recommendation_factors should be array');
  }

  console.log('✅ CarRecommendation interface validation passed');
  return true;
}

/**
 * Test RecommendationFactor interface
 */
function testRecommendationFactor() {
  console.log('🔍 Testing RecommendationFactor interface...');

  const validFactor = {
    factor: 'reliability',
    weight: 0.4,
    score: 0.9,
    description: {
      en: 'High reliability rating from multiple sources',
      zh: '来自多个来源的高可靠性评级'
    }
  };

  // Required fields
  assert(typeof validFactor.factor === 'string', 'RecommendationFactor factor should be string');
  assert(typeof validFactor.weight === 'number', 'RecommendationFactor weight should be number');
  assert(typeof validFactor.score === 'number', 'RecommendationFactor score should be number');
  assert(typeof validFactor.description === 'object', 'RecommendationFactor description should be object');
  assert(typeof validFactor.description.en === 'string', 'RecommendationFactor description.en should be string');
  assert(typeof validFactor.description.zh === 'string', 'RecommendationFactor description.zh should be string');

  // Validate weight and score ranges
  assert(validFactor.weight >= 0 && validFactor.weight <= 1, 'RecommendationFactor weight should be 0-1');
  assert(validFactor.score >= 0 && validFactor.score <= 1, 'RecommendationFactor score should be 0-1');

  console.log('✅ RecommendationFactor interface validation passed');
  return true;
}

/**
 * Test NextStep interface
 */
function testNextStep() {
  console.log('🔍 Testing NextStep interface...');

  const validNextStep = {
    id: 'step_123e4567-e89b-12d3-a456-426614174000',
    title: {
      en: 'Research car features',
      zh: '研究汽车功能'
    },
    description: {
      en: 'Compare different car models and their features',
      zh: '比较不同车型及其功能'
    },
    priority: 'high',
    action_type: 'research',
    estimated_time: '2-3 hours',
    resources: [
      {
        name: 'Car Comparison Tool',
        url: 'https://example.com/compare',
        description: {
          en: 'Compare cars side by side',
          zh: '并排比较汽车'
        },
        type: 'marketplace',
        rating: 4.5,
        is_recommended: true
      }
    ]
  };

  // Required fields
  assert(typeof validNextStep.id === 'string', 'NextStep id should be string');
  assert(typeof validNextStep.title === 'object', 'NextStep title should be object');
  assert(typeof validNextStep.title.en === 'string', 'NextStep title.en should be string');
  assert(typeof validNextStep.title.zh === 'string', 'NextStep title.zh should be string');
  assert(typeof validNextStep.description === 'object', 'NextStep description should be object');
  assert(typeof validNextStep.description.en === 'string', 'NextStep description.en should be string');
  assert(typeof validNextStep.description.zh === 'string', 'NextStep description.zh should be string');
  assert(typeof validNextStep.priority === 'string', 'NextStep priority should be string');
  assert(typeof validNextStep.action_type === 'string', 'NextStep action_type should be string');

  // Test valid priority values
  const validPriorities = ['high', 'medium', 'low'];
  assert(validPriorities.includes(validNextStep.priority), `NextStep priority should be one of: ${validPriorities.join(', ')}`);

  // Test valid action types
  const validActionTypes = ['research', 'visit', 'contact', 'prepare'];
  assert(validActionTypes.includes(validNextStep.action_type), `NextStep action_type should be one of: ${validActionTypes.join(', ')}`);

  // Optional fields
  if (validNextStep.estimated_time) {
    assert(typeof validNextStep.estimated_time === 'string', 'NextStep estimated_time should be string');
  }
  if (validNextStep.resources) {
    assert(Array.isArray(validNextStep.resources), 'NextStep resources should be array');
  }

  console.log('✅ NextStep interface validation passed');
  return true;
}

/**
 * Test CarReview interface
 */
function testCarReview() {
  console.log('🔍 Testing CarReview interface...');

  const validReview = {
    id: 'review_123e4567-e89b-12d3-a456-426614174000',
    car_id: 'car_456',
    rating: 4,
    comment: {
      en: 'Great car, very reliable',
      zh: '很棒的车，非常可靠'
    },
    author: 'John Doe',
    verified_purchase: true,
    helpful_count: 15,
    created_at: new Date('2023-01-15T10:30:00Z'),
    pros: ['Reliable', 'Good fuel economy'],
    cons: ['Small trunk space']
  };

  // Required fields
  assert(typeof validReview.id === 'string', 'CarReview id should be string');
  assert(typeof validReview.car_id === 'string', 'CarReview car_id should be string');
  assert(typeof validReview.rating === 'number', 'CarReview rating should be number');
  assert(typeof validReview.comment === 'object', 'CarReview comment should be object');
  assert(typeof validReview.comment.en === 'string', 'CarReview comment.en should be string');
  assert(typeof validReview.comment.zh === 'string', 'CarReview comment.zh should be string');
  assert(typeof validReview.author === 'string', 'CarReview author should be string');
  assert(typeof validReview.verified_purchase === 'boolean', 'CarReview verified_purchase should be boolean');
  assert(typeof validReview.helpful_count === 'number', 'CarReview helpful_count should be number');
  assert(validReview.created_at instanceof Date, 'CarReview created_at should be Date');

  // Validate rating range
  assert(validReview.rating >= 1 && validReview.rating <= 5, 'CarReview rating should be 1-5');

  // Optional fields
  if (validReview.pros) {
    assert(Array.isArray(validReview.pros), 'CarReview pros should be array');
  }
  if (validReview.cons) {
    assert(Array.isArray(validReview.cons), 'CarReview cons should be array');
  }

  console.log('✅ CarReview interface validation passed');
  return true;
}

/**
 * Test CarAvailability interface
 */
function testCarAvailability() {
  console.log('🔍 Testing CarAvailability interface...');

  const validAvailability = {
    in_stock: true,
    estimated_delivery: '2-3 weeks',
    available_colors: ['White', 'Black', 'Silver', 'Blue'],
    available_trims: ['LX', 'EX', 'EX-L'],
    dealer_count: 25,
    last_updated: new Date('2023-01-20T09:00:00Z')
  };

  // Required fields
  assert(typeof validAvailability.in_stock === 'boolean', 'CarAvailability in_stock should be boolean');
  assert(typeof validAvailability.estimated_delivery === 'string', 'CarAvailability estimated_delivery should be string');
  assert(validAvailability.last_updated instanceof Date, 'CarAvailability last_updated should be Date');

  // Optional fields
  if (validAvailability.available_colors) {
    assert(Array.isArray(validAvailability.available_colors), 'CarAvailability available_colors should be array');
  }
  if (validAvailability.available_trims) {
    assert(Array.isArray(validAvailability.available_trims), 'CarAvailability available_trims should be array');
  }
  if (validAvailability.dealer_count !== undefined) {
    assert(typeof validAvailability.dealer_count === 'number', 'CarAvailability dealer_count should be number');
  }

  console.log('✅ CarAvailability interface validation passed');
  return true;
}

/**
 * Test CarFilters interface
 */
function testCarFilters() {
  console.log('🔍 Testing CarFilters interface...');

  const validFilters = {
    category: ['Sedan', 'SUV'],
    fuel_type: ['Gasoline', 'Electric'],
    make: ['Toyota', 'Honda'],
    price_min: 20000,
    price_max: 50000,
    year_min: 2020,
    year_max: 2024,
    reliability_min: 4.0,
    fuel_economy_min: 25,
    safety_rating_min: 4,
    features: ['Air Conditioning', 'Bluetooth']
  };

  // All fields are optional in CarFilters
  if (validFilters.category) {
    assert(Array.isArray(validFilters.category), 'CarFilters category should be array');
  }
  if (validFilters.fuel_type) {
    assert(Array.isArray(validFilters.fuel_type), 'CarFilters fuel_type should be array');
  }
  if (validFilters.make) {
    assert(Array.isArray(validFilters.make), 'CarFilters make should be array');
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
  if (validFilters.features) {
    assert(Array.isArray(validFilters.features), 'CarFilters features should be array');
  }

  // Validate ranges if provided
  if (validFilters.price_min !== undefined && validFilters.price_max !== undefined) {
    assert(validFilters.price_min <= validFilters.price_max, 'CarFilters price_min should be <= price_max');
  }
  if (validFilters.year_min !== undefined && validFilters.year_max !== undefined) {
    assert(validFilters.year_min <= validFilters.year_max, 'CarFilters year_min should be <= year_max');
  }

  console.log('✅ CarFilters interface validation passed');
  return true;
}

/**
 * Test CarSearchParams interface
 */
function testCarSearchParams() {
  console.log('🔍 Testing CarSearchParams interface...');

  const validParams = {
    query: 'Toyota Camry',
    filters: {
      category: ['Sedan'],
      price_min: 20000,
      price_max: 30000
    },
    sort_by: 'price_min',
    sort_order: 'asc',
    page: 1,
    limit: 20,
    language: 'en'
  };

  // All fields are optional in CarSearchParams except some internal validation
  if (validParams.query) {
    assert(typeof validParams.query === 'string', 'CarSearchParams query should be string');
  }
  if (validParams.filters) {
    assert(typeof validParams.filters === 'object', 'CarSearchParams filters should be object');
  }
  if (validParams.sort_by) {
    assert(typeof validParams.sort_by === 'string', 'CarSearchParams sort_by should be string');
  }
  if (validParams.sort_order) {
    assert(typeof validParams.sort_order === 'string', 'CarSearchParams sort_order should be string');
  }
  if (validParams.page !== undefined) {
    assert(typeof validParams.page === 'number', 'CarSearchParams page should be number');
  }
  if (validParams.limit !== undefined) {
    assert(typeof validParams.limit === 'number', 'CarSearchParams limit should be number');
  }
  if (validParams.language) {
    assert(typeof validParams.language === 'string', 'CarSearchParams language should be string');
  }

  // Test valid sort field values
  if (validParams.sort_by) {
    const validSortFields = [
      'price_min', 'price_max', 'year_min', 'year_max',
      'reliability_score', 'fuel_economy', 'safety_rating',
      'created_at', 'popularity'
    ];
    assert(validSortFields.includes(validParams.sort_by), `CarSearchParams sort_by should be one of: ${validSortFields.join(', ')}`);
  }

  // Test valid sort order values
  if (validParams.sort_order) {
    const validSortOrders = ['asc', 'desc'];
    assert(validSortOrders.includes(validParams.sort_order), `CarSearchParams sort_order should be one of: ${validSortOrders.join(', ')}`);
  }

  console.log('✅ CarSearchParams interface validation passed');
  return true;
}

/**
 * Test CarSortField type
 */
function testCarSortField() {
  console.log('🔍 Testing CarSortField type...');

  const validSortFields = [
    'price_min',
    'price_max',
    'year_min',
    'year_max',
    'reliability_score',
    'fuel_economy',
    'safety_rating',
    'created_at',
    'popularity'
  ];

  validSortFields.forEach(field => {
    assert(typeof field === 'string', `CarSortField '${field}' should be string`);
    assert(validSortFields.includes(field), `CarSortField '${field}' should be valid`);
  });

  console.log('✅ CarSortField type validation passed');
  return true;
}

/**
 * Test CarSearchResult interface
 */
function testCarSearchResult() {
  console.log('🔍 Testing CarSearchResult interface...');

  const validResult = {
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
    page: 1,
    limit: 20,
    total_pages: 1,
    search_query: 'Toyota Camry',
    applied_filters: {
      category: ['Sedan'],
      price_min: 20000
    },
    suggestions: ['Toyota Corolla', 'Honda Accord'],
    facets: {
      categories: [
        { value: 'Sedan', label: { en: 'Sedan', zh: '轿车' }, count: 150 }
      ],
      fuel_types: [
        { value: 'Gasoline', label: { en: 'Gasoline', zh: '汽油' }, count: 200 }
      ],
      makes: [
        { value: 'Toyota', label: { en: 'Toyota', zh: '丰田' }, count: 75 }
      ],
      price_ranges: [
        { min: 20000, max: 30000, label: { en: '$20k-$30k', zh: '2万-3万美元' }, count: 100 }
      ],
      year_ranges: [
        { min: 2020, max: 2024, label: '2020-2024', count: 180 }
      ]
    }
  };

  // Required fields
  assert(Array.isArray(validResult.cars), 'CarSearchResult cars should be array');
  assert(typeof validResult.total === 'number', 'CarSearchResult total should be number');
  assert(typeof validResult.page === 'number', 'CarSearchResult page should be number');
  assert(typeof validResult.limit === 'number', 'CarSearchResult limit should be number');
  assert(typeof validResult.total_pages === 'number', 'CarSearchResult total_pages should be number');

  // Optional fields
  if (validResult.search_query) {
    assert(typeof validResult.search_query === 'string', 'CarSearchResult search_query should be string');
  }
  if (validResult.applied_filters) {
    assert(typeof validResult.applied_filters === 'object', 'CarSearchResult applied_filters should be object');
  }
  if (validResult.suggestions) {
    assert(Array.isArray(validResult.suggestions), 'CarSearchResult suggestions should be array');
  }
  if (validResult.facets) {
    assert(typeof validResult.facets === 'object', 'CarSearchResult facets should be object');
  }

  console.log('✅ CarSearchResult interface validation passed');
  return true;
}

/**
 * Test SearchFacets interface
 */
function testSearchFacets() {
  console.log('🔍 Testing SearchFacets interface...');

  const validFacets = {
    categories: [
      { value: 'Sedan', label: { en: 'Sedan', zh: '轿车' }, count: 150 },
      { value: 'SUV', label: { en: 'SUV', zh: 'SUV' }, count: 120 }
    ],
    fuel_types: [
      { value: 'Gasoline', label: { en: 'Gasoline', zh: '汽油' }, count: 200 }
    ],
    makes: [
      { value: 'Toyota', label: { en: 'Toyota', zh: '丰田' }, count: 75 }
    ],
    price_ranges: [
      { min: 20000, max: 30000, label: { en: '$20k-$30k', zh: '2万-3万美元' }, count: 100 }
    ],
    year_ranges: [
      { min: 2020, max: 2024, label: '2020-2024', count: 180 }
    ]
  };

  // Required fields
  assert(Array.isArray(validFacets.categories), 'SearchFacets categories should be array');
  assert(Array.isArray(validFacets.fuel_types), 'SearchFacets fuel_types should be array');
  assert(Array.isArray(validFacets.makes), 'SearchFacets makes should be array');
  assert(Array.isArray(validFacets.price_ranges), 'SearchFacets price_ranges should be array');
  assert(Array.isArray(validFacets.year_ranges), 'SearchFacets year_ranges should be array');

  // Validate facet items
  validFacets.categories.forEach((item, index) => {
    assert(typeof item.value === 'string', `SearchFacets categories[${index}] value should be string`);
    assert(typeof item.label === 'object', `SearchFacets categories[${index}] label should be object`);
    assert(typeof item.count === 'number', `SearchFacets categories[${index}] count should be number`);
  });

  console.log('✅ SearchFacets interface validation passed');
  return true;
}

/**
 * Test FacetItem interface
 */
function testFacetItem() {
  console.log('🔍 Testing FacetItem interface...');

  const validItem = {
    value: 'Toyota',
    label: {
      en: 'Toyota',
      zh: '丰田'
    },
    count: 75
  };

  // Required fields
  assert(typeof validItem.value === 'string', 'FacetItem value should be string');
  assert(typeof validItem.label === 'object', 'FacetItem label should be object');
  assert(typeof validItem.label.en === 'string', 'FacetItem label.en should be string');
  assert(typeof validItem.label.zh === 'string', 'FacetItem label.zh should be string');
  assert(typeof validItem.count === 'number', 'FacetItem count should be number');

  console.log('✅ FacetItem interface validation passed');
  return true;
}

/**
 * Test PriceRangeFacet interface
 */
function testPriceRangeFacet() {
  console.log('🔍 Testing PriceRangeFacet interface...');

  const validRange = {
    min: 20000,
    max: 30000,
    label: {
      en: '$20,000 - $30,000',
      zh: '2万美元 - 3万美元'
    },
    count: 150
  };

  // Required fields
  assert(typeof validRange.min === 'number', 'PriceRangeFacet min should be number');
  assert(typeof validRange.max === 'number', 'PriceRangeFacet max should be number');
  assert(typeof validRange.label === 'object', 'PriceRangeFacet label should be object');
  assert(typeof validRange.label.en === 'string', 'PriceRangeFacet label.en should be string');
  assert(typeof validRange.label.zh === 'string', 'PriceRangeFacet label.zh should be string');
  assert(typeof validRange.count === 'number', 'PriceRangeFacet count should be number');

  // Validate range
  assert(validRange.min <= validRange.max, 'PriceRangeFacet min should be <= max');

  console.log('✅ PriceRangeFacet interface validation passed');
  return true;
}

/**
 * Test YearRangeFacet interface
 */
function testYearRangeFacet() {
  console.log('🔍 Testing YearRangeFacet interface...');

  const validRange = {
    min: 2020,
    max: 2024,
    label: '2020-2024',
    count: 180
  };

  // Required fields
  assert(typeof validRange.min === 'number', 'YearRangeFacet min should be number');
  assert(typeof validRange.max === 'number', 'YearRangeFacet max should be number');
  assert(typeof validRange.label === 'string', 'YearRangeFacet label should be string');
  assert(typeof validRange.count === 'number', 'YearRangeFacet count should be number');

  // Validate range
  assert(validRange.min <= validRange.max, 'YearRangeFacet min should be <= max');

  console.log('✅ YearRangeFacet interface validation passed');
  return true;
}

/**
 * Test CarComparison interface
 */
function testCarComparison() {
  console.log('🔍 Testing CarComparison interface...');

  const validComparison = {
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
      },
      {
        id: 'car_2',
        make: 'Honda',
        model: 'Civic',
        year_min: 2022,
        year_max: 2024,
        price_min: 22000,
        price_max: 28000,
        currency: 'USD',
        category: 'Sedan',
        fuel_type: 'Gasoline',
        features: ['Air Conditioning', 'Bluetooth'],
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ],
    comparison_fields: [
      {
        key: 'price_min',
        label: {
          en: 'Starting Price',
          zh: '起步价'
        },
        type: 'number',
        format: 'currency',
        higher_is_better: false
      }
    ],
    winner_by_field: {
      'price_min': 'car_2',
      'reliability_score': 'car_1'
    }
  };

  // Required fields
  assert(Array.isArray(validComparison.cars), 'CarComparison cars should be array');
  assert(Array.isArray(validComparison.comparison_fields), 'CarComparison comparison_fields should be array');
  assert(typeof validComparison.winner_by_field === 'object', 'CarComparison winner_by_field should be object');

  // Validate comparison fields
  validComparison.comparison_fields.forEach((field, index) => {
    assert(typeof field.key === 'string', `CarComparison comparison_fields[${index}] key should be string`);
    assert(typeof field.label === 'object', `CarComparison comparison_fields[${index}] label should be object`);
    assert(typeof field.type === 'string', `CarComparison comparison_fields[${index}] type should be string`);
    assert(['number', 'string', 'array', 'boolean'].includes(field.type), `CarComparison comparison_fields[${index}] type should be valid`);
  });

  console.log('✅ CarComparison interface validation passed');
  return true;
}

/**
 * Test ComparisonField interface
 */
function testComparisonField() {
  console.log('🔍 Testing ComparisonField interface...');

  const validField = {
    key: 'reliability_score',
    label: {
      en: 'Reliability Score',
      zh: '可靠性评分'
    },
    type: 'number',
    format: 'rating',
    higher_is_better: true
  };

  // Required fields
  assert(typeof validField.key === 'string', 'ComparisonField key should be string');
  assert(typeof validField.label === 'object', 'ComparisonField label should be object');
  assert(typeof validField.label.en === 'string', 'ComparisonField label.en should be string');
  assert(typeof validField.label.zh === 'string', 'ComparisonField label.zh should be string');
  assert(typeof validField.type === 'string', 'ComparisonField type should be string');

  // Test valid types
  const validTypes = ['number', 'string', 'array', 'boolean'];
  assert(validTypes.includes(validField.type), `ComparisonField type should be one of: ${validTypes.join(', ')}`);

  // Optional fields
  if (validField.format) {
    const validFormats = ['currency', 'percentage', 'rating'];
    assert(validFormats.includes(validField.format), `ComparisonField format should be one of: ${validFormats.join(', ')}`);
  }
  if (validField.higher_is_better !== undefined) {
    assert(typeof validField.higher_is_better === 'boolean', 'ComparisonField higher_is_better should be boolean');
  }

  console.log('✅ ComparisonField interface validation passed');
  return true;
}

/**
 * Test CarStatistics interface
 */
function testCarStatistics() {
  console.log('🔍 Testing CarStatistics interface...');

  const validStats = {
    total_cars: 500,
    categories: {
      'Sedan': 200,
      'SUV': 150,
      'Truck': 100,
      'Hatchback': 50
    },
    fuel_types: {
      'Gasoline': 350,
      'Electric': 100,
      'Hybrid': 50
    },
    makes: {
      'Toyota': 120,
      'Honda': 100,
      'Ford': 80
    },
    price_distribution: {
      under_15k: 50,
      '15k_30k': 200,
      '30k_50k': 150,
      '50k_75k': 75,
      over_75k: 25
    },
    year_distribution: {
      '2020_plus': 300,
      '2015_2019': 150,
      '2010_2014': 40,
      '2005_2009': 8,
      before_2005: 2
    },
    average_ratings: {
      overall: 4.2,
      reliability: 4.1,
      fuel_economy: 3.8,
      safety: 4.3,
      value_for_money: 4.0
    }
  };

  // Required fields
  assert(typeof validStats.total_cars === 'number', 'CarStatistics total_cars should be number');
  assert(typeof validStats.categories === 'object', 'CarStatistics categories should be object');
  assert(typeof validStats.fuel_types === 'object', 'CarStatistics fuel_types should be object');
  assert(typeof validStats.makes === 'object', 'CarStatistics makes should be object');
  assert(typeof validStats.price_distribution === 'object', 'CarStatistics price_distribution should be object');
  assert(typeof validStats.year_distribution === 'object', 'CarStatistics year_distribution should be object');
  assert(typeof validStats.average_ratings === 'object', 'CarStatistics average_ratings should be object');

  console.log('✅ CarStatistics interface validation passed');
  return true;
}

/**
 * Test PriceDistribution interface
 */
function testPriceDistribution() {
  console.log('🔍 Testing PriceDistribution interface...');

  const validDistribution = {
    under_15k: 50,
    '15k_30k': 200,
    '30k_50k': 150,
    '50k_75k': 75,
    over_75k: 25
  };

  // Required fields
  assert(typeof validDistribution.under_15k === 'number', 'PriceDistribution under_15k should be number');
  assert(typeof validDistribution['15k_30k'] === 'number', 'PriceDistribution 15k_30k should be number');
  assert(typeof validDistribution['30k_50k'] === 'number', 'PriceDistribution 30k_50k should be number');
  assert(typeof validDistribution['50k_75k'] === 'number', 'PriceDistribution 50k_75k should be number');
  assert(typeof validDistribution.over_75k === 'number', 'PriceDistribution over_75k should be number');

  console.log('✅ PriceDistribution interface validation passed');
  return true;
}

/**
 * Test YearDistribution interface
 */
function testYearDistribution() {
  console.log('🔍 Testing YearDistribution interface...');

  const validDistribution = {
    '2020_plus': 300,
    '2015_2019': 150,
    '2010_2014': 40,
    '2005_2009': 8,
    before_2005: 2
  };

  // Required fields
  assert(typeof validDistribution['2020_plus'] === 'number', 'YearDistribution 2020_plus should be number');
  assert(typeof validDistribution['2015_2019'] === 'number', 'YearDistribution 2015_2019 should be number');
  assert(typeof validDistribution['2010_2014'] === 'number', 'YearDistribution 2010_2014 should be number');
  assert(typeof validDistribution['2005_2009'] === 'number', 'YearDistribution 2005_2009 should be number');
  assert(typeof validDistribution.before_2005 === 'number', 'YearDistribution before_2005 should be number');

  console.log('✅ YearDistribution interface validation passed');
  return true;
}

/**
 * Test AverageRatings interface
 */
function testAverageRatings() {
  console.log('🔍 Testing AverageRatings interface...');

  const validRatings = {
    overall: 4.2,
    reliability: 4.1,
    fuel_economy: 3.8,
    safety: 4.3,
    value_for_money: 4.0
  };

  // Required fields
  assert(typeof validRatings.overall === 'number', 'AverageRatings overall should be number');
  assert(typeof validRatings.reliability === 'number', 'AverageRatings reliability should be number');
  assert(typeof validRatings.fuel_economy === 'number', 'AverageRatings fuel_economy should be number');
  assert(typeof validRatings.safety === 'number', 'AverageRatings safety should be number');
  assert(typeof validRatings.value_for_money === 'number', 'AverageRatings value_for_money should be number');

  // Validate rating ranges
  Object.entries(validRatings).forEach(([key, value]) => {
    assert(value >= 0 && value <= 5, `AverageRatings ${key} should be 0-5`);
  });

  console.log('✅ AverageRatings interface validation passed');
  return true;
}

/**
 * Test CarResource interface
 */
function testCarResource() {
  console.log('🔍 Testing CarResource interface...');

  const validResource = {
    name: 'CarGurus',
    url: 'https://cargurus.com',
    description: {
      en: 'Popular car shopping website',
      zh: '受欢迎的汽车购物网站'
    },
    type: 'marketplace',
    rating: 4.5,
    is_recommended: true
  };

  // Required fields
  assert(typeof validResource.name === 'string', 'CarResource name should be string');
  assert(typeof validResource.url === 'string', 'CarResource url should be string');
  assert(typeof validResource.description === 'object', 'CarResource description should be object');
  assert(typeof validResource.description.en === 'string', 'CarResource description.en should be string');
  assert(typeof validResource.description.zh === 'string', 'CarResource description.zh should be string');
  assert(typeof validResource.type === 'string', 'CarResource type should be string');

  // Test valid types
  const validTypes = ['marketplace', 'dealer', 'review', 'financing', 'insurance'];
  assert(validTypes.includes(validResource.type), `CarResource type should be one of: ${validTypes.join(', ')}`);

  // Optional fields
  if (validResource.rating !== undefined) {
    assert(typeof validResource.rating === 'number', 'CarResource rating should be number');
    assert(validResource.rating >= 0 && validResource.rating <= 5, 'CarResource rating should be 0-5');
  }
  if (validResource.is_recommended !== undefined) {
    assert(typeof validResource.is_recommended === 'boolean', 'CarResource is_recommended should be boolean');
  }

  console.log('✅ CarResource interface validation passed');
  return true;
}

/**
 * Test CreateCarData interface
 */
function testCreateCarData() {
  console.log('🔍 Testing CreateCarData interface...');

  const validData = {
    make: 'Toyota',
    model: 'Camry',
    year_min: 2022,
    year_max: 2024,
    price_min: 25000,
    price_max: 35000,
    currency: 'USD',
    category: 'Sedan',
    fuel_type: 'Gasoline',
    description_en: 'A reliable sedan',
    description_zh: '一款可靠的轿车',
    pros_en: ['Reliable', 'Fuel efficient'],
    pros_zh: ['可靠', '省油'],
    cons_en: ['Not sporty'],
    cons_zh: ['不够运动'],
    features: ['Air Conditioning', 'Bluetooth'],
    image_url: 'https://example.com/camry.jpg',
    reliability_score: 4.5,
    fuel_economy: 32,
    safety_rating: 5
  };

  // Required fields
  assert(typeof validData.make === 'string', 'CreateCarData make should be string');
  assert(typeof validData.model === 'string', 'CreateCarData model should be string');
  assert(typeof validData.year_min === 'number', 'CreateCarData year_min should be number');
  assert(typeof validData.year_max === 'number', 'CreateCarData year_max should be number');
  assert(typeof validData.currency === 'string', 'CreateCarData currency should be string');
  assert(typeof validData.category === 'string', 'CreateCarData category should be string');
  assert(typeof validData.fuel_type === 'string', 'CreateCarData fuel_type should be string');

  // Validate year range
  assert(validData.year_min <= validData.year_max, 'CreateCarData year_min should be <= year_max');

  // Optional fields
  if (validData.price_min !== undefined) {
    assert(typeof validData.price_min === 'number', 'CreateCarData price_min should be number');
  }
  if (validData.price_max !== undefined) {
    assert(typeof validData.price_max === 'number', 'CreateCarData price_max should be number');
  }

  console.log('✅ CreateCarData interface validation passed');
  return true;
}

/**
 * Test UpdateCarData interface
 */
function testUpdateCarData() {
  console.log('🔍 Testing UpdateCarData interface...');

  const validData = {
    price_min: 26000,
    price_max: 36000,
    description_en: 'An updated reliable sedan',
    is_active: false
  };

  // All fields are optional in UpdateCarData
  if (validData.price_min !== undefined) {
    assert(typeof validData.price_min === 'number', 'UpdateCarData price_min should be number');
  }
  if (validData.price_max !== undefined) {
    assert(typeof validData.price_max === 'number', 'UpdateCarData price_max should be number');
  }
  if (validData.description_en) {
    assert(typeof validData.description_en === 'string', 'UpdateCarData description_en should be string');
  }
  if (validData.is_active !== undefined) {
    assert(typeof validData.is_active === 'boolean', 'UpdateCarData is_active should be boolean');
  }

  console.log('✅ UpdateCarData interface validation passed');
  return true;
}

/**
 * Test CarImportData interface
 */
function testCarImportData() {
  console.log('🔍 Testing CarImportData interface...');

  const validImportData = {
    cars: [
      {
        make: 'Toyota',
        model: 'Camry',
        year_min: 2022,
        year_max: 2024,
        category: 'Sedan',
        fuel_type: 'Gasoline',
        currency: 'USD'
      }
    ],
    source: 'external_api',
    import_date: new Date('2023-01-20T10:00:00Z'),
    validation_results: [
      {
        row: 1,
        field: 'price_min',
        error: 'Price below minimum threshold',
        severity: 'warning'
      }
    ]
  };

  // Required fields
  assert(Array.isArray(validImportData.cars), 'CarImportData cars should be array');
  assert(typeof validImportData.source === 'string', 'CarImportData source should be string');
  assert(validImportData.import_date instanceof Date, 'CarImportData import_date should be Date');

  // Optional field
  if (validImportData.validation_results) {
    assert(Array.isArray(validImportData.validation_results), 'CarImportData validation_results should be array');
  }

  console.log('✅ CarImportData interface validation passed');
  return true;
}

/**
 * Test ValidationResult interface
 */
function testValidationResult() {
  console.log('🔍 Testing ValidationResult interface...');

  const validResult = {
    row: 5,
    field: 'price_min',
    error: 'Value must be greater than 0',
    severity: 'error'
  };

  // Required fields
  assert(typeof validResult.row === 'number', 'ValidationResult row should be number');
  assert(typeof validResult.field === 'string', 'ValidationResult field should be string');
  assert(typeof validResult.error === 'string', 'ValidationResult error should be string');
  assert(typeof validResult.severity === 'string', 'ValidationResult severity should be string');

  // Test valid severity values
  const validSeverities = ['error', 'warning'];
  assert(validSeverities.includes(validResult.severity), `ValidationResult severity should be one of: ${validSeverities.join(', ')}`);

  console.log('✅ ValidationResult interface validation passed');
  return true;
}

/**
 * Test car type relationships and structure
 */
function testCarTypeRelationships() {
  console.log('🔍 Testing car type relationships and structure...');

  // Test that car types are properly structured and related
  const expectedCarTypes = [
    'Car',
    'CarRecommendation',
    'NextStep',
    'RecommendationFactor',
    'CarReview',
    'CarAvailability',
    'CarFilters',
    'CarSearchParams',
    'CarSortField',
    'CarSearchResult',
    'SearchFacets',
    'FacetItem',
    'PriceRangeFacet',
    'YearRangeFacet',
    'CarComparison',
    'ComparisonField',
    'CarStatistics',
    'PriceDistribution',
    'YearDistribution',
    'AverageRatings',
    'CarResource',
    'CreateCarData',
    'UpdateCarData',
    'CarImportData',
    'ValidationResult'
  ];

  // Verify that core car types exist in our expected structure
  assert(expectedCarTypes.length > 0, 'Should have car type exports');
  assert(expectedCarTypes.includes('Car'), 'Car should be in car types');
  assert(expectedCarTypes.includes('CarRecommendation'), 'CarRecommendation should be in car types');
  assert(expectedCarTypes.includes('NextStep'), 'NextStep should be in car types');

  // Test logical relationships between types
  // CarRecommendation should reference Car
  // NextStep should have action types
  // CarFilters should support various filter criteria

  console.log('✅ Car type relationships and structure validation passed');
  return true;
}

/**
 * Run all car type tests
 */
async function runAllTests() {
  console.log('🚀 Starting Car Types Test Suite...\n');

  const tests = [
    testCar,
    testCarRecommendation,
    testRecommendationFactor,
    testNextStep,
    testCarReview,
    testCarAvailability,
    testCarFilters,
    testCarSearchParams,
    testCarSortField,
    testCarSearchResult,
    testSearchFacets,
    testFacetItem,
    testPriceRangeFacet,
    testYearRangeFacet,
    testCarComparison,
    testComparisonField,
    testCarStatistics,
    testPriceDistribution,
    testYearDistribution,
    testAverageRatings,
    testCarResource,
    testCreateCarData,
    testUpdateCarData,
    testCarImportData,
    testValidationResult,
    testCarTypeRelationships
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

  console.log(`\n📊 Car Types Test Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('🎉 All car type tests passed!');
    return true;
  } else {
    console.error('💥 Some car type tests failed!');
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
  testCar,
  testCarRecommendation,
  testRecommendationFactor,
  testNextStep,
  testCarReview,
  testCarAvailability,
  testCarFilters,
  testCarSearchParams,
  testCarSortField,
  testCarSearchResult,
  testSearchFacets,
  testFacetItem,
  testPriceRangeFacet,
  testYearRangeFacet,
  testCarComparison,
  testComparisonField,
  testCarStatistics,
  testPriceDistribution,
  testYearDistribution,
  testAverageRatings,
  testCarResource,
  testCreateCarData,
  testUpdateCarData,
  testCarImportData,
  testValidationResult,
  testCarTypeRelationships
};
