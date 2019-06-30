'use strict';

const fs = require('fs');
const util = require('util');
const axios = require('axios');
const moment = require('moment');
const xlsx = require('node-xlsx');
const helpers = require('../helpers');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const { FILES_FOLDER } = require('../helpers/constants');

const RemunerationService = function () {
    const index = async () => {
        const currentPastYear = moment('2017-01-01');
        const today = moment();
        let remunerations = [];

        while (currentPastYear.format('YYYY') <= today.format('YYYY')) {
            let currentMonthKey = 1;
            let limitMonthKey = 12;
            let response;

            if (currentPastYear.format('YYYY') === today.format('YYYY')) {
                limitMonthKey = ~~currentPastYear.subtract(2, 'months').format('M');
            }

            while (currentMonthKey <= limitMonthKey) {
                const url = `http://transparencia.recife.pe.gov.br/codigos/web/camara/remuneracaoServidores_planilha.php?ano=${currentPastYear.format('YYYY')}&mes=${currentMonthKey.toString().padStart(2, 0)}&nome=&cpf=&matricula=&categoria=VEREADORES&cargo=&dataEmissao=09/06/2019 18:22:13&dataAtualizacao=`;
                let dataFromXlsx;
                let fileAdress;
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

                fileAdress = `${FILES_FOLDER}/remunerations/${currentPastYear.format('YYYY')}-${currentMonthKey.toString().padStart(2, 0)}.xls`;

                await writeFile(fileAdress, response.data);

                dataFromXlsx = await readFile(fileAdress);
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
                    remuneration.date = `${currentPastYear.format('YYYY')}-${currentMonthKey.toString().padStart(2, 0)}`;

                    remunerations.push(remuneration);
                });

                currentMonthKey++;
            }

            currentPastYear.add(1, 'year');
        }

        return remunerations;

    };

    return {
        index
    }
};

module.exports = RemunerationService;
