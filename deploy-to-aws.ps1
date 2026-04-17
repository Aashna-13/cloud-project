<#
.SYNOPSIS
Installs AWS CLI, securely configures temporary credentials, and deploys the Intelligent Cloud Application Catalog to AWS automatically.
#>

$ErrorActionPreference = "Stop"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Automated AWS CloudFormation Deployment" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# 1. Check if AWS CLI is installed
if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Host "AWS CLI is not installed. Downloading and installing now..." -ForegroundColor Yellow
    $installerPath = "$env:TEMP\AWSCLIV2.msi"
    Invoke-WebRequest -Uri "https://awscli.amazonaws.com/AWSCLIV2.msi" -OutFile $installerPath
    Write-Host "Installing AWS CLI... (this may take 1-2 minutes)" -ForegroundColor Yellow
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i $installerPath /qn" -Wait -NoNewWindow
    
    # Refresh environment variables in the current session so `aws` works instantly
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

Write-Host "AWS CLI is ready!" -ForegroundColor Green

# 2. Securely prompt for credentials
$accessKeyId = Read-Host "Enter your AWS Access Key ID"
$secretAccessKey = Read-Host -AsSecureString "Enter your AWS Secret Access Key (input will be hidden)"
$secretStr = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secretAccessKey))

# 3. Configure AWS CLI
Write-Host "Configuring AWS credentials..." -ForegroundColor Yellow
aws configure set aws_access_key_id $accessKeyId
aws configure set aws_secret_access_key $secretStr
aws configure set default.region us-east-1

$stackName = "CloudList-Deploy-Auto"
$templateFile = "aws-cloudformation-template.yaml"

# 4. Deploy the Stack
Write-Host "Triggering automated stack deployment ($stackName)..." -ForegroundColor Yellow
Write-Host "This will take AWS approximately 5-10 minutes to spin up the Database and EC2 instance." -ForegroundColor White

aws cloudformation deploy `
    --template-file $templateFile `
    --stack-name $stackName `
    --parameter-overrides DBUsername=admin DBPassword=CloudPass123! `
    --capabilities CAPABILITY_NAMED_IAM

if ($LASTEXITCODE -eq 0) {
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "Deployment Completed Successfully!" -ForegroundColor Green
    
    # Get outputs
    $outputs = aws cloudformation describe-stacks --stack-name $stackName --query "Stacks[0].Outputs" --output table
    Write-Host "Here are your live AWS Links:" -ForegroundColor White
    Write-Host $outputs -ForegroundColor Cyan
} else {
    Write-Host "Deployment Failed. Please check the AWS Console for more details." -ForegroundColor Red
}

# Cleanup credentials from the system for security
Write-Host "Cleaning up AWS credentials from local storage for security..." -ForegroundColor Yellow
Remove-Item "~/.aws/credentials" -ErrorAction SilentlyContinue
Remove-Item "~/.aws/config" -ErrorAction SilentlyContinue
Write-Host "Done!" -ForegroundColor Green
