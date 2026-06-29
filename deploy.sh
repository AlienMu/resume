#!/bin/bash

# 简历项目部署脚本
# 作者：Generated
# 功能：构建项目并部署到 Nginx

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v "$1" &> /dev/null; then
        log_error "命令 $1 未找到，请先安装"
        exit 1
    fi
}

# 主函数
main() {
    log_info "开始部署简历项目..."
    
    # 检查必要命令
    check_command "git"
    check_command "pnpm"
    check_command "cp"
    check_command "sudo"
    check_command "nginx"
    
    # 1. 拉取最新代码
    log_info "步骤1: 拉取最新代码 (git pull)"
    if git pull; then
        log_info "代码拉取成功"
    else
        log_error "代码拉取失败"
        exit 1
    fi
    
    # 2. 构建项目
    log_info "步骤2: 开始构建项目 (pnpm run build:prod)"
    if pnpm run build:prod; then
        log_info "项目构建成功"
    else
        log_error "项目构建失败"
        exit 1
    fi
    
    # 检查 dist 目录是否存在
    if [ ! -d "dist" ]; then
        log_error "dist 目录不存在，构建可能失败"
        exit 1
    fi
    
    # 3. 创建目标目录（如果不存在）
    log_info "步骤3: 确保目标目录存在"
    sudo mkdir -p "/usr/share/nginx/html/resume"
    
    # 4. 复制文件到 Nginx 目录
    log_info "步骤4: 复制 dist 文件到 Nginx 目录"
    sudo cp -rf dist/* "/usr/share/nginx/html/resume/"
    
    # 设置正确的权限
    sudo chown -R www-data:www-data "/usr/share/nginx/html/resume" 2>/dev/null || true
    sudo chmod -R 755 "/usr/share/nginx/html/resume"
    
    # 5. 重启 Nginx
    log_info "步骤5: 重启 Nginx 服务"
    if sudo systemctl restart nginx; then
        log_info "Nginx 重启成功"
    else
        log_error "Nginx 重启失败，尝试重新加载配置"
        sudo nginx -s reload
    fi
    
    # 检查 Nginx 状态
    if systemctl is-active --quiet nginx; then
        log_info "Nginx 服务运行正常"
    else
        log_error "Nginx 服务未运行"
        exit 1
    fi
    
    log_info "部署完成！"
    log_info "访问地址: http://localhost/resume/"
    
    # 显示部署信息
    echo "=========================================="
    echo "部署摘要:"
    echo "- 构建时间: $(date)"
    echo "- 源目录: $(pwd)/dist"
    echo "- 目标目录: /usr/share/nginx/html/resume"
    echo "=========================================="
}

# 脚本执行前确认
read -p "是否继续部署？(y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "用户取消部署"
    exit 0
fi

# 执行主函数
main "$@"