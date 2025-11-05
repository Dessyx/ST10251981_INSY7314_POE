

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Payment Portal - Environment Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path ".env") {
    Write-Host "Warning: .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (yes/no)"
    if ($overwrite -ne "yes") {
        Write-Host "Aborted. Existing .env file kept." -ForegroundColor Green
        exit
    }
}

Write-Host "Choose your MongoDB setup:" -ForegroundColor Green
Write-Host "1. Local MongoDB (localhost:27017)"
Write-Host "2. MongoDB Atlas (cloud)"
Write-Host ""
$choice = Read-Host "Enter choice (1 or 2)"

if ($choice -eq "1") {
    $mongoUri = "mongodb://localhost:27017/payment-portal"
    Write-Host "Using local MongoDB: $mongoUri" -ForegroundColor Green
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "Enter your MongoDB Atlas connection string:" -ForegroundColor Yellow
    Write-Host "Example: mongodb+srv://username:password@cluster.mongodb.net/payment-portal" -ForegroundColor Gray
    $mongoUri = Read-Host "MongoDB URI"
} else {
    Write-Host "Invalid choice. Exiting." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Generating secure secrets..." -ForegroundColor Green

$jwtBytes = New-Object byte[] 64
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($jwtBytes)
$jwtSecret = [System.BitConverter]::ToString($jwtBytes).Replace("-", "").ToLower()

$cookieBytes = New-Object byte[] 64
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($cookieBytes)
$cookieSecret = [System.BitConverter]::ToString($cookieBytes).Replace("-", "").ToLower()

$encryptionBytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($encryptionBytes)
$encryptionKey = [System.Convert]::ToBase64String($encryptionBytes)

$pepperBytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($pepperBytes)
$pepper = [System.BitConverter]::ToString($pepperBytes).Replace("-", "").ToLower()

$envContent = @"
# MongoDB Connection
MONGO_URI=$mongoUri

# JWT Secret (auto-generated secure random string)
JWT_SECRET=$jwtSecret

# Cookie Secret (auto-generated secure random string)
COOKIE_SECRET=$cookieSecret

# Database Encryption Key (auto-generated 256-bit key for AES-256-GCM)
DB_ENCRYPTION_KEY=$encryptionKey

# Password Pepper (auto-generated secure random string)
PEPPER=$pepper

# Server Configuration
PORT=4000
NODE_ENV=development
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8 -NoNewline

Write-Host ""
Write-Host "Success: .env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  MongoDB URI: $mongoUri"
Write-Host '  JWT Secret: Generated (128 characters)'
Write-Host '  Cookie Secret: Generated (128 characters)'
Write-Host '  DB Encryption Key: Generated (256-bit AES key)'
Write-Host '  Password Pepper: Generated (64 characters)'
Write-Host '  Port: 4000'
Write-Host '  Environment: development'
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host '  1. Make sure MongoDB is running (if using local)'
Write-Host '  2. Run: npm install'
Write-Host '  3. Run: npm run generate-ssl'
Write-Host '  4. Run: npm run test-security (verify setup)'
Write-Host '  5. Run: npm run reset-admin'
Write-Host '  6. Run: npm start'
Write-Host ""

