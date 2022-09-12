<template>
  <q-layout view="hHh lpR fFf">
    <q-toolbar class="text-primary">
      <q-btn flat dense icon="arrow_back" label="Back" to="/" />
    </q-toolbar>

    <q-page-container class="q-px-md">
      <h1 style="margin-top: 0;">Introduction</h1>
      <h2>Basic info</h2>
      <p>This application is a prototype of a keyboard that adapts to written text.</p>
      <h2>Keyboard</h2>
      <p>
        The keyboard layout changes dynamically while the user types the text. It removes the letters that are unlikely to appear to reduce the wrong key taps.
      </p>
      <p>
        While the user taps keys, the letters that are unlikely to appear next are replaced with predicted ones. 
        The user can still type all the letters (for those keys whose letter has changed) by holding the key down. 
        In the below example user entered three characters, "thi", so the keyboard leaves letters {s, r, c, n}, which are likely to appear next, and also {i, o, p, l} which are too far from possible characters changing them does not seem to help in typing. 
        <br />
        <!--i>Note: the colors are removed in the Keydrop as we find it distracting.</i-->
        <!--which are also unlikely to appear but changing them doesn't seem to 
        help in typying.
        so he likely wants to type words such as "that", "the", "three", "thuesday", "this", "those", etc. 
        In this example, it can also be noticed that some of the characters are not removed. 
        Those are too far away from possible characters, so they were not affected.-->
      </p>
      <div class="col-6">
        <q-img src="keyboard_thi_col.png" no-native-menu style="max-width: 456px;">
          <!--q-icon class="absolute all-pointer-events" size="64px" name="help" color="purple" style="top: 8px; left: 8px; border-radius: 50%; background: white;">
            <q-tooltip>
              keydrop on iphone for "thi" input.
            </q-tooltip>
          </q-icon-->
        </q-img>
        <i class="block text-center">We removed the colours as we believe they distract the user.</i>
      </div>
      <!--div style="font-size: 21pt; border: 1px solid #dadada;"><div class="kb-row"><input class="" type="button" style="background-color: transparent; box-shadow: none; border: 0px;"><input class="" type="button" style="background-color: transparent; box-shadow: none; border: 0px;" value="th"><input class="" type="button" style="background-color: transparent; box-shadow: none; border: 0px;"></div><div class="kb-row"><div class="btn btn-row1" style="position: relative; background-color: rgb(222, 255, 254);">A <div class="btn-original" style="display: block;">q</div></div><div class="btn btn-row1" style="position: relative; background-color: rgb(255, 224, 222);">E <div class="btn-original" style="display: block;">w</div></div><div class="btn btn-row1" style="position: relative; background-color: rgb(255, 224, 222);">E <div class="btn-original" style="display: none;">e</div></div><div class="btn btn-row1" style="position: relative; background-color: rgb(255, 254, 222);">R <div class="btn-original" style="display: none;">r</div></div><div class="btn btn-row1" style="position: relative; background-color: rgb(255, 254, 222);">R <div class="btn-original" style="display: block;">t</div></div><div class="btn btn-row1" style="position: relative; background-color: rgb(255, 244, 232);">U <div class="btn-original" style="display: block;">y</div></div><div class="btn btn-row1" style="position: relative; background-color: rgb(255, 244, 232);">U <div class="btn-original" style="display: none;">u</div></div><div class="btn btn-row1" style="position: relative; background-color: rgb(230, 255, 222);">I <div class="btn-original" style="display: none;">i</div></div><div class="btn btn-row1" style="position: relative; background-color: rgb(243, 232, 255);">O <div class="btn-original" style="display: none;">o</div></div><div class="btn btn-row1" style="position: relative; background-color: rgb(243, 232, 255);">O <div class="btn-original" style="display: block;">p</div></div></div><div class="kb-row"><div class="btn btn-row2" style="position: relative; margin-left: 10pt; background-color: rgb(222, 255, 254);">A <div class="btn-original" style="display: none;">a</div></div><div class="btn btn-row2" style="position: relative; background-color: rgb(255, 224, 222);">E <div class="btn-original" style="display: block;">s</div></div><div class="btn btn-row2" style="position: relative; background-color: rgb(255, 224, 222);">E <div class="btn-original" style="display: block;">d</div></div><div class="btn btn-row2" style="position: relative; background-color: rgb(255, 254, 222);">R <div class="btn-original" style="display: block;">f</div></div><div class="btn btn-row2" style="position: relative; background-color: rgb(255, 254, 222);">R <div class="btn-original" style="display: block;">g</div></div><div class="btn btn-row2" style="position: relative; background-color: rgb(255, 244, 232);">U <div class="btn-original" style="display: block;">h</div></div><div class="btn btn-row2" style="position: relative; background-color: rgb(230, 255, 222);">I <div class="btn-original" style="display: block;">j</div></div><div class="btn btn-row2" style="position: relative; background-color: rgb(230, 255, 222);">I <div class="btn-original" style="display: block;">k</div></div><div class="btn btn-row2" style="position: relative; margin-right: 10pt; background-color: rgb(243, 232, 255);">O <div class="btn-original" style="display: block;">l</div></div></div><div class="kb-row"><div class="btn btn-shift" style="position: relative;">⇧ <div class="btn-original" style="display: none;">⇧</div></div><div class="btn btn-row3" style="position: relative;">Z <div class="btn-original" style="display: none;">z</div></div><div class="btn btn-row3" style="position: relative; background-color: rgb(255, 224, 222);">E <div class="btn-original" style="display: block;">x</div></div><div class="btn btn-row3" style="position: relative; background-color: rgb(255, 254, 222);">R <div class="btn-original" style="display: block;">c</div></div><div class="btn btn-row3" style="position: relative;">V <div class="btn-original" style="display: none;">v</div></div><div class="btn btn-row3" style="position: relative;">B <div class="btn-original" style="display: none;">b</div></div><div class="btn btn-row3" style="position: relative;">N <div class="btn-original" style="display: none;">n</div></div><div class="btn btn-row3" style="position: relative; background-color: rgb(230, 255, 222);">I <div class="btn-original" style="display: block;">m</div></div><div class="btn btn-shift" style="position: relative;">⌫ <div class="btn-original" style="display: none;">⌫</div></div></div><div class="kb-row"><div class="btn btn-shift" style="position: relative;"> <div class="btn-original" style="display: none;"></div></div><div class="btn btn-row4" style="position: relative;">, <div class="btn-original" style="display: none;">,</div></div><div class="btn btn-row4" style="position: relative;">🙂 <div class="btn-original" style="display: none;">🙂</div></div><div class="btn btn-space" style="position: relative;">_ <div class="btn-original" style="display: none;">_</div></div><div class="btn btn-row4" style="position: relative;">. <div class="btn-original" style="display: none;">.</div></div><div class="btn btn-shift" style="position: relative;">⏎ <div class="btn-original" style="display: none;">⏎</div></div></div></div-->
      <h2>Test</h2>
      <p>
        This application tests the speed and correctness of typing 
        using a regular keyboard (similar to a gboard) and keydrop.
      </p>
      <p>
        There are two modes (tests) available from the main menu:
        <ul>
          <li>keydrop,</li>
          <li>normal (similar to gboard).</li>
        </ul>
        If you wish to participate in the tests,
        please perform them for both modes, 
        then fill in the feedback form,
        and send the results back to us at <a :href="`mailto:${em}`">{{em}}</a>.
      </p>
      <p>
        A test is prepared to evaluate the speed and correctness of typing. 
        The test is straightforward. 
        The application shows the sentence, and the participant has to rewrite it using the chosen keyboard. 
        The point is to try rewrite the text EXACTLY as is displayed and as fast as possible with a minimal number of typos (all typos need to be corrected).
        If the input differs from the given sentence, then the background of the corresponding part is highlighted in <span style="background-color: #f77">red</span>, otherwise in <span style="background-color: #dfd">green</span>, as shown below.
        <br />
        <b><span style="font-size: 1.2em">Important! </span>
          All text should be rewritten exactly as displayed (no typos are allowed), so if something in red appears, 
          it should be corrected - removed with backspace and entered correctly.
        </b>
      </p>
      <div class="col-6">
        <q-img src="game2.png" no-native-menu style="max-width: 456px;">
        </q-img>
      </div>
      <h2>Demo</h2>
      <p>
        Train typing with the Keydrop in <router-link to="/write">this demo</router-link>
        before starting the test.
      </p>
    </q-page-container>

    <q-footer class="footer">
      <q-toolbar>
        <!--q-toolbar-title>
          <Keyboard2 v-model="text" v-if="showKeyboard" />
        </q-toolbar-title-->
        <q-toolbar-title class="text-center">
          <q-icon name="img:logo.svg#icon-1|0 0 80 380" style="height:24px; width:114px;" />
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

export default defineComponent({
  name: 'Intro',

  components: {
    //Keyboard2
  },

  setup () {
    return {
    }
  },

  data() {
    return {
      ema: 'spcfsu/tvtjlAq/mpe{/qm'
    }
  },

  computed: {
    em: function() {
      return (this.ema.split('').map((x) => String.fromCharCode(x.charCodeAt(0)-1))).join('')
    },
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
  },

  methods: {

  },

})
</script>
<style>
h1, h2, h3, h4, h5, h6 {
  line-height: normal;
}
h1 {
  font-size: 2rem;
}
h2 {
  font-size: 1.5rem;
}

@keyframes anim_blink {
  0%   {color: blue;}
  50%  {color: transparent;}
  100%  {color: blue;}
}

.blink {
  animation-name: anim_blink;
  animation-delay: 1s;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}
</style>
