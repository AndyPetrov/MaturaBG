function filterSubjects() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const cards = document.querySelectorAll('.subject-card');

    cards.forEach(card => {
        const subjectName = card.querySelector('h3').textContent.toLowerCase();
        if (subjectName.includes(searchInput)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

document.getElementById('search-input').addEventListener('input', filterSubjects);