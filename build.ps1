# PowerShell build script for Windows
$ErrorActionPreference = "Stop"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "ShareSmallBiz - Web Build Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Clean previous build
Write-Host "Cleaning previous build..." -ForegroundColor Yellow
if (Test-Path publish) {
    Remove-Item -Recurse -Force publish
}
New-Item -ItemType Directory -Path publish | Out-Null

# Build Web App
Write-Host ""
Write-Host "Building Web App..." -ForegroundColor Yellow
Set-Location web
npm install
npm run build
Set-Location ..
Write-Host "Web build complete" -ForegroundColor Green

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Build Complete!" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Output: ./publish/web/"
Write-Host ""
