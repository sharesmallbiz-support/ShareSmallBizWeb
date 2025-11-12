# PowerShell build script for Windows
$ErrorActionPreference = "Stop"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "ShareSmallBiz - Unified Build Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Clean previous build
Write-Host "🧹 Cleaning previous build..." -ForegroundColor Yellow
if (Test-Path publish) {
    Remove-Item -Recurse -Force publish
}
New-Item -ItemType Directory -Path publish | Out-Null

# Build .NET API
Write-Host ""
Write-Host "🔨 Building .NET API..." -ForegroundColor Yellow
Set-Location api
dotnet restore
dotnet publish -c Release -o ../publish/api
Set-Location ..
Write-Host "✅ API build complete" -ForegroundColor Green

# Build Web App
Write-Host ""
Write-Host "🔨 Building Web App..." -ForegroundColor Yellow
Set-Location web
npm install
npm run build
Set-Location ..
Write-Host "✅ Web build complete" -ForegroundColor Green

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✅ Build Complete!" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Output directories:"
Write-Host "  API: ./publish/api/"
Write-Host "  Web: ./publish/web/"
Write-Host ""
