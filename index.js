const express = require('express')
const app = express()
const port = 3000

app.set("view engine","hbs");
app.set("views","assets/views");

app.get('/', (req, res) => {
  res.render('index');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})