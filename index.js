const axios = require('axios')
const cheerio = require('cheerio');
const express = require('express')
const Cors = require('cors');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 8000

app.use(express.json());
app.use(Cors());

const runApp = async()=>{
    const SITE_URL = "https://coinmarketcap.com/"
try{
 const {data} = await axios({
    method:"GET",
    url:SITE_URL,
 });
   const $ = cheerio.load(data);
   const eleSelector = '#__next > div.sc-faa5ca00-1.cKgcaj.global-layout-v2 > div.main-content > div.cmc-body-wrapper > div > div:nth-child(1) > div.sc-66133f36-2.cgmess > table > tbody > tr'
   
const coinKeys = [
    'rank',
    'name',
    'price',
    '24h',
    '7d',
    'marketCap',
    'volume',
    'circulatingSupply'
    
    ]
    const coinJSON = [];
    
   $(eleSelector).each((parentIdx , parentElem) =>{
    let coinCount = 0;
    let coinObj = {};   
    if(parentIdx <= 10){
    $(parentElem).children().each((childrenIdx , childrenElem)=>{
       let coinData = $(childrenElem).text()

       if(coinCount == 1   || coinCount == 6){
        coinData = $( "p:first-child", $(childrenElem).html()).text()
       }
       
       if(coinData){
        coinObj[coinKeys[coinCount]]= coinData
              
        
        coinCount++;
    }
    
})
coinJSON.push(coinObj);
}



})

console.log(coinJSON)

return coinJSON;

}catch(e){

  console.log(e)

}

}

app.get('/',(req , res)=>{
  res.status(200).json({message:"working perfectly"})
})

app.get("/crypto/price-feed" ,async (req,res)=>{
  try{
    let response = await runApp()

    if(response.length != 0 ){
        res.status(200).json({status:"200" , response})

    }else{

     res.status(201).json( {
        rank: '1',
        name: 'BitcoinBTC',
        price: '$34,371.14',
        '24h': '0.41%',
        '7d': '0.51%',
        marketCap: '21.04%',
        volume: '$671.86B$671,859,655,607',
        circulatingSupply: '$30,540,863,663887,488 BTC',
        undefined: '19,523,593 BTC'
      })
    }
  }catch(err){

    res.status(500).json({msg:"error occured"});
  }
})

app.listen(PORT, ()=>{
    console.log(`live on port ${PORT}`)
})

