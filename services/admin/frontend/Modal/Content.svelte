<script>
    import { getContext } from 'svelte';
    import Dialog from './Dialog.svelte';

    const { open } = getContext('simple-modal');

    let name;
    let status = 0;

    const onCancel = (text) => {
        name = '';
        status = -1;
    }

    const onOkay = (text) => {
        name = text;
        status = 1;
    }

    const showDialog = () => {
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
</script>
<section>
    <div class="add-project">
        <button on:click={showDialog}>+</button>
    </div>
</section>

<style>
    .add-project {
        float: right;
    }

    .add-project button {
        margin-top: 40%;
        height: 40px;
        width: 40px;
        border-radius: 50%;
        font-size: 32px;
    }
</style>