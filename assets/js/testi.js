// ham-button
const btn = document.getElementById("hamIcon");
const navHam = document.getElementById("hamList");
btn.addEventListener("click", function () {
  navHam.classList.toggle("show");
});

class testi {
  constructor(image, content, author) {
    this.image = image;
    this.content = content;
    this.author = author;
  }

  ShowCard() {
    return ` <div class="card">
                <img src="${this.image}">
                <p class="content">${this.content}</p>
                <p class="author">${this.author}</p>
                 </div> `;
  }
}
const testimoni1 = new testi(
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/07483e42-e81b-4d18-91ca-6235775e2063/dftgnf6-8e6482d2-531d-48b5-a71c-067ae0e0291e.png/v1/fill/w_1192,h_670,q_70,strp/makima_by_afrolein_dftgnf6-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzIwIiwicGF0aCI6IlwvZlwvMDc0ODNlNDItZTgxYi00ZDE4LTkxY2EtNjIzNTc3NWUyMDYzXC9kZnRnbmY2LThlNjQ4MmQyLTUzMWQtNDhiNS1hNzFjLTA2N2FlMGUwMjkxZS5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19._foZtr-mixoKVoew7IMbvQ78Ymke7q_Dn-97hTRNYIA",
  "keren sekali",
  "- faisal yulianto"
);
const testimoni2 = new testi(
  "https://rare-gallery.com/mocahbig/57314-Makima-Chainsaw-ManMakima-Chainsaw-Man-HD-Wallpaper.jpg",
  "keren sekali websitenya",
  "- ujang"
);

const testim = [testimoni1, testimoni2];
let testihtml = "";
for (let i = 0; i < testim.length; i++) {
  testihtml += testim[i].ShowCard();
}
document.getElementById("testi").innerHTML = testihtml;
