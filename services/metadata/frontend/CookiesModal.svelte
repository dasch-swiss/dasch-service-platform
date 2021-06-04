<script lang="ts">
  import { cookiesAgreement, getCookie, setCookie } from "./cookies-service";

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

{#if modalOn}
  <div id="cookieConsent">
    <div class="cookie-consent-modal">
      <div class="modal-content-wrapper">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Cookies settings</h3>
          </div>
          <div class="modal-body">
            We use cookies to personalize content and analyze access to our websites. Please choose whether you 
            accept only cookies that are necessary for the functioning of the website or whether you accept also
            analytical cookies. For more information, please refer to our
            <a href="https://dasch.swiss/cookie-policy/" target=_blank>cookie policy</a>,
            <a href="https://dasch.swiss/eula/" target=_blank>EULA</a> and
            <a href="https://dasch.swiss/privacy-policy/" target=_blank>privacy policy</a>.
          </div>
          <div class="modal-footer">
            <div class="buttons">
              <button on:click={() => handleModal()} class="btn-accept-necessary">Accept only necessary cookies</button>
              <button on:click={() => handleModal(true)} class="btn-accept-all">Accept all cookies</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
a {color: var(--dasch-violet)}
.cookie-consent-modal {
  z-index: 2;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  padding-top: 0;
  width: 100%;
  height: 100%;
}
.modal-content-wrapper {
  position: relative;
  margin: 5vh 0;
}
.modal-content {
  border: none;
  margin: 0 auto;
}
.modal-content {
  background-color: #fefefe;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
  padding: 0;
  max-width: 70vh;
  border-radius: 0.3rem;
}
.modal-header {
  text-align: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.modal-header h3 {
  margin: 0;
  font-size: 130%;
  font-weight: 500;
  position: relative;
  top: 0.2rem;
}
.modal-body {
  padding: 1rem;
  line-height: 1.3;
}
.modal-footer {padding: 1rem 0.5rem 0.5rem;}
.modal-footer .buttons {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
}
button {
  padding: 0.6rem 1rem;
  font-size: 100%;
  border-radius: 0.2rem;
  margin: 0 0.5rem 0.5rem;
  width: 100%;
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
  .cookie-consent-modal {padding-top: 25vh;}
  button {width: auto;}
}
</style>
