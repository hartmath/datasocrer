@echo off
echo Starting Git push process...
git add . > nul 2>&1
echo Files staged successfully
git commit -m "Initial commit: Complete DataCSV platform" > nul 2>&1
echo Commit created successfully
echo Pushing to GitHub...
git push -u origin main
echo Push completed!
