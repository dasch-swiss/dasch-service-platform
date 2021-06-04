<script>
  import { cookiesAgreement } from "./cookies-service";

  // enable GA for PROD env only
  // const hostname = 'meta.dasch.swiss';
  const hostname = 'meta.test.dasch.swiss';

  // creates window property which triggers post-render component update
  window.gtag = {};
  window.gtag.update = function () {
    gTag();
  };

  const gTag = () => {
    if(window.location.hostname === hostname && $cookiesAgreement) {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-9MD8RKZJHE');
    };
  };

  gTag();
</script>
