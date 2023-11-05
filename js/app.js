// fetch('../resource/letters.json')
//     .then((response) => response.json())
//     .then((json) => console.log(json));

const form = document.querySelector('#form')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    let formData = new FormData(form)

    let vowels = formData.getAll('vowels')
    let consonants = formData.getAll('consonants')
    let fricatives = formData.getAll('fricatives')
    let approximants = formData.getAll('approximants')

    let pattern = formData.get('pattern').split('')

    let word = [];
    pattern.forEach(letter => {
        if(letter === 'V'){
            word.push(vowels[Math.floor(Math.random() * vowels.length)])
        }
        if(letter === 'C'){
            word.push(consonants[Math.floor(Math.random() * consonants.length)])
        }
        if(letter === 'F'){
            word.push(fricatives[Math.floor(Math.random() * fricatives.length)])
        }
        if(letter === 'A'){
            word.push(approximants[Math.floor(Math.random() * approximants.length)])
        }
    });

    console.log(word.join(''))
});