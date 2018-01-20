@echo off
setlocal

echo --------------------------------------------------------------------------------------
echo !! WARNING !!
echo This is going to ERASE your development files and replace them with the Github Content
echo --------------------------------------------------------------------------------------

:PROMPT
SET AREYOUSURE=N
SET /P AREYOUSURE=Are you sure (Y/[N])?
IF /I "%AREYOUSURE%" NEQ "Y" GOTO END

Echo Installing the source - last chance to cancel before total REPLACEMENT! [CTRL+C]
PAUSE >nul

set ROOTDIR=..\..\..\..\darwino-client-javascript\javascript

rd src\main\app\darwinosrc\darwino /s /q
md src\main\app\darwinosrc\darwino
xcopy /s /q %ROOTDIR%\javascript-darwino\src\main\javascript\src src\main\app\darwinosrc\darwino

rd src\main\app\darwinosrc\darwino-react /s /q
md src\main\app\darwinosrc\darwino-react
xcopy /s /q %ROOTDIR%\javascript-darwino-react\src\main\javascript\src src\main\app\darwinosrc\darwino-react

:END
endlocal
