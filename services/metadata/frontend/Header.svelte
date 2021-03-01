<script lang="ts">
  import Menu from "./Menu.svelte";
</script>

<header>
  <div class="header">
    <a href="." class="header-left">
      <img class="logo" src="https://dasch.swiss/content/images/2021/02/DaSCH_Logo_RGB.jpeg" alt="DaSCH logo"/>
      <h1 class="title">Repository Explorer</h1>
    </a>
    <div class="header-right">
      <input class="searchbar-in-header" type="text" name="searchbar" placeholder="search..." />
      <button class="btn xs-hidden">
        <svg class="icon w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </button>
      <button class="btn">
        <!-- TODO: onclick -->
        <svg class="icon w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
      </button>
      <button class="btn">
        <!-- TODO: onclick -->
        <svg class="icon w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>
    </div>
  </div>
  <input type="text" class="searchbar" name="searchbar" placeholder="search...">
  <Menu>
    <a class="menu-item" href=".">dasch.swiss</a>
    <a class="menu-item" href=".">app.dasch.swiss</a>
    <a class="menu-item" href=".">admin.dasch.swiss</a>
  </Menu>
</header>

<style>
  header {
    background-color: #c9c9c9;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-left {
    padding: 0px;
  }
  
  .header-right {
    padding: 0.5rem 0rem;
    margin-right: 0.25rem;
  }
  
  .logo {
    height: 5rem;
    vertical-align: middle;
    cursor: pointer;
    display: none;
  }
  
  .title {
    color: rgb(90, 90, 90);
    padding: 12px;
    white-space: nowrap;
    font-size: 1rem;
    display: inline-block;
  }

  .searchbar-in-header {
    display: none;
    padding: 0.25rem;
    vertical-align: middle;
    line-height: 1.5rem;
    box-sizing: border-box;
  }

  .searchbar {
    display: block;
    box-sizing: border-box;
    margin: 0.25rem auto;
    padding: 0.25rem;
    width: 90%;
  }

  .btn {
    display: inline-block;
    vertical-align: middle;
    border-radius: 0.25rem;
    cursor: pointer;
    background-color: inherit;
    border: none;
    padding: 0px;
  }
  .btn:hover {
    background-color: gray;
  }
  .btn:focus {
    outline: none;
  }
  
  .icon {
    width: 1.5rem;
    height: 1.5rem;
    margin: 0.25rem;
  }
  
  .menu-item {
    display: block;
    padding: 0.5rem;
  }
  .menu-item:hover {
    background-color: rgb(218, 218, 218);
  }
  
  /*
  form {
    padding: 0px 12px;
    border-radius: 16pt;
  }
  input {
    margin: 0px; 
  } */

  /* for tiny screens? */
  /* @media screen and (max-width: 650px) {
    .logo {
      display: none;
    }
    .header {
      padding: 16px 0px;
    }
  }
  @media screen and (max-width: 450px) {
    .header {
      display: block;
      text-align: center;
    }
    a.title {
      display: block;
      padding: 12px;
    }
    .header-right {
      padding: 12px;
    }
    form {
      display: inline;
    }
  } */

  @media screen and (min-width: 450px){
    .searchbar-in-header {
      display: inline-block;
    }
    .searchbar {
      display: none !important;
    }
    .xs-hidden {
      display: none;
    }
  }
  
  @media screen and (min-width: 640px){
    .logo {
      display: inline-block;
    }
  }

</style>
