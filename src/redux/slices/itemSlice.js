import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'


axios.defaults.baseURL = 'http://192.168.0.11:4000/';


if(localStorage.getItem('config') === null){
    localStorage.setItem('config', `{"divinePrice":155,"items":[{"itemName":"craicic-chimeral","price":198,"minCount":"1"},{"itemName":"droxs-map","price":57.74999999999999,"minCount":"1"},{"itemName":"vivid-vulture","price":652,"minCount":"1"},{"itemName":"barans-map","price":48.9,"minCount":"1"},{"itemName":"veritanias-map","price":48.9,"minCount":"1"},{"itemName":"al-hezmins-map","price":48.9,"minCount":"1"},{"itemName":"exceptional-eldritch-ember","price":228.2,"minCount":"1"},{"itemName":"exceptional-eldritch-ichor","price":244.5,"minCount":"1"},{"itemName":"eldritch-chaos-orb","price":73.35000000000001,"minCount":"1"},{"itemName":"eldritch-orb-of-annulment","price":73.35000000000001,"minCount":"1"},{"itemName":"vivid-watcher","price":244.5,"minCount":"1"},{"itemName":"devouring-fragment","price":211.9,"minCount":"1"},{"itemName":"vivid-lifeforce","price":0.04008,"minCount":"1"},{"itemName":"screaming-invitation","price":224,"minCount":"1"},{"itemName":"incandescent-invitation","price":320,"minCount":"1"},{"itemName":"abomination-map-tier-17","price":51.150000000000006,"minCount":"1"},{"itemName":"ziggurat-map-tier-17","price":51.150000000000006,"minCount":"1"},{"itemName":"sanctuary-map-tier-17","price":51.150000000000006,"minCount":"1"},{"itemName":"fortress-map-tier-17","price":51.150000000000006,"minCount":"1"}]}`)
}
;( async function () {
  

  let labels = '';

  await axios.post('/api/getlabels').then(response => labels = response.data)

  await localStorage.setItem('labels', labels);

})()


const initialState = {
    items: [],
    newItems: [],
    bulkItems: [],
    lastData:[],
    graphData:[],
    alertToggle: false,
    requestStatus: 'idle',
    connectionStatus: false,
    divinePrice: JSON.parse(localStorage.getItem('config')).divinePrice,
    savedItems: JSON.parse(localStorage.getItem('config')).items
}

export const fetchUserById = createAsyncThunk(
    'items/fetchByIdItemName',
    async (item) => {
        return axios.post('/api/getdata', item).then(response => {
            return { name: item.name, stock: item.stock, data: response.data }
        })
    },
  )

export const fetchLastPrices = createAsyncThunk(
'items/fetchByIdLastPrices',
async (item) => {
    console.log(item)
    return axios.post('/api/getdatafrompoeninja', item).then(response => {
        return { itemName: item[0], graphData: response.data }
    })
},
)

export const itemSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        addNewItems: (state, actions) => {
            let array = []
            actions.payload.forEach(item1 => {
                if (state.items.find((item2) => item1.id === item2.id)) {

                } else {
                    item1.chaosEquivalent = null;
                    array.push(item1)
                }
            })

            // add Equivalent
            array = array.map(item => {

                if (item.listing.offers[0].exchange.currency == 'divine') {
                    return {
                        ...item,
                        chaosEquivalent: ((item.listing.offers[0].exchange.amount / item.listing.offers[0].item.amount) * state.divinePrice).toFixed(5),
                        divineEquivalent: (item.listing.offers[0].exchange.amount / item.listing.offers[0].item.amount).toFixed(5),
                        buyEquivalent: Math.floor(item.listing.offers[0].item.stock / item.listing.offers[0].item.amount)
                    }
                } else if (item.listing.offers[0].exchange.currency == 'chaos') {
                    return {
                        ...item,
                        chaosEquivalent: (item.listing.offers[0].exchange.amount / item.listing.offers[0].item.amount).toFixed(5),
                        divineEquivalent: (item.listing.offers[0].exchange.amount / item.listing.offers[0].item.amount / state.divinePrice).toFixed(5),
                        buyEquivalent: Math.floor(item.listing.offers[0].item.stock / item.listing.offers[0].item.amount)
                    }
                }
            })

            state.items = [...array, ...state.items]
            state.newItems = [...array]
        },
        setBulkItems: (state, actions) => {
            state.bulkItems = [...state.bulkItems, actions.payload]
        },
        updateLastData: (state, actions) => {
            state.lastData = [...state.lastData.filter((item) => item.name !== actions.payload.name), actions.payload]
            localStorage.setItem('lastData', JSON.stringify(state.lastData))
        },
        setDivinePrice: (state) => {
            state.divinePrice = JSON.parse(localStorage.getItem('config')).divinePrice
        },
        saveItems: (state, actions) => {
            state.savedItems = [...state.savedItems.filter((elem) => elem.itemName !== actions.payload.itemName), actions.payload]            

            let config = JSON.parse(localStorage.getItem('config'));

            config.items = state.savedItems;

            localStorage.setItem('config', JSON.stringify(config))
        },
        switchAlertToggle: (state, actions) => {
            state.alertToggle = actions.payload;
        },
        setConnectionStatus: (state, actions) => {
            state.connectionStatus = actions.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserById.fulfilled, (state, action) => {
            state.lastData = [...state.lastData.filter((item) => item.name !== action.payload.name), action.payload]
            localStorage.setItem('lastData', JSON.stringify(state.lastData))
            state.requestStatus = 'fulfilled'
        })
        builder.addCase(fetchUserById.pending, (state, action) => {
            state.requestStatus = 'pending'
        })
        builder.addCase(fetchLastPrices.fulfilled, (state, action) => {
            console.log(action.payload)
            state.graphData = [...state.graphData.filter((item) => item.itemName !== action.payload.itemName), action.payload]
        })
      },
      selectors: {
        getRequestStatus: (items) => items.requestStatus,
        getLastData: (items) => items.lastData,
        getDivinePrice: (items) => items.divinePrice,
        getGraphData: (items) => items.graphData,
        getConnectionStatus: (items) => items.connectionStatus,
        getAlertToggle: (items) => items.alertToggle,
      },
})


export const { getRequestStatus, getLastData, getGraphData, getConnectionStatus, getAlertToggle } = itemSlice.actions;

export const { addNewItems, setBulkItems, updateLastData, setDivinePrice, saveItems, switchAlertToggle, setConnectionStatus } = itemSlice.actions

export default itemSlice.reducer