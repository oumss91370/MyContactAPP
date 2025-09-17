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

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://mycontactapp-front.onrender.com'
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connecté à MongoDB..."))
    .catch(err => console.error("Erreur de connexion à MongoDB:", err));

app.use(checkUser);

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
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Documentation: http://localhost:${PORT}/api-docs`);
});

export default app;