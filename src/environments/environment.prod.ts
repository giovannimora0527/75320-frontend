import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true
  ,
  // URL base para servicios de autenticación/API en producción
  apiUrlAuth: 'https://api.example.com/clinica/v1'
};
