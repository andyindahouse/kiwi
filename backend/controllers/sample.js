'use strict';

const controller = {
    unprotected: (req, res) => {
        res.send('Ruta sin proteger');
    },
    protected: (req, res) => {
        res.send(`${req.user.first_name} ${req.user.last_name}, bienvenido a la ruta protegida.`);
    },
};

module.exports = controller;
