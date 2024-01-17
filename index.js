const express = require('express');
const cors = require('cors');
const robo = require('./buscarBateponto/index');
const app = express();

app.use(express.json());
app.use(cors()); 

app.post('/api/robo', async (req, res) => {
    const { usuario, dataInicio, dataFinal, grupamento } = req.body;

    try {
        const dadosDaTabela = await robo(usuario, dataInicio, dataFinal, grupamento);
        res.json({ message: 'Dados recebidos com sucesso!', dados: dadosDaTabela });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao executar o script Puppeteer' });
    }
});

const PORT = process.env.PORT || 3001;  // Usando a porta 3001 se process.env.PORT não estiver definido
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
