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

const ProposeController = function () {
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

    const proposeInfo = async (req, res) => {
        try {
            const propose = {};
            const proposeCode = 86007;
            const url = `http://sapl.recife.pe.leg.br/consultas/materia/materia_mostrar_proc?cod_materia=${proposeCode}`;
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            propose.type = $('#conteudo > fieldset:nth-child(4) > table > tbody > tr:nth-child(1) > td:nth-child(1)').text().split('\n')[1].trim();
            propose.number = $('#conteudo > fieldset:nth-child(4) > table > tbody > tr:nth-child(1) > td:nth-child(2)').text().split('\n')[1].trim();
            propose.date = $('#conteudo > fieldset:nth-child(4) > table > tbody > tr:nth-child(2) > td').text().split('\n')[1].trim();
            propose.ementa = $('#conteudo > fieldset:nth-child(4) > table > tbody > tr:nth-child(3) > td').text().split('\n')[1].trim();
            propose.tramitacao = $('#conteudo > fieldset:nth-child(5) > table > tbody > tr:nth-child(2) > td:nth-child(1)').text().split('\n')[1].trim();
            propose.polemica = $('#conteudo > fieldset:nth-child(5) > table > tbody > tr:nth-child(2) > td:nth-child(2)').text().split('\n')[1].trim();
            // propose.number = $('#conteudo > fieldset:nth-child(4) > table > tbody > tr:nth-child(1) > td:nth-child(2)').text().split('\n')[1].trim();

            res.status(200).send(propose);
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

    return {
        all,
        proposeInfo
    }
};

module.exports = ProposeController;
