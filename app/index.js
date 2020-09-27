const express = require('express')
const app = express()
const port = 3000;

app.listen(port);
console.log(`Acesse http://localhost: ${port}`);
app.get('/', (req, res) => {
  const candidato = process.env.CANDIDATO || 'Mutantx';
  res.send(`Bem-vindo ${candidato}!`);
});
