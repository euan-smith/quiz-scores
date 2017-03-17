<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style>
  *{
    margin: 0;
    padding: 0;
    border: 0;
  }
  #app, body, html {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  h1{
    font-size: 10vh;
    padding-bottom: 0.5em;
  }
  h2{
    padding-bottom: 1em;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  .page-title{
    flex: 0 0 auto;
  }
  .page{
    background: #eee;
    width: 100%;
    height:100%;
    color: black;
    display: flex;
    flex-direction: column;
    /*align-items: center;*/
  }
  .page-list{
    position: relative;
    flex: 1 1 auto;
  }
  .page-footer{
    position: relative;
    flex: 0 0 auto;
  }
  .item-line{
    position: absolute;
    width:95%;
    left:50%;
    transform: translate(-50%,0);
    padding: 0.5%;
    background: white;
    box-shadow: -2px 3px 18px 2px rgba(0,0,0,0.2);
  }
</style>
