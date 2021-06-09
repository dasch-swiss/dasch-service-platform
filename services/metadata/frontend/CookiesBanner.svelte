<script lang="ts">
  import { cookiesAgreement, getCookie, setCookie } from "./cookies-service";

  // prevents display modal locally
  const noLocalhost = window.location.hostname !== 'localhost';
  let modalOn = getCookie('cookiesAgreement') ? false : true;

  const handleModal = (all?: boolean) => {
    modalOn = !modalOn;
    if(all) {
      cookiesAgreement.set(true);
      window.gtag.update();
      setCookie('cookiesAgreement', 'true');
    } else {
      setCookie('cookiesAgreement', 'false');
    }
  };
</script>

{#if modalOn && noLocalhost}
  <div id="cookieConsent">
    <div class="modal-wrapper">
      <div class="modal-text">
        DaSCH uses cookies to personalize content and analyze access to its websites. Find more information on
        <a href="https://dasch.swiss/cookie-policy/" target=_blank>cookie policy</a>,
        <a href="https://dasch.swiss/eula/" target=_blank>EULA</a> and
        <a href="https://dasch.swiss/privacy-policy/" target=_blank>privacy policy</a>.
      </div>
      <div class="modal-buttons">
        <button on:click={() => handleModal()} class="btn-accept-necessary">Accept only essential cookies</button>
        <button on:click={() => handleModal(true)} class="btn-accept-all">Accept all cookies</button>
      </div>
    </div>
  </div>
{/if}

<style>
a {color: var(--dasch-violet)}
#cookieConsent {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  background-color: var(--dasch-grey-2);;
}
.modal-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: none;
}
.modal-text {
  padding: 1rem 1.5rem;
  line-height: 1.3;
  align-self: center;
}
.modal-buttons {
  padding: 0 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
button {
  padding: 0.6rem 1rem;
  font-size: 100%;
  border-radius: 0.2rem;
  margin: 0 0.5rem 0.5rem;
}
.btn-accept-necessary,
.btn-accept-all:hover {
  border: 1px solid var(--dasch-violet);
  background-color: #fff;
  color: var(--dasch-violet);
}
.btn-accept-necessary:hover,
.btn-accept-all {
  border: 1px solid transparent;
  background-color: var(--dasch-violet);
  color: white;
}
@media screen and (min-width: 768px) {
  .modal-wrapper {flex-direction: row;}
  .modal-text {
    padding: 1rem 1.5rem;
    width: 50%;
  }
  .modal-buttons {
    margin-top: 0.5rem;
    padding: 1rem;
    flex-direction: row;
    width: 50%;
  }
  button {width: auto;}
}
@media screen and (min-width: 1200px) {
  .modal-wrapper {
    margin: 0 auto;
    max-width: 1200px;
  }
}
</style>
