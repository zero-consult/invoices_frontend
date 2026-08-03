import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {RootState} from "./store.ts";
import moment from "moment";

export type InvoicingMonthState = {
    invoicingMonth?: string
    payslipMonth?: string
}

const initialState: InvoicingMonthState = {}

const invoicingMonthSlice = createSlice({
    name: 'invoicingMonth',
    initialState: initialState,
    reducers: {
        setInvoicingMonth: (state, action: PayloadAction<string>) => {
            state.invoicingMonth = action.payload;
        },
        setPayslipMonth: (state, action: PayloadAction<string>) => {
            state.payslipMonth = action.payload;
        }
    },
    selectors: {
        selectInvoicingMonth: state => state.invoicingMonth,
        selectPayslipMonth: state => state.payslipMonth,
        selectPayslipFormatted: state => moment(state.payslipMonth, "YYYY-MM-DD")
    }
})

export const {setInvoicingMonth, setPayslipMonth} = invoicingMonthSlice.actions

export const {
    selectInvoicingMonth, selectPayslipMonth, selectPayslipFormatted
} = invoicingMonthSlice.getSelectors((rootState: RootState) => rootState.invoicingMonth)

export default invoicingMonthSlice