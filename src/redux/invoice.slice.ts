import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {RootState} from "./store.ts";
import type {Invoice} from "../types/invoices";
import moment from "moment";

const EMPTY_INV: Invoice = {
    customerId: "",
    expireDate: moment().add(30, "days").format("YYYY-MM-DD"),
    id: undefined,
    invoiceDate: moment().format("YYYY-MM-DD"),
    invoiceUntil: moment().subtract(1, "month").format("YYYY-MM-DD"),
    notes: "",
    status: "Concept",
    vatPercent: 21,
    totalWithoutVat: 0,
};
export type InvoiceState = {
    invoices: Invoice[]
    selectedInvoice: Invoice
}

const initialState: InvoiceState = {
    invoices: [],
    selectedInvoice: EMPTY_INV
}


const invoiceSlice = createSlice({
    name: 'invoice',
    initialState: initialState,
    reducers: {
        loadInvoices: (state, action: PayloadAction<Invoice[]>) => {
            state.invoices = action.payload
        },
        loadSingleInvoice: (state, action: PayloadAction<Invoice>) => {
            state.selectedInvoice = action.payload
        },
        loadSingleInvoiceCustomerId: (state, action: PayloadAction<string>) => {
            state.selectedInvoice.customerId = action.payload;
        },
        resetSingleInvoice: (state) => {
            state.selectedInvoice = EMPTY_INV;
        },
    },
    selectors: {
        selectInvoices: state => state.invoices,
        selectSelectedInvoice: state => state.selectedInvoice,
    }
})

export const {loadInvoices, loadSingleInvoice, loadSingleInvoiceCustomerId, resetSingleInvoice} = invoiceSlice.actions

export const {
    selectInvoices,
    selectSelectedInvoice
} = invoiceSlice.getSelectors((rootState: RootState) => rootState.invoice)

export default invoiceSlice