<script lang="ts">
    import { getContext } from 'svelte';
    import Dialog from './Dialog.svelte';

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

    const openDialog = () => {
        open(
            Dialog,
            {
                editMode: modalType == 'edit',
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
        <button on:click={openDialog}>+</button>
    </div>
    {/if}
    {#if modalType == 'edit'}
        <div class="edit-project">
            <button on:click={openDialog}>Edit</button>
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