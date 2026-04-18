$envFile = Get-Content .env
foreach ($line in $envFile) {
    if ($line -match "^GEMINI_API_KEY=(.*)$") {
        $apiKey = $matches[1]
    }
}

if (-not $apiKey) {
    Write-Error "API Key not found in .env"
    exit 1
}

$url = "https://generativelanguage.googleapis.com/v1beta/models?key=$apiKey"
Try {
    $response = Invoke-RestMethod -Uri $url -Method Get
    $response.models | Select-Object -ExpandProperty name
} Catch {
    Write-Error $_.Exception.Message
}
