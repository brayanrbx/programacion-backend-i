import server from './services/server.js';

const PORT = 8080;

server.listen(PORT, () => {
    console.log(`Server listen in the port ${PORT}`);
})