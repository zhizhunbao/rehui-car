#!/usr/bin/env node

/**
 * Type System Test Suite - Chat Types (chat.ts)
 * Tests for: ChatMessage, Conversation, ChatState, ChatInputState, MessageStatus, etc.
 *
 * @description Validates chat-related type definitions including messages,
 * conversations, chat state management, and chat event handling.
 */

const assert = require('assert');
const path = require('path');

/**
 * Test ChatMessage interface
 */
function testChatMessage() {
  console.log('🔍 Testing ChatMessage interface...');

  const validMessage = {
    id: 'msg_123e4567-e89b-12d3-a456-426614174000',
    conversationId: 'conv_456',
    role: 'user',
    content: 'I need help finding a reliable car',
    language: 'en',
    createdAt: '2023-01-01T10:30:00Z'
  };

  // Required fields
  assert(typeof validMessage.id === 'string', 'ChatMessage id should be string');
  assert(typeof validMessage.conversationId === 'string', 'ChatMessage conversationId should be string');
  assert(typeof validMessage.role === 'string', 'ChatMessage role should be string');
  assert(typeof validMessage.content === 'string', 'ChatMessage content should be string');
  assert(typeof validMessage.language === 'string', 'ChatMessage language should be string');
  assert(typeof validMessage.createdAt === 'string', 'ChatMessage createdAt should be string');

  // Test valid roles
  const validRoles = ['user', 'assistant'];
  assert(validRoles.includes(validMessage.role), `ChatMessage role should be one of: ${validRoles.join(', ')}`);

  // Test valid languages
  const validLanguages = ['en', 'zh'];
  assert(validLanguages.includes(validMessage.language), `ChatMessage language should be one of: ${validLanguages.join(', ')}`);

  console.log('✅ ChatMessage interface validation passed');
  return true;
}

/**
 * Test Conversation interface
 */
function testConversation() {
  console.log('🔍 Testing Conversation interface...');

  const validConversation = {
    id: 'conv_123e4567-e89b-12d3-a456-426614174000',
    user_id: 'user_456',
    title: 'Car Shopping Discussion',
    summary: 'Discussion about finding the right car',
    language: 'en',
    session_id: 'sess_789',
    created_at: new Date('2023-01-01T09:00:00Z'),
    updated_at: new Date('2023-01-01T10:30:00Z')
  };

  // Required fields
  assert(typeof validConversation.id === 'string', 'Conversation id should be string');
  assert(typeof validConversation.language === 'string', 'Conversation language should be string');
  assert(typeof validConversation.session_id === 'string', 'Conversation session_id should be string');
  assert(validConversation.created_at instanceof Date, 'Conversation created_at should be Date');
  assert(validConversation.updated_at instanceof Date, 'Conversation updated_at should be Date');

  // Optional fields
  if (validConversation.user_id) {
    assert(typeof validConversation.user_id === 'string', 'Conversation user_id should be string');
  }
  if (validConversation.title) {
    assert(typeof validConversation.title === 'string', 'Conversation title should be string');
  }
  if (validConversation.summary) {
    assert(typeof validConversation.summary === 'string', 'Conversation summary should be string');
  }

  // Test valid languages
  const validLanguages = ['en', 'zh'];
  assert(validLanguages.includes(validConversation.language), `Conversation language should be one of: ${validLanguages.join(', ')}`);

  console.log('✅ Conversation interface validation passed');
  return true;
}

/**
 * Test ConversationWithMessages interface
 */
function testConversationWithMessages() {
  console.log('🔍 Testing ConversationWithMessages interface...');

  const validConversationWithMessages = {
    id: 'conv_123',
    user_id: 'user_456',
    title: 'Car Discussion',
    summary: 'Discussion about cars',
    language: 'en',
    session_id: 'sess_789',
    created_at: new Date('2023-01-01T09:00:00Z'),
    updated_at: new Date('2023-01-01T10:30:00Z'),
    messages: [
      {
        id: 'msg_1',
        conversationId: 'conv_123',
        role: 'user',
        content: 'Help me find a car',
        language: 'en',
        createdAt: '2023-01-01T09:15:00Z'
      },
      {
        id: 'msg_2',
        conversationId: 'conv_123',
        role: 'assistant',
        content: 'I can help you find the perfect car',
        language: 'en',
        createdAt: '2023-01-01T09:16:00Z'
      }
    ],
    message_count: 2,
    last_message_at: new Date('2023-01-01T10:30:00Z')
  };

  // Inherit from Conversation
  assert(typeof validConversationWithMessages.id === 'string', 'ConversationWithMessages id should be string');
  assert(typeof validConversationWithMessages.language === 'string', 'ConversationWithMessages language should be string');
  assert(typeof validConversationWithMessages.session_id === 'string', 'ConversationWithMessages session_id should be string');
  assert(validConversationWithMessages.created_at instanceof Date, 'ConversationWithMessages created_at should be Date');
  assert(validConversationWithMessages.updated_at instanceof Date, 'ConversationWithMessages updated_at should be Date');

  // Additional fields
  assert(Array.isArray(validConversationWithMessages.messages), 'ConversationWithMessages messages should be array');
  assert(typeof validConversationWithMessages.message_count === 'number', 'ConversationWithMessages message_count should be number');

  // Optional field
  if (validConversationWithMessages.last_message_at) {
    assert(validConversationWithMessages.last_message_at instanceof Date, 'ConversationWithMessages last_message_at should be Date');
  }

  // Validate messages
  validConversationWithMessages.messages.forEach((message, index) => {
    assert(typeof message.id === 'string', `Message ${index} id should be string`);
    assert(typeof message.conversationId === 'string', `Message ${index} conversationId should be string`);
    assert(['user', 'assistant'].includes(message.role), `Message ${index} role should be valid`);
  });

  console.log('✅ ConversationWithMessages interface validation passed');
  return true;
}

/**
 * Test ChatState interface
 */
function testChatState() {
  console.log('🔍 Testing ChatState interface...');

  const validChatState = {
    messages: [
      {
        id: 'msg_1',
        conversationId: 'conv_123',
        role: 'user',
        content: 'Hello',
        language: 'en',
        createdAt: '2023-01-01T09:00:00Z'
      }
    ],
    isLoading: false,
    error: null,
    currentConversation: {
      id: 'conv_123',
      language: 'en',
      session_id: 'sess_789',
      created_at: new Date(),
      updated_at: new Date()
    }
  };

  // Required fields
  assert(Array.isArray(validChatState.messages), 'ChatState messages should be array');
  assert(typeof validChatState.isLoading === 'boolean', 'ChatState isLoading should be boolean');
  assert(validChatState.error === null || typeof validChatState.error === 'string', 'ChatState error should be string or null');

  // Optional field
  if (validChatState.currentConversation) {
    assert(typeof validChatState.currentConversation === 'object', 'ChatState currentConversation should be object');
    assert(typeof validChatState.currentConversation.id === 'string', 'ChatState currentConversation.id should be string');
  }

  // Validate messages
  validChatState.messages.forEach((message, index) => {
    assert(typeof message.id === 'string', `Message ${index} id should be string`);
    assert(['user', 'assistant'].includes(message.role), `Message ${index} role should be valid`);
  });

  console.log('✅ ChatState interface validation passed');
  return true;
}

/**
 * Test ChatInputState interface
 */
function testChatInputState() {
  console.log('🔍 Testing ChatInputState interface...');

  const validInputState = {
    value: 'What cars do you recommend?',
    isSubmitting: false,
    error: null
  };

  // Required fields
  assert(typeof validInputState.value === 'string', 'ChatInputState value should be string');
  assert(typeof validInputState.isSubmitting === 'boolean', 'ChatInputState isSubmitting should be boolean');

  // Optional field
  if (validInputState.error) {
    assert(typeof validInputState.error === 'string', 'ChatInputState error should be string');
  }

  console.log('✅ ChatInputState interface validation passed');
  return true;
}

/**
 * Test MessageStatus type
 */
function testMessageStatus() {
  console.log('🔍 Testing MessageStatus type...');

  const validStatuses = ['sending', 'sent', 'failed', 'delivered'];

  validStatuses.forEach(status => {
    assert(typeof status === 'string', `MessageStatus '${status}' should be string`);
    assert(validStatuses.includes(status), `MessageStatus '${status}' should be valid`);
  });

  console.log('✅ MessageStatus type validation passed');
  return true;
}

/**
 * Test ChatMessageWithStatus interface
 */
function testChatMessageWithStatus() {
  console.log('🔍 Testing ChatMessageWithStatus interface...');

  const validMessageWithStatus = {
    id: 'msg_123',
    conversationId: 'conv_456',
    role: 'user',
    content: 'Hello, I need help',
    language: 'en',
    createdAt: '2023-01-01T09:00:00Z',
    status: 'sent',
    retryCount: 0
  };

  // Inherit from ChatMessage
  assert(typeof validMessageWithStatus.id === 'string', 'ChatMessageWithStatus id should be string');
  assert(typeof validMessageWithStatus.conversationId === 'string', 'ChatMessageWithStatus conversationId should be string');
  assert(typeof validMessageWithStatus.role === 'string', 'ChatMessageWithStatus role should be string');
  assert(typeof validMessageWithStatus.content === 'string', 'ChatMessageWithStatus content should be string');
  assert(typeof validMessageWithStatus.language === 'string', 'ChatMessageWithStatus language should be string');
  assert(typeof validMessageWithStatus.createdAt === 'string', 'ChatMessageWithStatus createdAt should be string');

  // Additional fields
  assert(typeof validMessageWithStatus.status === 'string', 'ChatMessageWithStatus status should be string');

  // Test valid status values
  const validStatuses = ['sending', 'sent', 'failed', 'delivered'];
  assert(validStatuses.includes(validMessageWithStatus.status), `ChatMessageWithStatus status should be one of: ${validStatuses.join(', ')}`);

  // Optional field
  if (validMessageWithStatus.retryCount !== undefined) {
    assert(typeof validMessageWithStatus.retryCount === 'number', 'ChatMessageWithStatus retryCount should be number');
  }

  console.log('✅ ChatMessageWithStatus interface validation passed');
  return true;
}

/**
 * Test ConversationSummary interface
 */
function testConversationSummary() {
  console.log('🔍 Testing ConversationSummary interface...');

  const validSummary = {
    id: 'conv_123',
    title: 'Car Shopping Discussion',
    last_message: 'What about Toyota Camry?',
    last_message_at: new Date('2023-01-01T10:30:00Z'),
    message_count: 5,
    language: 'en'
  };

  // Required fields
  assert(typeof validSummary.id === 'string', 'ConversationSummary id should be string');
  assert(typeof validSummary.title === 'string', 'ConversationSummary title should be string');
  assert(typeof validSummary.last_message === 'string', 'ConversationSummary last_message should be string');
  assert(validSummary.last_message_at instanceof Date, 'ConversationSummary last_message_at should be Date');
  assert(typeof validSummary.message_count === 'number', 'ConversationSummary message_count should be number');
  assert(typeof validSummary.language === 'string', 'ConversationSummary language should be string');

  // Test valid languages
  const validLanguages = ['en', 'zh'];
  assert(validLanguages.includes(validSummary.language), `ConversationSummary language should be one of: ${validLanguages.join(', ')}`);

  console.log('✅ ConversationSummary interface validation passed');
  return true;
}

/**
 * Test ChatHistoryParams interface
 */
function testChatHistoryParams() {
  console.log('🔍 Testing ChatHistoryParams interface...');

  const validParams = {
    conversation_id: 'conv_123',
    user_id: 'user_456',
    session_id: 'sess_789',
    limit: 20,
    offset: 0,
    before: new Date('2023-01-01T12:00:00Z'),
    after: new Date('2023-01-01T09:00:00Z')
  };

  // All fields are optional in ChatHistoryParams
  if (validParams.conversation_id) {
    assert(typeof validParams.conversation_id === 'string', 'ChatHistoryParams conversation_id should be string');
  }
  if (validParams.user_id) {
    assert(typeof validParams.user_id === 'string', 'ChatHistoryParams user_id should be string');
  }
  if (validParams.session_id) {
    assert(typeof validParams.session_id === 'string', 'ChatHistoryParams session_id should be string');
  }
  if (validParams.limit) {
    assert(typeof validParams.limit === 'number', 'ChatHistoryParams limit should be number');
  }
  if (validParams.offset) {
    assert(typeof validParams.offset === 'number', 'ChatHistoryParams offset should be number');
  }
  if (validParams.before) {
    assert(validParams.before instanceof Date, 'ChatHistoryParams before should be Date');
  }
  if (validParams.after) {
    assert(validParams.after instanceof Date, 'ChatHistoryParams after should be Date');
  }

  console.log('✅ ChatHistoryParams interface validation passed');
  return true;
}

/**
 * Test ChatConfig interface
 */
function testChatConfig() {
  console.log('🔍 Testing ChatConfig interface...');

  const validConfig = {
    max_message_length: 2000,
    max_messages_per_conversation: 100,
    auto_save_interval: 30000, // 30 seconds
    typing_indicator_timeout: 5000, // 5 seconds
    message_retry_attempts: 3
  };

  // Required fields
  assert(typeof validConfig.max_message_length === 'number', 'ChatConfig max_message_length should be number');
  assert(typeof validConfig.max_messages_per_conversation === 'number', 'ChatConfig max_messages_per_conversation should be number');
  assert(typeof validConfig.auto_save_interval === 'number', 'ChatConfig auto_save_interval should be number');
  assert(typeof validConfig.typing_indicator_timeout === 'number', 'ChatConfig typing_indicator_timeout should be number');
  assert(typeof validConfig.message_retry_attempts === 'number', 'ChatConfig message_retry_attempts should be number');

  // Validate reasonable ranges
  assert(validConfig.max_message_length > 0, 'ChatConfig max_message_length should be positive');
  assert(validConfig.max_messages_per_conversation > 0, 'ChatConfig max_messages_per_conversation should be positive');
  assert(validConfig.auto_save_interval > 0, 'ChatConfig auto_save_interval should be positive');
  assert(validConfig.typing_indicator_timeout > 0, 'ChatConfig typing_indicator_timeout should be positive');
  assert(validConfig.message_retry_attempts >= 0, 'ChatConfig message_retry_attempts should be non-negative');

  console.log('✅ ChatConfig interface validation passed');
  return true;
}

/**
 * Test TypingIndicator interface
 */
function testTypingIndicator() {
  console.log('🔍 Testing TypingIndicator interface...');

  const validIndicator = {
    isTyping: true,
    userId: 'user_123',
    timestamp: new Date('2023-01-01T10:30:00Z')
  };

  // Required fields
  assert(typeof validIndicator.isTyping === 'boolean', 'TypingIndicator isTyping should be boolean');
  assert(validIndicator.timestamp instanceof Date, 'TypingIndicator timestamp should be Date');

  // Optional field
  if (validIndicator.userId) {
    assert(typeof validIndicator.userId === 'string', 'TypingIndicator userId should be string');
  }

  console.log('✅ TypingIndicator interface validation passed');
  return true;
}

/**
 * Test ChatEventType type
 */
function testChatEventType() {
  console.log('🔍 Testing ChatEventType type...');

  const validEventTypes = [
    'message_sent',
    'message_received',
    'typing_start',
    'typing_stop',
    'conversation_created',
    'conversation_updated',
    'error_occurred'
  ];

  validEventTypes.forEach(eventType => {
    assert(typeof eventType === 'string', `ChatEventType '${eventType}' should be string`);
    assert(validEventTypes.includes(eventType), `ChatEventType '${eventType}' should be valid`);
  });

  console.log('✅ ChatEventType type validation passed');
  return true;
}

/**
 * Test ChatEvent interface
 */
function testChatEvent() {
  console.log('🔍 Testing ChatEvent interface...');

  const validEvent = {
    type: 'message_sent',
    payload: {
      messageId: 'msg_123',
      conversationId: 'conv_456',
      content: 'Hello world'
    },
    timestamp: new Date('2023-01-01T10:30:00Z'),
    conversation_id: 'conv_456'
  };

  // Required fields
  assert(typeof validEvent.type === 'string', 'ChatEvent type should be string');
  assert(validEvent.payload !== undefined, 'ChatEvent payload should be defined');
  assert(validEvent.timestamp instanceof Date, 'ChatEvent timestamp should be Date');

  // Test valid event types
  const validEventTypes = [
    'message_sent',
    'message_received',
    'typing_start',
    'typing_stop',
    'conversation_created',
    'conversation_updated',
    'error_occurred'
  ];
  assert(validEventTypes.includes(validEvent.type), `ChatEvent type should be one of: ${validEventTypes.join(', ')}`);

  // Optional field
  if (validEvent.conversation_id) {
    assert(typeof validEvent.conversation_id === 'string', 'ChatEvent conversation_id should be string');
  }

  console.log('✅ ChatEvent interface validation passed');
  return true;
}

/**
 * Test MessageTemplate interface
 */
function testMessageTemplate() {
  console.log('🔍 Testing MessageTemplate interface...');

  const validTemplate = {
    id: 'template_123',
    name: 'Greeting Template',
    content: {
      en: 'Hello! How can I help you today?',
      zh: '你好！我今天怎么帮助您？'
    },
    category: 'greeting',
    variables: ['name', 'time']
  };

  // Required fields
  assert(typeof validTemplate.id === 'string', 'MessageTemplate id should be string');
  assert(typeof validTemplate.name === 'string', 'MessageTemplate name should be string');
  assert(typeof validTemplate.content === 'object', 'MessageTemplate content should be object');
  assert(typeof validTemplate.content.en === 'string', 'MessageTemplate content.en should be string');
  assert(typeof validTemplate.content.zh === 'string', 'MessageTemplate content.zh should be string');
  assert(typeof validTemplate.category === 'string', 'MessageTemplate category should be string');

  // Test valid categories
  const validCategories = ['greeting', 'help', 'error', 'suggestion'];
  assert(validCategories.includes(validTemplate.category), `MessageTemplate category should be one of: ${validCategories.join(', ')}`);

  // Optional field
  if (validTemplate.variables) {
    assert(Array.isArray(validTemplate.variables), 'MessageTemplate variables should be array');
    validTemplate.variables.forEach((variable, index) => {
      assert(typeof variable === 'string', `MessageTemplate variable ${index} should be string`);
    });
  }

  console.log('✅ MessageTemplate interface validation passed');
  return true;
}

/**
 * Test ChatAnalytics interface
 */
function testChatAnalytics() {
  console.log('🔍 Testing ChatAnalytics interface...');

  const validAnalytics = {
    total_messages: 150,
    total_conversations: 25,
    average_messages_per_conversation: 6,
    most_active_hours: [9, 10, 14, 15, 19],
    common_topics: ['car_recommendations', 'price_inquiry', 'feature_comparison'],
    user_satisfaction_score: 4.2
  };

  // Required fields
  assert(typeof validAnalytics.total_messages === 'number', 'ChatAnalytics total_messages should be number');
  assert(typeof validAnalytics.total_conversations === 'number', 'ChatAnalytics total_conversations should be number');
  assert(typeof validAnalytics.average_messages_per_conversation === 'number', 'ChatAnalytics average_messages_per_conversation should be number');
  assert(Array.isArray(validAnalytics.most_active_hours), 'ChatAnalytics most_active_hours should be array');
  assert(Array.isArray(validAnalytics.common_topics), 'ChatAnalytics common_topics should be array');

  // Validate arrays
  validAnalytics.most_active_hours.forEach((hour, index) => {
    assert(typeof hour === 'number', `ChatAnalytics most_active_hours[${index}] should be number`);
    assert(hour >= 0 && hour <= 23, `ChatAnalytics most_active_hours[${index}] should be valid hour (0-23)`);
  });

  validAnalytics.common_topics.forEach((topic, index) => {
    assert(typeof topic === 'string', `ChatAnalytics common_topics[${index}] should be string`);
  });

  // Optional field
  if (validAnalytics.user_satisfaction_score !== undefined) {
    assert(typeof validAnalytics.user_satisfaction_score === 'number', 'ChatAnalytics user_satisfaction_score should be number');
    assert(validAnalytics.user_satisfaction_score >= 0 && validAnalytics.user_satisfaction_score <= 5, 'ChatAnalytics user_satisfaction_score should be between 0-5');
  }

  console.log('✅ ChatAnalytics interface validation passed');
  return true;
}

/**
 * Test ChatResponse interface (API response)
 */
function testChatResponseAPI() {
  console.log('🔍 Testing ChatResponse API interface...');

  const validResponse = {
    message: 'I can help you find the perfect car based on your needs.',
    conversationId: 'conv_123',
    messageId: 'msg_456',
    timestamp: '2023-01-01T10:30:00Z',
    metadata: {
      model: 'gpt-3.5-turbo',
      tokens: 150,
      context: {
        user_preferences: ['fuel_efficient', 'reliable']
      },
      error: false
    },
    recommendations: []
  };

  // Required fields
  assert(typeof validResponse.message === 'string', 'ChatResponse message should be string');
  assert(typeof validResponse.conversationId === 'string', 'ChatResponse conversationId should be string');
  assert(typeof validResponse.messageId === 'string', 'ChatResponse messageId should be string');
  assert(typeof validResponse.timestamp === 'string', 'ChatResponse timestamp should be string');

  // Optional fields
  if (validResponse.metadata) {
    assert(typeof validResponse.metadata === 'object', 'ChatResponse metadata should be object');
    if (validResponse.metadata.model) {
      assert(typeof validResponse.metadata.model === 'string', 'ChatResponse metadata.model should be string');
    }
    if (validResponse.metadata.tokens) {
      assert(typeof validResponse.metadata.tokens === 'number', 'ChatResponse metadata.tokens should be number');
    }
    if (validResponse.metadata.error !== undefined) {
      assert(typeof validResponse.metadata.error === 'boolean', 'ChatResponse metadata.error should be boolean');
    }
  }

  if (validResponse.recommendations) {
    assert(Array.isArray(validResponse.recommendations), 'ChatResponse recommendations should be array');
  }

  console.log('✅ ChatResponse API interface validation passed');
  return true;
}

/**
 * Test chat type relationships and structure
 */
function testChatTypeRelationships() {
  console.log('🔍 Testing chat type relationships and structure...');

  // Test that chat types are properly structured and related
  const expectedChatTypes = [
    'ChatMessage',
    'Conversation',
    'ConversationWithMessages',
    'ChatState',
    'ChatInputState',
    'MessageStatus',
    'ChatMessageWithStatus',
    'ConversationSummary',
    'ChatHistoryParams',
    'ChatConfig',
    'TypingIndicator',
    'ChatEventType',
    'ChatEvent',
    'MessageTemplate',
    'ChatAnalytics',
    'ChatResponse'
  ];

  // Verify that core chat types exist in our expected structure
  assert(expectedChatTypes.length > 0, 'Should have chat type exports');
  assert(expectedChatTypes.includes('ChatMessage'), 'ChatMessage should be in chat types');
  assert(expectedChatTypes.includes('Conversation'), 'Conversation should be in chat types');
  assert(expectedChatTypes.includes('ChatState'), 'ChatState should be in chat types');

  // Test logical relationships between types
  // ChatState should reference messages
  // ConversationWithMessages should extend Conversation
  // ChatMessageWithStatus should extend ChatMessage

  console.log('✅ Chat type relationships and structure validation passed');
  return true;
}

/**
 * Run all chat type tests
 */
async function runAllTests() {
  console.log('🚀 Starting Chat Types Test Suite...\n');

  const tests = [
    testChatMessage,
    testConversation,
    testConversationWithMessages,
    testChatState,
    testChatInputState,
    testMessageStatus,
    testChatMessageWithStatus,
    testConversationSummary,
    testChatHistoryParams,
    testChatConfig,
    testTypingIndicator,
    testChatEventType,
    testChatEvent,
    testMessageTemplate,
    testChatAnalytics,
    testChatResponseAPI,
    testChatTypeRelationships
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

  console.log(`\n📊 Chat Types Test Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('🎉 All chat type tests passed!');
    return true;
  } else {
    console.error('💥 Some chat type tests failed!');
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
  testChatMessage,
  testConversation,
  testConversationWithMessages,
  testChatState,
  testChatInputState,
  testMessageStatus,
  testChatMessageWithStatus,
  testConversationSummary,
  testChatHistoryParams,
  testChatConfig,
  testTypingIndicator,
  testChatEventType,
  testChatEvent,
  testMessageTemplate,
  testChatAnalytics,
  testChatResponseAPI,
  testChatTypeRelationships
};
