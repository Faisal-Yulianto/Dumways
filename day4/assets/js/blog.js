let dataBlog = [];
function addBlog(event){
    event.preventDefault();
    let title = document.getElementById("title").value
    let desk = document.getElementById("desk").value
    let startDate = document.getElementById("start").value
    let endDate = document.getElementById("end").value

    let blog = {
        title,
        desk,
        startDate,
        endDate,
    }
    dataBlog.push(blog);
    renderBlog()
    document.getElementById("title").value= ""
    document.getElementById("desk").value=""
    document.getElementById("start").value=""
    document.getElementById("end").value=""
}
function deleteBlog(index) {
    dataBlog.splice(index, 1);
    renderBlog();
}


function renderBlog(){
    document.getElementById("content").innerHTML = "";
        for(let i = 0 ; i<dataBlog.length; i++){
            document.getElementById("content").innerHTML += `   
                <div class="card" id="card">
                    <a href="detail.html">
                    <img src="assets/image/produk1.jpg">
                    </a>
                     <div class="title">
                        <h2>${dataBlog[i].title}</h2>
                    </div>
                     <div class="time">
                        <p>Durasi : ${dataBlog[i].startDate} Sampai ${dataBlog[i].endDate}</p>
                    </div>
                    <div class="desk">
                        <p>${dataBlog[i].desk}</p>
                    </div>
                    <div class="grop-button">
                        <button>Edit</button>
                        <button onclick="deleteBlog(${i})">Delete</button>
                    </div>
            
                 </div>
       `;
        }

}



