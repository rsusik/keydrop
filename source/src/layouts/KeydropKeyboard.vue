<template>
  <div class="kb-container">
    <div class="kb-row kb-row-first">
      <input class="" style="background-color: transparent; box-shadow: none; border: 0;" 
        type="button" 
        :value="leftWord" 
        @click="insertWord(leftWord)"
      />
      <input class="" style="background-color: transparent; box-shadow: none; border: 0;" 
        type="button" 
        :value="inp" 
        @click="() => {$emit('wordpressed', inp); insertWord(inp)}"
      />
      <input class="" style="background-color: transparent; box-shadow: none; border: 0;" 
        type="button" 
        :value="rightWord" 
        @click="insertWord(rightWord)"
      />
    </div>
    <div v-for="row in boardView" :key="row" class="kb-row">
      <!--q-btn v-for="key in row" :key="key" class="btn" :label="key.label" @click="key.action(key)" :style="key.style" :class="key.class" /-->
      <div v-for="key in row" 
        :key="key" 
        class="btn"  
        style="position: relative;"
        @mousedown="original_mousedown(key)"
        @mouseup="original_mouseup(key)"
        @mouseleave="original_mouseleave(key)"
        @touchstart="original_touchstart(key)"
        @touchend="original_touchend(key)"
        @touchcancel="original_touchcancel(key)"
        :style="key.style.concat(key.key==key.original_key?'color:black;':'color:#777;')"
        :class="[key.class, {'original': key.original_show}]"
      >
        <div>{{key.original_label.toUpperCase()}}</div><!-- primary character -->
        <div 
          class="btn-original"
          :style="{display: key.key==key.original_key?'none':'block'}"
        >
          {{key.original_show?key.original_label.toUpperCase():key.label.toUpperCase()}}<!-- secondary character -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { defineComponent, ref } from 'vue'
import bsearch from '../bsearch'
const axios = require('axios');

export default defineComponent({
  name: 'KeydropKeyboard',

  props: {
    modelValue: String
  },

  //emits: ['keypressed', 'wordpressed'],

  components: {
  },

  setup () {
    return {
    }
  },

  watch: {
    modelValue (val) {
      // zmieniono component z zewnatrz
      let lastSpace = val.lastIndexOf(' ')
      let lastDot = val.lastIndexOf('.')
      let lastComma = val.lastIndexOf(',')
      let lastEOL = val.lastIndexOf('\n')
      let lastSep = Math.max(lastEOL, lastSpace)
      if (lastSep == -1) {
        // nie ma zadnego separatora -> tekst to pojedyncze slowo
        this.internal_text = ''
        this.internal_inp = val
      } else if (lastSep == val.length - 1) {
        // tekst konczy sie separatorem
        this.internal_text = val
        this.internal_inp = ''
      } else {
        this.internal_text = val.substring(0, lastSep + 1)
        this.internal_inp = val.substring(lastSep + 1, val.length)
      }
      this.updateBoard()
    }
  },

  data() {
    return {
      internal_inp: '',
      words1: [],
      words2: [],
      words3: [],
      words4: [],
      wordsx: [],
      charmap1: [],
      charmap2: [],
      charmap3: [],
      charmap4: [],
      charmap5: [],
      internal_text: '',
      leftWord: '',
      rightWord: '',
      keys: {},
      boardView: [],
      tree: {},
      key_timeouts: {},
    }
  },

  computed: {
    fullText: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val );
      }
    },

    text: {
      get() {
        return this.internal_text;
      },
      set(val) {
        this.internal_text = val;
        this.fullText = this.internal_text + this.inp
      }
    },

    inp: {
      get() {
        return this.internal_inp;
      },
      set(val) {
        this.internal_inp = val;
        this.fullText = this.text + this.internal_inp
      }
    },

    words: function() {
      if (this.inp == undefined || this.inp.length == 0) {
        return this.words1
      } else if (this.inp.length == 1) {
        return this.words2
      } else if (this.inp.length == 2) {
        return this.words3
      } else if (this.inp.length == 3) {
        return this.words4
      } else {
        return this.wordsx
      } 
    },

    row0: function() {
      return Object.fromEntries(Object.entries(this.keys).filter(([k,v]) => v.row == 0));
    },
    row1: function() {
      return Object.fromEntries(Object.entries(this.keys).filter(([k,v]) => v.row == 1));
    },
    row2: function() {
      return Object.fromEntries(Object.entries(this.keys).filter(([k,v]) => v.row == 2));
    },
    row3: function() {
      return Object.fromEntries(Object.entries(this.keys).filter(([k,v]) => v.row == 3));
    },

    wordsLeft: function() {
      if (this.inp.length < 1) {
        return new Set()
      }
      let res = bsearch.findNext(this.words, this.inp, 0, this.words.length)
      return res.words
    },

    lettersLeft: function() {
      const findNextLetters = (mapping, txt) => {
        let letters = mapping[txt]
        if (letters == undefined || letters.length == 0) {
          return new Set();
        } else {
          return new Set(letters);
        }
      }

      const findNext = (txt) => {
        if (txt == undefined || txt.length == 0) {
          return 'q,w,e,r,t,y,u,i,o,p,l,k,j,h,g,f,d,s,a,z,x,c,v,b,n,m'.split(',')
        } else if (txt.length == 1) {
          return findNextLetters(this.charmap1, txt)
        } else if (txt.length == 2) {
          return findNextLetters(this.charmap2, txt)
        } else if (txt.length == 3) {
          return findNextLetters(this.charmap3, txt)
        } else if (txt.length == 4) {
          return findNextLetters(this.charmap4, txt)
        } else if (txt.length == 5) {
          return findNextLetters(this.charmap5, txt)
        } else {
          console.log('No more')
        }
      }

      if (this.inp.length < 1) {
        return new Set()
      } else if (this.inp.length < 4 && this.words != undefined) { // TODO: tu raczej co innego ma byc undefined
          return findNext(this.inp)
      } else if (this.words != undefined) {
        let res = bsearch.findNext(this.words, this.inp, 0, this.words.length)
        return res.letters
      } else {
        console.log('ERROR: something went wrong.')
        return new Set()
      }
    }
  },

  created() {
    const getWords = (target, filename) => {
      axios.get(filename).
      then( (resp) => {
        Object.assign(target, resp.data.split('\n'))
        this.updateBoard()
      })
    }

    const getNextCharMap = (target, filename) => {
      axios.get(filename).
      then( (resp) => {
        Object.assign(target, resp.data)
        this.updateBoard()
      })
    }

    getNextCharMap(this.charmap1, 'mm1.json')
    getNextCharMap(this.charmap2, 'mm2.json')
    getNextCharMap(this.charmap3, 'mm3.json')

    getWords(this.wordsx, 'unigram_words_gt5.txt')

    const generateTree = () => {
      this.tree = {}
      for (let word of this.words) {
        let tmp_tree = this.tree
        for (let ch of word) {
          if (Object.keys(tmp_tree).includes(ch)) {
            tmp_tree = tmp_tree[ch]
          } else {
            tmp_tree[ch] = {}
          }
        }
      }
    }

    // definiuje wyglad i uklad klawiatury (uklad zostawiamy niezmieniony)
    this.board = [
      [{key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}],
      [{key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}],
      [{key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}],
      [{key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}, {key: undefined}]
    ]

    // pozycje klawiszy na ukladzie
    this.key_positions = {
      'q'         : {row: 0, col: 0},
      'w'         : {row: 0, col: 1},
      'e'         : {row: 0, col: 2},
      'r'         : {row: 0, col: 3},
      't'         : {row: 0, col: 4},
      'y'         : {row: 0, col: 5},
      'u'         : {row: 0, col: 6},
      'i'         : {row: 0, col: 7},
      'o'         : {row: 0, col: 8},
      'p'         : {row: 0, col: 9},
      'a'         : {row: 1, col: 0},
      's'         : {row: 1, col: 1},
      'd'         : {row: 1, col: 2},
      'f'         : {row: 1, col: 3},
      'g'         : {row: 1, col: 4},
      'h'         : {row: 1, col: 5},
      'j'         : {row: 1, col: 6},
      'k'         : {row: 1, col: 7},
      'l'         : {row: 1, col: 8},
      'shift'     : {row: 2, col: 0},
      'z'         : {row: 2, col: 1},
      'x'         : {row: 2, col: 2},
      'c'         : {row: 2, col: 3},
      'v'         : {row: 2, col: 4},
      'b'         : {row: 2, col: 5},
      'n'         : {row: 2, col: 6},
      'm'         : {row: 2, col: 7},
      'backspace' : {row: 2, col: 8},
      'numeric'   : {row: 3, col: 0},
      ','     : {row: 3, col: 1},
      'emoji'     : {row: 3, col: 2},
      ' '     : {row: 3, col: 3},
      '.'       : {row: 3, col: 4},
      '\n'     : {row: 3, col: 5},
    }

    // sasiedzi 
    this.key_neighbors = {
      'q'         : ['w', 'a'],
      'w'         : ['q', 'a', 's', 'e'],
      'e'         : ['w', 's', 'd', 'r'],
      'r'         : ['e', 'd', 'f', 't'],
      't'         : ['r', 'f', 'g', 'y'],
      'y'         : ['t', 'g', 'h', 'u'],
      'u'         : ['y', 'h', 'j', 'i'],
      'i'         : ['u', 'j', 'k', 'o'],
      'o'         : ['i', 'k', 'l', 'p'],
      'p'         : ['o', 'l'],
      'a'         : ['q', 'w', 's'],
      's'         : ['a', 'w', 'e', 'd', 'z'],
      'd'         : ['s', 'e', 'r', 'f', 'x'],
      'f'         : ['d', 'r', 't', 'g', 'c'],
      'g'         : ['f', 't', 'y', 'h', 'v'],
      'h'         : ['g', 'y', 'u', 'j', 'b'],
      'j'         : ['h', 'u', 'i', 'k', 'n'],
      'k'         : ['j', 'i', 'o', 'l', 'm'],
      'l'         : ['k', 'o', 'p'],
      'shift'     : [],
      'z'         : ['s', 'x'],
      'x'         : ['z', 'd', 'c'],
      'c'         : ['x', 'f', 'v'],
      'v'         : ['c', 'g', 'b'],
      'b'         : ['v', 'h', 'n'],
      'n'         : ['b', 'j', 'm'],
      'm'         : ['n', 'k'],
      'backspace' : [],
      'numeric'   : [],
      ','     : [],
      'emoji'     : [], 
      ' '     : [],
      '.'       : [],
      '\n'     : [],
    }

    this.key_style = {
      'q'         : {class: 'btn-row1', style: ''},
      'w'         : {class: 'btn-row1', style: ''},
      'e'         : {class: 'btn-row1', style: ''},
      'r'         : {class: 'btn-row1', style: ''},
      't'         : {class: 'btn-row1', style: ''},
      'y'         : {class: 'btn-row1', style: ''},
      'u'         : {class: 'btn-row1', style: ''},
      'i'         : {class: 'btn-row1', style: ''},
      'o'         : {class: 'btn-row1', style: ''},
      'p'         : {class: 'btn-row1', style: ''},
      'a'         : {class: 'btn-row2', style: 'margin-left: 10pt;'},
      's'         : {class: 'btn-row2', style: ''},
      'd'         : {class: 'btn-row2', style: ''},
      'f'         : {class: 'btn-row2', style: ''},
      'g'         : {class: 'btn-row2', style: ''},
      'h'         : {class: 'btn-row2', style: ''},
      'j'         : {class: 'btn-row2', style: ''},
      'k'         : {class: 'btn-row2', style: ''},
      'l'         : {class: 'btn-row2', style: 'margin-right: 10pt;'},
      'shift'     : {class: 'btn-shift', style: ''},
      'z'         : {class: 'btn-row3', style: ''},
      'x'         : {class: 'btn-row3', style: ''},
      'c'         : {class: 'btn-row3', style: ''},
      'v'         : {class: 'btn-row3', style: ''},
      'b'         : {class: 'btn-row3', style: ''},
      'n'         : {class: 'btn-row3', style: ''},
      'm'         : {class: 'btn-row3', style: ''},
      'backspace' : {class: 'btn-shift', style: ''},
      'numeric'   : {class: 'btn-shift', style: ''},
      ','     : {class: 'btn-row4', style: ''},
      'emoji'     : {class: 'btn-row4', style: ''},
      ' '     : {class: 'btn-space', style: ''},
      '.'       : {class: 'btn-row4', style: ''},
      '\n'     : {class: 'btn-shift', style: ''},
    }

    this.key_labels = {
      'q'         : 'q', 
      'w'         : 'w', 
      'e'         : 'e', 
      'r'         : 'r', 
      't'         : 't', 
      'y'         : 'y', 
      'u'         : 'u', 
      'i'         : 'i', 
      'o'         : 'o', 
      'p'         : 'p', 
      'a'         : 'a', 
      's'         : 's', 
      'd'         : 'd', 
      'f'         : 'f', 
      'g'         : 'g', 
      'h'         : 'h', 
      'j'         : 'j', 
      'k'         : 'k', 
      'l'         : 'l', 
      'shift'     : '⇧', 
      'z'         : 'z', 
      'x'         : 'x', 
      'c'         : 'c', 
      'v'         : 'v', 
      'b'         : 'b', 
      'n'         : 'n', 
      'm'         : 'm', 
      'backspace' : '⌫', 
      'numeric'   : '', 
      ','     : ',',
      'emoji'     : '🙂', 
      ' '     : '_', 
      '.'       : '.', 
      '\n'     : '⏎',   
    }

    this.key_actions = {
      'q'         : this.keyFunWraper(this.keyClicked),
      'w'         : this.keyFunWraper(this.keyClicked),
      'e'         : this.keyFunWraper(this.keyClicked),
      'r'         : this.keyFunWraper(this.keyClicked),
      't'         : this.keyFunWraper(this.keyClicked),
      'y'         : this.keyFunWraper(this.keyClicked),
      'u'         : this.keyFunWraper(this.keyClicked),
      'i'         : this.keyFunWraper(this.keyClicked),
      'o'         : this.keyFunWraper(this.keyClicked),
      'p'         : this.keyFunWraper(this.keyClicked),
      'a'         : this.keyFunWraper(this.keyClicked),
      's'         : this.keyFunWraper(this.keyClicked),
      'd'         : this.keyFunWraper(this.keyClicked),
      'f'         : this.keyFunWraper(this.keyClicked),
      'g'         : this.keyFunWraper(this.keyClicked),
      'h'         : this.keyFunWraper(this.keyClicked),
      'j'         : this.keyFunWraper(this.keyClicked),
      'k'         : this.keyFunWraper(this.keyClicked),
      'l'         : this.keyFunWraper(this.keyClicked),
      'shift'     : this.keyFunWraper(this.shiftClicked),
      'z'         : this.keyFunWraper(this.keyClicked),
      'x'         : this.keyFunWraper(this.keyClicked),
      'c'         : this.keyFunWraper(this.keyClicked),
      'v'         : this.keyFunWraper(this.keyClicked),
      'b'         : this.keyFunWraper(this.keyClicked),
      'n'         : this.keyFunWraper(this.keyClicked),
      'm'         : this.keyFunWraper(this.keyClicked),
      'backspace' : this.keyFunWraper(this.backspaceClicked),
      'numeric'   : this.keyFunWraper(this.numClicked),
      ','     : this.keyFunWraper(this.commaClicked),
      'emoji'     : this.keyFunWraper(this.keyClicked),
      ' '     : this.keyFunWraper(this.spaceClicked),
      '.'       : this.keyFunWraper(this.dotClicked),
      '\n'     : this.keyFunWraper(this.enterClicked),
    }

    this.standard_keys = ['shift', 'backspace', 'numeric', ',', 'emoji', ' ', '.', '\n']

  },

  mounted() {
    this.updateBoard()
  },

  methods: {

    original_leave: function(key) {
      key.original_show = false;
      clearTimeout(this.key_timeouts[key]); // works also for backspace setInterval
    },

    original_down: function(key) {
      if (key.key != key.original_key) {
        this.key_timeouts[key] = setTimeout(() => {
          key.original_show = true;
        }, 500);
      } else if (key.key == 'backspace') {
        this.key_timeouts[key] = setTimeout(() => {
          this.key_timeouts[key] = setInterval(() => {
            this.backspaceClicked(key)
          }, 50)
        }, 500);
      }
    },

    original_up: function(key) {
      if (key.original_show) {
        key.original_action(
          Object.assign(
            Object.assign({}, key),
            {
              label: key.original_label,
              key: key.original_key,
              action: key.original_action,
            }
          )
        )
      } else {
        // workaround for backspace
        if (key.key == 'backspace') {
          clearTimeout(this.key_timeouts[key]);
        }
        key.action(key)
      }
    },

    original_mouseleave: function(key) {
      if (this.$q.platform.is.mobile) return false;
      this.original_leave(key);
    },

    original_mousedown: function(key) {
      if (this.$q.platform.is.mobile) return false;
      this.original_down(key)
    },

    original_mouseup: function(key) {
      if (this.$q.platform.is.mobile) return false;
      this.original_up(key)
    },

    original_touchstart: function(key) {
      this.original_down(key)
    },

    original_touchend: function(key) {
      this.original_up(key)
    },

    original_touchcancel: function(key) {
      this.original_leave(key);
    },

    showNotSupported: function() {
      this.$q.notify({
        type: 'info', // positive, negative, warning, info
        timeout: 100,
        message: 'Not supported',
      })
    },

    shiftClicked: function(key) {
      this.showNotSupported()
    },

    numClicked: function(key) {
      this.showNotSupported()
    },

    spaceClicked: function(key) {
      this.insertWord(this.inp)
    },

    dotClicked: function(key) {
      this.insertWord(this.inp + '.')
    },

    commaClicked: function(key) {
      this.insertWord(this.inp + ',')
    },

    enterClicked: function(key) {
      this.insertWord(this.inp, '\n')
    },

    keyFunWraper: function(fun) {
      return (key) => {
        fun(key)
        this.$emit('keypressed', key)
      }
    },

    backspaceClicked: function(key) {
      if (this.inp.length > 0) {
        this.inp = this.inp.substring(0, this.inp.length - 1)
        this.updateBoard()
      } else {
        if (
          this.text[this.text.length - 1] == ' ' ||
          this.text[this.text.length - 1] == '.' ||
          this.text[this.text.length - 1] == ',' ||
          this.text[this.text.length - 1] == '\n'
        ) { // TODO: mozna dodac kropki i inne
          this.text = this.text.substring(0, this.text.length - 1)
        } 
          let words = this.text.split(' ')
          let words_len = words.length
          if (words_len > 1) {
            this.text = words.slice(0, words_len - 1).join(' ') + ' '
          } else {
            this.text = ''
          }
          this.inp = words[words_len - 1]
      }
    },

    keyClicked: function(key) {
      this.inp = this.inp + key.label
      //this.findSimilar(this.inp)
      this.updateBoard()
    },

    insertWord: function(word, sep = ' ') {
      this.text += word + sep; 
      this.inp = ''; 
      this.rightWord = ''; 
      this.leftWord = '';
      this.updateBoard();
    },

    updateBoard: function() {

      let find_original_key_by_pos = (row, col) => {
        for (let le in this.key_positions) {
          let le_row = this.key_positions[le].row
          let le_col = this.key_positions[le].col
          if(le_row == row && le_col == col) {
            return le
          }
        }
        throw 'ERROR: cannot find'
      }

      let active_keys = Array.from(this.lettersLeft).concat(this.standard_keys)
      if (this.lettersLeft.size < 1) {
        // jezeli juz zadnej litery nie mozna podpowiedziec to pokaz wszystkie
        active_keys = Object.keys(this.key_neighbors)
      } else if (this.lettersLeft.size == 1 ) {
        // jezeli zostala tylko jedna litera
      }
      let active_keys_mapped = this.map_keys(active_keys).reverse()
      let tmp_board = this.board.map(a => {return [...a]})
      while(active_keys_mapped.length > 0) {
        let key = active_keys_mapped.pop()
        let neigh = key.neigh.map((el) => { return {
          row: this.key_positions[el].row,
          col: this.key_positions[el].col,
          original_key: el,
          original_label: this.key_labels[el],
          original_action: this.key_actions[el],
          key: key.key,
          label: key.label,
          neigh: this.key_neighbors[el],
          style: this.key_style[el].style,
          class: this.key_style[el].class,
          action: this.key_actions[el],
        }})
        
        if (
          tmp_board[key.row][key.col].key == undefined 
        ) { // jezeli jeszcze nie przypisany
          let pos1 = this.key_positions[key.original_key]
          // let pos2 = this.key_positions[find_original_key_by_pos(key.row, key.col)]
          let pos2 = this.key_positions[key.key]
          let dist = Math.sqrt(Math.pow(pos1.row - pos2.row, 2) + Math.pow(pos1.col - pos2.col, 2))
          if (dist < 2) {
            let numberOfNearNeigh = active_keys_mapped.filter((el) => {
                if (el.label != key.label) return false
                return Math.sqrt(Math.pow(key.row - el.row, 2) + Math.pow(key.col - el.col, 2)) <= Math.sqrt(2)
              }).length + [].concat(...tmp_board).filter((el) => {
                if (el.label != key.label) return false
                return Math.sqrt(Math.pow(key.row - el.row, 2) + Math.pow(key.col - el.col, 2)) <= Math.sqrt(2)
              }).length
            
            if (numberOfNearNeigh > 1 || key.label == key.original_label) {
              tmp_board[key.row][key.col] = {
                row: key.row,
                col: key.col,
                original_key: key.original_key,
                original_label: key.original_label,
                original_action: key.original_action,
                key: key.key,
                label: key.label,
                style: key.style,
                class: key.class,
                action: key.action,
              }
              
              active_keys_mapped.unshift(...neigh.reverse())
            }
          }
        }
      }
      for (let i = 0; i < tmp_board.length; i++) {
        for (let j = 0; j < tmp_board[i].length; j++) {
          let el = tmp_board[i][j]
          if (el == undefined || el.key == undefined || el.label == undefined) {
            let keey = find_original_key_by_pos(i, j)
            tmp_board[i][j] = {
              row   : i,
              col   : j,
              original_key: keey,
              original_label: this.key_labels[keey],
              original_action: this.key_actions[keey],
              key   : keey,
              label : this.key_labels[keey],
              style : this.key_style[keey].style,
              class : this.key_style[keey].class,
              action: this.key_actions[keey],
            }
          }
        }
      }
      let colors = ['#ffe0de', '#defffe', '#e6ffde', '#fffede', '#f3e8ff', '#fff4e8', '#fae4ef', '#f5ebc1', '#f5aff7', '#fcd666', '#ffe6fa', '#f7bea6', '#fabaf5', '#f4ccf8', '#ccf5c5', '#e5e4cb', '#c02750', '#f9166d', '#e4f22c', '#c68065', '#40df8d', '#68ce12', '#9f7ab8', '#945883', '#8d9a11', '#2af87e', '#b58f6f', '#5f35a3', '#0ea4fb', '#a8b289', '#a17289', '#fae4ef', '#7497aa', '#c5af37', '#0cd666', '#8f864a', '#f7bea6', '#9aba15', '#647c58', '#8c35b5', '#45e49b', '#c02750', '#f9166d', '#e4f22c', '#c68065', '#40df8d', '#68ce12', '#9f7ab8', '#945883', '#8d9a11', '#2af87e', '#b58f6f']
      let color_idx = 0;
      
      let staaate = active_keys.map((el) => {
        // zliczam liczbe takich samych przyciskow (wielkosc grupy)
        let flatt = [].concat(...tmp_board)
        return flatt.map((k) => {
          return k.key == el
        }).reduce((prev, next) => {
          return prev + next
        })
      })
      let colors_map = staaate.map((el) => {
        if(el > 1) { // jezeli wielkosc grupy wieksza niz 1 to kolorujemy
          //return colors[color_idx++] // coloring
          return false
        } else {
          return false
        }
      })

      let final_colors = this.zip(active_keys, colors_map)
      
      for (let row of tmp_board) {
        for (let el of row) {
          if (final_colors[el.key]) {
            el.style = `${el.style}; background-color: ${final_colors[el.key]}`
          }
        }
      }
      
      Object.assign(this.boardView, tmp_board)
    },

    zip: function(arr1,arr2,out={}){
      arr1.map( (val,idx)=>{ out[val] = arr2[idx]; } );
      return out;
    },

    reset: function() {
      this.inp = ''
      this.text = ''
    },

    map_keys: function(keys) {
      return keys.filter((el) => Object.keys(this.key_neighbors).includes(el) ).map((el) => { return {
        row: this.key_positions[el].row,
        col: this.key_positions[el].col,
        original_key: el,
        original_label: this.key_labels[el],
        original_action: this.key_actions[el],
        key: el,
        label: this.key_labels[el],
        neigh: this.key_neighbors[el],
        style: this.key_style[el].style,
        class: this.key_style[el].class,
        action: this.key_actions[el],
      }})
    },

    findSimilar: function(inp) {
      let res = this.wordsLeft

      let mySet = this.lettersLeft

      if (res.size > 0) {
        this.leftWord = res[0]
      } else {
        this.leftWord = ''
      }
      if (res.size > 1) {
        this.rightWord = res[1]
      } else {
        this.rightWord = ''
      }

    }
  },

})
</script>
<style scope>

</style>
