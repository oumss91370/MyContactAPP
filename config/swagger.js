import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MyContactAPP API',
      version: '1.0.0',
      description: 'API pour la gestion des contacts avec authentification JWT',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: "L'email de l'utilisateur"
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Le mot de passe (minimum 6 caractères)'
            },
            name: {
              type: 'string',
              description: 'Le nom de l\'utilisateur (optionnel)'
            }
          },
          example: {
            email: 'utilisateur@exemple.com',
            password: 'motdepasse123',
            name: 'Jean Dupont'
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            ok: { type: 'boolean' },
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' }
              }
            }
          },
          example: {
            ok: true,
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            user: {
              id: '5f8d0f3d6a1b2c3d4e5f6a7b',
              email: 'utilisateur@exemple.com',
              name: 'Jean Dupont'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            ok: { type: 'boolean' },
            message: { type: 'string' }
          },
          example: {
            ok: false,
            message: 'Message d erreur détaillé'
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

const swaggerDocs = (app, port) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

export { specs, swaggerUi, swaggerDocs };
