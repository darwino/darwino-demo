rem this point to the darwino-client-javascript project
set JS_PROJECT=../../../../../../../../darwino-client-javascript

mklink /J darwino "%JS_PROJECT%\javascript\javascript-darwino\src\main\javascript\src"
mklink /J darwino-react "%JS_PROJECT%\javascript\javascript-darwino-react\src\main\javascript\src"
mklink /J darwino-react-onsenui "%JS_PROJECT%\javascript\javascript-darwino-react-onsenui\src\main\javascript\src"
