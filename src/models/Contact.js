import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Le prénom est requis'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Le numéro de téléphone est requis'],
        trim: true,
        validate: {
            validator: function (v) {
                return /^[0-9\s-.]{10,20}$/.test(v);
            },
            message: props => `${props.value} n'est pas un numéro de téléphone valide (10-20 caractères)`
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true,});

export const Contact = mongoose.model('Contact', contactSchema);
