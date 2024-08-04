  document.getElementById('projectform').addEventListener('submit', function(event) {
    const title = document.getElementById('name').value.trim();
    const start = document.getElementById('start').value.trim();
    const end = document.getElementById('end').value.trim();
    const desk = document.getElementById('desk').value.trim();
    const image = document.getElementById('image').value.trim();
    
    if (!title || !start || !end || !desk || !image) {
      event.preventDefault();
      alert('Ada form yang masih kosong. Harap isi semua field.');
    }
  });



