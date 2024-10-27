import { configureStore } from '@reduxjs/toolkit'
import item from './slices/itemSlice.js'

export const store = configureStore({
    reducer: {
        item
    },
})