<script>
    import {getProject, currentProject, currentUser} from "./store";
    import {onMount} from 'svelte';
    import Content from "./Modal/Content.svelte";
    import Modal from 'svelte-simple-modal';

    export let token;
    const projectID = window.location.pathname.split("/")[2];

    onMount(async () => {
        currentUser.subscribe(async info => {
            console.log("ProjectPage currentUser: ", $currentUser)
            await getProject(info.token, projectID);
        });
    });

</script>

<div class="projects">
    <div>
        <h1>Project Info</h1>
    </div>
    <div class="info">
        <p>Short Code: {$currentProject.shortCode}</p>
        <p>Short Name: {$currentProject.shortName}</p>
        <p>Long Name: {$currentProject.longName}</p>
        <p>Description: {$currentProject.description}</p>
    </div>
    <!--    Modal for editing a project-->
    <Modal>
        <Content modalType="edit" token="{$currentUser.token}"/>
    </Modal>
</div>
