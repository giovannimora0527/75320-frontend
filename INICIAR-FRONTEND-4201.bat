@echo off
echo ===============================================
echo   INICIANDO FRONTEND ANGULAR
echo   Puerto: 4201
echo ===============================================
echo.

cd /d "%~dp0FRONTEND"

echo Verificando instalacion...
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install --legacy-peer-deps
)

echo.
echo Iniciando servidor Angular en puerto 4201...
echo.
echo Espera 30-60 segundos para que compile...
echo Luego abre: http://localhost:4201/#/login
echo.

call ng serve --port 4201 --host localhost --open

pause

