<template>
  <q-layout view="hHh lpR fFf">
    <q-toolbar class="text-primary">
      <q-btn flat dense icon="arrow_back" label="Back" to="/" />
    </q-toolbar>

    <q-page-container class="q-px-md">
      <h1 style="margin-top: 0;">Data</h1>
      Please download and send the results back to us <a :href="`mailto:${em}`">{{em}}</a>.
      <div class="text-center">
        <q-btn @click="download" label="Download data" icon="download" flat size="xl"
          class="q-my-md" style="border: 1pt solid black; border-radius: 20pt;"
        />
      </div>
      You can see the full data below:
      <div style="width: 90%; position: relative; margin: 0 auto;">
      <q-btn @click="toClipboard(data)" label="Copy" icon="content_copy" flat 
        class="" 
        style="position: absolute; right: 10pt; top: 20pt;" 
      />
      <textarea v-model="data" class="shadow-5 q-pa-md q-ma-md" style="overflow: scroll; width: 100%; min-height: 300pt; ;">
        
      </textarea>
      </div>
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
import { copyToClipboard } from 'quasar'
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
      ema: 'spcfsu/tvtjlAq/mpe{/qm'
    }
  },

  watch: {
  },

  computed: {
    data: function() {
      var text = localStorage.getItem('tests')
      var tests = JSON.parse(text)
      var data = JSON.stringify({
        'rating': localStorage.getItem('rating'),
        'speed': localStorage.getItem('speed'),
        'typos': localStorage.getItem('typos'),
        'tests': tests
      }, null, '  ')
      if (text == undefined) {
        // nothing to download
        return undefined
      } else {
        return data
      }
    },
    em: function() {
      return (this.ema.split('').map((x) => String.fromCharCode(x.charCodeAt(0)-1))).join('')
    },
  },

  created() {
    this.rating = localStorage.getItem('rating')
    this.speed = localStorage.getItem('speed')
    this.typos = localStorage.getItem('typos')
  },

  mounted() {
  },

  methods: {
    download: function () {
      if (this.data == undefined) {
        // nothing to download
      } else {
        var filename = 'results.json'
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.data));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      }
    },

    toClipboard: function(txt) {
      copyToClipboard(txt)
      .then(() => {
        this.$q.notify({
          type: 'info', // positive, negative, warning, info
          timeout: 1000,
          message: 'Copied!',
        })
      })

    },

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
