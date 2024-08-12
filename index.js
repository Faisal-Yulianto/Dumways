// Import module yang diperlukan
const express = require("express");
const path = require("path");
const hbs = require('hbs');
const fs = require("fs");
const { Sequelize } = require("sequelize");
const { Blog, User } = require("./models"); 
const session = require("express-session");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const upload = require("./middleware/upload");
const app = express();
const port = 3000;

// --- Setup ---
app.set("view engine", "hbs"); // Set view engine to Handlebars
app.set("views", path.join(__dirname, "views")); // Set views directory

// Setup folder statis untuk assets
app.use("/assets", express.static("assets"));
app.use(express.json()); // Middleware untuk parsing JSON
app.use(express.urlencoded({ extended: false })); // Middleware untuk parsing form data

// Setup session middleware
app.use(
  session({
    secret: "your_secret_key", // Kunci rahasia untuk session
    resave: false,
    saveUninitialized: false,
  })
);

// Setup flash middleware
app.use(flash());

// Middleware untuk menyimpan flash message di local variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.session = req.session;
  next();
});

// --- Helper Functions ---
/**
 * Menghitung durasi antara dua tanggal.
 * @param {Date} start - Tanggal mulai.
 * @param {Date} end - Tanggal akhir.
 * @returns {string} - Durasi dalam hari, bulan, atau tahun.
 */
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

// --- Register Helper `includes` ---
hbs.registerHelper('includes', function(array, value) {
  return array && array.includes(value);
});

// --- Routes ---

// Rute untuk menampilkan semua blog di halaman utama
app.get("/", async (req, res) => {
  let adblog;
  if (req.session.userId) {
    // Jika user login, tampilkan proyek yang dibuat oleh user tersebut
    adblog = await Blog.findAll({
      where: { userId: req.session.userId },
      include: [{ model: User, as: 'author' }]
    });
  } else {
    // Jika user tidak login, tampilkan semua proyek
    adblog = await Blog.findAll({
      include: [{ model: User, as: 'author' }]
    });
  }
  adblog = adblog.map(blog => {
    blog.technologies = blog.technologies ? blog.technologies.split(',') : [];
    return blog;
  });
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

// Rute untuk menampilkan detail blog berdasarkan id
app.get("/blog/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findByPk(id, {
    include: [{ model: User, as: 'author' }] // Sertakan data user sebagai penulis
  });

  if (blog) {
    blog.technologies = blog.technologies ? blog.technologies.split(',') : [];
    res.render("blog-detail", { project: blog });
  } else {
    res.status(404).send("Blog tidak ditemukan");
  }
});

// Rute untuk menampilkan halaman testimonial
app.get("/testi", (req, res) => {
  res.render("testi");
});

// Rute untuk menampilkan detail sebuah blog berdasarkan id
app.get("/detail/:id", async (req, res) => {
  const id = req.params.id;
  const project = await Blog.findByPk(id, {
    include: [{ model: User, as: 'author' }] // Sertakan data penulis
  });

  if (project) {
    project.technologies = project.technologies ? project.technologies.split(',') : [];
    res.render("detail", { project });
  } else {
    res.status(404).send("Project tidak ditemukan");
  }
});

// Rute untuk menampilkan halaman register
app.get("/register", (req, res) => {
  res.render("register");
});

// Rute untuk menampilkan halaman login
app.get("/login", (req, res) => {
  res.render("login");
});

// Rute untuk logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out.");
    }
    res.redirect("/login");
  });
});

// Rute untuk menampilkan blog berdasarkan userId
app.get("/user/:userId/blogs", async (req, res) => {
  const userId = req.params.userId;
  const userWithBlogs = await User.findByPk(userId, {
    include: [{
      model: Blog,
      as: 'blogs'
    }]
  });

  if (userWithBlogs) {
    res.render("user-blogs", { user: userWithBlogs });
  } else {
    res.status(404).send("User tidak ditemukan");
  }
});

// Rute untuk registrasi user
app.post("/register", async (req, res) => {
  const { email, password, username } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      req.flash("error_msg", "Email sudah pernah dipakai.");
      return res.redirect("/register");
    }
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    req.flash("success_msg", "Registrasi berhasil! Silakan login.");
    res.redirect("/login");
  } catch (error) {
    req.flash("error_msg", "Error registering new user.");
    res.redirect("/register");
  }
});

// Rute untuk login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.userId = user.id;
    req.flash("success_msg", "Login berhasil!");
    res.redirect("/");
  } else {
    req.flash("error_msg", "Invalid username or password.");
    res.redirect("/login");
  }
});

// Rute untuk menambahkan blog baru
app.post("/blog", upload.single("image"), async (req, res) => {
  const { title, desk, start, end, technologies } = req.body;
  const techList = technologies ? technologies.join(',') : '';
  if (!req.session.userId) {
    req.flash("error_msg", "Anda harus login untuk membuat blog.");
    return res.redirect("/login");
  }

  let blog = {
    title,
    desk,
    start,
    end,
    image: req.file ? "/assets/uploads/" + req.file.filename : null,
    duration: calculateDuration(start, end),
    technologies: techList,
    userId: req.session.userId,  // Mengambil userId dari session
  };

  try {
    await Blog.create(blog);
    res.redirect("/");
  } catch (error) {
    console.error("Error creating blog:", error);
    req.flash("error_msg", "Error creating blog.");
    res.redirect("/blog");
  }
});

// Rute untuk menampilkan halaman edit sebuah blog berdasarkan id
app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const project = await Blog.findByPk(id);
  if (project) {
    const technologiesArray = project.technologies ? project.technologies.split(',') : [];
    res.render("edit", { project, technologies: ['node', 'react', 'next', 'typescript'], selectedTechnologies: technologiesArray });
  } else {
    res.status(404).send("Project tidak ditemukan");
  }
});

// Rute untuk mengupdate blog yang sudah ada
app.post("/edit/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const { title, desk, start, end, technologies } = req.body;
  const techList = technologies ? technologies : [];

  try {
    let blog = await Blog.findByPk(id);
    
    if (!blog) {
      return res.status(404).send("Blog tidak ditemukan");
    }
    
    blog.title = title;
    blog.desk = desk;
    blog.start = start;
    blog.end = end;
    blog.technologies = techList.join(','); // Update teknologi
    blog.duration = calculateDuration(start, end);

    if (req.file) {
      blog.image = "/assets/uploads/" + req.file.filename;
    }

    await blog.save();
    res.redirect("/");
  } catch (error) {
    console.error("Error updating blog:", error);
    req.flash("error_msg", "Error updating blog.");
    res.redirect(`/edit/${id}`);
  }
});

// Rute untuk menghapus blog berdasarkan id
app.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await Blog.destroy({ where: { id } });
  res.redirect("/");
});

// Middleware untuk melindungi rute
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
};
// Menjalankan server pada port yang ditentukan
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



