import express from 'express';
import routeMain from '../routes/routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extend: true }));
app.use('/api', routeMain);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const msg = err.message || 'Internal Server Error';
    res.status(status).json({
        msg
    })
});

export default app