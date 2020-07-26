const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/products', async function (req, res) {
    console.log('New Request for products ' + req.query);
    res.set({'Content-Type': 'application/json'});
    try {
        const response = await controller.getProducts(req.query);
        res.status(200).send(response);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/products/:ean', async function (req, res) {
    console.log('New Request for products by ean ' + req.params);
    res.set({'Content-Type': 'application/json'});
    const params = req.params;
    if (!params.ean) {
        return res.status(400).send({message: 'Falta parametro ean'});
    }
    try {
        const response = await controller.getProductDetail(params);
        if (response) {
            res.status(200).send(response);
        } else {
            res.status(404).send({message: 'Producto no encontrado'});
        }
    } catch (error) {
        res.status(500).send({message: error});
    }
});

module.exports = router;
