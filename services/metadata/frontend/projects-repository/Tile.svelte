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
    box-shadow: var(--shadow-2);
  }

  button {
    display: inline-block;
    vertical-align: middle;
    border-radius: 0.25rem;
    background-color: #fff;
    /* border: none; */
    border: 1px solid var(--lead);
    /* margin: 0 -10px 20px 20px; */
    padding: 5px 20px;
    /* color: deeppink; */
    color: var(--lead);
    box-shadow: var(--shadow-1);
  }
  button:hover {
    color: #fff;
    background-color: var(--lead);
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
    margin: 10px 0;
    color: var(--lead);
    font-size: 0.8em;
    text-align: center;
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
