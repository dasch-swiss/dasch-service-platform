<script>
  // enable GA for PROD env only
  const hostname = 'meta.dasch.swiss';
  // const hostname = 'localhost';

  if(window.location.hostname === hostname) {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-9MD8RKZJHE');
  }
</script>
