<script>
    import { getContext } from 'svelte';
    import Dialog from './Dialog.svelte';
    import { currentProject } from "../store";

    const { open } = getContext('simple-modal');

    let name;
    let status = 0;

    export let modalType = 'create' | 'edit';

    const onCancel = (text) => {
        name = '';
        status = -1;
    }

    const onOkay = (text) => {
        name = text;
        status = 1;
    }

    const openCreateProjectDialog = () => {
        open(
            Dialog,
            {
                onCancel,
                onOkay
            },
            {
                closeButton: false,
                closeOnEsc: false,
                closeOnOuterClick: false,
            }
        );
    };

    const openEditProjectDialog = () => {
        open(
            Dialog,
            {
                editMode: true,
                shortCode: $currentProject.shortCode,
                shortName: $currentProject.shortName,
                longName: $currentProject.longName,
                description: $currentProject.description,
                onCancel,
                onOkay
            },
            {
                closeButton: false,
                closeOnEsc: false,
                closeOnOuterClick: false,
            }
        );
    };
</script>
<section>
    {#if modalType == 'create'}
    <div class="create-project">
        <button on:click={openCreateProjectDialog}>+</button>
    </div>
    {/if}
    {#if modalType == 'edit'}
        <div class="edit-project">
            <button on:click={openEditProjectDialog}>Edit</button>
        </div>
    {/if}
</section>

<style>
    .create-project {
        float: right;
    }

    .create-project button {
        margin-top: 40%;
        height: 40px;
        width: 40px;
        border-radius: 50%;
        font-size: 32px;
    }
</style>