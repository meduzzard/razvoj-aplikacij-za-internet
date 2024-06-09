@echo off
REM Check if adb is installed
where adb >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo adb could not be found
    exit /b 1
)

REM Print adb version for debugging
adb version

REM Get the username from the command-line arguments
set USERNAME=%1

REM Launch the LoginActivity via deep link
adb shell am start -a android.intent.action.VIEW -d "mypametnipaketnikapp://login?username=%USERNAME%"
