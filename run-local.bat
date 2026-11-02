@echo off
setlocal
if not defined JAVA_HOME (
  for /d %%J in ("%ProgramFiles%\Eclipse Adoptium\jdk-17*") do if exist "%%~fJ\bin\java.exe" set "JAVA_HOME=%%~fJ"
)
if not defined JAVA_HOME (
  echo Set JAVA_HOME to a Java 17 or newer JDK before running CompanyPro.
  pause
  exit /b 1
)
if not defined COMPANYPRO_ADMIN_USERNAME set "COMPANYPRO_ADMIN_USERNAME=admin"
if not defined COMPANYPRO_ADMIN_PASSWORD (
  echo Create a password of at least 12 characters for the local administrator account.
  set /p "COMPANYPRO_ADMIN_PASSWORD=Local admin password: "
)
if not defined COMPANYPRO_ADMIN_PASSWORD (
  echo An administrator password is required to start CompanyPro.
  pause
  exit /b 1
)
if not defined COOKIE_SECURE set "COOKIE_SECURE=false"
set "PATH=%JAVA_HOME%\bin;%PATH%"
start "CompanyPro API" /D "%~dp0backend" cmd /k mvnw.cmd spring-boot:run
cd /d "%~dp0"
npm run dev
