@echo off
setlocal

:PROMPT
SET AREYOUSURE=N
SET /P AREYOUSURE=Are you sure (Y/[N])?
IF /I "%AREYOUSURE%" NEQ "Y" GOTO END

Echo Installing the source - last chance to cancel before total REPLACEMENT! [CTRL+C]
PAUSE >nul

set ROOTDIR=..\..\..\..\..\..\..\darwino-client-javascript\javascript

rd %ROOTDIR%\javascript-darwino\src\main\javascript\src /s /q
md %ROOTDIR%\javascript-darwino\src\main\javascript\src
xcopy /s /q darwino %ROOTDIR%\javascript-darwino\src\main\javascript\src

rd %ROOTDIR%\javascript-darwino-react\src\main\javascript\src /s /q
md %ROOTDIR%\javascript-darwino-react\src\main\javascript\src
xcopy /s /q darwino-react %ROOTDIR%\javascript-darwino-react\src\main\javascript\src

rd %ROOTDIR%\javascript-darwino-react-bootstrap\src\main\javascript\src /s /q
md %ROOTDIR%\javascript-darwino-react-bootstrap\src\main\javascript\src
xcopy /s /q darwino-react-bootstrap %ROOTDIR%\javascript-darwino-react-bootstrap\src\main\javascript\src 

rd %ROOTDIR%\javascript-darwino-react-bootstrap-notes\src\main\javascript\src /s /q
md %ROOTDIR%\javascript-darwino-react-bootstrap-notes\src\main\javascript\src
xcopy /s /q darwino-react-bootstrap-notes %ROOTDIR%\javascript-darwino-react-bootstrap-notes\src\main\javascript\src 

:END
endlocal
