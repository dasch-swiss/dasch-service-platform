<script>
    import {Router, Route} from "svelte-routing";
    import Projects from "./Projects.svelte";
    import ProjectPage from "./ProjectPage.svelte";
    import Redirect from "./Redirect.svelte";
    import Header from "./Header.svelte";

    export let url = "";

</script>

<Header />
<div class=wrapper>
    <div class=content-container>
        <Router url="{url}">
            <Route path="/projects/:id"><ProjectPage /></Route>
            <Route path="/projects"><Projects /></Route>
            <Route path="/">
                <Redirect to="/projects" />
            </Route>
        </Router>
    </div>
</div>
