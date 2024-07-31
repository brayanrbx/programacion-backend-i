const socket = io();

socket.on('products', (data) => {
    renderProducts(data);
});

const renderProducts = (data) => {
    const products = document.getElementById('productsContainer');
    const card = document.createElement("div");
    card.classList.add("row");
    data.forEach(item => {
        card.innerHTML +=  `<div class="col-3 my-2">
                                <ul class="list-group my-2">
                                    <li class="list-group-item">${item.title}</li>
                                    <li class="list-group-item">${item.price}</li>
                                </ul>
                                <div class="text-center">
                                    <button type="button" class="btn btn-primary">Eliminar</button>
                                </div>
                            </div>`
        products.appendChild(card);

        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(item.id);
        })
    })
}

    const deleteProduct = (id) => {
        socket.emit("deleteProduct", id);
    }

    //Agregamos productos con el formulario:
    document.getElementById("btnSend").addEventListener("click", () => {
        addProduct();
    })

    const addProduct = () => {
        const product = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            code: document.getElementById("code").value,
            price: document.getElementById("price").value,
            status: document.getElementById("status").value === "true",
            stock: document.getElementById("stock").value,
            thumbnail: document.getElementById("thumbnail").value,
        }

        socket.emit("addProduct", product);
};