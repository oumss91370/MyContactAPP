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

// Configuration CORS pour la production
const allowedOrigins = [
    'http://localhost:5173',
    'https://mycontactapp-front.onrender.com',
    'https://mycontactapp-kyoh.onrender.com'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Middleware CORS
app.use(cors(corsOptions));

// Gestion des requêtes OPTIONS
app.options('*', cors(corsOptions));

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Connecté à MongoDB"))
    .catch(err => console.error("❌ Erreur de connexion à MongoDB:", err));

// Middleware d'authentification
app.use(checkUser);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/', (req, res) => res.redirect('/api-docs'));

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ 
        ok: false, 
        message: 'Route non trouvée',
        path: req.path
    });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error('❌ Erreur:', err);
    res.status(500).json({ 
        ok: false, 
        message: 'Erreur interne du serveur',
        ...(process.env.NODE_ENV === 'development' && { error: err.message, stack: err.stack })
    });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`🚀 Serveur démarré sur http://${HOST}:${PORT}`);
    console.log(`📚 Documentation: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/api-docs`);
    console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
});

export default app;