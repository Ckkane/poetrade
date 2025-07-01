import '../App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useSelector, useDispatch } from 'react-redux'
import { setDivinePrice } from '../redux/slices/itemSlice'

import Tooltip from '@mui/material/Tooltip';
import { GoArrowSwitch } from "react-icons/go";

import styles from '../style.module.scss'

function MainContent({date, buyPrice, sortedLabels}) {

    const items = useSelector((state) => state.item.items)
    const newItems = useSelector((state) => state.item.newItems)
    const divinePrice = useSelector((state) => state.item.divinePrice)

    let config = JSON.parse(localStorage.getItem('config'))

    var snd = new Audio("https://web.poecdn.com/audio/trade/pulse.mp3");
  
    const dispatch = useDispatch()

    const whisperMessage = (item) => {
      let responseData = {};

      console.log(item)

      axios.post('http://192.168.0.101:4000/api/whisper', { "token": `${item.listing.whisper_token}`, "values": [item.buyEquivalent] }).then(response => {
        responseData = response.data.succsess
      })
      return responseData
    }


    return <div style={{ maxWidth: '850px' }}>

{/* <div className='chel' style={{width:'400px',height:'500px'}}>
</div> */}
    <div style={{width:'100%',display:'flex', justifyContent:'space-around',alignItems:'center', padding:'20px 0px', zIndex:'2'}}>
      <div style={{display:'flex', width:'220px', justifyContent:'space-around', alignItems:'center'}}>
        <span style={{fontSize:'11px'}}>Total searched items:{items.length}</span>
        <span style={{fontSize:'11px'}}>{date.getUTCMinutes() + ':' + date.getSeconds()}</span>
      </div>
      <div style={{width:'150px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span style={{fontSize:'11px'}}>Divine price</span>
        <input onBlur={(event)=>{

          config.divinePrice = Number(event.target.value);
          localStorage.setItem('config', JSON.stringify(config))

          dispatch(setDivinePrice())

        }} name={`divine-price-input`} style={{maxWidth:'50px', textAlign:'center'}} type='text' defaultValue={JSON.parse(localStorage.getItem('config')).divinePrice} />
      </div>
    </div>

    <div className='item' style={{overflowY: 'auto'}}>
      {items.map((e, index) => {

        if ((((buyPrice.get(e.listing.offers[0].item.currency).price * e.listing.offers[0].item.stock) - (e.chaosEquivalent * e.listing.offers[0].item.stock)) / divinePrice).toFixed(5) <= 0.3 && ((buyPrice.get(e.listing.offers[0].item.currency).price - e.chaosEquivalent) / divinePrice).toFixed(5) <= 0.5) {
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
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%'}}>
                  <div style={{ padding:'3px', width:'270px',backgroundColor:'#ffffff87', borderRadius:'5px', display:'flex', justifyContent:'space-around', alignContent:'center', height:'15px'}}>
                    <div className={styles.left}>
                      <p style={{ fontSize: '11px', color: 'rgb(117 117 117)', fontWeight:'400' }}>{(e.listing.offers[0].item.currency + 'x' + e.listing.offers[0].item.amount).toString().toUpperCase()}</p>
                    </div>
                    <GoArrowSwitch size={'1em'} color='rgb(0 0 0)'/>
                    <div className={styles.right}>
                      <p style={{ fontSize: '10px', color: 'rgb(117 117 117)'}}>{(e.listing.offers[0].exchange.currency + 'x' + e.listing.offers[0].exchange.amount).toString().toUpperCase()}</p>
                    </div>
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
}

export default MainContent;