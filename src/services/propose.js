'use strict';

const axios = require('axios');
const cheerio = require('cheerio')
const moment = require('moment');
const iso88515 = require('iso-8859-15');
const querystring = require('querystring');
const { SAPL_URL } = require('../helpers/constants');

const ProposeService = function () {
    const index = async (councilsInfo) => {
        const currentPastYear = moment('2017-01-01');
        const today = moment();
        const proposes = [];

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

        return proposes;
    }

    return {
        index
    }
};

module.exports = ProposeService;
