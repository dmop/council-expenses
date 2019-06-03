"use strict";

const express = require("express");
const router = express.Router();
const council = require("../src/controllers/councilController")();

router.get("/", council.index);
// router.get("/all", council.all);

module.exports = router;


        // const index = async (req, res) => {
    //     try {
    //         const councils = [];
    //         const url = 'http://www.recife.pe.leg.br/vereadores/17a-legislatura';
    //         const response = await axios.get(url);
    //         const councilInfoPattern = (/<a.*href="http:\/\/www.recife.pe.leg.br\/vereadores\/17a-legislatura\/.*".*class="internal-link">.*<\/a>/gi);
    //         const councilUrlPattern = (/<a.*href="(http:\/\/www.recife.pe.leg.br\/vereadores\/17a-legislatura\/.*)" class="internal-link">.*<\/a>/i);
    //         const councilNamePattern = (/<a.*href="http:\/\/www.recife.pe.leg.br\/vereadores\/17a-legislatura\/.*".*class="internal-link">(.*)<\/a>/i);

    //         response.data.match(councilInfoPattern).forEach((tag) => {
    //             const council = {};

    //             council.url = tag.match(councilUrlPattern)[1];
    //             council.name = tag.match(councilNamePattern)[1];
    //             councils.push(council);
    //         });
            
    //         await Promise.all(councils.map(async (council) => {
    //             council.id = await getCouncilId(council);
    //         }));

    //         res.status(200).send(councils);
    //     }
    //     catch
    //         (err) {
    //         console.log(err);
    //         res.status(400)
    //             .send({
    //                 message: err.message,
    //                 error: true
    //             });
    //     }
    // };

    // const getCouncilId = async (councilData) => {
    //     const council = {};
    //     const councilIdPattern = (/cod_parlamentar=(.*)&/i);
    //     const response = await axios.get(councilData.url);
    //     let id = '';

    //     if (councilIdPattern.test(response.data)) {
    //         id = response.data.match(councilIdPattern)[1];
    //     }

    //     return id;
    // }