import './App.css';
import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux'
import { addNewItems, setBulkItems, updateLastData, getUpdatedBulkData, fetchUserById, setDivinePrice, saveItems } from './redux/slices/itemSlice'

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { IoRefresh, IoCheckmark  } from "react-icons/io5";

import styles from './style.module.scss'
import axios from 'axios';





let allLabels = JSON.parse(localStorage.getItem('labels'));
let config = JSON.parse(localStorage.getItem('config'))

let sortedLabels = new Map();

allLabels.forEach((elem1) => {
  elem1.entries.forEach(elem2 => {
    sortedLabels.set(elem2.id, elem2.image)
  })
})

sortedLabels.set('default', '/gen/image/WzI4LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9BdGxhczJNYXBzL05ldy9VYmVyUHJpbW9yZGlhbEJsb2NrcyIsInciOjEsImgiOjEsInNjYWxlIjoxLCJtbiI6MjAsIm10IjoxN31d/7f3890c45d/UberPrimordialBlocks.png')
sortedLabels.set('veritanias-map', '/gen/image/WzI4LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9BdGxhczJNYXBzL05ldy9EZWZpbGVkQ2F0aGVkcmFsIiwidyI6MSwiaCI6MSwic2NhbGUiOjEsIm1uIjoyMSwibXQiOjE2LCJtYyI6Mn1d/ae1d87f40c/DefiledCathedral.png')
sortedLabels.set('barans-map', '/gen/image/WzI4LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9BdGxhczJNYXBzL05ldy9IaWdoR2FyZGVucyIsInciOjEsImgiOjEsInNjYWxlIjoxLCJtbiI6MjEsIm10IjoxNiwibWMiOjF9XQ/1ec7fe49dd/HighGardens.png')
sortedLabels.set('droxs-map', '/gen/image/WzI4LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9BdGxhczJNYXBzL05ldy9SZXNpZGVuY2UiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MSwibW4iOjIxLCJtdCI6MTQsIm1jIjo0fV0/4e97de906a/Residence.png')
sortedLabels.set('al-hezmins-map', '/gen/image/WzI4LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9BdGxhczJNYXBzL05ldy9CZWFjaCIsInciOjEsImgiOjEsInNjYWxlIjoxLCJtbiI6MjEsIm10IjoxNCwibWMiOjN9XQ/638b6bb641/Beach.png')
sortedLabels.set('craicic-chimeral', '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQmVzdGlhcnlPcmJGdWxsIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/3214b44360/BestiaryOrbFull.png')
sortedLabels.set('vivid-watcher', '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQmVzdGlhcnlPcmJGdWxsIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/3214b44360/BestiaryOrbFull.png')
sortedLabels.set('vivid-vulture', '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQmVzdGlhcnlPcmJGdWxsIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/3214b44360/BestiaryOrbFull.png')



let buyPrice = new Map();
var snd = new Audio("https://web.poecdn.com/audio/trade/pulse.mp3");

buyPrice.set('fortress-map-tier-17', { price: 0.80 * config.divinePrice })
buyPrice.set('abomination-map-tier-17', { price: 0.60 * config.divinePrice })
buyPrice.set('ziggurat-map-tier-17', { price: 0.70 * config.divinePrice })
buyPrice.set('incandescent-invitation', { price: 0.70 * config.divinePrice })
buyPrice.set('veritanias-map', { price: 0.3 * config.divinePrice })
buyPrice.set('barans-map', { price: 0.3 * config.divinePrice })
buyPrice.set('droxs-map', { price: 0.3 * config.divinePrice })
buyPrice.set('al-hezmins-map', { price: 0.3 * config.divinePrice })
buyPrice.set('craicic-chimeral', { price: 1.1 * config.divinePrice })
buyPrice.set('vivid-watcher', { price: 2 * config.divinePrice })
buyPrice.set('vivid-vulture', { price: 3.7 * config.divinePrice })

const ws = new WebSocket('ws://localhost:8999/');

ws.onopen = (event) => {
  console.log("open")
}


function App() {

  const items = useSelector((state) => state.item.items)
  const newItems = useSelector((state) => state.item.newItems)
  const bulkItems = useSelector((state) => state.item.bulkItems)

  const requestStatus = useSelector((state) => state.item.requestStatus)
  const lastData = useSelector((state) => state.item.lastData)
  const divinePrice = useSelector((state) => state.item.divinePrice)
  const savedItems = useSelector((state) => state.item.savedItems)



  console.log(savedItems)

  const dispatch = useDispatch()

  const whisperMessage = (item) => {
    let responseData = {};
    axios.post('http://localhost:4000/whisper', { "token": `${item.listing.whisper_token}`, "values": [item.buyEquivalent] }).then(response => {
      responseData = response.data.succsess
    })
    return responseData
  }

  React.useEffect(() => {
    setTimeout(() => {
      ws.send('start')
    }, 2000)
  }, [])

  React.useEffect(() => {
    ws.onmessage = (event) => {

      let array = [];
      let data = JSON.parse(event.data);

      for (const key in data.result) {
        array.push(data.result[key])
      }

      if (data.isBulkPrice) {

        let item = array[0];


        if (!buyPrice.get(item.listing.offers[0].item.currency)) {
          dispatch(setBulkItems({ name: item.listing.offers[0].item.currency, price: (item.listing.offers[0].exchange.amount / item.listing.offers[0].item.amount) }))
        }

        buyPrice.set(item.listing.offers[0].item.currency, {
          price: (item.listing.offers[0].exchange.amount / item.listing.offers[0].item.amount) * divinePrice
        })

        return;
      }

      dispatch(addNewItems(array))
    };

  }, [])


  let indexItem = 1;


  function serializePrice() {
    let entries = buyPrice.entries();
    let sortedData = []

    buyPrice.forEach(() => {
      sortedData.push(entries.next().value)
    })

    return sortedData
  }



  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{display:'flex',flexDirection:'column', maxWidth:'520px', padding:'20px'}}>
      <div style={{width:'100%',display:'flex', justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex', width:'190px', justifyContent:'space-between', alignItems:'center'}}>
          <span style={{fontSize:'15px'}}>Total searched items</span>
          <span style={{fontSize:'15px'}}>{items.length}</span>
        </div>
        <div style={{width:'150px', display:'flex', justifyContent:'space-between'}}>
          <span style={{fontSize:'15px'}}>Divine price</span>
          <input onBlur={(event)=>{

            config.divinePrice = Number(event.target.value);
            localStorage.setItem('config', JSON.stringify(config))

            dispatch(setDivinePrice())

          }} name={`divine-price-input`} style={{maxWidth:'50px', textAlign:'center'}} type='text' defaultValue={JSON.parse(localStorage.getItem('config')).divinePrice} />
        </div>
      </div>
        <div style={{maxWidth:'550px', maxHeight:'750px', overflowY:'auto'}}>
          {serializePrice().map((e)=>{

            let config = JSON.parse(localStorage.getItem('config'));


            let item = config.items.filter((item)=> item.itemName === e[0]);

            console.log(item)

            return <div style={{width:'400px'}}>

            <Accordion style={{backgroundColor:'#f4f7fc', marginTop:'20px'}} slotProps={{ heading: { component: 'h4' } }}>
                <AccordionSummary
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <div style={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
                    <span style={{fontSize:'12px'}}>{e[0]}</span>
                  </div>
                </AccordionSummary>
                <AccordionDetails style={{height:'220px'}}>
                  <div style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
                  <div style={{width:'300px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <span style={{fontSize:'12px'}}>Price</span>
                      <input name={`price-input-${e[0]}`} style={{maxWidth:'50px', textAlign:'center'}} type='text' defaultValue={Number(item.price / divinePrice).toFixed(2)} />
                      <span style={{fontSize:'12px'}}>Min count</span>
                      <input name={`count-input-${e[0]}`} style={{maxWidth:'50px', textAlign:'center'}} type='text' defaultValue={1} />
                      <button onClick={()=>{
                        let priceInput = document.getElementsByName(`price-input-${e[0]}`)[0];
                        let countInput = document.getElementsByName(`count-input-${e[0]}`)[0];
                        buyPrice.set(e[0], { price: priceInput.value * divinePrice })

                        dispatch(saveItems({
                          itemName: e[0],
                          price: priceInput.value * divinePrice,
                          minCount: countInput.value
                        }))

                      }} style={{backgroundColor:'transparent', border:'none', cursor:'pointer'}}>{<IoCheckmark color='green' size={'1.5em'} />}</button>
                    </div>
                  <div>
                    <div style={{display:'flex', justifyContent:'center'}}>
                      <div style={{display:'flex', width:'130px', justifyContent:'space-between', alignItems:'center', marginTop:'30px'}}>
                        <span style={{fontSize:'12px'}}>Count</span>
                        <input name={e[0]} style={{maxWidth:'35px', textAlign:'center'}} type='text' defaultValue={20} />

                        <button style={{backgroundColor:'transparent', border:'none', cursor:'pointer'}} onClick={(event)=>{

                          let input = document.getElementsByName(e[0])[0];

                          dispatch(fetchUserById({ name: e[0], stock: input.value }))


                        }}><IoRefresh size={'1.5em'} /></button>
                      </div>
                    </div>
                      {requestStatus === 'fulfilled' ? <div style={{padding:'0px 10px'}}>
                        {
                          lastData.filter((item)=> item.name === e[0]).map((elem)=> {
                            let result = []

                            for (const key in elem.data.result) {
                              result.push(elem.data.result[key])
                            }


                            return <div>
                              <span>{result.length}</span>
                              {result.slice(0,5).map((each) => <div style={{display:'flex', width:'250px', justifyContent:'space-between', padding:'3px'}}>
                                <span style={{fontSize:'12px'}}>{e[0]}</span>
                                <span style={{fontSize:'12px', width:'50px', textAlign:'center'}}>{(each.listing.offers[0].exchange.amount / each.listing.offers[0].item.amount).toFixed(2)}</span>
                                <span style={{fontSize:'12px', width:'50px', textAlign:'center'}}>{ each.listing.offers[0].item.stock}</span>
                            </div>)}
                            </div>

                          })
                        }
                      </div> : <div style={{width:'100%',height:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}><img height={20} style={{ opacity: '0.3' }} src='https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif' /></div>}
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          })}
        </div>
      </div>

      <div style={{ }}>

        {/* <div style={{ fontFamily: '"Raleway", sans-serif', backgroundColor: '#F4F7FC', width: '100%', height: '50px', display: 'flex', alignItems: 'center', fontSize: '14px', color: '#464F60' }}>
          <div style={{ width: '68px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><p>QTY</p></div>
          <div style={{ width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><p>ITEM</p></div>
          <div style={{ width: '116px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><p>PRICE</p></div>
          <div style={{ width: '55px', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}><p>CHAOS PRICE</p></div>
          <div style={{ width: '55px', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}><p>DIVINE PRICE</p></div>
          <div style={{ width: '55px', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}><p>TOTAL PRICE</p></div>
          <div style={{ width: '55px', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}><p>PROFIT PER ITEM</p></div>
        </div> */}

        <div style={{ overflowY: 'auto', maxHeight: '700px', maxWidth: '650px', }}>
          {items.map((e, index) => {

            if ((((buyPrice.get(e.listing.offers[0].item.currency).price * e.listing.offers[0].item.stock) - (e.chaosEquivalent * e.listing.offers[0].item.stock)) / divinePrice).toFixed(2) <= 1 || ((buyPrice.get(e.listing.offers[0].item.currency).price - e.chaosEquivalent) / divinePrice).toFixed(2) <= 0.12) {
              return;
            }

            if (newItems.find((elem) => elem.id === e.id)) {
              snd.play();
            }

            indexItem++;

            return <div key={e.id}>
              <div style={indexItem % 2 == 0 ? { display: 'flex', width: '600px', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' } : { display: 'flex', width: '600px', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFC' }}>
                <div className={styles.price}>
                  <div style={{ padding: '3px 10px', backgroundColor: '#f9fafc', width: '60px', height: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    <img height={48} style={{ opacity: '0.3' }} src={"https://web.poecdn.com" + (sortedLabels.get(e.listing.offers[0].item.currency) ? sortedLabels.get(e.listing.offers[0].item.currency) : sortedLabels.get('default'))} />
                    <p style={{ position: 'absolute', color: 'rgb(70, 79, 96)' }}>{e.listing.offers[0].item.stock}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '48px', width: '400px', borderRight: '1px solid #f4f7fc;' }}>
                    <div className={styles.left}>
                      <p style={{ fontSize: '12px', color: '#171C26' }}>{e.listing.offers[0].item.currency + 'x' + e.listing.offers[0].item.amount}</p>
                    </div>
                    <p style={{ color: 'rgb(93 92 84)' }}>←</p>
                    <div className={styles.right}>
                      <p style={{ fontSize: '12px', color: '#171C26' }}>{e.listing.offers[0].exchange.currency + 'x' + e.listing.offers[0].exchange.amount}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '400px', height: '48px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <h1 style={{ color: '#687182', fontWeight: '200', fontSize: '14px' }}>{e.chaosEquivalent}</h1>
                      <img height={13} style={{ opacity: '0.6' }} src={"https://web.poecdn.com" + sortedLabels.get("chaos")} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <h1 style={{ color: '#687182', fontWeight: '200', fontSize: '14px' }}>{(e.divineEquivalent)} </h1>
                      <img height={13} style={{ opacity: '0.6' }} src={"https://web.poecdn.com" + sortedLabels.get("divine")} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <h1 style={{ color: '#687182', fontWeight: '200', fontSize: '14px' }}>{(((buyPrice.get(e.listing.offers[0].item.currency).price * e.listing.offers[0].item.stock) - (e.chaosEquivalent * e.listing.offers[0].item.stock)) / divinePrice).toFixed(2)}</h1 >
                      <img height={13} style={{ opacity: '0.6' }} src={"https://web.poecdn.com" + sortedLabels.get("divine")} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <h1 style={{ color: '#14804A', fontWeight: '200', fontSize: '16px', textDecoration: 'underline' }}>{((buyPrice.get(e.listing.offers[0].item.currency).price - e.chaosEquivalent) / divinePrice).toFixed(2)}</h1 >
                      <img height={13} style={{ opacity: '0.6' }} src={"https://web.poecdn.com" + sortedLabels.get("divine")} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <button className={styles.btn} onClick={(event) => {
                        whisperMessage(e) 
                        event.currentTarget.disabled = true;
                      }}>whisper</button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
      <div>
        {bulkItems.map(e => {
          return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5px 0px' }}>
            <div style={{ backgroundColor: '#515050', height: '100%', width: '100%' }}>
              <h1 style={{ color: 'white', fontWeight: '500', fontSize: '16px', padding: '0px 10px' }}>{e.name}</h1>
            </div>
            <div style={{ backgroundColor: '#474444', height: '100%', width: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h1 style={{ color: 'white', fontWeight: '500', fontSize: '16px', padding: '0px 10px' }}>{e.price.toFixed(2)}</h1>
              <img height={13} src={"https://web.poecdn.com" + sortedLabels.get("divine")} />
            </div>
          </div>
        })}
      </div>
    </div>
  );
}

export default App;
