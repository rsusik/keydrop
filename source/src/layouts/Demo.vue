<template>
  <q-layout view="hHh lpR fFf" >
    <div class="text-primary q-py-none q-my-none">
      <q-btn flat dense icon="arrow_back" label="Back" to="/" />
    </div>
    <q-page-container class="q-px-md q-pt-none q-mt-none">
      <div>
        <div class="top-controls">
          <q-linear-progress size="30px" :value="sentenceProgress" color="accent" class="q-mt-sm">
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="accent" :label="sentenceProgressLabel" />
            </div>
          </q-linear-progress>
        </div>

        <q-card flat bordered>
          <q-card-section style="font-size: 1.6em;" v-html="sentenceDisp" v-if="sentence && sentence.length > 0" />
        </q-card>
      </div>
      <q-banner
        v-if="!gameFinished"
        class="q-mx-md q-my-md bg-primary text-white rounded-borders">
        <template v-slot:avatar>
          <q-icon name="info" color="white" />
        </template>
        This is a demo. 
        The timing and progress is at the top of the screen. 
        The keyboard is at the bottom of the screen. 
        The aim of the test is to write the text as fast as possible.
      </q-banner>
      <q-banner
        v-if="gameFinished"
        class="q-mx-md q-my-md bg-secondary text-white rounded-borders">
        <template v-slot:avatar>
          <q-icon name="task_alt" color="white" />
        </template>
        Congratulation! You finished the demo. You can still exercise or leave the demo and start tests.
      </q-banner>

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
      refreshControlsInterval: undefined,
      sentenceTimeStart: 0,
      sentenceTimeStop: 0,
      sentenceTimeElapsed: 0,
      gameFinished: false,
      sentence: undefined,
      gamemode: undefined,
    }
  },

  computed: {
    viewportHeight: function () {
      return this.$q.screen.height - this.getFooterSize()
    },

    sentenceProgressLabel: function () {
      return 'Test (demo) progress: 🕑 ' + this.sentenceTimeDisp +  's | ' + (this.sentenceProgress*100).toFixed(0) + '%'
    },

    sentenceProgress: function () {
      return this.sentence ? this.correctCharacters() / this.sentence.length : 0
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
    this.sentence = 'the timing and progress is at the top and the keyboard is at the bottom of the screen and the aim of the test is to write the text as fast as possible'
    this.sentenceTimeStart = undefined
    this.sentenceTimeStop = undefined
    this.sentenceTimeElapsed = 0
    this.gameFinished = false
    this.gameStart()
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
    
    logKey: function(key) {
      // check if the sentence is completed
      if (this.text.toLowerCase() == this.sentence.toLowerCase()) {
        this.gameFinished = true
        this.resetState()
        this.gameStart()
      }
    },

    resetState: function() {
      clearInterval(this.refreshControlsInterval)
    },
    

    gameStart: function() {
      this.text = ''
      this.sentenceTimeStart = Date.now()
      this.refreshControlsInterval = setInterval(() => {
          this.refreshControls()
      }, 100)
    },

    getFooterSize: function() {
      return document.getElementsByClassName('q-footer')[0].getBoundingClientRect().height
    },

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
