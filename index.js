// Import module yang diperlukan
const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { Sequelize } = require("sequelize");
const { Blog } = require("./models"); // Import Blog model
const session = require("express-session");
const bcrypt = require("bcrypt");
const { User } = require("./models");
const app = express();
const port = 3000;

// Setup view engine dan folder views
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Setup folder statis
app.use("/assets", express.static("assets"));
app.use(express.json());

// Middleware untuk parsing form data
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

// Buat folder untuk upload jika belum ada
const uploadDir = path.join(__dirname, "assets/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi multer untuk penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Fungsi untuk menghitung durasi antara dua tanggal
const calculateDuration = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const durationMs = endDate - startDate;
  const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));

  if (durationDays < 30) {
    return `${durationDays} hari`;
  } else if (durationDays < 365) {
    const months = Math.floor(durationDays / 30);
    return `${months} bulan`;
  } else {
    const years = Math.floor(durationDays / 365);
    return `${years} tahun`;
  }
};

// Rute untuk menampilkan semua blog di halaman utama
app.get("/", async (req, res) => {
  const adblog = await Blog.findAll();
  res.render("index", { adblog });
});

// Rute untuk menampilkan halaman contact
app.get("/contact", (req, res) => {
  res.render("contact");
});

// Rute untuk menampilkan semua blog di halaman blog
app.get("/blog", async (req, res) => {
  const adblog = await Blog.findAll();
  res.render("blog", { adblog });
});

// Rute untuk menampilkan halaman testimonial
app.get("/testi", (req, res) => {
  res.render("testi");
});

// Rute untuk menampilkan detail sebuah blog berdasarkan id
app.get("/detail/:id", async (req, res) => {
  const id = req.params.id;
  console.log(`Fetching project with ID: ${id}`);
  
  const project = await Blog.findByPk(id);
  
  if (project) {
    res.render("detail", { project });
  } else {
    console.log(`Project with ID: ${id} not found`);
    res.status(404).send("Project tidak ditemukan");
  }
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out.");
    }
    res.redirect("/login");
  });
});
app.post("/register", async (req, res) => {
  const { email, password,username } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send("Email sudah pernah dipakai.");
    }
    await User.create({
      username,
      email,
      password: hashedPassword
    });
    res.redirect("/login");
  } catch (error) {
    res.status(500).send("Error registering new user.");
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user.id;
    res.redirect("/");
  } else {
    res.status(401).send("Invalid username or password.");
  }
});

// Rute untuk menambahkan blog baru
app.post("/blog", upload.single("image"), async (req, res) => {
  const { title, desk, start, end } = req.body;
  let blog = {
    title,
    desk,
    start,
    end,
    image: req.file ? "/assets/uploads/" + req.file.filename : null,
    duration: calculateDuration(start, end),
  };
  await Blog.create(blog);
  res.redirect("/");
});

// Rute untuk menampilkan halaman edit sebuah blog berdasarkan id
app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const project = await Blog.findByPk(id);
  res.render("edit", { project, id });
});

// Rute untuk mengupdate blog yang sudah ada
app.post("/edit/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const { title, desk, start, end } = req.body;
  let blog = await Blog.findByPk(id);
  blog.title = title;
  blog.desk = desk;
  blog.start = start;
  blog.end = end;
  if (req.file) {
    blog.image = "/assets/uploads/" + req.file.filename;
  }
  blog.duration = calculateDuration(start, end);
  await blog.save();
  res.redirect("/");
});

// Rute untuk menghapus blog berdasarkan id
app.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await Blog.destroy({ where: { id } });
  res.redirect("/");
});
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
};
app.use("/protected", requireAuth, (req, res) => {
  res.send("This is a protected route.");
});

// Menjalankan server pada port yang ditentukan
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


