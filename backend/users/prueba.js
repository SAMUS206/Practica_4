import mongoose from 'mongoose';

const conectarDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://emmagx:htEUA2t3KTT3IhF3@redsocialpi.ouwu1.mongodb.net/miBaseDeDatos', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conexión a la base de datos exitosa.');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
  }
};