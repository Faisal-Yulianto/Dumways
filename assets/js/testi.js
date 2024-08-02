
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
      testiShow += ` <div class="card p-3 m-3" style="width: 25rem; ">
        <img src="${testimonial.image}" class="card-img-top" style="height: 15rem;>
        <div class="card-body">
          <p class="card-text">${testimonial.content}</p>
          <p class="card-text text-end">${testimonial.author}</p>
        </div>
      </div> `;
  });
  document.getElementById("testi").innerHTML = testiShow;
}

async function ratingTesti(rating) {
  const testimonials = await fetchData();
  const filterRating = testimonials.filter(testimonial => testimonial.rating == rating);
  let ratingShow = "";
  filterRating.forEach(testimonial => {
      ratingShow += ` <div class="card p-3 m-3" style="width: 25rem;">
        <img src="${testimonial.image}" class="card-img-top" style="height: 15rem;>
        <div class="card-body">
          <p class="card-text">${testimonial.content}</p>
          <p class="card-text text-end">${testimonial.author}</p>
        </div>
      </div>
 `;
  });
  document.getElementById("testi").innerHTML = ratingShow;
}

alltesti();
