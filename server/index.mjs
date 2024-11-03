import http from 'http';
import express, { response } from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import fs from 'fs'
import { SocksProxyAgent } from 'socks-proxy-agent';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(cors())
app.use(express.json());

const server = http.createServer(app);
const webSocketServer = new WebSocketServer({ server });

let queryes = [

    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"devouring-fragment\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"devouring-fragment\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",


    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"exceptional-eldritch-ichor\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"exceptional-eldritch-ichor\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"exceptional-eldritch-ember\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"exceptional-eldritch-ember\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",


    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"eldritch-orb-of-annulment\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"eldritch-orb-of-annulment\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"eldritch-chaos-orb\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"eldritch-chaos-orb\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",


    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"veritanias-map\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"veritanias-map\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",


    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"al-hezmins-map\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"al-hezmins-map\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",


    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"barans-map\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"barans-map\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",


    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"droxs-map\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"droxs-map\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",


    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"incandescent-invitation\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"incandescent-invitation\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",



    // Beats
    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"craicic-chimeral\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"craicic-chimeral\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"vivid-watcher\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"vivid-watcher\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"vivid-vulture\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"vivid-vulture\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

    // Maps

    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"fortress-map-tier-17\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"fortress-map-tier-17\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"abomination-map-tier-17\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"abomination-map-tier-17\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",

    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"ziggurat-map-tier-17\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"ziggurat-map-tier-17\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    
    // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"sanctuary-map-tier-17`\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"sanctuary-map-tier-17\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",


    // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"chaos\"],\"want\":[\"divination-scarab-of-completion\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
    // "{\"query\":{\"status\":{\"option\":\"online\"},\"have\":[\"divine\"],\"want\":[\"divination-scarab-of-completion\"],\"stock\":{\"min\":2,\"max\":null}},\"sort\":{\"have\":\"asc\"},\"engine\":\"new\"}",
]

let proxyList = [
    "socks5://GKUw3D:GyMHQQ@181.177.103.20:9617",
    "socks5://GKUw3D:GyMHQQ@181.177.87.2:9610",
]


let interval = null;
let j = 0;
let i = 0;


webSocketServer.on('connection', ws => {

    ws.on('message', function message(data) {


        console.log(data.toString())

        if(data.toString() === 'stop'){
            ws.close();
            return
        }

        clearInterval(interval)

        i = 0;
        j = 0;

        let func = () => {

            if (i == queryes.length) i = 0;
            if (j == proxyList.length) j = 0;

            let httpsAgent = new SocksProxyAgent(proxyList[j]);

            const response = axios({ 
                httpsAgent,
                method: 'POST',
                url: 'https://www.pathofexile.com/api/trade/exchange/Settlers',
                data: queryes[i],

                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                    "Origin": "https://www.pathofexile.com",
                    "Referer": "https://www.pathofexile.com/trade/exchange/Settlers",
                    "Content-Type": "application/json",
                    "Cookie": "POESESSID=4a4b4bdf80421657c1d06551e3ab200b",
                },
            })

            response.then((res) => {
                ws.send(JSON.stringify(res.data))
                console.log(res.data)
                i++;
                j++;
            }).catch((err) => console.log(err.message))
        }

        func();
        interval = setInterval(func, 14000)
        ws.on("error", e => ws.send(e));

    });

    ws.on('close', () => {
        clearInterval(interval)
        console.log('close')
    });
});


app.post('/api/whisper', (req, res) => {
    fetch("https://www.pathofexile.com/api/trade/whisper", {
        "headers": {
            "accept": "*/*",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
            "sec-ch-ua-arch": "\"x86\"",
            "sec-ch-ua-bitness": "\"64\"",
            "sec-ch-ua-full-version": "\"124.0.6367.63\"",
            "sec-ch-ua-full-version-list": "\"Chromium\";v=\"124.0.6367.63\", \"Google Chrome\";v=\"124.0.6367.63\", \"Not-A.Brand\";v=\"99.0.0.0\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": "\"\"",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-ch-ua-platform-version": "\"10.0.0\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "POESESSID=1e2b88b0dce2b744a8cd93b0e3a029dc; cf_clearance=fiuqQkWeKbcjbSjALg2im6N2YruomVQHJocm8Wq2FNg-1729852569-1.2.1.1-.tEo6dID0rZxJu1f.c9x1cJC9xvunhZz7D05lbqsxWderSUEcgHgfJlq3tsXQ6mEFKlroqyejK9MAM7jX7_e.EeLJhA2uBbMkFPg4nDgk7psf_dbR1HupDG00qKLZLpDMq52PStdZBJJr59qi5SYod8ClJZyvOhlnoOFIdK9U6y_P3Yfga_5PB8zFVUg8uN94Sg7i01bEDHOm428vSAsxpC8eIewl9E.MNlEoiksYuwvAhw5DQ2qXsPJ4ohfOHOg8XNQOAv289FhimjNjwERICl.B.as96bRVPe_SbcXvSs30oO3k_M8qI5.jvQOPvS1vaRg1F5YrqGQirqFHtnJeaKLxVa1t83pJy48lUJh45tRAJCy.zAO064c856f4LSenT7mIBgjOZ0_8qfyHaTrX4.b9DrJfk61tO3k9_Zvx4EItCUa6.4tZtGfoWBuSzcY",
            "Referer": "https://www.pathofexile.com/trade/exchange/Settlers/8PzoeWGiV",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `{\"token\":\"${req.body.token}\",\"values\":[${req.body.values[0]}]}`,
        "method": "POST"
    }).then((response) => {
        res.send({ succsess: true })
    })


})


app.post('/api/getdata', (req, res) => {

        let query = `{"query":{"status":{"option":"online"},"have":["divine"],"want":["${req.body.name}"],"stock":{"min":${req.body.stock},"max":null}},"sort":{"have":"asc"},"engine":"new"}`;

        const response = axios({
            // httpsAgent,
            method: 'POST',
            url: 'https://www.pathofexile.com/api/trade/exchange/Settlers',
            data: query,

            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                "Origin": "https://www.pathofexile.com",
                "Referer": "https://www.pathofexile.com/trade/exchange/Settlers",
                "Content-Type": "application/json",
                "Cookie": "POESESSID=4a4b4bdf80421657c1d06551e3ab200b",
            },
        })

        response.then((response)=> res.send(response.data))
})


app.post('/api/getlabels', (req, res) => {
    fs.readFile('labels.json', 'utf8', function (err, data) {
        res.send(JSON.stringify(data))
    })
})

app.listen(4000);
server.listen(8999, () => console.log("Server started"))