document.addEventListener('DOMContentLoaded', (event) => {
    async function performSearch() {
        const searchInput = document.getElementById('searchInput');
        const message = document.getElementById('message');
        const searchText = searchInput.value.trim();

        if (searchText === "") {
            searchInput.classList.add('error');
            message.textContent = "Please enter a word to search.";
            return;
        } else {
            searchInput.classList.remove('error');
            message.textContent = "";
        }

        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchText}`);
            if (!response.ok) {
                throw new Error('Word not found');
            }
            const data = await response.json();
            displayResult(data[0]);
        } catch (error) {
            message.textContent = error.message;
        }
    }

    function displayResult(data) {
        const disContainer = document.getElementById('disContainer');
        disContainer.innerHTML = '';

        const audioFiles = data.phonetics.map(phonetic => phonetic.audio).filter(audio => audio);

        const wordHtml = `
            <div class="section">
                <h1>${data.word}</h1>
                ${audioFiles.length > 0 ? `<button id="playAudio">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="10 8 16 12 10 16 10 8"></polygon>
                    </svg>
                </button>` : ''}
                <p>/${data.phonetic || 'N/A'}/</p>
            </div>
        `;

        disContainer.innerHTML = wordHtml;

        if (audioFiles.length > 0) {
            const playAudioButton = document.getElementById('playAudio');
            playAudioButton.addEventListener('click', () => {
                const audio = new Audio(audioFiles[0]);
                audio.play();
            });
        }

        const noun = data.meanings.find(meaning => meaning.partOfSpeech === 'noun');
        const verb = data.meanings.find(meaning => meaning.partOfSpeech === 'verb');

        if (noun) {
            const nounHtml = `
                <div class="noun">
                    <h3>noun</h3>
                    <p>Meaning</p>
                    <ol class="meanings">
                        ${noun.definitions.map(def => `<li>${def.definition}</li>`).join('')}
                    </ol>
                    <div class="synoms">
                        <p>synoms <span class="syn">${noun.synonyms.join(', ') || 'N/A'}</span></p>
                    </div>
                    <hr>
                </div>
            `;
            disContainer.innerHTML += nounHtml;
        }

        if (verb) {
            const verbHtml = `
                <div class="verb">
                    <h3>verb</h3>
                    <p>Meaning</p>
                    <ol class="meanings">
                        ${verb.definitions.map(def => `<li>${def.definition}</li>`).join('')}
                    </ol>
                    <hr>
                </div>
            `;
            disContainer.innerHTML += verbHtml;
        }
    }

    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', performSearch);
    } else {
        console.error('Element with class "search-icon" not found');
    }

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

});
