<script lang="ts">
  import { ProjectService } from "./project-service";
  
  let projectService = new ProjectService();
  export let name = projectService.name;
  export let description = projectService.description;
</script>

<style>
  section {
    border: 1px solid #000;
    border-radius: 10px;
    background-color: #fff;
    padding: 10px;
    margin: 10px;
    height: 200px;
    width: 200px;
    float: left;
  }

  div {
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  h3, a {
    text-align: center;
  }

  a {
    margin: 10px 0;
    float: right;
  }
</style>

<section>
  <h3>{ name }</h3>
  <div>{ description }</div>
  <a href="#">Read more</a>
</section>