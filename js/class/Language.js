class Language {
    lettersGroups = []
    patterns = []
    wordCount = 10
    words = []

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
            this.currentWordCount = this.wordCount
            const maxUniqueCombinations = patternLetters.reduce((acc, letter) => acc * (this.lettersGroups[letter] ? this.lettersGroups[letter].length : 0), 1)

            if (maxUniqueCombinations < this.currentWordCount) {
                console.warn(`Maximum unique words for pattern "${pattern}" is ${maxUniqueCombinations}. Adjusting word count.`)
                this.currentWordCount = maxUniqueCombinations
            }

            const wordsSet = new Set()
            let attempts = 0
            const maxAttempts = this.currentWordCount * 10

            for (let i = 0; i < this.currentWordCount && attempts < maxAttempts; i++) {
                let word = patternLetters.map((patternLetter) => this.getRandomLetter(this.lettersGroups[patternLetter])).join("")

                if (wordsSet.has(word)) {
                    i--
                    attempts++
                    continue
                }

                wordsSet.add(word)
            }

            this.words[pattern] = Array.from(wordsSet).sort()
        })
    }

    getRandomLetter(letters) {
        return letters[Math.floor(Math.random() * letters.length)]
    }
}

export default Language
