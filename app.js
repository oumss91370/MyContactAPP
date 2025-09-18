import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import { specs, swaggerUi } from "./config/swagger.js";
import { checkUser } from "./src/auth/middleware.js";
import authRoutes from './routes/users.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'https://mycontactapp-front.onrender.com'
];

// Configuration CORS
const corsOptions = {
    origin: function (origin, callback) {
        // Autoriser les requêtes sans origine (comme les applications mobiles ou Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

// Activer CORS avec les options configurées
app.use(cors(corsOptions));

// Gérer manuellement les requêtes OPTIONS pour certaines routes
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connecté à MongoDB..."))
    .catch(err => console.error("Erreur de connexion à MongoDB:", err));

app.use(checkUser);
// test
app.get('/api/auth/test', (req, res) => {
  console.log('Test de connexion reçu');
  res.json({ status: 'success', message: 'API fonctionnelle !' });
});

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/', (req, res) => res.redirect('/api-docs'));

app.use((req, res) => {
    res.status(404).json({ ok: false, message: 'Route non trouvée' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        ok: false,
        message: 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

export default app;