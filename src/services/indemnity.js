'use strict';

const fs = require('fs');
const util = require('util');
const axios = require('axios');
const moment = require('moment');
const xlsx = require('node-xlsx');
const Council = require('../models').council;
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const Indemnity = require('../models').indemnity;
const {INDEMNITY_URL} = require('../helpers/constants');

const IndemnityService = function () {
    const pastIndemnities = async (req, res) => {
        try {
            const currentPastYear = moment('2017-01-01');
            const councilsInfo = {};
            const today = moment();
            let indemnities = [];
            let dataFromXlsx;
            let councils;
            let rawData;

            while (currentPastYear.format('YYYY') <= today.format('YYYY')) {
                let currentDateKey = currentPastYear.format('YYYY-MM');
                let currentMonthKey = 1;
                let limitMonthKey = 12;
                let response;
                let url;

                if (~~currentPastYear.format('YYYY') === 2017) {
                    url = `${INDEMNITY_URL}/dezembro-2017`;
                }

                if (~~currentPastYear.format('YYYY') === 2018) {
                    url = `${INDEMNITY_URL}/dezembro`;
                }

                if (~~currentPastYear.format('YYYY') === 2019) {
                    url = `${INDEMNITY_URL}/abril-1`;
                    limitMonthKey = 4;
                }

                response = await axios.request({
                    method: 'GET',
                    url: url,
                    responseType: 'arraybuffer',
                    responseEncoding: 'binary',
                    headers: {
                        'Content-Type': 'blob'
                    }
                });

                await writeFile(`src/sheets/indemnitys/${currentDateKey}.xlsx`, response.data);

                dataFromXlsx = await readFile(`src/sheets/indemnitys/${currentDateKey}.xlsx`);
                rawData = xlsx.parse(dataFromXlsx);

                while (currentMonthKey <= limitMonthKey) {
                    rawData.forEach((councilSheet) => {
                        const indemnity = {
                            name: '',
                            date: '',
                            office_rent: 0,
                            condominium: 0,
                            energy: 0,
                            water: 0,
                            iptu: 0,
                            internet_phone: 0,
                            drives: 0,
                            car_rent: 0,
                            car_maintenance: 0,
                            researchs: 0,
                            office_materials: 0,
                            software: 0,
                            news_subscriptions: 0,
                            graphics: 0,
                            total: 0,
                            glosed: 0
                        };
                        indemnity.name = councilSheet.name.trim();
                        indemnity.date = `${currentMonthKey.toString().padStart(2, 0)}-${currentPastYear.format('YYYY')}`;
        
                        councilSheet.data.forEach((row) => {
                            if (/Aluguel de Escrit.*rio/.test(row)) {
                                indemnity.office_rent = ~~row[currentMonthKey];
                            } else if (/Despesas relacionadas ao Escrit.*rio/.test(row)) {
                                indemnity.condominium = ~~row[currentMonthKey];
                            } else if (/CELPE/.test(row)) {
                                indemnity.energy = ~~row[currentMonthKey];
                            } else if (/COMPESA/.test(row)) {
                                indemnity.water = ~~row[currentMonthKey];
                            } else if (/IPTU/.test(row)) {
                                indemnity.iptu = ~~row[currentMonthKey];
                            } else if (/Internet e telefone/.test(row)) {
                                indemnity.internet_phone = ~~row[currentMonthKey];
                            } else if (/Locomo.*.*o - Passagens, Hospedagens e Transporte/.test(row)) {
                                indemnity.drives = ~~row[currentMonthKey];
                            } else if (/Locomo.*.*o - Loca.*.*o de Autom.*vel/.test(row)) {
                                indemnity.car_rent = ~~row[currentMonthKey];
                            } else if (/Pe.*as e acess.*rios de ve.*culos/.test(row)) {
                                indemnity.car_maintenance = ~~row[currentMonthKey];
                            } else if (/Servi.*os de Consultoria, Assessoria, Pesquisas e Trabalhos t.*cnicos /.test(row)) {
                                indemnity.researchs = ~~row[currentMonthKey];
                            } else if (/Material de expediente/.test(row)) {
                                indemnity.office_materials = ~~row[currentMonthKey];
                            } else if (/Loca.*.*o de m.*veis e equipamentos, aquisi.*.*o ou loca.*.*o de software/.test(row)) {
                                indemnity.software = ~~row[currentMonthKey];
                            } else if (/Assinaturas de jornais, revistas e publica.*.*es/.test(row)) {
                                indemnity.news_subscriptions = ~~row[currentMonthKey];
                            } else if (/Servi.*os g.*ficos e c.*pias/.test(row)) {
                                indemnity.graphics = ~~row[currentMonthKey];
                            } else if (/VERBA INDENIZAT.*RIA PAGA NO M.*S/.test(row)) {
                                indemnity.total = ~~row[currentMonthKey];
                            } else if (/GLOSA/.test(row)) {
                                indemnity.glosed = ~~row[currentMonthKey];
                            }
                        })

                        indemnities.push(indemnity);
                    });

                    currentMonthKey++;
                }
                
                currentPastYear.add(1,'year');
            }

            councils = await Council.findAll({
                raw: true,
                attributes: ['id', 'indemnity_name']
            });

            councils.forEach((council) => {
                councilsInfo[council.indemnity_name] = council.id 
            })

            indemnities.forEach((indemnity) => {
                indemnity.council_id = councilsInfo[indemnity.name];
            });

            indemnities = indemnities.filter(indemnity => indemnity.council_id);

            await Indemnity.bulkCreate(indemnities);

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
    };

    return {
        pastIndemnities
    }
};

module.exports = IndemnityService;
