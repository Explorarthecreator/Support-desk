import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import ticketService from './ticketService'

const initialState = {
    tickets: [],
    ticket:{},
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: false
}

// Create new ticket
export const createTicket = createAsyncThunk('tickets/create',async(ticketData,thunkApi)=>{
    try {
        const token = thunkApi.getState().auth.user.token
        // console.log(token);
        return await ticketService.createTicket(ticketData,token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)||error.message|| error.toString()

        return thunkApi.rejectWithValue(message)
        
    }
})

// Get all users ticket
export const getTickets = createAsyncThunk('tickets/getAll',async(_,thunkApi)=>{
    try {
        const token = thunkApi.getState().auth.user.token
        return await ticketService.getTickets(token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)||error.message|| error.toString()

        return thunkApi.rejectWithValue(message)
        
    }
})

// Get single ticket
export const getTicket = createAsyncThunk('tickets/get',async(ticketId,thunkApi)=>{
    try {
        const token = thunkApi.getState().auth.user.token
        return await ticketService.getTicket(ticketId,token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)||error.message|| error.toString()

        return thunkApi.rejectWithValue(message)
        
    }
})

// close ticket
export const closeTicket = createAsyncThunk('tickets/close',async(ticketId,thunkApi)=>{
    try {
        const token = thunkApi.getState().auth.user.token
        return await ticketService.closeTicket(ticketId,token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)||error.message|| error.toString()

        return thunkApi.rejectWithValue(message)
        
    }
})

export const ticketSlice = createSlice({
    name: 'ticket',
    initialState,
    reducers:{
        reset: (state)=> initialState
    },
    extraReducers: (builder)=>{
        builder
            .addCase(createTicket.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(createTicket.fulfilled,(state)=>{
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(createTicket.rejected,(state,action)=>{
                 state.isLoading = false
                 state.isError= true
                 state.message = action.payload
            })
            .addCase(getTickets.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(getTickets.fulfilled,(state,action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.tickets = action.payload
            })
            .addCase(getTickets.rejected,(state,action)=>{
                 state.isLoading = false
                 state.isError= true
                 state.message = action.payload
            })
            .addCase(getTicket.pending,(state)=>{
                state.isLoading = true
            })
            .addCase(getTicket.fulfilled, (state,action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.ticket = action.payload
            })
            .addCase(getTicket.rejected,(state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(closeTicket.fulfilled,(state, action)=>{
                state.isLoading = false
                state.tickets.map((ticket)=> ticket._id === action.payload._id? (ticket.status='closed'):ticket)
            })
    }
})

export const {reset} = ticketSlice.actions

export default ticketSlice.reducer