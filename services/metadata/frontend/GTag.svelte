<script>
  import { cookiesAgreement } from "./store";

  // creating window property which triggers the post-render update
  window.gtag = {};
  // enable GA for PROD env only
  // const hostname = 'meta.dasch.swiss';
  const hostname = 'localhost';

  window.gtag.update = function () {
    if(window.location.hostname === hostname && $cookiesAgreement) {
      console.log('YESSSSSSS')
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-9MD8RKZJHE');
    }
  }
</script>
