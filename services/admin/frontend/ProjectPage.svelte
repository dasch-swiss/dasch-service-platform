<script>
    import {getProject, currentProject, currentUser} from "./store";
    import {onMount} from 'svelte';
    import Content from "./Modal/Content.svelte";
    import Modal from 'svelte-simple-modal';

    export let token;
    const projectID = window.location.pathname.split("/")[2];

    onMount(async () => {
        currentUser.subscribe(async userInfo => {
            if ($currentUser.token) {
                await getProject(userInfo.token, projectID);
            }
        });
    });

</script>

<div class="projects">
    <div>
        <h1>Project Info</h1>
    </div>
    {#if $currentUser.token}
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
    {:else}
        <div>
            <p>You must be logged in to access the project info.</p>
        </div>
    {/if}
</div>
