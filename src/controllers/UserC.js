import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User.js";

const registerSchema = z.object({
    email: z
        .string({ required_error: "L'email est requis" })
        .email("Email invalide"),
    password: z
        .string({ required_error: "Le mot de passe est requis" })
        .min(6, "Le mot de passe doit contenir au moins 6 caracteres"),
    name: z.string().optional()
});

const loginSchema = z.object({
    email: z
        .string({ required_error: "L'email est requis" })
        .email("Email invalide"),
    password: z
        .string({ required_error: "Le mot de passe est requis" })
        .min(1, "Le mot de passe est requis"),
});

// Gestion des erreurs
const handleErrors = (err) => {
    if (err.errors) {
        return err.errors;
    }
    let errors = { email: '', password: '' };
    if (err.code === 11000) {
        errors.email = 'Cet email est deja utilise';
        return errors;
    }
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
        return errors;
    }
    return { general: 'Une erreur est survenue lors de la création du compte' };
};

const createToken = (id) => {
    return jwt.sign(
        { sub: id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

const signup_post = async (req, res) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const user = await User.create(validatedData);
        const token = createToken(user._id);
        res.status(201).json({
            ok: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Erreur lors de linscription:', error);

        if (error instanceof z.ZodError) {
            const formattedErrors = {};
            error.errors.forEach(err => {
                const field = err.path[0];
                formattedErrors[field] = err.message;
            });
            return res.status(400).json({
                ok: false,
                message: 'Erreur de validation',
                errors: formattedErrors
            });
        }
        const errors = handleErrors(error);
        res.status(400).json({
            ok: false,
            message: 'Erreur lors de linscription',
            errors: errors
        });
    }
};

const logout_get = (req, res) => {
    res.status(200).json({ message: 'Déconnexion reussie' });
};

const login_post = async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'Email ou mot de passe incorrect'
            });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                ok: false,
                message: 'Email ou mot de passe incorrect'
            });
        }
        const token = createToken(user._id);

        res.json({
            ok: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            return res.status(400).json({
                ok: false,
                message: 'Erreur de validation',
                errors
            });
        }
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({
            ok: false,
            message: 'Erreur lors de la connexion'
        });
    }
};
export { signup_post, login_post, logout_get};
