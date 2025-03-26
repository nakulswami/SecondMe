# Available Commands:
# Commands that don't require conda environment:
#   make help         - Show this help message
#   make setup        - Run complete installation script
#   make start        - Start all services
#   make stop         - Stop chat services
#   make restart      - Restart chat services
#   make restart-backend - Restart only backend service
#   make restart-force - Force restart and reset data
#   make status       - Show status of all services

.PHONY: install test format lint all setup start stop restart restart-backend restart-force help check-conda check-env

# Show help message
help:
	@echo "\033[0;36m"
	@echo ' ███████╗███████╗ ██████╗ ██████╗ ███╗   ██╗██████╗       ███╗   ███╗███████╗'
	@echo ' ██╔════╝██╔════╝██╔════╝██╔═══██╗████╗  ██║██╔══██╗      ████╗ ████║██╔════╝'
	@echo ' ███████╗█████╗  ██║     ██║   ██║██╔██╗ ██║██║  ██║█████╗██╔████╔██║█████╗  '
	@echo ' ╚════██║██╔══╝  ██║     ██║   ██║██║╚██╗██║██║  ██║╚════╝██║╚██╔╝██║██╔══╝  '
	@echo ' ███████║███████╗╚██████╗╚██████╔╝██║ ╚████║██████╔╝      ██║ ╚═╝ ██║███████╗'
	@echo ' ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═════╝       ╚═╝     ╚═╝╚══════╝'
	@echo "\033[0m"
	@echo "\033[1mSecond-Me Makefile Commands\033[0m"
	@echo "\033[0;90m$$(date)\033[0m\n"
	@echo ""
	@echo "\033[1;32m▶ MAIN COMMANDS:\033[0m"
	@echo "  make setup                 - Complete installation"
	@echo "  make start                 - Start all services"
	@echo "  make stop                  - Stop all services"
	@echo "  make restart               - Restart all services"
	@echo "  make restart-backend       - Restart only backend service"
	@echo "  make restart-force         - Force restart and reset data"
	@echo "  make status                - Show status of all services"
	@echo ""
	@echo "\033[1mAll Available Commands:\033[0m"
	@echo "  make help                  - Show this help message"
	@echo "  make check-env             - Check environment without installing"
	@echo ""
	@echo "\033[1mCommands that require conda environment:\033[0m"
	@echo "  make install               - Install project dependencies"
	@echo "  make test                  - Run tests"
	@echo "  make format                - Format code"
	@echo "  make lint                  - Check code style"
	@echo "  make all                   - Run format, lint and test"

# Check if in conda environment
check-conda:
	@if [ -z "$$CONDA_DEFAULT_ENV" ]; then \
		echo "Error: Please activate conda environment first!"; \
		exit 1; \
	fi

# Check environment without installing
check-env:
	zsh ./scripts/setup.sh --check-only

# Commands that don't require conda environment
setup:
	zsh ./scripts/setup.sh

start:
	zsh ./scripts/start.sh

stop:
	zsh ./scripts/stop.sh

restart:
	zsh ./scripts/restart.sh

restart-backend:
	zsh ./scripts/restart-backend.sh

restart-force:
	zsh ./scripts/restart-force.sh

status:
	zsh ./scripts/status.sh

# Commands that require conda environment
install: check-conda
	poetry install

test: check-conda
	poetry run pytest tests

format: check-conda
	poetry run ruff format lpm_kernel/

lint: check-conda
	poetry run ruff check lpm_kernel/

all: check-conda format lint test