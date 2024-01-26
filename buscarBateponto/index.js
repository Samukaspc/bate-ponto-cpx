const puppeteer = require('puppeteer');

async function robo(usuario, dataInicio, dataFinal, grupamento) {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const initialUrl = 'https://policia.complexorj.com.br/rpdatas.php';
    await page.goto(initialUrl);
    await page.setViewport({ width: 1920, height: 1080 });

    await page.waitForSelector('.form-control.usuario');
    await page.type('.form-control.usuario', 'juver');

    await page.waitForSelector('.form-control.senha');
    await page.type('.form-control.senha', 'juver1234');

    await page.click('.btn.btn-primary.my-4.btn_login');

    await page.waitForNavigation();

    const newUrl = 'https://policia.complexorj.com.br/rpdatas.php';
    await page.goto(newUrl)

    await page.waitForSelector('.form-control.datepicker');

    await page.evaluate((dataInicio, dataFinal) => {
        const datePickerStart = document.querySelector('.form-control.datepicker');
        if (datePickerStart) {
            datePickerStart.value = dataInicio; // Data de início da pesquisa do mês
        }

        const datePickerEnd = document.getElementById('busca_registro_data_final');
        if (datePickerEnd) {
            datePickerEnd.value = dataFinal; // Data final da pesquisa do mês
        }
    }, dataInicio, dataFinal);

    //  guarnicoes gam
    
    
    await page.evaluate((grupamento) => {
        const guarnicoesSelect = document.getElementById('guarnicoes');
        if (guarnicoesSelect) {
            guarnicoesSelect.value = grupamento
            guarnicoesSelect.dispatchEvent(new Event('change'));
        }
    },grupamento);
    
    //usuario
    
    async function esperarPorTempo(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }
    await page.waitForSelector('.selection');

    let dadosUsuarios = []

    for (let i = 0; i < usuario.length; i++) {
        const valorUsuario = usuario[i].trim();

    
        await esperarPorTempo(500);

        await page.click('.selection');
        await page.waitForSelector('.select2-selection__rendered');

        await page.evaluate((valorUsuario) => {
            const inputField = document.querySelector('.select2-search__field');
        
            if (inputField) {
                inputField.value = valorUsuario;
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
            } 
        }, valorUsuario);
    
      
        await esperarPorTempo(500);
        
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Enter');
    
        await page.waitForSelector('.btn_buscar');
        await page.click('.btn_buscar');

        await esperarPorTempo(500);
    
        await page.waitForFunction((usuario) => {
            const totalHorasSomadaElement = document.querySelector('tfoot .total_horas_somada');
            if (totalHorasSomadaElement) {
                return totalHorasSomadaElement.textContent.trim() !== '';
            }
            return false;
        }, {}, usuario[i]);
    
        const dadosDaTabela = await page.evaluate(() => {
            const totalHorasSomadaElement = document.querySelector('tfoot .total_horas_somada');
            let totalHorasSomada = '';
            if (totalHorasSomadaElement) {
                totalHorasSomada = totalHorasSomadaElement.textContent.trim();
            }
    
            return totalHorasSomada;
        });
        const dadosUsuario = {
            OficialRG: valorUsuario,
            Horas: dadosDaTabela
        };

        dadosUsuarios.push(dadosUsuario)
    
        // console.log(`Para o usuário ${valorUsuario}, dados da tabela: ${dadosDaTabela}`);
    }
    await browser.close();
    return dadosUsuarios;
}
module.exports = robo;