<script lang="ts">
  import { replace } from 'svelte-spa-router';
  import type { ProjectMetadata } from '../interfaces';
  
  export let projectMetadata: ProjectMetadata;
</script>

<section>
  <div class=header>
    <h5>{ projectMetadata.name }</h5>
  </div>
  <div class=content>{ projectMetadata.description }</div>
  <div class=footer>
    <button on:click={() => replace(`#/project/${projectMetadata.id}`)}>Read more</button>
  </div>
</section>

<style>
  section {
    /* border: 1px solid #000; */
    border: 1px solid #cdcdcd;
    border-radius: 5px;
    background-color: #fff;
    padding: 5px 5vw;
    margin: 5px;
    width: 75vw;
    float: left;
    box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.3);
  }
  .header{
    height: 30px;
    padding-top: 10px;
  }
  .header h5 {
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
    color: var(--lead);
  }
  .footer a {
    display: flex;
    justify-content: center;
    height: 20px;
  }
  @media screen and (min-width: 768px) {
    section {
      width: 240px;
      height: 208px;
      padding: 10px 30px;
      margin: 10px;
    }
    .content {
      -webkit-line-clamp: 7;
      height: 107px;
      margin: 5px 0 25px;
    }
  }
  @media screen and (min-width: 1200px) {
    section {
      margin: 5px;
    }
  }
</style>
