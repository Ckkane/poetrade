import './App.css';
import React, { useState } from 'react';

import { useSelector } from 'react-redux'

import Alert from './components/Alert';
import LeftSideMenu from './components/LeftSideMenu'
import MainContent from './components/MainContent';

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

buyPrice.set('fortress-map-tier-17', { price: config.items.filter((item) => item.itemName === 'fortress-map-tier-17')[0]?.price|| 0.80 * config.divinePrice, itemId: "118526", type:'Map' })
buyPrice.set('abomination-map-tier-17', { price: config.items.filter((item) => item.itemName === 'abomination-map-tier-17')[0]?.price|| 0.80 * config.divinePrice, itemId: "118546",  type:'Map' })
buyPrice.set('ziggurat-map-tier-17', { price: config.items.filter((item) => item.itemName === 'ziggurat-map-tier-17')[0]?.price || 0.70 * config.divinePrice, itemId: "118447",  type:'Map' })
buyPrice.set('sanctuary-map-tier-17', { price: config.items.filter((item) => item.itemName === 'sanctuary-map-tier-17')[0]?.price || 0.04 * config.divinePrice })
buyPrice.set('screaming-invitation', { price: config.items.filter((item) => item.itemName === 'screaming-invitation')[0]?.price || 0.04 * config.divinePrice })
buyPrice.set('incandescent-invitation', { price: config.items.filter((item) => item.itemName === 'incandescent-invitation')[0]?.price || 0.70 * config.divinePrice, itemId: "93814",  type:'Invitation' })
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
buyPrice.set('vivid-lifeforce', { price: config.items.filter((item) => item.itemName === 'vivid-lifeforce')[0]?.price || 0.04 * config.divinePrice })

function App() {

  const divinePrice = useSelector((state) => state.item.divinePrice)
  const alertToggle = useSelector((state) => state.item.alertToggle)

  const [date, setDate] = useState(new Date());

  return (
    <div className='main' style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      {alertToggle ? <Alert /> : null}
      <LeftSideMenu divinePrice={divinePrice} buyPrice={buyPrice} sortedLabels={sortedLabels} />
      <MainContent date={date} buyPrice={buyPrice} sortedLabels={sortedLabels}/>
    </div>
  );
}

export default App;
