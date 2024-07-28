// ham-button
const btn = document.getElementById("hamIcon");
const navHam = document.getElementById("hamList");
btn.addEventListener("click", function () {
  navHam.classList.toggle("show");
});

const fetchData = async () => {
  try {
      const response = await fetch('https://api.npoint.io/f8e175eb86db16937ba2'); // URL JSON yang benar
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching data:', error);
      return [];
  }
};

async function alltesti() {
  const testimonials = await fetchData();
  let testiShow = "";
  testimonials.forEach((testimonial) => {
      testiShow += ` <div class="card">
              <img src="${testimonial.image}" alt="Testimonial Image">
              <p class="content">${testimonial.content}</p>
              <p class="author">${testimonial.author}</p>
               </div> `;
  });
  document.getElementById("testi").innerHTML = testiShow;
}

async function ratingTesti(rating) {
  const testimonials = await fetchData();
  const filterRating = testimonials.filter(testimonial => testimonial.rating == rating);
  let ratingShow = "";
  filterRating.forEach(testimonial => {
      ratingShow += ` <div class="card">
              <img src="${testimonial.image}" alt="Testimonial Image">
              <p class="content">${testimonial.content}</p>
              <p class="author">${testimonial.author}</p>
               </div> `;
  });
  document.getElementById("testi").innerHTML = ratingShow;
}

alltesti();
