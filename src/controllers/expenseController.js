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
const Indemnity = require('../models').indemnity;
const Council = require('../models').council;
const Remuneration = require('../models').remuneration;

const ExpensesController = function () {
    const all = async (req, res) => {
        try {
            let remunerations = [];
            const dataFromCsv = await readFile('src/sheets/servidores.xml', 'utf8');
            const councilsDataRows = dataFromCsv.trim().split('\n').splice(1);

            councilsDataRows.forEach((row) => {
                const remuneration = {};
                const column = row.split(';');

                remuneration.name = column[2];
                remuneration.category = column[3];
                remuneration.office = column[4];
                remuneration.total_advantages = helpers.formatMoney(column[5]);
                remuneration.total_discounts = helpers.formatMoney(column[6]);
                remuneration.total_liquid = helpers.formatMoney(column[7]);
                remuneration.date = moment().subtract(5, 'months').format('MM-YYYY');
                remunerations.push(remuneration);
            });

            await Promise.all(remunerations.map(async (remuneration) => {
                const council = await Council.find({
                    where: {
                        remuneration_name: remuneration.name
                    },
                    raw:true,
                    attributes: ['id']
                });

                if (council && council.id) {
                    remuneration.council_id = council.id;
                }
            }));

            remunerations = remunerations.filter(remuneration => remuneration.council_id);

            await Remuneration.bulkCreate(remunerations)

            res.status(200).send(remunerations);
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

    const indemnitys = async (req, res) => {
        try {
            let indemnities = [];
            const currentMonthKey = moment().subtract(2, 'months').format('M')
            const dataFromXlsx = await readFile('src/sheets/verba.xlsx');
            const rawData = xlsx.parse(dataFromXlsx);

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
                indemnity.date = moment().subtract(2, 'months').format('MM-YYYY');

                councilSheet.data.forEach((row) => {
                    if (/Aluguel de Escrit.*rio/.test(row)) {
                        indemnity.office_rent = row[currentMonthKey] || 0;
                    } else if (/Despesas relacionadas ao Escrit.*rio/.test(row)) {
                        indemnity.condominium = row[currentMonthKey] || 0;
                    } else if (/CELPE/.test(row)) {
                        indemnity.energy = row[currentMonthKey] || 0;
                    } else if (/COMPESA/.test(row)) {
                        indemnity.water = row[currentMonthKey] || 0;
                    } else if (/IPTU/.test(row)) {
                        indemnity.iptu = row[currentMonthKey] || 0;
                    } else if (/Internet e telefone/.test(row)) {
                        indemnity.internet_phone = row[currentMonthKey] || 0;
                    } else if (/Locomo.*.*o - Passagens, Hospedagens e Transporte/.test(row)) {
                        indemnity.drives = row[currentMonthKey] || 0;
                    } else if (/Locomo.*.*o - Loca.*.*o de Autom.*vel/.test(row)) {
                        indemnity.car_rent = row[currentMonthKey] || 0;
                    } else if (/Pe.*as e acess.*rios de ve.*culos/.test(row)) {
                        indemnity.car_maintenance = row[currentMonthKey] || 0;
                    } else if (/Servi.*os de Consultoria, Assessoria, Pesquisas e Trabalhos t.*cnicos /.test(row)) {
                        indemnity.researchs = row[currentMonthKey] || 0;
                    } else if (/Material de expediente/.test(row)) {
                        indemnity.office_materials = row[currentMonthKey] || 0;
                    } else if (/Loca.*.*o de m.*veis e equipamentos, aquisi.*.*o ou loca.*.*o de software/.test(row)) {
                        indemnity.software = row[currentMonthKey] || 0;
                    } else if (/Assinaturas de jornais, revistas e publica.*.*es/.test(row)) {
                        indemnity.news_subscriptions = row[currentMonthKey] || 0;
                    } else if (/Servi.*os g.*ficos e c.*pias/.test(row)) {
                        indemnity.graphics = row[currentMonthKey] || 0;
                    } else if (/VERBA INDENIZAT.*RIA PAGA NO M.*S/.test(row)) {
                        indemnity.total = row[currentMonthKey] || 0;
                    } else if (/GLOSA/.test(row)) {
                        indemnity.glosed = row[currentMonthKey] || 0;
                    }
                })

                indemnities.push(indemnity);
            });

            await Promise.all(indemnities.map(async (indemnity) => {
                const council = await Council.find({
                    where: {
                        indemnity_name: indemnity.name
                    },
                    raw:true,
                    attributes: ['id']
                });

                if (council && council.id) {
                    indemnity.council_id = council.id;
                }
            }));

            indemnities = indemnities.filter(indemnity => indemnity.council_id);

            await Indemnity.bulkCreate(indemnities)

            res.status(200).send(indemnities);
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
        indemnitys
    }
};

module.exports = ExpensesController;
