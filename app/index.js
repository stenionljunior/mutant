const express = require('express')
const app = express()
const port = 3000;
#test
app.listen(port);
console.log(`Acesse http://localhost: ${port}`);
app.get('/', (req, res) => {
  res.send(`Bem-vindo!`);
});
