@echo off
REM Get current timestamp in YYYYMMDD-HHMMSS format
set timestamp=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%-%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%

REM Replace spaces in timestamp with underscores
set timestamp=%timestamp: =_%

REM Run ng build with dynamic output path
ng build --prod --output-path="dist\%timestamp%"

