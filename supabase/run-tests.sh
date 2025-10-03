#!/bin/bash

# =====================================================
# 数据库测试运行脚本
# 运行所有数据库相关测试
# =====================================================

set -e  # 遇到错误时退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 检查 Supabase CLI 是否安装
check_supabase_cli() {
    if ! command -v supabase &> /dev/null; then
        print_message $RED "❌ Supabase CLI 未安装"
        print_message $YELLOW "请先安装 Supabase CLI: https://supabase.com/docs/guides/cli"
        exit 1
    fi
    print_message $GREEN "✅ Supabase CLI 已安装"
}

# 检查是否在正确的目录
check_directory() {
    if [ ! -f "supabase/config.toml" ]; then
        print_message $RED "❌ 请在项目根目录运行此脚本"
        exit 1
    fi
    print_message $GREEN "✅ 在正确的项目目录"
}

# 启动本地 Supabase
start_supabase() {
    print_message $BLUE "🚀 启动本地 Supabase..."
    if supabase start; then
        print_message $GREEN "✅ Supabase 启动成功"
    else
        print_message $RED "❌ Supabase 启动失败"
        exit 1
    fi
}

# 运行迁移
run_migrations() {
    print_message $BLUE "📦 运行数据库迁移..."
    if supabase db reset; then
        print_message $GREEN "✅ 数据库迁移完成"
    else
        print_message $RED "❌ 数据库迁移失败"
        exit 1
    fi
}

# 运行测试
run_test() {
    local test_file=$1
    local test_name=$2
    
    print_message $BLUE "🧪 运行 ${test_name}..."
    
    if psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f "$test_file" > /dev/null 2>&1; then
        print_message $GREEN "✅ ${test_name} 通过"
        return 0
    else
        print_message $RED "❌ ${test_name} 失败"
        print_message $YELLOW "详细错误信息："
        psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f "$test_file"
        return 1
    fi
}

# 运行所有测试
run_all_tests() {
    local failed_tests=0
    
    print_message $BLUE "🧪 开始运行数据库测试..."
    echo
    
    # 运行迁移测试
    if ! run_test "supabase/__tests__/migrations.test.sql" "迁移测试"; then
        ((failed_tests++))
    fi
    
    # 运行表结构测试
    if ! run_test "supabase/__tests__/schema.test.sql" "表结构测试"; then
        ((failed_tests++))
    fi
    
    # 运行函数触发器测试
    if ! run_test "supabase/__tests__/functions.test.sql" "函数触发器测试"; then
        ((failed_tests++))
    fi
    
    echo
    if [ $failed_tests -eq 0 ]; then
        print_message $GREEN "🎉 所有测试通过！"
        return 0
    else
        print_message $RED "❌ ${failed_tests} 个测试失败"
        return 1
    fi
}

# 停止 Supabase
stop_supabase() {
    print_message $BLUE "🛑 停止 Supabase..."
    supabase stop
    print_message $GREEN "✅ Supabase 已停止"
}

# 显示帮助信息
show_help() {
    echo "数据库测试运行脚本"
    echo
    echo "用法:"
    echo "  ./supabase/run-tests.sh [选项]"
    echo
    echo "选项:"
    echo "  -h, --help          显示帮助信息"
    echo "  -s, --start-only    仅启动 Supabase，不运行测试"
    echo "  -t, --test-only     仅运行测试，假设 Supabase 已启动"
    echo "  -m, --migrations    运行迁移测试"
    echo "  -c, --schema        运行表结构测试"
    echo "  -f, --functions     运行函数触发器测试"
    echo "  --stop              停止 Supabase"
    echo
    echo "示例:"
    echo "  ./supabase/run-tests.sh                    # 运行所有测试"
    echo "  ./supabase/run-tests.sh -m                 # 仅运行迁移测试"
    echo "  ./supabase/run-tests.sh -s                 # 仅启动 Supabase"
    echo "  ./supabase/run-tests.sh --stop             # 停止 Supabase"
}

# 主函数
main() {
    local start_only=false
    local test_only=false
    local run_migrations_test=false
    local run_schema_test=false
    local run_functions_test=false
    local stop_only=false
    
    # 解析命令行参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -s|--start-only)
                start_only=true
                shift
                ;;
            -t|--test-only)
                test_only=true
                shift
                ;;
            -m|--migrations)
                run_migrations_test=true
                shift
                ;;
            -c|--schema)
                run_schema_test=true
                shift
                ;;
            -f|--functions)
                run_functions_test=true
                shift
                ;;
            --stop)
                stop_only=true
                shift
                ;;
            *)
                print_message $RED "未知选项: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # 检查环境
    check_supabase_cli
    check_directory
    
    if [ "$stop_only" = true ]; then
        stop_supabase
        exit 0
    fi
    
    if [ "$test_only" = false ]; then
        start_supabase
        run_migrations
    fi
    
    if [ "$start_only" = false ]; then
        local failed_tests=0
        
        if [ "$run_migrations_test" = true ]; then
            if ! run_test "supabase/__tests__/migrations.test.sql" "迁移测试"; then
                ((failed_tests++))
            fi
        elif [ "$run_schema_test" = true ]; then
            if ! run_test "supabase/__tests__/schema.test.sql" "表结构测试"; then
                ((failed_tests++))
            fi
        elif [ "$run_functions_test" = true ]; then
            if ! run_test "supabase/__tests__/functions.test.sql" "函数触发器测试"; then
                ((failed_tests++))
            fi
        else
            # 运行所有测试
            if ! run_all_tests; then
                failed_tests=1
            fi
        fi
        
        if [ $failed_tests -gt 0 ]; then
            exit 1
        fi
    fi
    
    print_message $GREEN "🎉 完成！"
}

# 运行主函数
main "$@" 