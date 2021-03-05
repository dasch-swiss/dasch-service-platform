<script lang="ts">
  export let name: string;
  export let description: string;
</script>

<section>
  <div class=header>
    <h5>{ name }</h5>
  </div>
  <div class=content>{ description }</div>
  <div class=footer>
    <a href="/">Read more</a>
  </div>
</section>

<style>
  section {
    border: 1px solid #000;
    border-radius: 5px;
    background-color: #fff;
    padding: 5px 5vw;
    margin: 5px;
    width: 75vw;
    float: left;
  }
  .header{
    height: 30px;
    padding-top: 10px;
  }
  .header h5 {
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden; 
    white-space: nowrap;
    margin: 0;
  }
  .content {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 0.8em;
    height: 45x;
    margin: 10px 0 25px;
  }
  .footer {
    font-size: 0.8em;
    margin: 10px 0;
  }
  .footer a {
    display: flex;
    justify-content: center;
    height: 20px;
  }
  @media screen and (min-width: 768px) {
    section {
      width: 240px;
      height: 248px;
      padding: 10px 30px;
      margin: 10px;
    }
    .content {
      -webkit-line-clamp: 6;
      height: 90px;
      margin: 10px 0 50px;
    }
  }
  @media screen and (min-width: 1200px) {
    section {
      margin: 5px;
    }
  }
</style>
