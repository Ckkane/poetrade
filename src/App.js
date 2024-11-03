import './App.css';
import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux'
import { addNewItems, setBulkItems, fetchUserById, setDivinePrice, saveItems } from './redux/slices/itemSlice'

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Tooltip from '@mui/material/Tooltip';

import { IoRefresh, IoCheckmark  } from "react-icons/io5";
import { GoArrowSwitch } from "react-icons/go";

import styles from './style.module.scss'
import axios from 'axios';
import { useRef } from 'react';

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

var snd = new Audio("https://web.poecdn.com/audio/trade/pulse.mp3");

let buyPrice = new Map();

buyPrice.set('fortress-map-tier-17', { price: config.items.filter((item) => item.itemName === 'fortress-map-tier-17')[0]?.price|| 0.80 * config.divinePrice })
buyPrice.set('abomination-map-tier-17', { price: config.items.filter((item) => item.itemName === 'abomination-map-tier-17')[0]?.price|| 0.80 * config.divinePrice })
buyPrice.set('ziggurat-map-tier-17', { price: config.items.filter((item) => item.itemName === 'ziggurat-map-tier-17')[0]?.price || 0.70 * config.divinePrice })
buyPrice.set('incandescent-invitation', { price: config.items.filter((item) => item.itemName === 'incandescent-invitation')[0]?.price || 0.70 * config.divinePrice })
buyPrice.set('veritanias-map', { price: config.items.filter((item) => item.itemName === 'veritanias-map')[0]?.price|| 0.30 * config.divinePrice })
buyPrice.set('barans-map', { price: config.items.filter((item) => item.itemName === 'barans-map')[0]?.price|| 0.30 * config.divinePrice })
buyPrice.set('droxs-map', { price: config.items.filter((item) => item.itemName === 'droxs-map')[0]?.price || 0.30 * config.divinePrice })
buyPrice.set('al-hezmins-map', { price: config.items.filter((item) => item.itemName === 'al-hezmins-map')[0]?.price || 0.30 * config.divinePrice })
buyPrice.set('eldritch-orb-of-annulment', { price: config.items.filter((item) => item.itemName === 'eldritch-orb-of-annulment')[0]?.price || 0.30 * config.divinePrice })
buyPrice.set('eldritch-chaos-orb', { price: config.items.filter((item) => item.itemName === 'eldritch-chaos-orb')[0]?.price || 0.30 * config.divinePrice })
buyPrice.set('vivid-watcher', { price: config.items.filter((item) => item.itemName === 'vivid-watcher')[0]?.price || 0.30 * config.divinePrice })
buyPrice.set('vivid-vulture', { price: config.items.filter((item) => item.itemName === 'vivid-vulture')[0]?.price || 0.30 * config.divinePrice })
buyPrice.set('craicic-chimeral', { price: config.items.filter((item) => item.itemName === 'craicic-chimeral')[0]?.price || 0.30 * config.divinePrice })
buyPrice.set('exceptional-eldritch-ichor', { price: config.items.filter((item) => item.itemName === 'exceptional-eldritch-ichor')[0]?.price || 0.30 * config.divinePrice })
buyPrice.set('exceptional-eldritch-ember', { price: config.items.filter((item) => item.itemName === 'exceptional-eldritch-ember')[0]?.price || 0.30 * config.divinePrice })
buyPrice.set('devouring-fragment', { price: config.items.filter((item) => item.itemName === 'devouring-fragment')[0]?.price || 1.2 * config.divinePrice })

function App() {

  const items = useSelector((state) => state.item.items)
  const newItems = useSelector((state) => state.item.newItems)
  const bulkItems = useSelector((state) => state.item.bulkItems)

  const requestStatus = useSelector((state) => state.item.requestStatus)
  const lastData = useSelector((state) => state.item.lastData)
  const divinePrice = useSelector((state) => state.item.divinePrice)
  const savedItems = useSelector((state) => state.item.savedItems)

  const dispatch = useDispatch()

  const whisperMessage = (item) => {
    let responseData = {};
    axios.post('http://localhost:4000/whisper', { "token": `${item.listing.whisper_token}`, "values": [item.buyEquivalent] }).then(response => {
      responseData = response.data.succsess
    })
    return responseData
  }

  let ws = useRef(new WebSocket('ws://localhost:8999/'));

  function resultUpdate(ws) {
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
  }

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

      <div style={{background:'linear-gradient(90deg, rgba(38, 52, 255, 0.25) 15%, rgba(149, 102, 255, 0.25) 100%)', borderRadius:'3px'}}>
        <div style={{display:'flex', width:'375px', justifyContent:'space-around', alignItems:'center', padding:'20px 0px'}}>
            <button style={{background:'transparent', border:'1px solid white' ,borderRadius:'3px',padding:'10px',color:'white',cursor:'pointer'}} onClick={()=>{

              ws.current = new WebSocket('ws://localhost:8999/')

              ws.current.onopen = (event) => {
                ws.current.send('start')
              }

              resultUpdate(ws.current)

            }} >{'Start'.toUpperCase()}</button>
            <button style={{background:'transparent', border:'1px solid white',borderRadius:'3px',padding:'10px',color:'white', fontSize:'12px', cursor:'pointer'}} onClick={()=>{
              ws.current.send('stop')
            }} >{'stop'.toUpperCase()}</button>
          </div>
      </div>
        <div style={{maxWidth:'550px', maxHeight:'750px', overflowY:'auto'}}>
          
          {serializePrice().map((e)=>{

            let config = JSON.parse(localStorage.getItem('config'));
            let item = config.items.filter((item)=> item.itemName === e[0])[0];

            return <div style={{width:'400px'}}>

            <Accordion style={{background:'linear-gradient(90deg, rgb(38 52 255 / 25%) 15%, rgba(149, 102, 255, 0.25) 100%)', boxShadow:'none', width:'397px', marginTop:'1px'}} slotProps={{ heading: { component: 'h4' } }}>
                <AccordionSummary
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <div style={{display:'flex', justifyContent:'', width:'100%', alignItems:'center'}}>
                    <img height={25} style={{opacity:'0.2'}} src={"https://web.poecdn.com" + (sortedLabels.get(e[0]) ? sortedLabels.get(e[0]) : sortedLabels.get('default'))}/>
                    <span style={{fontSize:'12px', color:'white', marginLeft:'5px'}}>{e[0].toUpperCase()}</span>
                  </div>
                </AccordionSummary>
                <AccordionDetails style={{height:'250px'}}>
                  <div style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
                  <div style={{width:'300px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <span style={{fontSize:'12px'}}>Price</span>
                      <input name={`price-input-${e[0]}`} style={{maxWidth:'50px', textAlign:'center',borderRadius:'3px', border:'none', color:'rgb(104, 113, 130)'}} type='text' defaultValue={Number(item.price / divinePrice).toFixed(2)} />
                      <span style={{fontSize:'12px'}}>Min count</span>
                      <input name={`count-input-${e[0]}`} style={{maxWidth:'50px', textAlign:'center',borderRadius:'3px', border:'none', color:'rgb(104, 113, 130)'}} type='text' defaultValue={1} />
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
                        <input name={e[0]} style={{maxWidth:'35px', textAlign:'center', borderRadius:'3px', border:'none', color:'#8f8f8f'}} type='text' defaultValue={20} />

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


                            return <div style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', marginTop:'10px'}}>
                              <span style={{fontSize:'12px', color:'white', fontWeight:'500'}}>{('total found ' + result.length).toString().toUpperCase()}</span>
                              {result.slice(0,5).map((each) => <div style={{display:'flex', fontWeight:'500', width:'220px', justifyContent:'space-between', alignItems:'center', padding:'3px', color:'rgb(104, 113, 130)'}}>
                                <div style={{width: '150px'}}>
                                  <span style={{fontSize:'12px'}}>{each.listing.account.name.split('').slice(0,20).join('')}</span>
                                </div>
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
      <div>

        <div style={{ maxHeight: '700px', maxWidth: '850px', }}>

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

          <div style={{overflowY: 'auto', maxHeight: '700px', maxWidth: '850px'}}>
            {items.map((e, index) => {

              if ((((buyPrice.get(e.listing.offers[0].item.currency).price * e.listing.offers[0].item.stock) - (e.chaosEquivalent * e.listing.offers[0].item.stock)) / divinePrice).toFixed(2) <= 0.5 || ((buyPrice.get(e.listing.offers[0].item.currency).price - e.chaosEquivalent) / divinePrice).toFixed(2) <= 0.12) {
                return;
              }

              if (newItems.find((elem) => elem.id === e.id)) {
                snd.play();
              }

              function generateGradient(item) {

                let profitProcent = (((buyPrice.get(item.listing.offers[0].item.currency).price * item.listing.offers[0].item.stock) / ((buyPrice.get(item.listing.offers[0].item.currency).price * item.listing.offers[0].item.stock) - ((buyPrice.get(item.listing.offers[0].item.currency).price * item.listing.offers[0].item.stock) - (item.chaosEquivalent * item.listing.offers[0].item.stock))) - 1) * 100).toFixed(2);
                let bulkProfit = (((buyPrice.get(item.listing.offers[0].item.currency).price * item.listing.offers[0].item.stock) - (item.chaosEquivalent * item.listing.offers[0].item.stock)) / divinePrice).toFixed(2);

                let leftColor = ''
                let rightColor = ''


                if(bulkProfit >= 0.5 && bulkProfit <= 1){
                  rightColor = 15
                }else if (bulkProfit >= 1.01 && bulkProfit <= 2) {
                  rightColor = 25
                }else if (bulkProfit >= 2.01 && bulkProfit <= 4) {
                  rightColor = 40
                }else if (bulkProfit >= 4.01) {
                  rightColor = 50
                }else{
                  rightColor = 0
                }


                if(profitProcent >= 1 && profitProcent <= 25){
                  leftColor = 15
                }else if (profitProcent >= 25 && profitProcent <= 45) {
                  leftColor = 25
                }else if (profitProcent >= 45 && profitProcent <= 75) {
                  leftColor = 40
                }else if (profitProcent >= 75) {
                  leftColor = 50
                }else{
                  leftColor = 0
                }

                return `linear-gradient(90deg, rgb(255 238 0 / ${leftColor}%) 15%, rgb(149 102 255 / ${rightColor}%) 100%)`
              }

              function divineChaos(item) {
                return <div>
                  <span style={{color:'white'}}>{Math.floor((item.listing.offers[0].item.amount * item.divineEquivalent * item.buyEquivalent).toFixed(1).toString().split('.')[0]) + 'd ' + ((item.listing.offers[0].item.amount * item.divineEquivalent * item.buyEquivalent).toFixed(2) - Number((item.listing.offers[0].item.amount * item.divineEquivalent * item.buyEquivalent).toString().split('.')[0])).toFixed(1) * divinePrice + 'c'}</span>
                </div>
              }

              return <div key={e.id}>
                <div style={{ display: 'flex', margin:'1px', borderRadius:'5px', width: '800px', justifyContent: 'space-between', alignItems: 'center', background: `${generateGradient(e)}` }}>
                  <div className={styles.price}>
                    <div style={{ display: 'flex', alignItems: 'center', height: '59px', width: '450px', borderRight: '1px solid #f4f7fc;' }}>
                      <div style={{backgroundColor:'white'}}>
                        <div style={{ padding: '3px 10px', borderRadius:'5px 0px 0px 5px', background: `linear-gradient(90deg, rgb(203 182 244) 15%, rgb(252 244 126) 100%)`, width: '52px', height: '52px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }} >
                          <img height={48} style={{ opacity: '0.3' }} src={"https://web.poecdn.com" + (sortedLabels.get(e.listing.offers[0].item.currency) ? sortedLabels.get(e.listing.offers[0].item.currency) : sortedLabels.get('default'))} />
                          <p style={{ position: 'absolute', color: 'white' }}>{e.listing.offers[0].item.stock}</p>
                        </div>
                      </div>
                      <div style={{display:'flex', justifyContent:'center', width:'100%', alignItems:'center'}}>
                        <div className={styles.left}>
                          <p style={{ fontSize: '10px', color: 'rgb(104, 113, 130)', fontWeight:'400' }}>{(e.listing.offers[0].item.currency + 'x' + e.listing.offers[0].item.amount).toString().toUpperCase()}</p>
                        </div>
                        <GoArrowSwitch size={'1em'} color='rgb(104, 113, 130)'/>
                        <div className={styles.right}>
                          <p style={{ fontSize: '10px', color: 'rgb(104, 113, 130)', marginLeft:'30px' }}>{(e.listing.offers[0].exchange.currency + 'x' + e.listing.offers[0].exchange.amount).toString().toUpperCase()}</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '450px', height: '48px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <h1 style={{ color: '#687182', fontWeight: '200', fontSize: '14px', marginRight:'5px' }}>{e.chaosEquivalent}</h1>
                        <img height={15} style={{ opacity: '0.6' }} src={"https://web.poecdn.com" + sortedLabels.get("chaos")} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <h1 style={{ color: '#687182', fontWeight: '200', fontSize: '14px', marginRight:'5px' }}>{(e.divineEquivalent)} </h1>
                        <img height={15} style={{ opacity: '0.6' }} src={"https://web.poecdn.com" + sortedLabels.get("divine")} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <h1 style={{ color: '#687182', fontWeight: '200', fontSize: '14px', marginRight:'5px' }}>{(((buyPrice.get(e.listing.offers[0].item.currency).price * e.listing.offers[0].item.stock) - (e.chaosEquivalent * e.listing.offers[0].item.stock)) / divinePrice).toFixed(2)}</h1 >
                        <img height={15} style={{ opacity: '0.6' }} src={"https://web.poecdn.com" + sortedLabels.get("divine")} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <h1 style={{ color: 'rgb(104, 113, 130)', fontWeight: '200', fontSize: '14px', marginRight:'5px'}}>{((buyPrice.get(e.listing.offers[0].item.currency).price - e.chaosEquivalent) / divinePrice).toFixed(2)}</h1 >
                        <img height={15} style={{ opacity: '0.6' }} src={"https://web.poecdn.com" + sortedLabels.get("divine")} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <h1 style={{ color: 'rgb(104, 113, 130)', fontWeight: '200', fontSize: '14px'}}>{(((buyPrice.get(e.listing.offers[0].item.currency).price * e.listing.offers[0].item.stock) / ((buyPrice.get(e.listing.offers[0].item.currency).price * e.listing.offers[0].item.stock) - ((buyPrice.get(e.listing.offers[0].item.currency).price * e.listing.offers[0].item.stock) - (e.chaosEquivalent * e.listing.offers[0].item.stock))) - 1) * 100).toFixed(2) + '%'}</h1 >
                      </div>

                      <Tooltip title={divineChaos(e)} placement="right">
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button className={styles.btn} onClick={(event) => {
                          whisperMessage(e) 
                          event.currentTarget.disabled = true;
                        }}>{'send'.toUpperCase()}</button>
                      </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
              })}
          </div>
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
