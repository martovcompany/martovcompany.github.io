function web3IsRunning() {
  console.log('web3.js is running');
}
web3IsRunning();

async function myHandleResponseFunction(data) {
  console.log('myHandleResponseFunction is running');
  console.warn('UE4 Response received!', data);

  switch (data) {
    case 'OnMetaForgedLoaded':
      console.log('Meta Forged player LOADED from UE4');

      // Get all cookies with eth user data from martoverse.com
      const allCookies = document.cookie;
      console.log('allCookies from OnMetaForgedLoaded:', allCookies);

      // Parse cookies as js Object
      if (allCookies) {
        const parseCookies = (str) =>
          str
            // separate key-value pairs from each other
            .split(';')
            // separate keys from values in each pair
            .map((v) => v.split('='))
            // create an object with all key-value pairs
            .reduce((acc, v) => {
              acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(
                v[1].trim()
              );
              return acc;
            }, {});
        const res = parseCookies(allCookies);
        console.log('parseCookies res from OnMetaForgedLoaded:', res);
        console.log(
          'ethUserAddress',
          res.userEthAddress,
          'tovBalance',
          res.tovBalance,
          'headwear',
          res.Headwear,
          'eyewear',
          res.Eyewear
        );
        // Pass eth user data from cookie to the game
        emitUIInteraction({
          ethUserAddress: res.userEthAddress,
          tovBalance: res.tovBalance,
          Headwear: res.Headwear,
          Eyewear: res.Eyewear,
        });
      } else {
        console.log('No cookies from OnMetaForgedLoaded');
      }
      break;
    case 'OnGameStateLoaded':
      console.log('Game state LOADED from UE4');
      console.log('allCookies from OnGameStateLoaded:', allCookies);

      // Parse cookies as js Object
      if (allCookies) {
        const parseCookies = (str) =>
          str
            // separate key-value pairs from each other
            .split(';')
            // separate keys from values in each pair
            .map((v) => v.split('='))
            // create an object with all key-value pairs
            .reduce((acc, v) => {
              acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(
                v[1].trim()
              );
              return acc;
            }, {});
        const res = parseCookies(allCookies);
        console.log('parseCookies res from OnGameStateLoaded:', res);
        console.log(
          'ethUserAddress',
          res.userEthAddress,
          'tovBalance',
          res.tovBalance,
          'headwear',
          res.Headwear,
          'eyewear',
          res.Eyewear
        );
        // Pass eth user data from cookie to the game
        emitUIInteraction({
          ethUserAddress: res.userEthAddress,
          tovBalance: res.tovBalance,
          Headwear: res.Headwear,
          Eyewear: res.Eyewear,
        });
      } else {
        console.log('No cookies from OnGameStateLoaded');
      }
      break;
  }
}

console.log('isPlaying.a outside of the registerListener:', isPlaying.a);

isPlaying.registerListener(async function (val) {
  console.log('registerListener is called');
  addResponseEventListener('handle_responses', myHandleResponseFunction);
  console.log('isPlaying.a in registerListener:', isPlaying.a);
});

console.log('isPlaying Obj:', isPlaying);
