'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const iso88515 = require('iso-8859-15');
const { SAPL_URL } = require('../helpers/constants');

const CouncilService = function () {
    const index = async () => {
        const councils = [];
        const response = await axios.request({
            method: 'GET',
            url: `${SAPL_URL}/consultas/parlamentar/parlamentar_index_html`,
            responseType: 'arraybuffer',
            responseEncoding: 'binary'
        });
        const htmlPage = iso88515.decode(response.data.toString('binary'));
        const $ = cheerio.load(htmlPage);

        $('#parlamentares > tbody > tr').each((i, elem) => {
            const council = {};
            council.civil_name = $(elem).children().eq(0).text().trim();
            council.name = $(elem).children().eq(1).text().trim();
            council.party = $(elem).children().eq(2).text().trim();
            council.active = ($(elem).children().eq(3).text().trim() === 'SIM');
            council.code = ~~$(elem).children().first().children().attr('href').split('=')[1];

            councils.push(council);
        });

        await Promise.all(councils.map(async (council) => {
            const response = await axios.request({
                method: 'GET',
                url: `${SAPL_URL}/consultas/parlamentar/parlamentar_mostrar_proc?cod_parlamentar=${council.code}`,
                responseType: 'arraybuffer',
                responseEncoding: 'binary'
            });
            const htmlPage = iso88515.decode(response.data.toString('binary'));
            const $ = cheerio.load(htmlPage);

            council.birthday = $('#texto-parlamentar > b:nth-child(5)').text().trim();
            council.phone = $('#texto-parlamentar > b:nth-child(7)').text().trim();
            council.email = $('#texto-parlamentar > b:nth-child(9) > a').text().trim();
        }));

        return councils;
    }

    const indemnityNames = () => {
        return {
            'Aderaldo Pinto': 'ADERALDO OLIVEIRA',
            'Aerto Luna': 'AERTO LUNA',
            'Aimee Carvalho': 'AIMÉE SILVA',
            'Alcides Teixeira Neto': 'ALCIDES TEIXEIRA NETO',
            'Aline Mariano': 'ALINE MARIANO',
            'Almir Fernando': 'ALMIR FERNANDO',
            'Amaro Cipriano': 'AMARO CIPRIANO',
            'Professora Ana Lúcia': 'ANA LÚCIA',
            'André Régis': 'ANDRÉ RÉGIS',
            'Antonio Luiz Neto': 'ANTONIO LUIZ NETO',
            'Augusto Carreras': 'AUGUSTO CARRERAS',
            'Benjamim da Saúde': 'BENJAMIN DA SAÚDE',
            'Carlos Gueiros': 'CARLOS GUEIROS',
            'Davi Muniz': 'DAVI MUNIZ',
            'Eduardo Chera': 'EDUARDO CHERA',
            'Eduardo Marques': 'EDUARDO MARQUES',
            'Eriberto Rafael': 'RAFAEL ACIOLI',
            'Felipe Francismar': 'FELIPE FRANCISMAR',
            'Chico Kiko': 'CHICO KIKO',
            'Fred Ferreira': 'FRED FERREIRA',
            'Gilberto Alves': 'GILBERTO ALVES',
            'Hélio Guabiraba': 'HÉLIO GUABIRARA',
            'Júnior Bocão': 'JÚNIOR BOCÃO',
            'Ivan Moraes': 'IVAN MORAES',
            'Jadeval de Lima': 'Jadeval de Lima',
            'Jairo Britto': 'JAIRO BRITTO',
            'Jayme Asfora': 'JAYME ASFORA',
            'João da Costa': 'JOÃO DA COSTA',
            'Wilton Brito': 'WILTON BRITO',
            'Marco Aurélio Medeiros': 'MARCO AURÉLIO',
            'Marcos di Bria': 'MARCOS DI BRIA',
            'Goretti Queiroz': 'GORETTI QUEIROZ',
            'Marília Arraes': 'MARÍLIA ARRAES',
            'Missionária Michele Collins': 'DAIZE MICHELE',
            'Natália de Menudo': 'NATÁLIA DE MENUDO',
            'Renato Antunes': 'RENATO ANTUNES',
            'Ricardo Cruz': 'RICARDO CRUZ',
            'Rinaldo Júnior': 'RINALDO JÚNIOR',
            'Rodrigo Coutinho': 'RODRIGO COUTINHO',
            'Rogério de Lucca': 'ROGÉRIO DE LUCCA',
            'Romerinho Jatobá': 'ROMERINHO JATOBÁ',
            'Romero Albuquerque': 'ROMERO ALBUQUERQUE',
            'Samuel Salazar': 'SAMUEL SALAZAR',
            'Wanderson Florêncio': 'WANDERSON SOBRAL'
        };
    };

    const remunerationNames = () => {
        return {
            'Aderaldo Pinto': 'ADERALDO DE OLIVEIRA FLORENCIO',
            'Aerto Luna': 'AERTO DE BRITO LUNA',
            'Aimee Carvalho': 'AIMEE SILVA DE CARVALHO',
            'Alcides Teixeira Neto': 'ALCIDES TEIXEIRA NETO',
            'Aline Mariano': 'ALINE BRITO MARTINS DA FONSECA',
            'Almir Fernando': 'ALMIR FERNANDO ALVES',
            'Amaro Cipriano': 'AMARO CIPRIANO DE LIMA',
            'Professora Ana Lúcia': 'ANA LUCIA DO REGO FERREIRA',
            'André Régis': 'ANDRE REGIS DE CARVALHO',
            'Antonio Luiz Neto': 'ANTONIO LUIZ DA SILVA NETO',
            'Augusto Carreras': 'AUGUSTO JOSE C C ALBUQUERQUE',
            'Benjamim da Saúde': 'BENJAMIM G DA SILVA JUNIOR',
            'Carlos Gueiros': 'CARLOS ALBERTO GUEIROS',
            'Davi Muniz': 'DAVI BERNARDO MUNIZ',
            'Eduardo Chera': 'EDUARDO PEREIRA DA SILVA',
            'Eduardo Marques': 'EDUARDO AMORIM MARQUES CUNHA',
            'Eriberto Rafael': 'RAFAEL ACIOLI MEDEIROS',
            'Felipe Francismar': 'LUIZ FELIPE CAMARA DE O PONTES',
            'Chico Kiko': 'FRANCISCO FERREIRA DA S FILHO',
            'Fred Ferreira': 'FREDERICO M DE M S FERREIRA',
            'Gilberto Alves': 'GILBERTO DARIO DE MELO ALVES',
            'Hélio Guabiraba': 'HELIO BATISTA DE OLIVEIRA',
            'Júnior Bocão': 'INALDO GERSON P FREIRES',
            'Ivan Moraes': 'IVAN V DE MORAES FILHO',
            'Jairo Britto': 'JAIRO XAVIER DE BRITTO',
            'João da Costa': 'JOAO DA COSTA BEZERRA FILHO',
            'Wilton Brito': 'JOSE WILTON DE B CAVALCANTI',
            'Marco Aurélio Medeiros': 'MARCO AURELIO DE M  LIMA',
            'Marcos di Bria': 'MARCOS ANTONIO GOMES DA SILVA',
            'Goretti Queiroz': 'MARIA GORETTI C DE QUEIROZ',
            'Marília Arraes': 'MARILIA V R ARRAES DE A PONTES',
            'Missionária Michele Collins': 'DAIZE MICHELE DE A. GONCALVES',
            'Natália de Menudo': 'NATALIA R COUTO BARBOSA',
            'Renato Antunes': 'PAULO RENATO A GUIMARAES',
            'Ricardo Cruz': 'RICARDO JORGE DA CRUZ',
            'Rinaldo Júnior': 'RINALDO ALVES DE L JUNIOR',
            'Rodrigo Coutinho': 'RODRIGO B COUTINHO DE MELO',
            'Rogério de Lucca': 'ROGERIO LIMA DE LUCCA',
            'Romerinho Jatobá': 'ROMERO JATOBA C NETO',
            'Romero Albuquerque': 'ROMERO L B DE ALBUQUERQUE',
            'Samuel Salazar': 'SAMUEL R DOS SANTOS SALAZAR',
            'Wanderson Florêncio': 'WANDERSON SOBRAL FLORENCIO'
        };
    };

    return {
        index,
        indemnityNames,
        remunerationNames
    }
};

module.exports = CouncilService;
