import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { divPrice } from '../../settings'
import axios from 'axios'

const initialState = {
    items: [],
    newItems: [],
    bulkItems: [],
    lastData:[],
    requestStatus: 'idle',
    divinePrice: JSON.parse(localStorage.getItem('config')).divinePrice,
    savedItems: JSON.parse(localStorage.getItem('config')).items
}

export const fetchUserById = createAsyncThunk(
    'items/fetchByIdItemName',
    async (item) => {
        return axios.post('http://localhost:4000/getdata', item).then(response => {
            return { name: item.name, stock: item.stock, data: response.data }
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
                        chaosEquivalent: ((item.listing.offers[0].exchange.amount / item.listing.offers[0].item.amount) * state.divinePrice).toFixed(1),
                        divineEquivalent: (item.listing.offers[0].exchange.amount / item.listing.offers[0].item.amount).toFixed(2),
                        buyEquivalent: Math.floor(item.listing.offers[0].item.stock / item.listing.offers[0].item.amount)
                    }
                } else if (item.listing.offers[0].exchange.currency == 'chaos') {
                    return {
                        ...item,
                        chaosEquivalent: (item.listing.offers[0].exchange.amount / item.listing.offers[0].item.amount).toFixed(1),
                        divineEquivalent: (item.listing.offers[0].exchange.amount / item.listing.offers[0].item.amount / state.divinePrice).toFixed(2),
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
      },
      selectors: {
        getRequestStatus: (items) => items.requestStatus,
        getLastData: (items) => items.lastData,
        getDivinePrice: (items) => items.divinePrice,
      },
})


export const { getRequestStatus, getLastData } = itemSlice.actions;

export const { addNewItems, setBulkItems, updateLastData, setDivinePrice, saveItems } = itemSlice.actions

export default itemSlice.reducer