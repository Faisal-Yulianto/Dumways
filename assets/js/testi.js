// ham-button
const btn = document.getElementById("hamIcon");
const navHam = document.getElementById("hamList");
btn.addEventListener("click", function () {
  navHam.classList.toggle("show");
});

const testimonials = [
  {
    image: "https://4kwallpapers.com/images/walls/thumbs_3t/15442.jpg",
    author: "- Faisal Yulianto",
    content: "jelek",
    rating: "1",
  },
  {
    image:
      "https://rare-gallery.com/mocahbig/57314-Makima-Chainsaw-ManMakima-Chainsaw-Man-HD-Wallpaper.jpg",
    author: "- joni",
    content: "biasa aja",
    rating: "2",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT-AHCcZgcQ5QaQdMB-9fdyn-6ogU3BGhROO647Fkwmn0URy4&s",
    author: "- asep",
    content: "lumayan",
    rating: "3",
  },
  {
    image:
      "https://4kwallpapers.com/images/walls/thumbs_3t/16561.jpg",
    author: "- udin",
    content: "keren websitenya",
    rating: "4",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR90_0zEvq6JKTsEKCr5nxdPmDL4zZyag-Ta4hSLsR3qhjLTLOC&s",
    author: "- sentot",
    content: "keren sekali websitenya",
    rating: "5",
  },
];
function alltesti() {
  let testiShow = "";
  testimonials.forEach((testimonial) => {
    testiShow += ` <div class="card">
                <img src="${testimonial.image}">
                <p class="content">${testimonial.content}</p>
                <p class="author">${testimonial.author}</p>
                 </div> `;
  });

  document.getElementById("testi").innerHTML = testiShow;
}
alltesti();

function ratingTesti(rating) {
  const filterRating = testimonials.filter(testimonial=> {
    return testimonial.rating == rating;
  });
  let ratingShow = "";
  filterRating.forEach(testimonial => {
    ratingShow += ` <div class="card">
                <img src="${testimonial.image}">
                <p class="content">${testimonial.content}</p>
                <p class="author">${testimonial.author}</p>
                 </div> `;
  });
  document.getElementById("testi").innerHTML = ratingShow;
}
