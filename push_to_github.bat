@echo off
cd /d "C:\Users\DAMMIE\Desktop\datacsv-main"
echo Checking Git status...
git status --short
echo.
echo Adding all files...
git add .
echo.
echo Committing changes...
git commit -m "Initial commit: Complete DataCSV platform with CMS, payments, and lead import system"
echo.
echo Pushing to GitHub...
git push -u origin main
echo.
echo Push completed successfully!
pause
