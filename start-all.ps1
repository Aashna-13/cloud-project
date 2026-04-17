<#
.SYNOPSIS
Installs dependencies, builds, and starts both the Catalog Backend and Frontend locally.
#>

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Starting Cloud Application Catalog Stack " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check if Maven is available in PATH
$mvnAvailable = Get-Command mvn -ErrorAction SilentlyContinue
if (-not $mvnAvailable) {
    Write-Host "It looks like Maven (mvn) is not installed or not in your PATH. Please install Maven or run from your IDE." -ForegroundColor Red
} else {
    Write-Host "1. Building and starting Spring Boot Backend..." -ForegroundColor Yellow
    # Start Backend in a new window
    Start-Process powershell.exe -ArgumentList "-NoExit -Command `"cd catalog-backend; mvn spring-boot:run`"" -WindowStyle Normal
    Write-Host "Spring Boot backend is starting in a new window..." -ForegroundColor Green
}

# Wait a few seconds before starting frontend
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "2. Installing Frontend dependencies and starting React..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit -Command `"cd catalog-frontend; npm install; npm run dev`"" -WindowStyle Normal

Write-Host "React frontend is starting in a new window..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Frontend will be available at http://localhost:5173" -ForegroundColor White
Write-Host "Backend is available at http://localhost:8080" -ForegroundColor White
Write-Host "==========================================" -ForegroundColor Cyan
