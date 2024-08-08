const express = require("express");
const path = require("path");
const upload = require("./middleware/upload")
const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use("/assets", express.static("assets"));
app.use(express.urlencoded({ extended: false }));

let adblog = [];

const calculateDuration = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const durationMs = endDate - startDate;
  const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));

  if (durationDays < 30) {
    return `${durationDays} hari`;
  } else if (durationDays < 365) {
    const months = Math.floor(durationDays / 30);
    return `${months} bulan `;
  } else {
    const years = Math.floor(durationDays / 365);
    return `${years} tahun lalu`;
  }
};

app.get("/", (req, res) => {
  res.render("index", { adblog });
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/blog", (req, res) => {
  res.render("blog");
});

app.get("/testi", (req, res) => {
  res.render("testi");
});

app.get("/detail/:index", (req, res) => {
  const index = req.params.index;
  const project = adblog[index];
  if (project) {
    res.render("detail", { project });
  } else {
    res.status(404).send("Project tidak ditemukan");
  }
});

app.post("/blog", upload.single("image"), (req, res) => {
  const { title, desk, start, end } = req.body;
  let blog = {
    title,
    desk,
    start,
    end,
    image: req.file ? "/assets/uploads/" + req.file.filename : null,
    duration: calculateDuration(start, end),
  };
  adblog.push(blog);
  res.redirect("/");
});

app.get("/edit/:index", (req, res) => {
  const index = req.params.index;
  const project = adblog[index];
  res.render("edit", { project, index });
});

app.post("/edit/:index", upload.single("image"), (req, res) => {
  const index = req.params.index;
  const { title, desk, start, end } = req.body;
  adblog[index].title = title;
  adblog[index].desk = desk;
  adblog[index].start = start;
  adblog[index].end = end;
  if (req.file) {
    adblog[index].image = "/assets/uploads/" + req.file.filename;
  }
  adblog[index].duration = calculateDuration(start, end);
  res.redirect("/");
});

app.post("/delete/:index", (req, res) => {
  const index = req.params.index;
  if (index > -1) {
    adblog.splice(index, 1);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
