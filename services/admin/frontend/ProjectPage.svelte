<script>
    import {getProject, currentProject, currentUser} from "./store";
    import { onMount } from 'svelte';
    import Content from "./Modal/Content.svelte";
    import Modal from 'svelte-simple-modal';
    import KeyCloak from 'keycloak-js';

    let kc = new KeyCloak("/keycloak.json");

    let logged_in = null;

    kc.init({onLoad: "check-sso", checkLoginIframe: false}).then((auth) => {
        logged_in = auth;
        if (auth) {
            logged_in = true;

            kc.loadUserInfo().then((user) => {
                user.token = kc.idToken;
                currentUser.set(user);
            })
        }
    })
    export let token;
    const projectID = window.location.pathname.split("/")[2];

    onMount(async () => {
      currentUser.subscribe(async info => {
          await getProject(info.token, projectID);
      });
    });

</script>

<div class="projects">
    <div class="header">
        <pre>{JSON.stringify($currentUser, null, 2)}</pre>
        <div><p>{JSON.stringify($currentUser.token, null, 2)}</p></div>
        <div class="login-logout">
            {#if logged_in && $currentUser.preferred_username}
                <div>
                    {$currentUser.preferred_username}
                    <button on:click={() => { kc.logout(); }}>
                        Logout
                    </button>
                </div>
            {/if}

            {#if logged_in == false}
                <div>
                    <button on:click={() => { kc.login(); }}>
                        Login
                    </button>
                </div>
            {/if}
        </div>
    </div>
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

<style lang="scss">
    .projects {
        width: 96%;
        padding-left: 2%;
        padding-right: 2%;
    }

    .projects .header .login-logout {
        float: right;
    }

    .projects .header .login-logout button{
        color: white;
        background: #1e90ff;
        border: 1px #1e90ff solid;
        border-radius: 5px;
        padding: 5px 10px;
    }

    .projects .header .login-logout button:hover{
        background: #027cf4;
    }
</style>