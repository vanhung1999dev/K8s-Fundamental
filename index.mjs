import express from "express";
import os from 'os';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    const mess = `Hello from the ${os.hostname}`;
    console.log(mess);
    res.send(mess);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});