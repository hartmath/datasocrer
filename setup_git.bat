@echo off
cd /d "C:\Users\DAMMIE\Desktop\datacsv-main"
git remote set-url origin https://github.com/hartmath/datacsv.git
echo Remote URL updated successfully
git remote -v
echo.
echo Checking git status...
git status --porcelain
echo.
echo Ready to push to GitHub!
pause
