<script>
    import {getProjects, deleteProject, projectsList, userInfo} from "./store";
    import {onMount} from 'svelte';
    import {Router, Link} from "svelte-routing";
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
                userInfo.set(user)
            })
        }
    })

    onMount(async () => {
        await getProjects();
    });


</script>
<div class="projects">
    <div class="header">
        <div class="login-logout">
            {#if logged_in && $userInfo.preferred_username}
                <!--            <pre>{JSON.stringify($userInfo, null, 2)}</pre>-->
                <div>
                    {$userInfo.preferred_username}
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
        <h1>Projects</h1>
    </div>
    <div class="list">
        {#each $projectsList as p}
           <li>
               <div class="name">
                   <Router>
                       <Link to={`/projects/${p.id}`}>
                           {p.longName}
                       </Link>
                   </Router>
               </div>
               <div class="delete">
                   <button on:click={deleteProject(p.id)}>X</button>
               </div>
           </li>
        {/each}
        <!--    Modal for creating a new project-->
        <Modal>
            <Content modalType="create"/>
        </Modal>
    </div>
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

    .projects .list {
        width: 50%;
        box-shadow: #c4c4c4 0px 0px 20px 6px;
        /* Border radius for Chrome, Webkit and other good browsers */
        -webkit-border-radius: 10px 10px 10px 10px;
        -moz-border-radius: 10px 10px 10px 10px;
        -border-radius: 10px 10px 10px 10px;
        border-radius: 10px 10px 10px 10px;
    }

    .list li {
        padding: 25px;
        list-style: none;
    }

    .list li:nth-child(odd) {
        background-color: #ebebeb;
    }

    .list li:hover {
        background-color: #cecece;
        cursor: pointer;

        .delete {
            display: inline;
        }
    }

    .list li:first-child {
        -webkit-border-radius: 10px 10px 0px 0px;
        -moz-border-radius: 10px 10px 0px 0px;
        -border-radius: 10px 10px 0px 0px;
        border-radius: 10px 10px 0px 0px;
    }

    .list li:last-child {
        -webkit-border-radius: 0px 0px 10px 10px;
        -moz-border-radius: 0px 0px 10px 10px;
        -border-radius: 0px 0px 10px 10px;
        border-radius: 0px 0px 10px 10px;
    }

    .list li .name {
        display: inline;
    }

    .list li .delete {
        float: right;
        display: none;
    }

    .list li .delete button {
        border: none;
        background: none;
    }
    
</style>
