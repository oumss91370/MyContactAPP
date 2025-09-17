import { Contact } from "../models/Contact.js";
import { z } from "zod";

const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9\s-.]{10,20}$/;
    if (!phoneRegex.test(phone)) {
        throw new Error('Le numero de telephone doit contenir entre 10 et 20 chiffres, espaces, tirets ou points');
    }
    return true;
};

const contactSchema = z.object({
    firstName: z.string().min(1, "Le prenom est requis").trim(),
    lastName: z.string().min(1, "Le nom est requis").trim(),
    phone: z.string()
        .min(10, "Le numero doit contenir au moins 10 caractères")
        .max(20, "Le numero ne peut pas dépasser 20 caractères")
        .refine(phone => /^[0-9\s-.]{10,20}$/.test(phone), {
            message: "Numero de téléphone invalide utilisez uniquement des chiffres, espaces, tirets ou points"
        })
});

const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id });
        res.status(200).json({
            ok: true,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Erreur lors de la récupération des contacts',
            error: error.message
        });
    }
};

const createContact = async (req, res) => {
    try {
        const validatedData = contactSchema.parse(req.body);
        const contact = await Contact.create({
            ...validatedData,
            user: req.user.id
        });
        res.status(201).json({
            ok: true,
            data: contact
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            const formattedErrors = {};
            error.issues.forEach(issue => {
                const field = issue.path[0];
                formattedErrors[field] = issue.message;
            });
            return res.status(400).json({
                ok: false,
                message: 'Erreur de validation',
                errors: formattedErrors
            });
        }
        res.status(500).json({
            ok: false,
            message: 'Erreur lors de la création du contact',
            error: error.message
        });
    }
};

const updateContact = async (req, res) => {
    try {
        // Vérification que le contact existe et appartient à l'utilisateur
        const contact = await Contact.findOne({
            _id: req.params.id,
            user: req.user.id
        });
        if (!contact) {
            return res.status(404).json({
                ok: false,
                message: 'Contact non trouve ou accès non autorise'
            });
        }
        const dataToValidate = {
            firstName: req.body.firstName !== undefined ? req.body.firstName : contact.firstName,
            lastName: req.body.lastName !== undefined ? req.body.lastName : contact.lastName,
            phone: req.body.phone !== undefined ? req.body.phone : contact.phone
        };
        if (req.body.phone !== undefined) {
            validatePhoneNumber(req.body.phone);
        }
        const validatedData = contactSchema.parse(dataToValidate);
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            { $set: validatedData },
            { 
                new: true, 
                runValidators: true,
                context: 'query'
            }
        );
        if (!updatedContact) {
            throw new Error('Echec de la mise à jour du contact verifier le numero ');
        }
        res.status(200).json({
            ok: true,
            data: updatedContact
        });
    } catch (error) {
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
        res.status(500).json({
            ok: false,
            message: 'Erreur lors de la mise à jour du contact',
            error: error.message
        });
    }
};


const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findOne({
            _id: req.params.id,
            user: req.user.id
        });
        if (!contact) {
            return res.status(404).json({
                ok: false,
                message: 'Contact non trouvé ou accès non autorise'
            });
        }
        await Contact.findByIdAndDelete(req.params.id);

        res.status(200).json({
            ok: true,
            message: 'Contact supprime avec succes'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Erreur lors de la suppression du contact',
            error: error.message
        });
    }
};
export {
    getContacts,
    createContact,
    updateContact,
    deleteContact
};