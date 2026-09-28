const MY_API = "https://devapi-react-rho.vercel.app";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url, tryUrl } = req.query;

  
  if (tryUrl) {
    try {
      const r = await fetch(tryUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
      const t = await r.text();
      let j; try{ j=JSON.parse(t); } catch{ j=t.slice(0,3000); }
      return res.json({ bypassed: true, status: r.status, final_url: tryUrl, data: j });
    } catch(e){ return res.status(500).json({ error:e.message }); }
  }

  
  const target = url || "https://quick-react-rho.vercel.app/?v=2";
  try {
    const html = await (await fetch(target, { headers: { "User-Agent": "Mozilla/5.0" } })).text();

    let found = new Set();
    const re = /\/api\/[a-z0-9\/\-_?=&]+/gi;
    (html.match(re)||[]).forEach(a=>{
      if(a.length>5) found.add(MY_API + a);
    });

    
    if(found.size === 0){
      found.add(`${MY_API}/api?url=${encodeURIComponent(target)}&bypass=true`);
      found.add(`${MY_API}/api?tryUrl=${encodeURIComponent(target)}`);
    }

    const apis = Array.from(found);

    return res.json({
      name: "DEV SCRP API",
      bypassed: true,
      status: "success",
      source: target,
      my_api_base: MY_API,
      total: apis.length,
      apis: apis,
      data: {
        final_url: apis[0],
        copy_link: apis[0],
        all_links: apis,
        message: "Bypassed - Use this API link"
      }
    });

  } catch(e){
    return res.status(500).json({ error: e.message });
  }
}