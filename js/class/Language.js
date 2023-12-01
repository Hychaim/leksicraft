class Language {
    lettersGroups = []
    patterns = []
    wordCount = 10
    wordsData = []

    constructor(lettersGroups, patterns, wordCount) {
        this.lettersGroups = lettersGroups
        this.patterns = patterns
        this.wordCount = wordCount
        this.generateWords()
    }

    generateWords() {
        if (Object.values(this.lettersGroups).flat().length === 0 || this.patterns.length === 0 || this.wordCount <= 0) {
            console.error("No letters groups, patterns or word count provided")
            return
        }

        this.patterns.forEach((pattern) => {
            const patternLetters = pattern.split("")
            let currentWordCount = this.wordCount
            const uniqueCombinationsCount = patternLetters.reduce((acc, letter) => acc * (this.lettersGroups[letter] ? this.lettersGroups[letter].length : 0), 1)

            if (uniqueCombinationsCount < currentWordCount) {
                console.warn(`Maximum unique words for pattern "${pattern}" is ${uniqueCombinationsCount}. Adjusting word count.`)
                currentWordCount = uniqueCombinationsCount
            }

            const wordsSet = new Set()
            let attempts = 0
            const maxAttempts = currentWordCount * 10

            for (let i = 0; i < currentWordCount && attempts < maxAttempts; i++) {
                let word = patternLetters.map((patternLetter) => this.getRandomLetter(this.lettersGroups[patternLetter])).join("")

                if (wordsSet.has(word)) {
                    i--
                    attempts++
                    continue
                }

                wordsSet.add(word)
            }

            this.wordsData[pattern] = {}
            this.wordsData[pattern].uniqueCombinationsCount = uniqueCombinationsCount
            this.wordsData[pattern].words = Array.from(wordsSet).sort()
        })
    }

    getRandomLetter(letters) {
        return letters[Math.floor(Math.random() * letters.length)]
    }
}

export default Language
