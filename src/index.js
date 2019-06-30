'use strict';

const express = require('express');
const router = express.Router();
const Council = require('./models').council;
const Propose = require('./models').propose;
const Indemnity = require('./models').indemnity;
const Remuneration = require('./models').remuneration;
const PlenarySession = require('./models').plenary_session;
const CouncilPlenarySessionPresence = require('./models').council_plenary_session_presence;
const councilService = require('./services/council')();
const proposeService = require('./services/propose')();
const indemnityService = require('./services/indemnity')();
const remunerationService = require('./services/remuneration')();
const plenarySessionService = require('./services/plenarySession')();

router.get('/councils', async (req, res) => {
    try {
        const councilsToCreate = await councilService.index();
        const councils = await Council.bulkCreate(councilsToCreate, {
            returning: true
        });
        const indemnityNames = councilService.indemnityNames();
        const remunerationNames = councilService.remunerationNames();

        await Promise.all(councils.map(async (council) => {
            await Council.update({
                indemnity_name: indemnityNames[council.name],
                remuneration_name: remunerationNames[council.name]
            }, {
                where: {
                    id: council.id
                }
            });
        }));

        res.status(200).send({
            message: 'success',
            error: false
        });
    }

    catch (err) {
        res.status(400)
            .send({
                message: err,
                error: true
            });
    }
});

router.get('/indemnities', async (req, res) => {
    try {
        const councilsInfo = {};
        let indemnities = await indemnityService.index();
        let councils;

        councils = await Council.findAll({
            raw: true,
            attributes: ['id', 'indemnity_name']
        });

        councils.forEach((council) => {
            councilsInfo[council.indemnity_name] = council.id;
        });

        indemnities.forEach((indemnity) => {
            indemnity.council_id = councilsInfo[indemnity.name];
        });

        indemnities = indemnities.filter(indemnity => indemnity.council_id);

        await Indemnity.bulkCreate(indemnities);

        res.status(200).send({
            message: 'success',
            error: false
        });
    }

    catch (err) {
        res.status(400)
            .send({
                message: err,
                error: true
            });
    }
});


router.get('/remunerations', async (req, res) => {
    try {
        const councilsInfo = {};
        let remunerations = await remunerationService.index();
        let councils;

        councils = await Council.findAll({
            raw: true,
            attributes: ['id', 'remuneration_name']
        });

        councils.forEach((council) => {
            councilsInfo[council.remuneration_name] = council.id;
        });

        remunerations.forEach((remuneration) => {
            remuneration.council_id = councilsInfo[remuneration.name];
        });

        remunerations = remunerations.filter(remuneration => remuneration.council_id);

        await Remuneration.bulkCreate(remunerations);

        res.status(200).send({
            message: 'success',
            error: false
        });
    }

    catch (err) {
        res.status(400)
            .send({
                message: err,
                error: true
            });
    }
});

router.get('/plenary-sessions', async (req, res) => {
    try {
        const sessions = [];
        const councilsIds = [];
        const councilsInfo = {};
        const councilPresences = [];
        let sessionsLinks;
        let councils;

        councils = await Council.findAll({
            where: {
                active: true
            },
            raw: true,
            attributes: ['id', 'name']
        });

        councils.forEach((council) => {
            councilsInfo[council.name] = council.id;
            councilsIds.push(council.id);
        });
    
        sessionsLinks = await plenarySessionService.index();

        await Promise.all(sessionsLinks.map(async (sessionLink) => {
            const session = await plenarySessionService.getSession(sessionLink, councilsInfo);

            sessions.push(session);
        }));

        await Promise.all(sessions.map(async (session) => {
            const plenarySession = await PlenarySession.create(session);

            councilsIds.forEach((councilId) => {
                const councilPresence = {};

                councilPresence.council_id = councilId;
                councilPresence.plenary_session_id = plenarySession.id;
                councilPresence.present = session.present.includes(councilId);

                councilPresences.push(councilPresence);
            });
        }));

        await CouncilPlenarySessionPresence.bulkCreate(councilPresences);

        res.status(200).send({
            message: 'success',
            error: false
        });
    }

    catch (err) {
        res.status(400)
            .send({
                message: err,
                error: true
            });
    }
});

router.get('/proposes', async (req, res) => {
    try {
        const councilsInfo = {};
        let proposes;
        let councils;

        councils = await Council.findAll({
            where: {
                active: true
            },
            raw: true,
            attributes: ['id', 'civil_name']
        });

        councils.forEach((council) => {
            councilsInfo[council.civil_name] = council.id;
        });

        proposes = await proposeService.index(councilsInfo);

        await Propose.bulkCreate(proposes);

        res.status(200).send({
            message: 'success',
            error: false
        });
    }

    catch (err) {
        res.status(400)
            .send({
                message: err,
                error: true
            });
    }
});


module.exports = router;


