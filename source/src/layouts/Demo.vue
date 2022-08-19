<template>
  <q-layout view="hHh lpR fFf">
    <q-toolbar class="text-primary">
      <q-btn flat dense icon="arrow_back" label="Back" to="/" />
    </q-toolbar>

    <q-page-container class="q-pa-md">
      <q-card flat bordered>
        <q-card-section v-if="text == ''" class="text-grey">
          Type text using below keyboard 
        </q-card-section>
        <q-card-section v-html="displayText" v-if="displayText.length > 0" />
      </q-card>
    </q-page-container>

    <q-footer class="footer">
      <q-toolbar>
        <q-toolbar-title>
          <KeydropKeyboard v-model="text" />
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

export default defineComponent({
  name: 'MainLayout',

  components: {
    KeydropKeyboard
  },

  setup () {
    return {
    }
  },

  data() {
    return {
      text: ''
    }
  },

  computed: {
    displayText: function() {
      console.log(this.text)
      let lastSpace = this.text.lastIndexOf(' ')
      let lastDot = this.text.lastIndexOf('.')
      let lastComma = this.text.lastIndexOf(',')
      let lastEOL = this.text.lastIndexOf('\n')
      let lastSep = Math.max(lastEOL, lastSpace)
      let txt = ''
      let word = ''
      if (lastSep == this.text.length - 1) {
        // tekst konczy sie separatorem
        txt = this.text
      } else {
        txt = this.text.substring(0, lastSep + 1)
        word = this.text.substring(lastSep + 1, this.text.length)
      }
      
      // let parts = this.text.split(' ')
      // let txt = parts
      //     .slice(0, parts.length - 1)
      //     .join(' ')
      // let word = parts[parts.length - 1].replace(/\n/g, '<br />')
      
      txt = txt.replace(/ /g, '<wbr>&nbsp;')
      txt = txt.replace(/\n/g, '<br/>')

      txt = txt + '<u>' + word + '</u>'
      if (this.text.length > 0) {
          txt = txt + '<span style="color:blue; font-size: 1rem; font-weight:900;" class="blink">|</span>'
      }

      return txt
        
    },
  },

  created() {
    
  },

  mounted() {
    localStorage.setItem('demoCompleted', true);
  },

  methods: {

  },

})
</script>
<style>

@keyframes anim_blink {
  0%   {color: blue;}
  50%  {color: transparent;}
  100%  {color: blue;}
}

.q-toolbar {
  padding: 0 0;
}

.blink {
  animation-name: anim_blink;
  animation-delay: 1s;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}
</style>
