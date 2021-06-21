<script>
    import { getContext } from 'svelte';
    import {createProject} from "../store";

    export let onCancel = () => {};
    export let onOkay = () => {};

    const { close } = getContext('simple-modal');

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
        await createProject(shortCode, shortName, longName, description);
        close();
    }

    $: onChange(shortCode);
    $: onChange(shortName);
    $: onChange(longName);
    $: onChange(description);
</script>

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


<div>
    <h2>Create a new project</h2>
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