<template>
  <q-layout view="hHh lpR fFf" >
    <q-page-container class="q-px-md">
      <div v-if="gameFinished">
        <div class="counter-wrapper">
          <div class="counter">
            THE END
          </div>
        </div>
      </div>
      <div v-else>
        <div class="top-controls">
          <q-linear-progress size="30px" :value="testProgress" color="accent" class="q-mt-sm">
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="accent" :label="testProgressLabel" />
            </div>
          </q-linear-progress>
          <q-linear-progress size="30px" :value="sentenceProgress" color="accent" class="q-mt-sm">
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="accent" :label="sentenceProgressLabel" />
            </div>
          </q-linear-progress>
        </div>

        <q-card flat bordered>
          <!--q-card-section  class="text-grey">
            Type text using below keyboard 
          </q-card-section-->
          <q-card-section style="font-size: 2em;" v-html="sentenceDisp" v-if="sentence && sentence.length > 0" />
        </q-card>

        <div class="counter-wrapper" v-if="startGameDelayCounter>=0">
          <div class="counter" v-if="startGameDelayCounter>1">
            Ready
          </div>
          <div class="counter" v-if="startGameDelayCounter>=0 && startGameDelayCounter<=1">
            GO!
          </div>
        </div>
      </div>

      <div v-if="isError">
        <div class="is-error">
          <div class="counter" style="color:red;">
            !
          </div>
        </div>
      </div>

    </q-page-container>

    <q-footer class="footer">
      <q-toolbar>
        <q-toolbar-title>
          <KeydropKeyboard ref="keydropKeyboard" v-model="text" v-on:keypressed="logKey($event)" v-on:wordpressed="logWord($event)" v-if="gamemode == 'keydrop'" />
          <NormalKeyboard  ref="normalKeyboard" v-model="text" v-on:keypressed="logKey($event)" v-on:wordpressed="logWord($event)" v-else />
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { useQuasar } from 'quasar'
import { defineComponent, ref } from 'vue'
import bsearch from '../bsearch'
const axios = require('axios');
import KeydropKeyboard from './KeydropKeyboard.vue'
import NormalKeyboard from './NormalKeyboard.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    KeydropKeyboard,
    NormalKeyboard
  },

  setup () {
    return {
    }
  },

  data() {
    return {
      text: '',
      startGameDelayCounter: 3, // counts the time to start
      startGameDelayInterval: undefined,
      refreshControlsInterval: undefined,
      sentenceIdx: -1,
      pressedKeys: [],
      completedSentences: [],
      gameFinished: false,
      startTime: 0,
      gameTimeStart: 0,
      gameTimeStop: 0,
      sentenceTimeStart: 0,
      sentenceTimeStop: 0,
      sentenceTimeElapsed: 0,
      testTimeElapsed: 0,
      sentence: undefined,
      gamemode: undefined,
    }
  },

  computed: {
    viewportHeight: function () {
      return this.$q.screen.height - this.getFooterSize()
    },

    testProgressLabel: function () {
      return 'Test progress: 🕑 ' + this.testTimeDisp +  's | ' + (this.sentenceIdx > -1 ? this.sentenceIdx : 0) + '/' + this.sentences.length + ' (' + (this.testProgress*100).toFixed(0) + '%)'
    },

    testProgress: function () {
      return this.sentenceIdx > -1 ? this.sentenceIdx / this.sentences.length : 0
    },

    sentenceProgressLabel: function () {
      return 'Round progress: 🕑 ' + this.sentenceTimeDisp +  's | ' + (this.sentenceProgress*100).toFixed(0) + '%'
    },

    sentenceProgress: function () {
      return this.sentence ? this.correctCharacters() / this.sentence.length : 0
    },

    testTimeDisp: function () {
      return this.testTimeElapsed ? this.testTimeElapsed.toFixed(1) : 0
    },

    sentenceTimeDisp: function () {
      return this.sentenceTimeElapsed ? this.sentenceTimeElapsed.toFixed(1) : 0
    },

    isError: function() {
      return this.correctCharacters() < this.text.length ? true : false
    },

    sentenceDisp: function () {
      let sentence = this.sentence.toLowerCase()
      let text = this.text.toLowerCase()
      let st = '<span style="color:black; background-color:lightgreen;">'
      let i = this.correctCharacters()
      st += sentence.substr(0, i) + '</span>'
      if (i < text.length) {
        st += '<span style="background-color:red">' + sentence.substr(i, text.length-i) + '</span>'
        i = text.length
      }
      st += '<span style="color:#aaa">'+sentence.substr(i, sentence.length - i)+'</span>'
      return st
    }
  },

  deactivated() {
  },

  unmounted() {
    console.log('unmounted')
    this.resetState()
  },

  created() {
    this.gamemode = this.$route.params.mode ?? 'keydrop'
    this.sentences = [
      // 'this is',
      // 'the',
      // 'here',
      'Which form of transport do you prefer to use',
      'Every month I spend hundreds of dollars on gas insurance and repairs',
      'An irrevocable letter of credit ensures that the seller gets paid in time',
      'And since you are already a valued customer there should be no trouble in processing you application for this loan',
      'Would you prefer helping with the writing part or is programming more your thing',
      'We could hire a car and travel around the interior of Australia for several days',
      'All of your coursework is important including everything from attendance and homework to all of your test results for the semester',
      'It happened at the crossing just behind his house',
      'Your professor has placed this book on reserve',
      'I make around one hundred thousand dollars per year'
    ]
    this.startGameDelayCounter = 3
    this.gameFinished = false
    this.pressedKeys = []
    this.sentenceIdx = -1
    this.gameTimeStart = undefined
    this.gameTimeStop = undefined
    this.sentenceTimeStart = undefined
    this.sentenceTimeStop = undefined
    this.sentenceTimeElapsed = 0
    this.testTimeElapsed = 0
    this.completedSentences = []
    this.refreshControlsInterval = setInterval(() => {
        this.refreshControls()
    }, 100)

    this.startGameDelayInterval = setInterval(() => {
      this.startGameDelayCounter--
      if (this.startGameDelayCounter < 0) {
        clearInterval(this.startGameDelayInterval)
        this.gameStart()
      }
    }, 1000)
  },

  mounted() {
  },

  methods: {

    correctCharacters: function () {
      if (this.sentence == undefined || this.text == undefined) {
        return 0
      }
      let sentence = this.sentence.toLowerCase()
      let text = this.text.toLowerCase()
      let i = 0
      while(sentence[i] == text[i] && i < sentence.length && i < text.length) {i++}
      return i
    },

    resetKeyboard: function() {
      for (let el of [this.$refs.keyboard, this.$refs.keydropKeyboard, this.$refs.normalKeyboard]) {
        if (el != undefined) {
          el.reset()
        }
      }
    },

    refreshControls: function() {
      this.sentenceTimeElapsed = (Date.now() - this.sentenceTimeStart)/1000
      this.testTimeElapsed = (Date.now() - this.gameTimeStart)/1000
    },
    
    nextSentence: function() {
      // append current sentence score to list
      if (this.sentenceIdx > -1) {
        this.sentenceTimeStop = Date.now()
        this.completedSentences.push({
          'sentence': this.sentence,
          'text': this.text,
          'startTime': this.sentenceTimeStart,
          'endTime': this.sentenceTimeStop,
          'pressedKeys': this.pressedKeys
        })
      }
      // clean variables
      this.pressedKeys = []
      this.sentenceTimeStop = undefined
      this.sentenceTimeStart = undefined
      // this.$root.$emit('keydrop-reset')
      this.resetKeyboard()
      if (this.sentenceIdx < this.sentences.length-1) {
        // start next
        this.sentenceIdx++
        this.sentence = this.sentences[this.sentenceIdx]
        this.sentenceTimeStart = Date.now()
      } else {
        // display finish screen
        this.gameFinished = true
        // finish the test
        this.gameEnd()
      }
    },
    
    logKey: function(key) {
      // append key to the list
      this.pressedKeys.push({
        'key': {
          'key': key.key, 
          'label': key.label, 
          'original_key': key.original_key,
          'original_label': key.original_label
        }, 
        'expected_key': this.sentence[this.text.length-1],
        'time': Date.now(),
        // 'text': this.text, 
        // 'sentence': this.sentence
      })
      // check if the sentence is completed
      if (this.text.toLowerCase() == this.sentence.toLowerCase()) {
        this.nextSentence()
      }
    },
    
    logTestScore: function() {
      // get the previous results
      let tests = localStorage.getItem('tests')
      if (tests == undefined) {
        tests = []
      } else {
        tests = JSON.parse(tests)
      }
      // append current
      tests.push({
        mode: this.gamemode,
        startTime: this.gameTimeStart,
        endTime: this.gameTimeStop,
        sentences: Object.assign([], this.completedSentences),
      })
      localStorage.setItem('tests', JSON.stringify(tests))
      // clean variables
      this.gameTimeStart = undefined
      this.gameTimeStop = undefined
      this.completedSentences = undefined
    },

    resetState: function() {
      console.log('resetState')
      clearInterval(this.refreshControlsInterval)
      clearInterval(this.startGameDelayInterval)
      this.gameFinished = false
    },
    
    gameEnd: function() {
      console.log('gameEnd')
      if (this.gameFinished == true) {
        console.log('gameEnd inside if')
        this.gameTimeStop = Date.now()
        // save the result
        this.logTestScore()
        // and after 2 seconds move to main menu
        setTimeout(() => {
          // reset state
          this.resetState()
          this.$router.push('/')
        }, 2000)
      }
      
    },

    gameStart: function() {
      this.gameTimeStart = Date.now()
      this.nextSentence()
    },

    getFooterSize: function() {
      return document.getElementsByClassName('q-footer')[0].getBoundingClientRect().height
    },

    

    // getRandomWord: function() {
    //   let num = Math.random();
    //   // TODO: bsearch
    //   for (let i = 0; i < this.words.probs.length; i++) {
    //     if (this.words.probs[i]>num) {
    //       return this.words.words[i]
    //     }
    //   }
    // },

  },

})
</script>
<style>
:root {
  --gametime: 120s;
  --fallingInterval: 0.8s;
  --progess-title-width: 40pt;
  --score-width: 50pt;
}
.top-controls {
  position: relative;
  margin-top: 6pt;
  vertical-align: bottom;
  display: block;
  overflow: auto;
  background-color: white;
  z-index: 5;
  border-bottom: 1px solid #eee;
  padding-bottom: 4pt;
}
.progressbar-title {
  width: var(--progess-title-width);
  float: left;
  margin-top: 8pt;
}
.progressbar-wrapper {
  margin-top: calc(0.2rem + 8pt);
  background-color: #efe;
  height: 10pt;
  border: 1pt solid grey;
  border-radius: 5pt;
  overflow: hidden;
  float: left;
  width: calc(100vw - var(--progess-title-width) - var(--score-width) - 40pt);
}
.progressbar {
  background-color: #2d2;
  transition: var(--gametime);
  transition-timing-function: linear;
  transition-delay: 1s;
  height: 10pt;
  width: 0%;
}
.score {
  width: var(--score-width);
  text-align: center;
  float: right;
}
.score-positive {
  color: #0a0;
}
.score-negative {
  color: #a00;
}
.complete {
  width: 100%;
  background-color: red;
}
.is-error {
  display: flex;
  align-items: center;
  vertical-align: middle;
  justify-content: center;
}
.counter-wrapper {
  display: flex;
  align-items: center;
  vertical-align: middle;
  justify-content: center;
  height: 65vh;
}
.counter {
  align-items: center;
  font-size: 5rem; /*20rem;*/
  text-align: center;
  vertical-align: middle;
  color: #57e;
}
.words {
  z-index: 0;
}
.word {
  z-index: 0;
  position: absolute;
  border: 2pt solid transparent;
  border-radius: 5pt;
  padding: 2pt 8pt;
  ttransition-timing-function: linear;
  /*transition: 1.5s ease border, 1.5s ease background, 1.5s ease color;*/
  transition: 1.5s ease, top var(--fallingInterval) linear;
  color: transparent;
  background: transparent;
}
.word.normal {
  border: 2pt solid #afa;
  color: black;
  background: linear-gradient(#fff, #eee);
}
.word.warning {
  border: 2pt solid #ee0;
  color: black;
  background: linear-gradient(#fff, #eee);
  font-weight:bold;
}
.word.danger {
  border: 2pt solid red;
  color: black;
  background: linear-gradient(#fff, #eee);
  font-weight:bold;
}
.word.deleted {
  border: 2pt solid transparent;
  color: transparent;
  background: linear-gradient(#fff, #eee);
  bbackground: transparent;
}

</style>
