import winston from 'winston';

const logger = winston.createLogger({
  level: 'info', // Niveau minimal de logs à afficher
  format: winston.format.combine(
    winston.format.timestamp(), // Ajoute l'heure
    winston.format.json()       // Format JSON (pratique pour fichiers)
  ),
  transports: [
    new winston.transports.Console(), // Affiche dans la console
    new winston.transports.File({ filename: 'app.log' }) // Écrit dans un fichier
  ]
});
export default logger;