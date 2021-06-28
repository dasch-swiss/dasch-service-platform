<script>
    import {getContext, onMount} from 'svelte';
    import {createProject, editProject, currentProject} from "../store";

    export let onCancel = () => {};
    export let onOkay = () => {};

    export let editMode;

    const { close } = getContext('simple-modal');

    const projectID = window.location.pathname.split("/")[2];
    let shortCode;
    let shortName;
    let longName;
    let description;

    let onChange = () => {};

    function _onCancel() {
        onCancel();
        close();
    }

    async function _onOkay(){
        if (editMode) {
            await editProject(projectID, shortCode, shortName, longName, description);
        } else {
            await createProject(shortCode, shortName, longName, description);
        }
        close();
    }

    $: onChange(shortCode);
    $: onChange(shortName);
    $: onChange(longName);
    $: onChange(description);

    onMount(() => {
        if (editMode) {
            shortCode = $currentProject.shortCode;
            shortName = $currentProject.shortName;
            longName = $currentProject.longName;
            description = $currentProject.description;
        }
    });
</script>

<div>
    {#if editMode}
        <h2>Edit project info</h2>
    {:else}
        <h2>Create a new project</h2>
    {/if}
</div>
<div>
    <p>Short Code:</p>
    <input
        type="text"
        bind:value={shortCode} />
    <p>Short Name:</p>
    <input
            type="text"
            bind:value={shortName} />
    <p>Long Name:</p>
    <input
            type="text"
            bind:value={longName} />
    <p>Description:</p>
    <input
            type="text"
            bind:value={description} />
</div>



<div class="buttons">
    <button on:click={_onCancel}>
        Cancel
    </button>
    <button on:click={_onOkay}>
        Okay
    </button>
</div>

<style>
    h2 {
        font-size: 2rem;
        text-align: center;
    }

    input {
        width: 100%;
    }

    .buttons {
        display: flex;
        justify-content: space-between;
    }
</style>