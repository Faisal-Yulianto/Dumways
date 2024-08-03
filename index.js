const express = require('express')
const path = require('path'); 
const app = express()
const port = 3000

app.set("view engine","hbs");
app.set("views", path.join(__dirname, 'views'));
app.use("/assets", express.static("assets"));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/blog', (req, res) => {
  res.render('blog');
});

app.get('/testi', (req, res) => {
  res.render('testi');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})