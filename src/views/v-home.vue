<template>
<section>
  <div class="home component-padding">
    <div class="home__areYouReady">
      <div class="home__areYouReady__line1"><span class="header-font">Are you ready</span></div>
      <div class="home__areYouReady__line2"><span>for a</span></div>
      <div class="home__areYouReady__line3"><span class="header-font"><span class="home__areYouReady__newEra header-font">new era</span> of gaming?</span></div>
    </div>
  </div>
</section>
</template>

<script>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home__areYouReady {
  display: grid;
  align-content: center;
  align-items: center;
  text-align: center;
  padding: 9rem 0;
}
.home__areYouReady__line1 {
  font-size: 4.8rem;
  text-transform: uppercase;
}
.home__areYouReady__line2 {
  font-size: 2.4rem;
  margin: 4.8rem 0rem;
}
.home__areYouReady__line3 {
  font-size: 4.8rem;
  text-transform: uppercase;
}
.home__areYouReady__newEra {
  color: var(--brand-color-main);
}
</style>