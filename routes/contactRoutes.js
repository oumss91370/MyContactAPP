import { Router } from "express";
import { requireAuth } from "../src/auth/middleware.js";
import { 
    getContacts, 
    createContact, 
    updateContact, 
    deleteContact 
} from "../src/controllers/contactController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Gestion des contacts
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Récupère tous les contacts de l'utilisateur connecté
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 */
router.get('/', requireAuth, getContacts);

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Crée un nouveau contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInput'
 *     responses:
 *       201:
 *         description: Contact créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 */
router.post('/', requireAuth, createContact);

/**
 * @swagger
 * /api/contacts/{id}:
 *   patch:
 *     summary: Met à jour partiellement un contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du contact à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInput'
 *     responses:
 *       200:
 *         description: Contact mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 */
router.patch('/:id', requireAuth, updateContact);

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Supprime un contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du contact à supprimer
 *     responses:
 *       200:
 *         description: Contact supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.delete('/:id', requireAuth, deleteContact);

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: L'ID du contact
 *         firstName:
 *           type: string
 *           description: Le prénom du contact
 *         lastName:
 *           type: string
 *           description: Le nom du contact
 *         phone:
 *           type: string
 *           description: Le numéro de téléphone du contact
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 60d21b4667d0d8992e610c85
 *         firstName: Jean
 *         lastName: Dupont
 *         phone: 00612345678
 *         createdAt: 2023-06-23T10:00:00.000Z
 *         updatedAt: 2023-06-23T10:00:00.000Z
 * 
 *     ContactInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - phone
 *       properties:
 *         firstName:
 *           type: string
 *           description: Le prénom du contact
 *           example: Jean
 *         lastName:
 *           type: string
 *           description: Le nom du contact
 *           example: Dupont
 *         phone:
 *           type: string
 *           description: Le numéro de téléphone (10-20 caractères)
 *           example: 0612345678
 */

export default router;
