import jwt from "jsonwebtoken";
import { User } from "../models/User.js";


export const requireAuth = async (req, res, next) => {
    // Vérifier le header d'autorisation
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({
            ok: false,
            message: 'Accès non autorisé - Token manquant'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.sub).select('-password');
        if (!user) {
            return res.status(401).json({
                ok: false,
                message: 'Utilisateur non trouvé'
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Erreur authentification:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                ok: false,
                message: 'Session expirée, veuillez vous reconnecter'
            });
        }
        res.status(401).json({
            ok: false,
            message: 'Token invalide ou expiré'
        });
    }
};

export const checkUser = async (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.sub).select('-password');
        
        if (user) {
            req.user = user;
        }
        next();
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        next();
    }
};
