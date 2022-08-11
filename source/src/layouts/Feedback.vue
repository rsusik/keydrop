<template>
  <q-layout view="hHh lpR fFf">
    <q-toolbar class="text-primary">
      <q-btn flat dense icon="arrow_back" label="Back" to="/" />
    </q-toolbar>

    <q-page-container class="q-px-md">
      <h1 style="margin-top: 0;">Feedback</h1>
      <q-form @submit="onSubmit">
        <div>
          <h2>Rate your experience with keydrop (leftmost&nbsp;-&nbsp;very&nbsp;bad,&nbsp;rightmost&nbsp;-&nbsp;very good).</h2>
          <q-rating
            v-model="rating"
            :max="5"
            size="3.5em"
            color="blue"
            :icon="icons"
          />
        </div>
        <div>
          <h2>
            Do you think keydrop speeds up typing on your phone
            (1&nbsp;-&nbsp;definitely&nbsp;not,&nbsp;5&nbsp;-&nbsp;definitely&nbsp;yes)?
          </h2>
          <div class="q-gutter-sm">
            <q-radio v-model="speed" val="0" label="definitely not" />
            <q-radio v-model="speed" val="1" label="rather not" />
            <q-radio v-model="speed" val="2" label="no difference" />
            <q-radio v-model="speed" val="3" label="rather yes" />
            <q-radio v-model="speed" val="4" label="definitely yes" />
          </div>
        </div>
        <div>
          <h2>
            Do you think keydrop limits the number of typos
            (1&nbsp;-&nbsp;definitely&nbsp;not,&nbsp;5&nbsp;-&nbsp;definitely&nbsp;yes)?
          </h2>
          <div class="q-gutter-sm">
            <q-radio v-model="typos" val="0" label="definitely not" />
            <q-radio v-model="typos" val="1" label="rather not" />
            <q-radio v-model="typos" val="2" label="no difference" />
            <q-radio v-model="typos" val="3" label="rather yes" />
            <q-radio v-model="typos" val="4" label="definitely yes" />
          </div>
        </div>
        <q-separator class="q-ma-md" />
        <div class="text-center">
          <q-btn 
            :class="{disabled: !(!!rating && !!speed && !!typos)}"
            to="/"
            label="Done" type="submit" color="primary"
          />
          <div v-if="!(!!rating && !!speed && !!typos)" class="text-center" style="color:#888;">(fill in all fileds)</div>
        </div>
      </q-form>
    </q-page-container>

    <q-footer class="footer">
      <q-toolbar>
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

export default defineComponent({
  name: 'Intro',

  components: {
  },

  setup () {
    return {
    }
  },

  data() {
    return {
      rating: undefined,
      speed: undefined,
      typos: undefined,
      icons: [
        'sentiment_very_dissatisfied',
        'sentiment_dissatisfied',
        'sentiment_neutral',
        'sentiment_satisfied',
        'sentiment_very_satisfied'
      ]
    }
  },

  watch: {
    rating: function (val) {
      if (val != undefined) {
        localStorage.setItem('rating', val);
      }
    },
    
    speed: function (val) {
      if (val != undefined) {
        localStorage.setItem('speed', val);
      }
    },
    
    typos: function (val) {
      if (val != undefined) {
        localStorage.setItem('typos', val);
      }
    },
    
  },

  computed: {
  },

  created() {
    this.rating = localStorage.getItem('rating')
    this.speed = localStorage.getItem('speed')
    this.typos = localStorage.getItem('typos')
  },

  mounted() {
  },

  methods: {
    onSubmit: function() {

    }
  },

})
</script>
<style>
.disabled {
  opacity: 0.2;
  pointer-events: none;
}
h1, h2, h3, h4, h5, h6 {
  line-height: normal;
}
h1 {
  font-size: 2rem;
}
h2 {
  font-size: 1.3rem;
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
