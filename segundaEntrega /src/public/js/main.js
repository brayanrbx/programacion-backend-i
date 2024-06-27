const socket = io();

socket.on('products', (data) => {
    renderProducts(data);
});


const renderProducts = (data) => {
    const products = document.getElementById('contenedorProductos');

    data.forEach(item => {
        const card = document.createElement("div");

        card.innerHTML = `  <p> ${item.id} </p>
                            <p> ${item.title} </p>
                            <p> ${item.price} </p>
                            <button> Eliminar </button>
                        `
        products.appendChild(card);

        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id);
        })
    })
};