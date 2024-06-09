@echo off
REM Check if adb is installed
where adb >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo adb could not be found
    exit /b 1
)

REM Print adb version for debugging
adb version

REM Launch the RegisterActivity via deep link
adb shell am start -a android.intent.action.VIEW -d "mypametnipaketnikapp://register"
