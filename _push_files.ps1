[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$env:MATON_API_KEY = "v2.FTDFcse7jnUOhUh6WcSnB-pnYP8OomvyNtD53AQcT-KHvk3I_UJ2kAbqCH1M13Nhbh9_YB1u_VPpOymwTKeKOoMLgO7SU7DtzTaUToItgkga5BDUm5XAoEfF"
$baseDir = "C:\Users\X\.qclaw\workspace\news-portal"
$headers = @{
    "Authorization" = "Bearer $env:MATON_API_KEY"
    "Content-Type"  = "application/json"
    "Accept"        = "application/vnd.github.v3+json"
}
$repo = "buwangni2016/news-portal"

# Get all files (exclude README.md which is already uploaded, .git, node_modules)
$files = Get-ChildItem $baseDir -Recurse -File | Where-Object { 
    $_.FullName -notmatch '\\.git\\' -and 
    $_.FullName -notmatch 'node_modules' -and
    $_.FullName -notmatch '\\.gitignore$'
}
# Filter out README.md
$files = $files | Where-Object { $_.Name -ne 'README.md' }

$success = 0
$failed = 0
$skip = 0

foreach ($f in $files) {
    $relPath = $f.FullName.Substring($baseDir.Length + 1).Replace('\', '/')
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $base64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($content))
    
    # Check if file already exists (to get SHA for update)
    $existingSha = $null
    try {
        $existing = Invoke-RestMethod -Uri "https://gateway.maton.ai/github/repos/$repo/contents/$([Uri]::EscapeDataString($relPath))" -Headers @{ "Authorization" = "Bearer $env:MATON_API_KEY"; "Accept" = "application/vnd.github.v3+json" } -TimeoutSec 5
        $existingSha = $existing.sha
    } catch { }
    
    $body = @{
        message = "feat: 添加 $relPath"
        content = $base64
    }
    if ($existingSha) {
        $body.sha = $existingSha
    }
    $bodyJson = $body | ConvertTo-Json
    
    try {
        $result = Invoke-RestMethod -Uri "https://gateway.maton.ai/github/repos/$repo/contents/$([Uri]::EscapeDataString($relPath))" -Method Put -Headers $headers -Body $bodyJson -TimeoutSec 15
        $success++
        echo "✅ $relPath"
    } catch {
        $ex = $_.Exception.GetBaseException()
        if ($ex.Response) {
            $reader = [System.IO.StreamReader]::new($ex.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            if ($errorBody -match "409") {
                echo "⚠️  Conflict: $relPath (trying with SHA)"
                # Retry with SHA
                try {
                    $sha = ($errorBody | ConvertFrom-Json).content.sha
                    $body.sha = $sha
                    $bodyJson2 = $body | ConvertTo-Json
                    $result = Invoke-RestMethod -Uri "https://gateway.maton.ai/github/repos/$repo/contents/$([Uri]::EscapeDataString($relPath))" -Method Put -Headers $headers -Body $bodyJson2 -TimeoutSec 15
                    $success++
                    echo "  ✅ Retry OK: $relPath"
                } catch {
                    $failed++
                    echo "  ❌ Retry failed: $relPath"
                }
            } else {
                $failed++
                echo "❌ $relPath - $errorBody"
            }
        } else {
            $failed++
            echo "❌ $relPath - $($_.Exception.Message)"
        }
    }
    Start-Sleep -Milliseconds 500
}

echo ""
echo "=== Done: $success succeeded, $failed failed, $skip skipped ==="