import { Server } from 'socket.io';
import server from './services/server.js';
import ProductManager from './dao/fs/products.controller.js';
import './dataLayer/dbConnection.js';

const PORT = 8080;

const httpServer = server.listen(PORT, () => {
    console.log(`Server listen in the port ${PORT}`);
})

// const io = new Server(httpServer);

// const productManager = new ProductManager("./src/products.json");

// io.on('connection', async(socket) => {
//     console.log('Client connected');
//     const products = await productManager.getProducts();
//      //Enviamos el array de productos:
//     socket.emit("products", products);

//      //Recibimos el evento "eliminarProducto" desde el cliente:
//     socket.on("deleteProduct", async (id) => {
//         await productManager.deleteProduct(id);

//          //Le voy a enviar la lista actualizada al cliente:
//         io.sockets.emit("products", products);
//     })

//      //Agregamos productos por medio de un formulario:
//     socket.on("addProduct", async (product) => {
//         await productManager.addProduct(product);
//          //Le voy a enviar la lista actualizada al cliente:
//         io.sockets.emit("products", products);
//     })
// })