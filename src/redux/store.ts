import {configureStore} from "@reduxjs/toolkit";
import employeeSlice from "./employee.slice.ts";
import customerSlice from "./customer.slice.ts";
import errorSlice from "./error.slice.ts";
import payslipSlice from "./payslip.slice.ts";
import invoicingMonthSlice from "./invoicingMonth.slice.ts";


const store = configureStore({
    reducer: {
        customer: customerSlice.reducer,
        employee: employeeSlice.reducer,
        error: errorSlice.reducer,
        invoicingMonth: invoicingMonthSlice.reducer,
        payslip: payslipSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store;