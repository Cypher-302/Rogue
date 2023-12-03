const axios = require('axios');

const firstUrl = 'https://pin.it/4i0WYZ5';
const secondUrl = 'https://img00.deviantart.net/eb7d/i/2016/271/a/7/dark_souls_3__ashen_one_by_menaslg-daj7agh.jpg'; //https://www.instagram.com/p/Ch4jmqgO6BB/?igshid=MDJmNzVkMjY=  https://zetcode.com/javascript/axios/
const upto = 1;
let percentDiff = 0, timeTotal = 0;
let firstRes, secondRes = '';


(async () => {
  for (let i = 0; i < upto; i++) {

    let start = Date.now();

    //console.time('total')
    firstRes = await firstTest();
    let secondTime = Date.now();
    secondRes = await secondTest();
    //console.timeEnd('total');

    let end = Date.now();
    let timeDiff = end - start;
    let instDiff = end - secondTime;
    timeTotal += timeDiff / 1000;
    percentDiff += (instDiff / timeDiff) * 100;
    console.log(`${i + 1}: ${(timeDiff / 1000).toFixed(2)}s (${(timeTotal).toFixed(2)}s total)`);
    console.log(secondRes.request.socket._host) //
  }

  percentDiff /= upto;
  console.log(`The second link took: ${percentDiff.toFixed(2)}% of the total time`);
})();


function firstTest() {
  return axios.get(firstUrl);
}

function secondTest() {
  return axios.get(secondUrl);
}
