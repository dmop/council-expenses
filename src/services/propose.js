'use strict';

const axios = require('axios');
const cheerio = require('cheerio')
const moment = require('moment');
const iso88515 = require('iso-8859-15');
const querystring = require('querystring');
const Council = require('../models').council;
const Propose = require('../models').propose;
const {SAPL_URL} = require('../helpers/constants');

const ProposeService = function () {
    const proposeInfo = async (url) => {
        console.log(url)
        // const url = `http://sapl.recife.pe.leg.br/consultas/materia/materia_mostrar_proc?cod_materia=${proposeCode}`;
        let response;

        try {
            response = await axios.request({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer',
                responseEncoding: 'binary'
            });
        } catch (err){
            if (err) {
                response = await axios.request({
                    method: 'GET',
                    url: url,
                    responseType: 'arraybuffer',
                    responseEncoding: 'binary'
                });
            }
        }

        const data = iso88515.decode(response.data.toString('binary'));
        const $ = cheerio.load(data);
        const propose = {};

        propose.type = $('#conteudo > fieldset:nth-child(4) > table > tbody > tr:nth-child(1) > td:nth-child(1)').text().split('\n')[1].trim();
        propose.number = $('#conteudo > fieldset:nth-child(4) > table > tbody > tr:nth-child(1) > td:nth-child(2)').text().split('\n')[1].trim();
        propose.date = $('#conteudo > fieldset:nth-child(4) > table > tbody > tr:nth-child(2) > td').text().split('\n')[1].trim();
        propose.description = $('#conteudo > fieldset:nth-child(4) > table > tbody > tr:nth-child(3) > td').text().split('\n')[1].trim();
        propose.name = $('#conteudo > fieldset:nth-child(4) > table > tbody > tr:nth-child(4) > td').text().split('\n')[1].trim();
        // propose.in_process = $('#conteudo > fieldset:nth-child(5) > table > tbody > tr:nth-child(2) > td:nth-child(1)').text().split('\n')[1].trim();
        // propose.is_polemic = $('#conteudo > fieldset:nth-child(5) > table > tbody > tr:nth-child(2) > td:nth-child(2)').text().split('\n')[1].trim();
        // propose.processing_regime = $('#conteudo > fieldset:nth-child(5) > table > tbody > tr:nth-child(2) > td:nth-child(3)').text().split('\n')[1].trim();

        // propose.date = moment(propose.date).format('YYYY-MM-DD');

        return propose;
    };

    const index = async (req, res) => {
        try {
            const proposes = [];
            const currentPastYear = moment('2017-01-01');
            const councilsInfo = {};
            const today = moment();
            const councils = await Council.findAll({
                where: {
                    active: true
                },
                raw: true,
                attributes: ['id', 'civil_name']
            });

            councils.forEach((council) => {
                councilsInfo[council.civil_name] = council.id;
            });

            while (currentPastYear.format('YYYY') <= today.format('YYYY')) {
                const response = await axios.request({
                    method: 'POST',
                    url: `${SAPL_URL}/relatorios_administrativos/resumoPropositurasAutor/resumoPropositurasAutor_index_html`,
                    responseType: 'arraybuffer',
                    responseEncoding: 'binary',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                        'Accept-Encoding': 'gzip, deflate',
                        'Accept-Language': 'en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7',
                        'Cache-Control': 'max-age=0',
                        'Connection': 'keep-alive',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Host': 'sapl.recife.pe.leg.br',
                        'Origin': 'http://sapl.recife.pe.leg.br',
                        'Referer': 'http://sapl.recife.pe.leg.br/relatorios_administrativos/resumoPropositurasAutor/resumoPropositurasAutor_index_html',
                        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36'
                    },
                    data: querystring.stringify({
                        selAno: currentPastYear.format('YYYY')
                    })
                });
                const htmlPage = iso88515.decode(response.data.toString('binary'));
                const $ = cheerio.load(htmlPage);
                let councilId;

                $('#conteudo > fieldset > table > tbody > tr').each((i, elem) => {
                    const text = $(elem).text().trim();
                    const propose = {};

                    if (councilsInfo[text]) {
                        councilId = councilsInfo[text];
                    }

                    if (!/\/201[7-9]/.test(text)) {
                        return;
                    }

                    propose.year = ~~currentPastYear.format('YYYY');
                    propose.description = $(elem).children().last().text().trim();
                    propose.url = $(elem).children().first().children().first().attr('href');
                    propose.name = $(elem).children().first().children().first().text().trim();
                    propose.type = propose.name.split(/[0-9]/)[0].trim();
                    propose.code = ~~propose.url.match(/http:\/\/sapl\.recife\.pe\.leg\.br\/consultas\/materia\/materia_mostrar_proc\?cod_materia=(.*)/)[1];
                    propose.council_id = councilId;

                    proposes.push(propose);
                });

                currentPastYear.add(1, 'year');
            }
    
            await Propose.bulkCreate(proposes);

            res.status(200).send({
                success: true
            });
        }            

        catch (err) {
            res.status(400)
                .send({
                    message: err.message,
                    error: true
                });
        }

    }

    return {
        index
    }
};

module.exports = ProposeService;
