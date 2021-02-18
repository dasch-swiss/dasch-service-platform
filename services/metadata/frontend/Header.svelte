<script>
  import Menu from "./Menu.svelte";
</script>

<div class="header">
  <div class="header-left">
    <img src="https://dasch.swiss/content/images/2021/02/DaSCH_Logo_RGB.jpeg" alt="DaSCH logo"/>
    <a class="title" href=".">Repository Explorer</a>
  </div>
  <div class="header-right">
    <form>
      <input type="text" name="searchbar" placeholder="search..." />
    </form>
    <Menu>
      <a href="."><li>dasch.swiss</li></a>
      <a href="."><li>app.dasch.swiss</li></a>
      <a href="."><li>admin.dasch.swiss</li></a>
    </Menu>
  </div>
</div>

<style>
  .header {
    background-color: rgb(185, 184, 184);
    /* background-color: rgb(89, 73, 167); */ /* DaSCH Purple */
    /* color: whitesmoke; */
    color: rgb(90, 90, 90);
    font-weight: bold;
    display: inline-flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
  .header-right {
    display: inline-flex;
    padding: 0px 16px;
  }
  img {
    max-height: 80px;
    vertical-align: middle;
    cursor: pointer;
  }
  a.title {
    color: rgb(90, 90, 90);
    padding: 12px;
    /* color: whitesmoke; */  /* to go with dasch purple */
  }
  form {
    padding: 0px 12px;
    border-radius: 16pt;
  }
</style>
