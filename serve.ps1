$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:9090/")
$listener.Start()
Write-Host "HTTP Server started on http://localhost:9090/"
$root = $PSScriptRoot

while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $resp = $ctx.Response
    $path = $req.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    # Strip query string from path
    $cleanPath = $path -replace "\?.*$", ""
    $filePath = Join-Path $root ($cleanPath.TrimStart("/").Replace("/", "\"))

    if (Test-Path $filePath) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $ct = switch ($ext) {
            ".html" { "text/html;charset=utf-8" }
            ".css"  { "text/css;charset=utf-8" }
            ".js"   { "application/javascript;charset=utf-8" }
            ".png"  { "image/png" }
            ".jpg"  { "image/jpeg" }
            ".svg"  { "image/svg+xml" }
            ".woff2" { "font/woff2" }
            default { "application/octet-stream" }
        }
        $resp.ContentType = $ct
        $resp.Headers.Add("Cache-Control", "no-store, no-cache, must-revalidate")
        $resp.Headers.Add("Pragma", "no-cache")
        $resp.ContentLength64 = $bytes.Length
        $resp.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $resp.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("Not Found: $filePath")
        $resp.OutputStream.Write($msg, 0, $msg.Length)
    }
    $resp.Close()
}
