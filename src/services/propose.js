'use strict';

const _ = require('lodash');
const axios = require('axios');
const cheerio = require('cheerio')
const moment = require('moment');
const xlsx = require('node-xlsx');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const helpers = require('../helpers');
const iso88515 = require('iso-8859-15');
const querystring = require('querystring');

const ProposeService = function () {
    const legislative = async (req, res) => {
        try {   
            const councils = [];
            const proposes = [];
            const councilCode = 120;
            let numberOfPages = 1;

            for (let currentPage = 1; currentPage <= numberOfPages; currentPage++) {
                const url = `http://sapl.recife.pe.leg.br/generico/materia_pesquisar_proc?page=${currentPage}&step=8&txt_relator=&txt_numero=&dt_public2=&lst_tip_autor=Parlamentar&txt_num_protocolo=&hdn_txt_autor=&txt_ano=&hdn_cod_autor=${councilCode}&lst_localizacao=&lst_tip_materia=6&txt_assunto=&btn_materia_pesquisar=Pesquisar&incluir=0&lst_cod_partido=&dt_apres2=&chk_coautor=0&txt_npc=&lst_status=&dt_public=&rd_ordenacao=1&rad_tramitando=&existe_ocorrencia=0&dt_apres=`;
                const response = await axios.get(url);
                const $ = cheerio.load(response.data);
                let selectorNumberOfPages = $('#conteudo > fieldset > table > tbody > tr:nth-child(18) > td > b').text();
            
                if (selectorNumberOfPages.match(/P.*ginas[\s\S]*\((.*)\):/) &&  selectorNumberOfPages.match(/P.*ginas[\s\S]*\((.*)\):/)[1]) {
                    numberOfPages = ~~selectorNumberOfPages.match(/P.*ginas[\s\S]*\((.*)\):/)[1];
                }

                $('#conteudo > fieldset > table > tbody > tr').each((i, elem) => {
                    const url = $(elem).children().first().children().first().attr('href');
                    
                    if (url && !proposes.includes(url)) {
                        proposes.push(url);
                    }
                });
            }            

            res.status(200).send(proposes);
        }
        catch
            (err) {
            console.log(err);
            res.status(400)
                .send({
                    message: err.message,
                    error: true
                });
        }
    };

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

    const pastProposes = async (req, res) => {
        try {
            const currentPastYear = moment('2019-01-01');
            const today = moment();
            const councilsInfo = {};
            const proposes = [];
            const urls = [];
            let data;

            while (currentPastYear.format('YYYY') <= today.format('YYYY')) {
                const url = 'http://sapl.recife.pe.leg.br/relatorios_administrativos/resumoPropositurasAutor/resumoPropositurasAutor_index_html';
                let response;
                let $;

                response = await axios.request({
                    method: 'POST',
                    url: url,
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
                
                data = iso88515.decode(response.data.toString('binary'));
                $ = cheerio.load(data);

                $('#conteudo > fieldset > table > tbody > tr').each((i, elem) => {
                    let url;
                    
                    if (!/\/(20[0-8][0-9]|209[0-9])/.test($(elem).text())) {
                        return;
                    }

                    url = $(elem).children().first().children().first().attr('href').trim();
                    urls.push(url);
                });
                
                currentPastYear.add(1,'year');
            }

            await Promise.all(urls.map(async (url) => {
                const propose = await proposeInfo(url);
                helpers.timeoutDelay(1000);
                proposes.push(propose);
            }));

            res.status(200).send(proposes);
        }
        catch (err) {
            console.log(err);
            res.status(400)
                .send({
                    message: err.message,
                    error: true
                });
        }
    };
    return {
        pastProposes
    }
};

module.exports = ProposeService;
