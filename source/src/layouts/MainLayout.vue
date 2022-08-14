<template>
  <q-layout view="hHh lpR fFf">
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title class="text-center text-bold">Menu</q-toolbar-title>
    </q-toolbar>
  </q-header>
    <q-page-container class="q-pa-md">
      <div style="margin-top: 10pt;"></div>
      <q-banner 
        class="text-white bg-red q-ma-md"
        v-if="!$q.platform.is.mobile"
        cclass="text-center"
        rounded
      >
        <template v-slot:avatar>
          <q-icon name="warning" color="white" class="" />
        </template>
        This app is designated for a phone device. 
        You are currently using a different device. 
        We encourage you to open this link on your phone and install this (PWA) application.
      </q-banner>
      <router-link 
        class="menu-item intro" 
        
        to="/intro"
        @click="introRead = true"
      >Introduction</router-link>
      <router-link 
        class="menu-item" 
        to="/write"
        :class="{'link-disabled': !introRead}"
        @click="demoCompleted = true"
      >Demo
      </router-link>
      <router-link 
        class="menu-item" 
        to="/test/keydrop"
        :class="{'link-disabled': !demoCompleted}"
      >Test (keydrop)</router-link>
      <router-link 
        class="menu-item" 
        to="/test/normal"
        :class="{'link-disabled': !demoCompleted}"
      >Test (normal)</router-link>
      <router-link 
        class="menu-item" 
        to="/feedback"
        v-if="games.length > 0"
      >Feedback</router-link>
      <!--div style="text-align: center;">Is mobile: {{this.$q.platform.is.mobile}}</div-->
      <!--a href="#" 
        v-if="games.length > 0 && canDownload" 
        @click="download" 
        class="menu-item"
      >GET DATA</a-->
      <router-link 
        v-if="games.length > 0 && canDownload" 
        class="menu-item" 
        to="/getdata"
      >GET DATA</router-link>

      <q-separator v-if="games.length > 0" inset class="q-my-md" />
      <div v-if="games.length > 0">
        <div class="results">Results</div>
        <table class="ranking" style="">
          <thead>
            <tr>
              <th>Date</th>
              <th>Mode</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="game, idx in games" :key="idx">
              <td style="font-size: 12pt" v-html="game.date"></td>
              <td>{{game.mode}}</td>
              <td>{{game.score.overall}}s</td>
            </tr>
          </tbody>
        </table>
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
  <div id="overlay"></div>
</template>

<script>
import { useQuasar } from 'quasar'
import { defineComponent, ref } from 'vue'
import bsearch from '../bsearch'
const axios = require('axios');
import $ from 'jquery'


export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  setup () {
    return {
    }
  },

  data() {
    return {
    }
  },

  computed: {

    demoCompleted: {
      get() {
        return localStorage.getItem('demoCompleted') ?? false;
      },
      set(val) {
        localStorage.setItem('demoCompleted', val);
      }
    },

    introRead: {
      get() {
        return localStorage.getItem('introRead') ?? false;
      },
      set(val) {
        localStorage.setItem('introRead', val);
      }
    },

    games: function() {
      let games = localStorage.getItem('tests')
      if (games == undefined) {
        return []
      } else {
        games = JSON.parse(games)
        console.log(games)
        games = games.map((el) => {
          console.log(el)
          let overall = ((el.endTime - el.startTime)/1000).toFixed(1)
          let dt = new Date(el.startTime)
          
          return {
            'mode': el.mode,
            'date': `${dt.getFullYear()}-${(dt.getMonth() + 1)}-${dt.getDate()}<br />${dt.getHours()}:${String(dt.getMinutes()).padStart(2, "0")}`,
            'score': {
              'overall': overall
            }
          }
        })
        return games.sort((a, b) => {return b.score.overall - a.score.overall}).reverse()
      }
    }
  },

  created() {

    this.canDownload = !!localStorage.getItem('rating') && !!localStorage.getItem('speed') && !!localStorage.getItem('typos')
  },

  mounted() {

  },

  methods: {


  },

})
</script>
<style scope>
.link-disabled {
  opacity: 0.2;
  pointer-events: none;
}
.ranking {
  margin: 0 auto; 
  font-size: 16pt;
}
.ranking td {
  border: 1px solid #ededed;
  text-align: center;
  padding: 2pt 10pt;
}

.menu-title {
  display: block;
  font-size: 3rem;
  text-align:center;
  text-transform: uppercase;
}

.results {
  display: block;
  font-size: 1.7rem;
  font-weight: bold;
  margin: 4pt 10%;
  padding: 8pt auto;
  text-align: center;
  color: black;
}

.menu-item {
  display: block;
  font-size: 1.8rem;
  margin: 4pt 10%;
  padding: 8pt auto;
  text-align:center;
  border: 1pt solid #eee;
  border-radius: 5pt;
  background: linear-gradient(#fff, #eee);
  transition: border 0.3s, color 0.3s, font-weight 0.3s;
  text-decoration: none;
  color: black;
}

.menu-item:hover {
  border: 1pt solid black;
  color: black;
  /*font-weight: bold;*/
}

</style>
