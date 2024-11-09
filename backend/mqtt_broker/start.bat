@echo off
setlocal enabledelayedexpansion

:: Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Docker is not installed or not in PATH
    exit /b 1
)

:: Check if Docker Compose is available
docker compose version >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Docker Compose is not available
    exit /b 1
)

:: Check if Docker Desktop is running
docker info >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Docker Desktop is not running
    echo Please start Docker Desktop and try again
    exit /b 1
)

echo Starting Docker Compose...
docker compose up

if %ERRORLEVEL% neq 0 (
    echo Error: Docker Compose failed with exit code %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)

endlocal
