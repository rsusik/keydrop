
// const words = ["ABC", "BCD", "CAAAAAA", "CAB", "CABBBB", "FGH", "JKL", "ZKL"];

let findBoudaries = (words, prefix, start, end) => {

    let middle = Math.round((start + end)/2)

    // match
    if ( prefix.localeCompare(words[middle].substring(0, prefix.length)) == 0 ) {
        let boundaryStart = middle;
        let boundaryEnd = middle;
        let i = middle;
        while (i >= 0 && prefix.localeCompare(words[i].substring(0, prefix.length)) == 0) {i--;}
        boundaryStart = i + 1; i = middle;
        while (i < words.length && prefix.localeCompare(words[i].substring(0, prefix.length)) == 0) {i++;}
        boundaryEnd = i - 1;
        return {
            start: boundaryStart,
            end: boundaryEnd
        }
    // search on the left side
    } else if( prefix.localeCompare(words[middle].substring(0, prefix.length)) < 0 ) {
        return findBoudaries(words, prefix, start, middle-1)
    // search on the right side
    } else {
        return findBoudaries(words, prefix, middle, end)
    }
}

const findNext = function (words, prefix, start, end) {
    if ( (words.length == 0) || (start == end && prefix.localeCompare(words[start].substring(0, prefix.length)) != 0) ) {
        return {
            start: -1,
            end: -1,
            words: [],
            letters: new Set()
        }
    }

    let middle = Math.round((start + end)/2)
    // match
    if ( prefix.localeCompare(words[middle].substring(0, prefix.length)) == 0 ) {
        let boundaryStart = middle;
        let boundaryEnd = middle;
        let i = middle - 1;
        let nextWords = new Set();
        let nextLetters = new Set();
        nextWords.add(words[middle]);
        if (words[middle].length > prefix.length)
            nextLetters.add(words[middle][prefix.length])
        while (i >= 0 && prefix.localeCompare(words[i].substring(0, prefix.length)) == 0) {
            nextWords.add(words[i]);
            if (words[i].length > prefix.length)
                nextLetters.add(words[i][prefix.length])
            i--;
        }
        boundaryStart = i + 1; i = middle + 1;
        while (i < words.length && prefix.localeCompare(words[i].substring(0, prefix.length)) == 0) {
            nextWords.add(words[i]);
            if (words[i].length > prefix.length)
                nextLetters.add(words[i][prefix.length])
            i++;
        }
        boundaryEnd = i - 1;
        return {
            start: boundaryStart,
            end: boundaryEnd,
            words: nextWords,
            letters: nextLetters
        }
    // search on the left side
    } else if( prefix.localeCompare(words[middle].substring(0, prefix.length)) < 0 ) {
        return findNext(words, prefix, start, middle-1)
    // search on the right side
    } else {
        return findNext(words, prefix, middle, end)
    }
}

// for (word of words) {
//     console.log(word.substring(0, 2))
//     let res = findNext(words, word.substring(0, 2), 0, words.length)
//     console.log(res)
//     for (letter of res.letters) {
//         console.log(letter)
//     }
//     for (w of res.words) {
//         console.log(w)
//     }
// }

export default {
    findNext: findNext
}