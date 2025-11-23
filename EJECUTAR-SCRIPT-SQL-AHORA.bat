@echo off
echo ================================================
echo EJECUTANDO SCRIPT SQL PARA CREAR BASE DE DATOS
echo ================================================
echo.

REM Buscar MySQL en ubicaciones comunes
set MYSQL_PATH=
if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    set "MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
) else if exist "C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe" (
    set "MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe"
) else if exist "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    set "MYSQL_PATH=C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe"
)

if "%MYSQL_PATH%"=="" (
    echo ERROR: MySQL CLI no encontrado automaticamente.
    echo.
    echo Por favor, ejecuta el script SQL manualmente:
    echo 1. Abre MySQL Workbench
    echo 2. Ve a File -^> Open SQL Script
    echo 3. Selecciona: %~dp0..\75320-backend\database_complete.sql
    echo 4. Ejecuta el script (boton de rayo o Ctrl+Shift+Enter)
    echo.
    pause
    exit /b 1
)

echo MySQL encontrado en: %MYSQL_PATH%
echo.
echo Ejecutando script SQL...
echo Contraseña requerida: lozada11nahomi24*
echo.

"%MYSQL_PATH%" -u root -p"lozada11nahomi24*" < "%~dp0..\75320-backend\database_complete.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo SCRIPT EJECUTADO CORRECTAMENTE
    echo ================================================
    echo.
    echo Base de datos 'clinica' creada con todas las tablas.
    echo.
    echo Credenciales para iniciar sesion:
    echo   Usuario: admin
    echo   Contraseña: admin123
    echo.
) else (
    echo.
    echo ================================================
    echo ERROR AL EJECUTAR EL SCRIPT
    echo ================================================
    echo.
    echo Verifica:
    echo 1. Que MySQL este corriendo
    echo 2. Que la contraseña sea correcta (lozada11nahomi24*)
    echo 3. Que tengas permisos para crear bases de datos
    echo.
    echo O ejecuta el script manualmente en MySQL Workbench.
    echo.
)

pause

