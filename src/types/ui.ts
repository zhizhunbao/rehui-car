import React from 'react';

// UI 组件通用类型
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// 加载状态类型
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// 表单状态类型
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// 模态框状态类型
export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  onClose?: () => void;
}

// 通知类型
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// 按钮变体类型
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

// 输入框状态类型
export interface InputState {
  value: string;
  error?: string;
  isValid: boolean;
  isTouched: boolean;
}

// 选择器选项类型
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// 标签页类型
export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

// 卡片属性类型
export interface CardProps extends BaseComponentProps {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

// 对话框属性类型
export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

// 工具提示属性类型
export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

// 徽章变体类型
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

// 骨架屏属性类型
export interface SkeletonProps extends BaseComponentProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
}

// 分页组件属性类型
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
}

// 搜索框属性类型
export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
}

// 筛选器属性类型
export interface FilterProps<T> {
  filters: T;
  onChange: (filters: T) => void;
  onReset: () => void;
  options: Record<keyof T, SelectOption[]>;
}

// 排序器属性类型
export interface SorterProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  options: SelectOption[];
}

// 数据表格列定义类型
export interface TableColumn<T> {
  key: keyof T;
  title: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

// 数据表格属性类型
export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: PaginationProps;
  onRowClick?: (record: T, index: number) => void;
  rowKey?: keyof T | ((record: T) => string);
}

// 主题类型
export type Theme = 'light' | 'dark' | 'system';

// 响应式断点类型
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// 动画变体类型
export type AnimationVariant = 'fade' | 'slide' | 'scale' | 'bounce';

// 位置类型
export type Position = 'top' | 'right' | 'bottom' | 'left' | 'center';

// 对齐类型
export type Alignment = 'start' | 'center' | 'end' | 'stretch';

// 间距类型
export type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// 颜色变体类型
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// 组件状态类型
export type ComponentState = 'idle' | 'loading' | 'success' | 'error';

// 可见性类型
export type Visibility = 'visible' | 'hidden' | 'collapsed';

// 方向类型
export type Direction = 'horizontal' | 'vertical';

// 尺寸类型
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// 圆角类型
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

// 阴影类型
export type Shadow = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'; 