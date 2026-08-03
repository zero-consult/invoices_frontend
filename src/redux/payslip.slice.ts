import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {RootState} from "./store.ts";
import type {Payslip} from "../types/invoices";

const EMPTY_PS: Payslip = {
    id: undefined,
    employeeId: "",
    month: "",
    grossSalary: 3000,
    taxRate: 37.5,
    allowances: []
};
export type PayslipState = {
    payslips: Payslip[]
    selectedPayslip: Payslip
}

const initialState: PayslipState = {
    payslips: [],
    selectedPayslip: EMPTY_PS
}


const payslipSlice = createSlice({
    name: 'payslip',
    initialState: initialState,
    reducers: {
        loadPayslips: (state, action: PayloadAction<Payslip[]>) => {
            state.payslips = action.payload
        },
        loadSinglePayslip: (state, action: PayloadAction<Payslip>) => {
            state.selectedPayslip = action.payload
        },
        resetSinglePayslip: (state) => {
            state.selectedPayslip = EMPTY_PS;
        },
    },
    selectors: {
        selectPayslips: state => state.payslips,
        selectSelectedPayslip: state => state.selectedPayslip,
    }
})

export const {loadPayslips, loadSinglePayslip, resetSinglePayslip} = payslipSlice.actions

export const {
    selectPayslips,
    selectSelectedPayslip
} = payslipSlice.getSelectors((rootState: RootState) => rootState.payslip)

export default payslipSlice