$env:GIT_CONFIG_GLOBAL = ""
$env:GIT_PAGER = "cat"

Write-Host "Adding all files..."
& git add .

Write-Host "Creating commit..."
& git commit -m "Initial commit: Complete DataCSV platform with CMS, payments, and lead import system"

Write-Host "Pushing to GitHub repository: https://github.com/hartmath/datacsv.git"
& git push -u origin main

Write-Host "Push completed successfully!"
