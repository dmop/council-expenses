'use strict';

const axios = require('axios');
const moment = require('moment');
const cheerio = require('cheerio')
const iso88515 = require('iso-8859-15');
const { timeoutDelay } = require('../helpers');
const { SAPL_URL } = require('../helpers/constants');

const PlenarySessionService = function () {
    const getSession = async (sessionLink, councilsInfo) => {
        try {
            const response = await axios.request({
                method: 'GET',
                url: `${SAPL_URL}/consultas/sessao_plenaria/${sessionLink}`,
                responseType: 'arraybuffer',
                responseEncoding: 'binary'
            });
            const htmlPage = iso88515.decode(response.data.toString('binary'));
            const $ = cheerio.load(htmlPage);
            const session = {};
            const present = [];

            session.code = sessionLink.match(/agenda_sessao_plen_mostrar_proc\?cod_sessao_plen=(.*)&dat_sessao=.*/)[1];

            session.date = sessionLink.match(/agenda_sessao_plen_mostrar_proc\?cod_sessao_plen=.*&dat_sessao=(.*)/)[1];
            session.date = moment(session.date, 'DD/MM/YYYY').format('YYYY-MM-DD');

            if ($('#conteudo > h3')) {
                session.name = $('#conteudo > h3').text().trim();
            }

            if ($('#conteudo > fieldset:nth-child(4) > table > tbody > tr > td:nth-child(1)')) {
                session.type = $('#conteudo > fieldset:nth-child(4) > table > tbody > tr > td:nth-child(1)').text().split('\n')[1].trim();
            }

            if ($('#conteudo > fieldset:nth-child(4) > table > tbody > tr > td:nth-child(3)')) {
                session.end_hour = $('#conteudo > fieldset:nth-child(4) > table > tbody > tr > td:nth-child(3)').text().split('\n')[1].trim();
                session.end_hour = moment(session.end_hour, 'DD/MM/YYYY - HH:mm').format('HH:mm');
            }

            if ($('#conteudo > fieldset:nth-child(4) > table > tbody > tr > td:nth-child(2)')) {
                session.start_hour = $('#conteudo > fieldset:nth-child(4) > table > tbody > tr > td:nth-child(2)').text().split('\n')[1].trim();
                session.start_hour = moment(session.start_hour, 'DD/MM/YYYY - HH:mm').format('HH:mm');
            }

            if ($('#conteudo > fieldset:nth-child(7) > table > tbody')) {
                $('#conteudo > fieldset:nth-child(7) > table > tbody').children().each((index, elem) => {
                    const councilName = $(elem).text().trim().split('/')[0].trim();

                    if (councilsInfo[councilName]) {
                        present.push(councilsInfo[councilName]);
                    }
                });
            }

            session.present = JSON.stringify(present);

            return session;
        } catch (err) {
            timeoutDelay(5000);
            return getSession(sessionLink, councilsInfo)
        }
    }

    const index = async () => {
        const sessionsDates = [];
        const sessionsLinks = [];
        const response = await axios.request({
            method: 'GET',
            url: `${SAPL_URL}/consultas/sessao_plenaria/sessao_plenaria_index_html`,
            responseType: 'arraybuffer',
            responseEncoding: 'binary'
        });
        const htmlPage = iso88515.decode(response.data.toString('binary'));
        const $ = cheerio.load(htmlPage);

        $('#lst_dat_sessao').children().each((i, elem) => {
            let sessionDate = $(elem).text().trim();

            if (!sessionDate) {
                return;
            }

            sessionDate = moment(sessionDate, 'DD-MM-YYYY');

            if (sessionDate.format('YYYY-MM-DD') >= '2017-01-01') {
                sessionsDates.push(sessionDate.format('DD/MM/YYYY'));
            }
        });

        await Promise.all(sessionsDates.map(async (sessionDate) => {
            const response = await axios.request({
                method: 'GET',
                url: `${SAPL_URL}/consultas/sessao_plenaria/sessao_plenaria_index_html?dat_sessao_sel=${sessionDate}`,
                responseType: 'arraybuffer',
                responseEncoding: 'binary'
            });
            const htmlPage = iso88515.decode(response.data.toString('binary'));
            const linkPattern = /<a href="(agenda_sessao_plen_mostrar_proc\?cod_sessao_plen=.*&dat_sessao=.*)">/;
            let link = htmlPage.match(linkPattern) ? htmlPage.match(linkPattern)[1] : null;

            if (link) {
                link = link.replace("'", '');

                sessionsLinks.push(link);
            }
        }));

        return sessionsLinks;
    };

    return {
        index,
        getSession
    }
};

module.exports = PlenarySessionService;
