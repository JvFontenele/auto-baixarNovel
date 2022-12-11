const puppeteer = require("puppeteer");
const fs = require("fs");

async function buscar(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const caps = await page.evaluate(() => {
    const p = document.querySelector("#reading-content");
    const cap = p.innerHTML;
    return cap;
  });
  await browser.close();
  return caps;
}

async function salvar(url, num) {
  console.log(`capitulo - ${num}`);
  const cap = await buscar(url);
  await fs.appendFile(
    "novel.html",
    `<div id="capitulo-${num}">${cap}</div>`,
    function (err) {
      if (err) throw err;
    }
  );
  console.log(`salvo`);
}

// site wuxiaworldsite

async function buscarWuxiaworld(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 800,
  });
  await page.goto(url);
  await autoScroll(page);

  const caps = await page.evaluate(() => {
    const p = document.querySelector(".read-container");

    const cap = p.innerHTML;
    return cap;
  });
  await browser.close();
  return caps;
}

async function salvarWuxiaworld(url, num) {
  console.log(`capitulo - ${num}`);

  const cap = await buscarWuxiaworld(url);
  await fs.appendFile(
    "novel_Global_Tower_Obtain_the_SSS_Talent.html",
    `<div id="capitulo-${num}">${cap}</div>`,
    function (err) {
      if (err) throw err;
    }
  );
  console.log(`salvo`);
}

// função de scroll
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

(async () => {
  for (let index = 140; index <= 200; index++) {
    const num = ("000" + index).slice(-3);
    const url = `https://wuxiaworldsite-com.translate.goog/novel/global-towers-starting-with-the-sss-rank-talent-god-tier-extraction-gkp/chapter-${index}/?1&_x_tr_sl=en&_x_tr_tl=pt&_x_tr_hl=pt-BR&_x_tr_pto=wapp`;
    await salvarWuxiaworld(url, num);
  }
})();
