@echo off
setlocal

:PROMPT
SET AREYOUSURE=N
SET /P AREYOUSURE=Are you sure (Y/[N])?
IF /I "%AREYOUSURE%" NEQ "Y" GOTO END

Echo Installing the source - last chance to cancel before total REPLACEMENT! [CTRL+C]
PAUSE >nul

rem set ROOTDIR=..\..\..\..\..\..\..\darwino-client-javascript\javascript
set ROOTDIR=c:\phildev\source\darwino\darwino-client-javascript\javascript

rd %ROOTDIR%\javascript-darwino\src\main\javascript\src /s /q
md %ROOTDIR%\javascript-darwino\src\main\javascript\src
xcopy /s /q darwino %ROOTDIR%\javascript-darwino\src\main\javascript\src

rd %ROOTDIR%\javascript-darwino-react\src\main\javascript\src /s /q
md %ROOTDIR%\javascript-darwino-react\src\main\javascript\src
xcopy /s /q darwino-react %ROOTDIR%\javascript-darwino-react\src\main\javascript\src

rd %ROOTDIR%\javascript-darwino-react-onsenui\src\main\javascript\src /s /q
md %ROOTDIR%\javascript-darwino-react-onsenui\src\main\javascript\src
xcopy /s /q darwino-react-onsenui %ROOTDIR%\javascript-darwino-react-onsenui\src\main\javascript\src 

:END
endlocal
