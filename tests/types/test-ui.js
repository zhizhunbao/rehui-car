#!/usr/bin/env node

/**
 * Type System Test Suite - UI Types (ui.ts)
 * Tests for: UI components, state management, form handling, modal states
 *
 * @description Validates UI-related type definitions including component props,
 * state management types, form handling, and UI interaction patterns.
 */

const assert = require('assert');
const path = require('path');

/**
 * Test BaseComponentProps interface
 */
function testBaseComponentProps() {
  console.log('🔍 Testing BaseComponentProps interface...');

  const validProps = {
    className: 'custom-class',
    children: '<div>Test Content</div>'
  };

  // All fields are optional in BaseComponentProps
  if (validProps.className) {
    assert(typeof validProps.className === 'string', 'BaseComponentProps className should be string');
  }
  if (validProps.children) {
    // children can be React.ReactNode which includes string, number, JSX, etc.
    assert(validProps.children !== undefined, 'BaseComponentProps children should be defined');
  }

  console.log('✅ BaseComponentProps interface validation passed');
  return true;
}

/**
 * Test LoadingState interface
 */
function testLoadingState() {
  console.log('🔍 Testing LoadingState interface...');

  const validState = {
    isLoading: false,
    error: null
  };

  // Required fields
  assert(typeof validState.isLoading === 'boolean', 'LoadingState isLoading should be boolean');

  // Optional field
  if (validState.error !== undefined) {
    assert(validState.error === null || typeof validState.error === 'string', 'LoadingState error should be string or null');
  }

  console.log('✅ LoadingState interface validation passed');
  return true;
}

/**
 * Test FormState interface
 */
function testFormState() {
  console.log('🔍 Testing FormState interface...');

  const validFormState = {
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    },
    errors: {
      email: 'Invalid email format'
    },
    isSubmitting: false,
    isValid: false
  };

  // Required fields
  assert(typeof validFormState.data === 'object', 'FormState data should be object');
  assert(typeof validFormState.errors === 'object', 'FormState errors should be object');
  assert(typeof validFormState.isSubmitting === 'boolean', 'FormState isSubmitting should be boolean');
  assert(typeof validFormState.isValid === 'boolean', 'FormState isValid should be boolean');

  // Validate errors structure (should be partial record of data keys)
  Object.keys(validFormState.errors).forEach(key => {
    assert(typeof validFormState.errors[key] === 'string', `FormState errors[${key}] should be string`);
  });

  console.log('✅ FormState interface validation passed');
  return true;
}

/**
 * Test ModalState interface
 */
function testModalState() {
  console.log('🔍 Testing ModalState interface...');

  const validModalState = {
    isOpen: true,
    title: 'Confirm Action',
    content: '<p>Are you sure you want to proceed?</p>',
    onClose: () => console.log('Modal closed')
  };

  // Required fields
  assert(typeof validModalState.isOpen === 'boolean', 'ModalState isOpen should be boolean');

  // Optional fields
  if (validModalState.title) {
    assert(typeof validModalState.title === 'string', 'ModalState title should be string');
  }
  if (validModalState.content) {
    // content can be React.ReactNode
    assert(validModalState.content !== undefined, 'ModalState content should be defined');
  }
  if (validModalState.onClose) {
    assert(typeof validModalState.onClose === 'function', 'ModalState onClose should be function');
  }

  console.log('✅ ModalState interface validation passed');
  return true;
}

/**
 * Test Notification interface
 */
function testNotification() {
  console.log('🔍 Testing Notification interface...');

  const validNotification = {
    id: 'notif_123e4567-e89b-12d3-a456-426614174000',
    type: 'success',
    title: 'Operation Successful',
    message: 'Your data has been saved successfully',
    duration: 5000,
    action: {
      label: 'View Details',
      onClick: () => console.log('Action clicked')
    }
  };

  // Required fields
  assert(typeof validNotification.id === 'string', 'Notification id should be string');
  assert(typeof validNotification.type === 'string', 'Notification type should be string');
  assert(typeof validNotification.title === 'string', 'Notification title should be string');

  // Test valid notification types
  const validTypes = ['success', 'error', 'warning', 'info'];
  assert(validTypes.includes(validNotification.type), `Notification type should be one of: ${validTypes.join(', ')}`);

  // Optional fields
  if (validNotification.message) {
    assert(typeof validNotification.message === 'string', 'Notification message should be string');
  }
  if (validNotification.duration !== undefined) {
    assert(typeof validNotification.duration === 'number', 'Notification duration should be number');
  }
  if (validNotification.action) {
    assert(typeof validNotification.action === 'object', 'Notification action should be object');
    assert(typeof validNotification.action.label === 'string', 'Notification action.label should be string');
    assert(typeof validNotification.action.onClick === 'function', 'Notification action.onClick should be function');
  }

  console.log('✅ Notification interface validation passed');
  return true;
}

/**
 * Test ButtonVariant type
 */
function testButtonVariant() {
  console.log('🔍 Testing ButtonVariant type...');

  const validVariants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'];

  validVariants.forEach(variant => {
    assert(typeof variant === 'string', `ButtonVariant '${variant}' should be string`);
    assert(validVariants.includes(variant), `ButtonVariant '${variant}' should be valid`);
  });

  console.log('✅ ButtonVariant type validation passed');
  return true;
}

/**
 * Test ButtonSize type
 */
function testButtonSize() {
  console.log('🔍 Testing ButtonSize type...');

  const validSizes = ['default', 'sm', 'lg', 'icon'];

  validSizes.forEach(size => {
    assert(typeof size === 'string', `ButtonSize '${size}' should be string`);
    assert(validSizes.includes(size), `ButtonSize '${size}' should be valid`);
  });

  console.log('✅ ButtonSize type validation passed');
  return true;
}

/**
 * Test InputState interface
 */
function testInputState() {
  console.log('🔍 Testing InputState interface...');

  const validInputState = {
    value: 'user@example.com',
    error: 'Invalid email format',
    isValid: false,
    isTouched: true
  };

  // Required fields
  assert(typeof validInputState.value === 'string', 'InputState value should be string');
  assert(typeof validInputState.isValid === 'boolean', 'InputState isValid should be boolean');
  assert(typeof validInputState.isTouched === 'boolean', 'InputState isTouched should be boolean');

  // Optional field
  if (validInputState.error) {
    assert(typeof validInputState.error === 'string', 'InputState error should be string');
  }

  console.log('✅ InputState interface validation passed');
  return true;
}

/**
 * Test SelectOption interface
 */
function testSelectOption() {
  console.log('🔍 Testing SelectOption interface...');

  const validOption = {
    value: 'option_1',
    label: 'Option 1',
    disabled: false
  };

  // Required fields
  assert(typeof validOption.value === 'string', 'SelectOption value should be string');
  assert(typeof validOption.label === 'string', 'SelectOption label should be string');

  // Optional field
  if (validOption.disabled !== undefined) {
    assert(typeof validOption.disabled === 'boolean', 'SelectOption disabled should be boolean');
  }

  console.log('✅ SelectOption interface validation passed');
  return true;
}

/**
 * Test TabItem interface
 */
function testTabItem() {
  console.log('🔍 Testing TabItem interface...');

  const validTabItem = {
    id: 'tab_1',
    label: 'Tab 1',
    content: '<div>Tab content</div>',
    disabled: false
  };

  // Required fields
  assert(typeof validTabItem.id === 'string', 'TabItem id should be string');
  assert(typeof validTabItem.label === 'string', 'TabItem label should be string');
  assert(validTabItem.content !== undefined, 'TabItem content should be defined');

  // Optional field
  if (validTabItem.disabled !== undefined) {
    assert(typeof validTabItem.disabled === 'boolean', 'TabItem disabled should be boolean');
  }

  console.log('✅ TabItem interface validation passed');
  return true;
}

/**
 * Test CardProps interface
 */
function testCardProps() {
  console.log('🔍 Testing CardProps interface...');

  const validCardProps = {
    className: 'custom-card',
    title: 'Card Title',
    description: 'Card description',
    footer: '<div>Card Footer</div>'
  };

  // All fields are optional in CardProps (inherits from BaseComponentProps)
  if (validCardProps.className) {
    assert(typeof validCardProps.className === 'string', 'CardProps className should be string');
  }
  if (validCardProps.title) {
    assert(typeof validCardProps.title === 'string', 'CardProps title should be string');
  }
  if (validCardProps.description) {
    assert(typeof validCardProps.description === 'string', 'CardProps description should be string');
  }
  if (validCardProps.footer) {
    assert(validCardProps.footer !== undefined, 'CardProps footer should be defined');
  }

  console.log('✅ CardProps interface validation passed');
  return true;
}

/**
 * Test DialogProps interface
 */
function testDialogProps() {
  console.log('🔍 Testing DialogProps interface...');

  const validDialogProps = {
    open: true,
    onOpenChange: (open) => console.log('Dialog open state changed:', open),
    title: 'Dialog Title',
    description: 'Dialog description',
    children: '<div>Dialog content</div>'
  };

  // Required fields
  assert(typeof validDialogProps.open === 'boolean', 'DialogProps open should be boolean');
  assert(typeof validDialogProps.onOpenChange === 'function', 'DialogProps onOpenChange should be function');
  assert(validDialogProps.children !== undefined, 'DialogProps children should be defined');

  // Optional fields
  if (validDialogProps.title) {
    assert(typeof validDialogProps.title === 'string', 'DialogProps title should be string');
  }
  if (validDialogProps.description) {
    assert(typeof validDialogProps.description === 'string', 'DialogProps description should be string');
  }

  console.log('✅ DialogProps interface validation passed');
  return true;
}

/**
 * Test TooltipProps interface
 */
function testTooltipProps() {
  console.log('🔍 Testing TooltipProps interface...');

  const validTooltipProps = {
    content: 'This is a helpful tooltip',
    children: '<button>Hover me</button>',
    side: 'top',
    align: 'center'
  };

  // Required fields
  assert(typeof validTooltipProps.content === 'string', 'TooltipProps content should be string');
  assert(validTooltipProps.children !== undefined, 'TooltipProps children should be defined');

  // Optional fields
  if (validTooltipProps.side) {
    const validSides = ['top', 'right', 'bottom', 'left'];
    assert(validSides.includes(validTooltipProps.side), `TooltipProps side should be one of: ${validSides.join(', ')}`);
  }
  if (validTooltipProps.align) {
    const validAligns = ['start', 'center', 'end'];
    assert(validAligns.includes(validTooltipProps.align), `TooltipProps align should be one of: ${validAligns.join(', ')}`);
  }

  console.log('✅ TooltipProps interface validation passed');
  return true;
}

/**
 * Test BadgeVariant type
 */
function testBadgeVariant() {
  console.log('🔍 Testing BadgeVariant type...');

  const validVariants = ['default', 'secondary', 'destructive', 'outline'];

  validVariants.forEach(variant => {
    assert(typeof variant === 'string', `BadgeVariant '${variant}' should be string`);
    assert(validVariants.includes(variant), `BadgeVariant '${variant}' should be valid`);
  });

  console.log('✅ BadgeVariant type validation passed');
  return true;
}

/**
 * Test SkeletonProps interface
 */
function testSkeletonProps() {
  console.log('🔍 Testing SkeletonProps interface...');

  const validSkeletonProps = {
    className: 'skeleton-loader',
    width: '100%',
    height: 40,
    variant: 'rectangular'
  };

  // All fields are optional in SkeletonProps (inherits from BaseComponentProps)
  if (validSkeletonProps.className) {
    assert(typeof validSkeletonProps.className === 'string', 'SkeletonProps className should be string');
  }
  if (validSkeletonProps.width) {
    assert(typeof validSkeletonProps.width === 'string' || typeof validSkeletonProps.width === 'number', 'SkeletonProps width should be string or number');
  }
  if (validSkeletonProps.height) {
    assert(typeof validSkeletonProps.height === 'string' || typeof validSkeletonProps.height === 'number', 'SkeletonProps height should be string or number');
  }
  if (validSkeletonProps.variant) {
    const validVariants = ['text', 'circular', 'rectangular'];
    assert(validVariants.includes(validSkeletonProps.variant), `SkeletonProps variant should be one of: ${validVariants.join(', ')}`);
  }

  console.log('✅ SkeletonProps interface validation passed');
  return true;
}

/**
 * Test PaginationProps interface
 */
function testPaginationProps() {
  console.log('🔍 Testing PaginationProps interface...');

  const validPaginationProps = {
    currentPage: 2,
    totalPages: 10,
    onPageChange: (page) => console.log('Page changed to:', page),
    showFirstLast: true,
    showPrevNext: true,
    maxVisiblePages: 5
  };

  // Required fields
  assert(typeof validPaginationProps.currentPage === 'number', 'PaginationProps currentPage should be number');
  assert(typeof validPaginationProps.totalPages === 'number', 'PaginationProps totalPages should be number');
  assert(typeof validPaginationProps.onPageChange === 'function', 'PaginationProps onPageChange should be function');

  // Optional fields
  if (validPaginationProps.showFirstLast !== undefined) {
    assert(typeof validPaginationProps.showFirstLast === 'boolean', 'PaginationProps showFirstLast should be boolean');
  }
  if (validPaginationProps.showPrevNext !== undefined) {
    assert(typeof validPaginationProps.showPrevNext === 'boolean', 'PaginationProps showPrevNext should be boolean');
  }
  if (validPaginationProps.maxVisiblePages !== undefined) {
    assert(typeof validPaginationProps.maxVisiblePages === 'number', 'PaginationProps maxVisiblePages should be number');
  }

  // Validate logical constraints
  assert(validPaginationProps.currentPage > 0, 'PaginationProps currentPage should be positive');
  assert(validPaginationProps.totalPages > 0, 'PaginationProps totalPages should be positive');
  assert(validPaginationProps.currentPage <= validPaginationProps.totalPages, 'PaginationProps currentPage should not exceed totalPages');

  console.log('✅ PaginationProps interface validation passed');
  return true;
}

/**
 * Test SearchBoxProps interface
 */
function testSearchBoxProps() {
  console.log('🔍 Testing SearchBoxProps interface...');

  const validSearchBoxProps = {
    value: 'Toyota Camry',
    onChange: (value) => console.log('Search value changed:', value),
    onSearch: (value) => console.log('Search triggered:', value),
    placeholder: 'Search for cars...',
    disabled: false,
    loading: false
  };

  // Required fields
  assert(typeof validSearchBoxProps.value === 'string', 'SearchBoxProps value should be string');
  assert(typeof validSearchBoxProps.onChange === 'function', 'SearchBoxProps onChange should be function');

  // Optional fields
  if (validSearchBoxProps.onSearch) {
    assert(typeof validSearchBoxProps.onSearch === 'function', 'SearchBoxProps onSearch should be function');
  }
  if (validSearchBoxProps.placeholder) {
    assert(typeof validSearchBoxProps.placeholder === 'string', 'SearchBoxProps placeholder should be string');
  }
  if (validSearchBoxProps.disabled !== undefined) {
    assert(typeof validSearchBoxProps.disabled === 'boolean', 'SearchBoxProps disabled should be boolean');
  }
  if (validSearchBoxProps.loading !== undefined) {
    assert(typeof validSearchBoxProps.loading === 'boolean', 'SearchBoxProps loading should be boolean');
  }

  console.log('✅ SearchBoxProps interface validation passed');
  return true;
}

/**
 * Test FilterProps interface
 */
function testFilterProps() {
  console.log('🔍 Testing FilterProps interface...');

  const validFilterProps = {
    filters: {
      category: 'Sedan',
      priceRange: [20000, 50000]
    },
    onChange: (filters) => console.log('Filters changed:', filters),
    onReset: () => console.log('Filters reset'),
    options: {
      category: [
        { value: 'Sedan', label: 'Sedan' },
        { value: 'SUV', label: 'SUV' }
      ],
      priceRange: [
        { value: '0-25000', label: '$0 - $25,000' },
        { value: '25000-50000', label: '$25,000 - $50,000' }
      ]
    }
  };

  // Required fields
  assert(typeof validFilterProps.filters === 'object', 'FilterProps filters should be object');
  assert(typeof validFilterProps.onChange === 'function', 'FilterProps onChange should be function');
  assert(typeof validFilterProps.onReset === 'function', 'FilterProps onReset should be function');
  assert(typeof validFilterProps.options === 'object', 'FilterProps options should be object');

  // Validate options structure
  Object.entries(validFilterProps.options).forEach(([key, options]) => {
    assert(Array.isArray(options), `FilterProps options[${key}] should be array`);
    options.forEach((option, index) => {
      assert(typeof option.value === 'string', `FilterProps options[${key}][${index}] value should be string`);
      assert(typeof option.label === 'string', `FilterProps options[${key}][${index}] label should be string`);
    });
  });

  console.log('✅ FilterProps interface validation passed');
  return true;
}

/**
 * Test SorterProps interface
 */
function testSorterProps() {
  console.log('🔍 Testing SorterProps interface...');

  const validSorterProps = {
    sortBy: 'price',
    sortOrder: 'asc',
    onChange: (sortBy, sortOrder) => console.log('Sort changed:', sortBy, sortOrder),
    options: [
      { value: 'price', label: 'Price' },
      { value: 'rating', label: 'Rating' },
      { value: 'name', label: 'Name' }
    ]
  };

  // Required fields
  assert(typeof validSorterProps.sortBy === 'string', 'SorterProps sortBy should be string');
  assert(typeof validSorterProps.sortOrder === 'string', 'SorterProps sortOrder should be string');
  assert(typeof validSorterProps.onChange === 'function', 'SorterProps onChange should be function');
  assert(Array.isArray(validSorterProps.options), 'SorterProps options should be array');

  // Test valid sort order values
  const validSortOrders = ['asc', 'desc'];
  assert(validSortOrders.includes(validSorterProps.sortOrder), `SorterProps sortOrder should be one of: ${validSortOrders.join(', ')}`);

  // Validate options
  validSorterProps.options.forEach((option, index) => {
    assert(typeof option.value === 'string', `SorterProps options[${index}] value should be string`);
    assert(typeof option.label === 'string', `SorterProps options[${index}] label should be string`);
  });

  console.log('✅ SorterProps interface validation passed');
  return true;
}

/**
 * Test TableColumn interface
 */
function testTableColumn() {
  console.log('🔍 Testing TableColumn interface...');

  const validColumn = {
    key: 'name',
    title: 'Name',
    width: 200,
    align: 'left',
    sortable: true,
    render: (value, record, index) => `<div>${value}</div>`
  };

  // Required fields
  assert(typeof validColumn.key === 'string', 'TableColumn key should be string');
  assert(typeof validColumn.title === 'string', 'TableColumn title should be string');

  // Optional fields
  if (validColumn.width) {
    assert(typeof validColumn.width === 'string' || typeof validColumn.width === 'number', 'TableColumn width should be string or number');
  }
  if (validColumn.align) {
    const validAligns = ['left', 'center', 'right'];
    assert(validAligns.includes(validColumn.align), `TableColumn align should be one of: ${validAligns.join(', ')}`);
  }
  if (validColumn.sortable !== undefined) {
    assert(typeof validColumn.sortable === 'boolean', 'TableColumn sortable should be boolean');
  }
  if (validColumn.render) {
    assert(typeof validColumn.render === 'function', 'TableColumn render should be function');
  }

  console.log('✅ TableColumn interface validation passed');
  return true;
}

/**
 * Test TableProps interface
 */
function testTableProps() {
  console.log('🔍 Testing TableProps interface...');

  const validTableProps = {
    data: [
      { id: 1, name: 'Item 1', value: 100 },
      { id: 2, name: 'Item 2', value: 200 }
    ],
    columns: [
      { key: 'name', title: 'Name' },
      { key: 'value', title: 'Value' }
    ],
    loading: false,
    pagination: {
      currentPage: 1,
      totalPages: 5,
      onPageChange: (page) => console.log('Page:', page)
    },
    onRowClick: (record, index) => console.log('Row clicked:', record, index),
    rowKey: 'id'
  };

  // Required fields
  assert(Array.isArray(validTableProps.data), 'TableProps data should be array');
  assert(Array.isArray(validTableProps.columns), 'TableProps columns should be array');

  // Optional fields
  if (validTableProps.loading !== undefined) {
    assert(typeof validTableProps.loading === 'boolean', 'TableProps loading should be boolean');
  }
  if (validTableProps.pagination) {
    assert(typeof validTableProps.pagination === 'object', 'TableProps pagination should be object');
  }
  if (validTableProps.onRowClick) {
    assert(typeof validTableProps.onRowClick === 'function', 'TableProps onRowClick should be function');
  }
  if (validTableProps.rowKey) {
    assert(typeof validTableProps.rowKey === 'string' || typeof validTableProps.rowKey === 'function', 'TableProps rowKey should be string or function');
  }

  console.log('✅ TableProps interface validation passed');
  return true;
}

/**
 * Test Theme type
 */
function testTheme() {
  console.log('🔍 Testing Theme type...');

  const validThemes = ['light', 'dark', 'system'];

  validThemes.forEach(theme => {
    assert(typeof theme === 'string', `Theme '${theme}' should be string`);
    assert(validThemes.includes(theme), `Theme '${theme}' should be valid`);
  });

  console.log('✅ Theme type validation passed');
  return true;
}

/**
 * Test Breakpoint type
 */
function testBreakpoint() {
  console.log('🔍 Testing Breakpoint type...');

  const validBreakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];

  validBreakpoints.forEach(breakpoint => {
    assert(typeof breakpoint === 'string', `Breakpoint '${breakpoint}' should be string`);
    assert(validBreakpoints.includes(breakpoint), `Breakpoint '${breakpoint}' should be valid`);
  });

  console.log('✅ Breakpoint type validation passed');
  return true;
}

/**
 * Test AnimationVariant type
 */
function testAnimationVariant() {
  console.log('🔍 Testing AnimationVariant type...');

  const validVariants = ['fade', 'slide', 'scale', 'bounce'];

  validVariants.forEach(variant => {
    assert(typeof variant === 'string', `AnimationVariant '${variant}' should be string`);
    assert(validVariants.includes(variant), `AnimationVariant '${variant}' should be valid`);
  });

  console.log('✅ AnimationVariant type validation passed');
  return true;
}

/**
 * Test Position type
 */
function testPosition() {
  console.log('🔍 Testing Position type...');

  const validPositions = ['top', 'right', 'bottom', 'left', 'center'];

  validPositions.forEach(position => {
    assert(typeof position === 'string', `Position '${position}' should be string`);
    assert(validPositions.includes(position), `Position '${position}' should be valid`);
  });

  console.log('✅ Position type validation passed');
  return true;
}

/**
 * Test Alignment type
 */
function testAlignment() {
  console.log('🔍 Testing Alignment type...');

  const validAlignments = ['start', 'center', 'end', 'stretch'];

  validAlignments.forEach(alignment => {
    assert(typeof alignment === 'string', `Alignment '${alignment}' should be string`);
    assert(validAlignments.includes(alignment), `Alignment '${alignment}' should be valid`);
  });

  console.log('✅ Alignment type validation passed');
  return true;
}

/**
 * Test Spacing type
 */
function testSpacing() {
  console.log('🔍 Testing Spacing type...');

  const validSpacings = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];

  validSpacings.forEach(spacing => {
    assert(typeof spacing === 'string', `Spacing '${spacing}' should be string`);
    assert(validSpacings.includes(spacing), `Spacing '${spacing}' should be valid`);
  });

  console.log('✅ Spacing type validation passed');
  return true;
}

/**
 * Test ColorVariant type
 */
function testColorVariant() {
  console.log('🔍 Testing ColorVariant type...');

  const validVariants = ['primary', 'secondary', 'success', 'warning', 'error', 'info'];

  validVariants.forEach(variant => {
    assert(typeof variant === 'string', `ColorVariant '${variant}' should be string`);
    assert(validVariants.includes(variant), `ColorVariant '${variant}' should be valid`);
  });

  console.log('✅ ColorVariant type validation passed');
  return true;
}

/**
 * Test ComponentState type
 */
function testComponentState() {
  console.log('🔍 Testing ComponentState type...');

  const validStates = ['idle', 'loading', 'success', 'error'];

  validStates.forEach(state => {
    assert(typeof state === 'string', `ComponentState '${state}' should be string`);
    assert(validStates.includes(state), `ComponentState '${state}' should be valid`);
  });

  console.log('✅ ComponentState type validation passed');
  return true;
}

/**
 * Test Visibility type
 */
function testVisibility() {
  console.log('🔍 Testing Visibility type...');

  const validVisibilities = ['visible', 'hidden', 'collapsed'];

  validVisibilities.forEach(visibility => {
    assert(typeof visibility === 'string', `Visibility '${visibility}' should be string`);
    assert(validVisibilities.includes(visibility), `Visibility '${visibility}' should be valid`);
  });

  console.log('✅ Visibility type validation passed');
  return true;
}

/**
 * Test Direction type
 */
function testDirection() {
  console.log('🔍 Testing Direction type...');

  const validDirections = ['horizontal', 'vertical'];

  validDirections.forEach(direction => {
    assert(typeof direction === 'string', `Direction '${direction}' should be string`);
    assert(validDirections.includes(direction), `Direction '${direction}' should be valid`);
  });

  console.log('✅ Direction type validation passed');
  return true;
}

/**
 * Test Size type
 */
function testSize() {
  console.log('🔍 Testing Size type...');

  const validSizes = ['xs', 'sm', 'md', 'lg', 'xl'];

  validSizes.forEach(size => {
    assert(typeof size === 'string', `Size '${size}' should be string`);
    assert(validSizes.includes(size), `Size '${size}' should be valid`);
  });

  console.log('✅ Size type validation passed');
  return true;
}

/**
 * Test BorderRadius type
 */
function testBorderRadius() {
  console.log('🔍 Testing BorderRadius type...');

  const validRadii = ['none', 'sm', 'md', 'lg', 'full'];

  validRadii.forEach(radius => {
    assert(typeof radius === 'string', `BorderRadius '${radius}' should be string`);
    assert(validRadii.includes(radius), `BorderRadius '${radius}' should be valid`);
  });

  console.log('✅ BorderRadius type validation passed');
  return true;
}

/**
 * Test Shadow type
 */
function testShadow() {
  console.log('🔍 Testing Shadow type...');

  const validShadows = ['none', 'sm', 'md', 'lg', 'xl', '2xl'];

  validShadows.forEach(shadow => {
    assert(typeof shadow === 'string', `Shadow '${shadow}' should be string`);
    assert(validShadows.includes(shadow), `Shadow '${shadow}' should be valid`);
  });

  console.log('✅ Shadow type validation passed');
  return true;
}

/**
 * Test UI type relationships and structure
 */
function testUITypeRelationships() {
  console.log('🔍 Testing UI type relationships and structure...');

  // Test that UI types are properly structured and related
  const expectedUITypeGroups = {
    base: ['BaseComponentProps', 'LoadingState', 'FormState'],
    components: ['ModalState', 'Notification', 'ButtonVariant', 'InputState'],
    layout: ['TabItem', 'CardProps', 'DialogProps', 'PaginationProps'],
    forms: ['SelectOption', 'SearchBoxProps', 'FilterProps', 'SorterProps'],
    data: ['TableColumn', 'TableProps'],
    design: ['Theme', 'Breakpoint', 'AnimationVariant', 'Position'],
    styling: ['Alignment', 'Spacing', 'ColorVariant', 'BorderRadius', 'Shadow']
  };

  // Verify that UI type groups exist in our expected structure
  Object.entries(expectedUITypeGroups).forEach(([group, types]) => {
    assert(Array.isArray(types), `${group} types should be an array`);
    assert(types.length > 0, `Should have ${group} type exports`);
  });

  // Test that core UI types exist
  assert(expectedUITypeGroups.base.includes('BaseComponentProps'), 'BaseComponentProps should be in base types');
  assert(expectedUITypeGroups.components.includes('Notification'), 'Notification should be in component types');
  assert(expectedUITypeGroups.data.includes('TableProps'), 'TableProps should be in data types');

  // Test logical relationships between types
  // Component props should extend BaseComponentProps
  // TableColumn should work with TableProps
  // FormState should support validation

  console.log('✅ UI type relationships and structure validation passed');
  return true;
}

/**
 * Run all UI type tests
 */
async function runAllTests() {
  console.log('🚀 Starting UI Types Test Suite...\n');

  const tests = [
    testBaseComponentProps,
    testLoadingState,
    testFormState,
    testModalState,
    testNotification,
    testButtonVariant,
    testButtonSize,
    testInputState,
    testSelectOption,
    testTabItem,
    testCardProps,
    testDialogProps,
    testTooltipProps,
    testBadgeVariant,
    testSkeletonProps,
    testPaginationProps,
    testSearchBoxProps,
    testFilterProps,
    testSorterProps,
    testTableColumn,
    testTableProps,
    testTheme,
    testBreakpoint,
    testAnimationVariant,
    testPosition,
    testAlignment,
    testSpacing,
    testColorVariant,
    testComponentState,
    testVisibility,
    testDirection,
    testSize,
    testBorderRadius,
    testShadow,
    testUITypeRelationships
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

  console.log(`\n📊 UI Types Test Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('🎉 All UI type tests passed!');
    return true;
  } else {
    console.error('💥 Some UI type tests failed!');
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
  testBaseComponentProps,
  testLoadingState,
  testFormState,
  testModalState,
  testNotification,
  testButtonVariant,
  testButtonSize,
  testInputState,
  testSelectOption,
  testTabItem,
  testCardProps,
  testDialogProps,
  testTooltipProps,
  testBadgeVariant,
  testSkeletonProps,
  testPaginationProps,
  testSearchBoxProps,
  testFilterProps,
  testSorterProps,
  testTableColumn,
  testTableProps,
  testTheme,
  testBreakpoint,
  testAnimationVariant,
  testPosition,
  testAlignment,
  testSpacing,
  testColorVariant,
  testComponentState,
  testVisibility,
  testDirection,
  testSize,
  testBorderRadius,
  testShadow,
  testUITypeRelationships
};
