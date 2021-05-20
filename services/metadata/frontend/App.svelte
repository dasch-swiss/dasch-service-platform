<script lang="ts">
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";
  import { Router, Route } from "svelte-routing";
  import ProjectsRepository from "./projects-repository/ProjectsRepository.svelte";
  import ProjectPage from "./project-page/ProjectPage.svelte";
  import Redirect from "./Redirect.svelte";

  export let url = "";
</script>

<Header />
  <div class=wrapper>
    <div class=content-container>
      <Router url="{url}">        
        <Route path="/projects/:id"><ProjectPage /></Route>
        <Route path="/projects"><ProjectsRepository /></Route>
        <Route path="/">
          <Redirect to="/projects?_page=1&_limit=9" />
          <!-- <ProjectsRepository /> -->
        </Route>
      </Router>
    </div>
  </div>
<Footer />

<style>
  .content-container {
    flex-direction: row;
  }
@media screen and (min-width: 992px) {
  .wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex: 1 0 auto;
  }
  .content-container {
    display: flex;
    flex-direction: row;
    max-width: 1920px;
  }
}
</style>
