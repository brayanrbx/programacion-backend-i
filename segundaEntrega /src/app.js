import { Server } from 'socket.io';
import server from './services/server.js';
import ProductManager from './controller/products.controller.js';

const PORT = 8080;

const httpServer = server.listen(PORT, () => {
    console.log(`Server listen in the port ${PORT}`);
})

const io = new Server(httpServer);

const productManager = new ProductManager("./src/products.json");

io.on('connection', async(socket) => {
    console.log('Client connected');

     //Enviamos el array de productos:
    socket.emit("productos", await productManager.getProducts());

     //Recibimos el evento "eliminarProducto" desde el cliente:
    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);

         //Le voy a enviar la lista actualizada al cliente:
        io.sockets.emit("productos", await productManager.getProducts());
    })

     //Agregamos productos por medio de un formulario:
    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);
         //Le voy a enviar la lista actualizada al cliente:
        io.sockets.emit("productos", await productManager.getProducts());
    })
})