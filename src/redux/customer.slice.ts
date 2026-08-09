import moment from "moment/moment";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {RootState} from "./store.ts";
import type {Customer} from "../types/people";

const EMPTY_CUST: Customer = {
    city: "", companyName: "",contactPersonFirstName: "", contactPersonLastName: "", sector: "Tech",
    email: "", hiringRatePerHour: 50, phone: "", startDate: moment().valueOf(), status: "Prospect",
};
export type CustomerState = {
    customers: Customer[],
    customerIds: string[],
    selectedCustomer: Customer
}

const initialState: CustomerState = {
    customers: [],
    customerIds: [],
    selectedCustomer: EMPTY_CUST
}


const customerSlice = createSlice({
    name: 'customer',
    initialState: initialState,
    reducers: {
        loadCustomers: (state, action: PayloadAction<Customer[]>) => {
            state.customers = action.payload
        },
        loadCustomerIds: (state, action: PayloadAction<string[]>) => {
            state.customerIds = action.payload;
        },
        loadSingleCustomer: (state, action: PayloadAction<Customer>) => {
            state.selectedCustomer = action.payload
        },
        resetSingleCustomer: (state)=> {
            state.selectedCustomer = EMPTY_CUST;
        },
    },
    selectors: {
        selectCustomers: state => state.customers,
        selectCustomerIds: state => state.customerIds,
        selectSelectedCustomer: state => state.selectedCustomer,
    }
})

export const {loadCustomers, loadCustomerIds, loadSingleCustomer, resetSingleCustomer} = customerSlice.actions

export const {
    selectCustomers,
    selectCustomerIds,
    selectSelectedCustomer
} = customerSlice.getSelectors((rootState: RootState) => rootState.customer)

export default customerSlice