<script>
  import { currentProjectMetadata } from "../stores";
</script>

<h3 class=widget-heading>Contact us</h3>
{#if $currentProjectMetadata}
  {#each $currentProjectMetadata.metadata as org}
    {#if org.type === 'http://ns.dasch.swiss/repository#Organization' && org.address && org.email}
    <h5 class=label>Address</h5>
    <div class=data>{org.name[0]}</div>
    <span class=data>{org.address.postalCode}</span>
    <span class=data>{org.address.addressLocality}</span>
    <div class=data>{org.address.streetAddress}</div>
    <h5 class=label>Email</h5>
    <div class=data>{org.email}</div>
    <h5 class=label>Website</h5>
    <a href={`https://${org.email.split('@')[1]}`} rel=external>{org.email.split('@')[1]}</a>
    <h5 class=label>Telephone</h5>
    <div class=data>+41 61 123 45 67</div>
    {/if}
  {/each}
{/if}
