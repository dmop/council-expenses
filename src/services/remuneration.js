'use strict';

const fs = require('fs');
const util = require('util');
const axios = require('axios');
const moment = require('moment');
const xlsx = require('node-xlsx');
const helpers = require('../helpers');
const Council = require('../models').council;
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const {FILES_FOLDER} = require('../helpers/constants');
const Remuneration = require('../models').remuneration;

const RemunerationService = function () {
    const pastRemunerations = async (req, res) => {
        try {
            const currentPastYear = moment('2017-01-01');
            const councilsInfo = {};
            const today = moment();
            let remunerations = [];
            let councils;

            while (currentPastYear.format('YYYY') <= today.format('YYYY')) {
                let currentMonthKey = 1;
                let limitMonthKey = 12;
                let response;

                if (~~currentPastYear.format('YYYY') === 2019) {
                    limitMonthKey = 4;
                }

                while (currentMonthKey <= limitMonthKey) {
                    let url = `http://transparencia.recife.pe.gov.br/codigos/web/camara/remuneracaoServidores_planilha.php?ano=${currentPastYear.format('YYYY')}&mes=${currentMonthKey.toString().padStart(2, 0)}&nome=&cpf=&matricula=&categoria=VEREADORES&cargo=&dataEmissao=09/06/2019 18:22:13&dataAtualizacao=`;
                    let dataFromXlsx;
                    let rawData;

                    response = await axios.request({
                        method: 'GET',
                        url: url,
                        responseType: 'arraybuffer',
                        responseEncoding: 'binary',
                        headers: {
                            'Content-Type': 'blob'
                        }
                    });

                    await writeFile(`${FILES_FOLDER}/remunerations/${currentPastYear.format('YYYY')}-${currentMonthKey.toString().padStart(2, 0)}.xls`, response.data);

                    dataFromXlsx = await readFile(`${FILES_FOLDER}/remunerations/${currentPastYear.format('YYYY')}-${currentMonthKey.toString().padStart(2, 0)}.xls`);
                    rawData = xlsx.parse(dataFromXlsx);

                    rawData = rawData[0].data.slice(5);
                    rawData.forEach((row) => {
                        const remuneration = {};
                        
                        if (!row.length) {
                            return;
                        }

                        remuneration.name = row[2];
                        remuneration.total_advantages = helpers.formatMoney(row[5]);
                        remuneration.total_discounts = helpers.formatMoney(row[6]);
                        remuneration.total_liquid = helpers.formatMoney(row[7]);
                        remuneration.date = `${currentMonthKey.toString().padStart(2, 0)}-${currentPastYear.format('YYYY')}`;
                        
                        remunerations.push(remuneration);
                    });

                    currentMonthKey++;
                }
                
                currentPastYear.add(1,'year');
            }

            councils = await Council.findAll({
                raw:true,
                attributes: ['id', 'remuneration_name']
            });

            councils.forEach((council) => {
                councilsInfo[council.remuneration_name] = council.id 
            })

            remunerations.forEach((remuneration) => {
                remuneration.council_id = councilsInfo[remuneration.name];
            });

            remunerations = remunerations.filter(remuneration => remuneration.council_id);

            await Remuneration.bulkCreate(remunerations);

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
        pastRemunerations
    }
};

module.exports = RemunerationService;
