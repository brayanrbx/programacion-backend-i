import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://admin:admin01@cluster0.uxfb50k.mongodb.net/ecommerce?retryWrites=true&w=majority')
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err));