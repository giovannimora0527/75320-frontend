import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  // En Docker, el backend está en el mismo host pero en un contenedor diferente
  // Usar la URL del host para acceder desde el navegador
  apiUrl: 'http://localhost:8000/clinica/v1',
  apiUrlAuth: 'http://localhost:8000/clinica/v1'
};
