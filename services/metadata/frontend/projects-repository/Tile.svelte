<script lang="ts">
  import { Router, Link } from 'svelte-routing';
  import type { ProjectMetadata } from '../interfaces';

  export let projectMetadata: ProjectMetadata;
</script>

<section>
  <div class=header>
    <h5>{ projectMetadata.name }</h5>
  </div>
  <div class=content>{ projectMetadata.description }</div>
  <div class=footer>
    <button>
      <Router>
        <Link to={`/projects/${projectMetadata.id}`} class=regular-link>
          Read more
        </Link>
      </Router>
    </button>
  </div>
</section>

<style>
  section {
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
    border: 1px solid var(--lead-colour);
    padding: 5px 20px;
    color: var(--lead-colour);
    box-shadow: var(--shadow-1);
  }
  button:hover {
    color: #fff;
    background-color: var(--lead-colour);
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
    color: var(--lead-colour);
    font-size: 0.8em;
    text-align: center;
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
    section {margin: 5px;}
  }
</style>
