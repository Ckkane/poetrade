import http from "http";
import express, { query, response } from "express";
import WebSocket, { WebSocketServer } from "ws";
import fs from "fs";
import { SocksProxyAgent } from "socks-proxy-agent";
import cors from "cors";
import axios from "axios";
import robotjs from "robotjs";

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const webSocketServer = new WebSocketServer({ server });

let queryes = [
  // Maps

  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"vivid-lifeforce\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"vivid-lifeforce\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

  '{"query":{"status":{"option":"online"},"have":["chaos"],"want":["fortress-map-tier-17"],"stock":{"min":1,"max":null}},"sort":{"have":"asc"},"engine":"new"}',
  '{"query":{"status":{"option":"online"},"have":["divine"],"want":["fortress-map-tier-17"],"stock":{"min":1,"max":null}},"sort":{"have":"asc"},"engine":"new"}',

  '{"query":{"status":{"option":"online"},"have":["chaos"],"want":["abomination-map-tier-17"],"stock":{"min":1,"max":null}},"sort":{"have":"asc"},"engine":"new"}',
  '{"query":{"status":{"option":"online"},"have":["divine"],"want":["abomination-map-tier-17"],"stock":{"min":1,"max":null}},"sort":{"have":"asc"},"engine":"new"}',

  '{"query":{"status":{"option":"online"},"have":["chaos"],"want":["ziggurat-map-tier-17"],"stock":{"min":1,"max":null}},"sort":{"have":"asc"},"engine":"new"}',
  '{"query":{"status":{"option":"online"},"have":["divine"],"want":["ziggurat-map-tier-17"],"stock":{"min":1,"max":null}},"sort":{"have":"asc"},"engine":"new"}',

  '{"query":{"status":{"option":"online"},"have":["chaos"],"want":["sanctuary-map-tier-17"],"stock":{"min":1,"max":null}},"sort":{"have":"asc"},"engine":"new"}',
  '{"query":{"status":{"option":"online"},"have":["divine"],"want":["sanctuary-map-tier-17"],"stock":{"min":1,"max":null}},"sort":{"have":"asc"},"engine":"new"}',

  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"devouring-fragment\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"devouring-fragment\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"exceptional-eldritch-ichor\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"exceptional-eldritch-ichor\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"exceptional-eldritch-ember\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"exceptional-eldritch-ember\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"eldritch-orb-of-annulment\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"eldritch-orb-of-annulment\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"eldritch-chaos-orb\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"eldritch-chaos-orb\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"veritanias-map\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"veritanias-map\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"al-hezmins-map\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"al-hezmins-map\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"barans-map\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"barans-map\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"droxs-map\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"droxs-map\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"incandescent-invitation\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"incandescent-invitation\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

  // Beats
  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"craicic-chimeral\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"craicic-chimeral\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"vivid-watcher\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"vivid-watcher\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"vivid-vulture\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"vivid-vulture\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"divination-scarab-of-completion\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
  // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"divination-scarab-of-completion\"],\"stock\":{\"min\":1,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
];

let proxyList = ["socks5://M1UWum:gVCgdA@168.80.203.219:8000"];


// sanya
let cookie = 'POESESSID=8356f1633c5fb8ad5b9c173149947414; cf_clearance=BvZvNqg0Eq9hhyEuVOEsYMJ6ToBq803xP_RutcRUxWQ-1749992546-1.2.1.1-qJacl1hH3viBJrb8F9izs26ZYeg5KlbVENlynQ.1CXONo0Hc8RncsvKXmsVXZi_m0S802idAVwHOBUCowa0NAR_tUEtFoGYu8VdeKcu488A2cRpTWsZoxBALE0oyUoA5YaUKgPaMzvl7lcthitlLw0VU..3Ckm7_GPYCmvsun5wOqSRJ77OsyQ1X3jur0YwL8BxLHvN4.rIyGmLPlbipKYRKdYOyzXNelZWQnt5UM9m4S6Ink51jhYTWq25JReFhFKFaU4z5.MWNAN6P4JVoewpQdvKITfHTTvyPExxwMRkVtQi3N58T7dNTaXayQZs.6tQ3lISLrtGk5EnZBBHvAb3.UWpVhR8J.q25SZjNj0kxIktKOdeJ5FX88Ux8rWWg';

// moe
// let cookie = 'POESESSID=3275376946b157c5dae455e99bd64918; cf_clearance=NI4bRdrTPtGYpyT4HLwojfW932GU16_poFXHXVICYjw-1749984131-1.2.1.1-rA5lr537.fGFKGZD4R8MxLsywlM1ioQpMdW0V0gTB3PYQuj_yv63WCeovteDkOOGoPKdxllMRBoyWaAAcLDjZvpTgNsNVk4ryEveEWRF_S.boxSWDB__42R6BkuOCS0Tg6EMRFa3cEbiDu247qFti4t.QwwrmAtCf7rUAhmQs4U_4BRaiLJqHxgWIVjlPDN8lU4LYSQSp5zow4EDeT.F5DPrQ.jx40QlGhgRVS4aKSZvIEW9Z2PS7kekhx_fXUFRru_V0k3XfrTiQboCtpb30M6AMBCKpYvBw66FZvbgXQ8ctx2_Jj6ahtKaBBYVXE8Vz4bnUo9Z7FmFb6fG_H84uXGjEPOBL1AVhOlxpkES_QLXAjA._tclqI1.EMGua0wt';



let interval = null;
let j = 0;
let i = 0;
let k = 0;
let league = "Mercenaries";

webSocketServer.on("connection", (ws) => {
  clearInterval(interval);

  i = 0;
//   j = 0;
  k = 0;

  let func = () => {
    if (i == queryes.length) i = 0;
    if (k == proxyList.length) k = 0;
    // if (j == cookieList.length) j = 0;

    // let httpsAgent = new SocksProxyAgent(proxyList[k]);

    const response = axios({
      // httpsAgent,
      method: "POST",
      url: `https://www.pathofexile.com/api/trade/exchange/${league}`,
      data: queryes[i],

      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Origin: "https://www.pathofexile.com",
        Referer: `https://www.pathofexile.com/trade/exchange/${league}`,
        "Content-Type": "application/json",
        Cookie:
          `${cookie}`,
      },
    });

    response
      .then((res) => {
        ws.send(JSON.stringify(res.data));
        console.log(res.data);
        i++;
        // j++;
        k++;
      })
      .catch((err) => console.log(err.message));
  };

//   setInterval(() => {
//     if (robotjs.getPixelColor(1724, 936) !== "e7eaea") {
//       ws.send(JSON.stringify({ message: true }));
//     }else{
//         // ws.send(JSON.stringify({ message: false }));
//     }
//   }, 30);

  func();
  interval = setInterval(func, 14000);

  ws.on("message", function message(data) {
    console.log(data.toString());
  });

  ws.on("error", (e) => ws.send(e));

  ws.on("close", () => {
    clearInterval(interval);
    console.log("close");
  });
});

app.post("/api/whisper", (req, res) => {
  console.log(req.body);

  fetch("https://www.pathofexile.com/api/trade/whisper", {
    headers: {
      accept: "*/*",
      "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/json",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
      "sec-ch-ua-arch": '"x86"',
      "sec-ch-ua-bitness": '"64"',
      "sec-ch-ua-full-version": '"124.0.6367.63"',
      "sec-ch-ua-full-version-list":
        '"Chromium";v="124.0.6367.63", "Google Chrome";v="124.0.6367.63", "Not-A.Brand";v="99.0.0.0"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": '""',
      "sec-ch-ua-platform": '"Windows"',
      "sec-ch-ua-platform-version": '"10.0.0"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
      cookie:
        `${cookie}`,
      Referer: `https://www.pathofexile.com/trade/exchange/${league}/8PzoeWGiV`,
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: `{\"token\":\"${req.body.token}\",\"values\":[${req.body.values[0]}]}`,
    method: "POST",
  }).then((response) => {
    res.send({ succsess: true });
  });
});

app.post("/api/getdata", async (req, res) => {
  // let httpsAgent = new SocksProxyAgent(proxyList[0]);

  let querys = [
    `{"query":{"status":{"option":"online"},"have":["divine"],"want":["${req.body.name}"],"stock":{"min":${req.body.stock},"max":null}},"sort":{"have":"asc"},"engine":"new"}`,
    `{"query":{"status":{"option":"online"},"have":["chaos"],"want":["${req.body.name}"],"stock":{"min":${req.body.stock},"max":null}},"sort":{"have":"asc"},"engine":"new"}`,
  ];

  let requests = querys.map((query) =>
    axios({
      // httpsAgent,
      method: "POST",
      url: `https://www.pathofexile.com/api/trade/exchange/${league}`,
      data: query,

      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Origin: "https://www.pathofexile.com",
        Referer: `https://www.pathofexile.com/trade/exchange/${league}`,
        "Content-Type": "application/json",
        Cookie:
          `${cookie}`,
      },
    })
  );

  let data = {
    item: req.body.name,
    divineData: {},
    chaosData: {},
  };

  await Promise.all(requests).then((responses) =>
    responses.forEach((response, index) => {
      if (index == 0) data.divineData = response.data;
      else if (index == 1) data.chaosData = response.data;
    })
  );

  await res.send(data);
});

app.post("/api/getdatafrompoeninja", async (req, res) => {
  let httpsAgent = new SocksProxyAgent(proxyList[0]);

  // let response = await axios({
  //     // httpsAgent,
  //     method: 'GET',
  //     url: `https://poe.ninja/api/data/itemhistory?league=${league}&type=${req.body[1].type}&itemId=${req.body[1].itemId}`,
  // })

  // await res.send(response.data)
});

app.post("/api/getlabels", (req, res) => {
  fs.readFile("labels.json", "utf8", function (err, data) {
    res.send(JSON.stringify(data));
  });
});

app.listen(4000);
server.listen(8999, () => console.log("Server started"));
