const express = require('express');
const cors = require('cors');
require('dotenv').config();

const robo = require('./buscarBateponto');

const app = express();

app.use(express.json());
app.use(cors()); 

app.post('/api/robo', async (req, res) => {
    const { usuario, dataInicio, dataFinal, grupamento } = req.body;

    try {
        const dadosDaTabela = await robo(usuario, dataInicio, dataFinal, grupamento);
        res.json({ message: 'Dados recebidos com sucesso!', dados: dadosDaTabela });
    } catch (error) {
        console.error('Erro ao executar o script Puppeteer:', error);
        res.status(500).json({ error: 'Erro ao executar o script Puppeteer' });
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
