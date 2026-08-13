import './App.css'
import {BrowserRouter, Route, Routes} from "react-router";
import {useSelector} from "react-redux";
import ErrorMessagePopup from "./components/ErrorMessagePopup.tsx";

import './i18n';
import {useEffect, useState} from "react";
import CollapsedMenu from "./components/CollapsedMenu.tsx";
import FullMenu from "./components/FullMenu.tsx";
import Invoicelist from "./pages/Invoicelist.tsx";
import Paysliplist from "./pages/Payslipslist.tsx";
import GeneratePayslip from "./pages/GeneratePayslip.tsx";
import GenerateInvoice from "./pages/GenerateInvoice.tsx";
import {selectUser} from "./redux/account.slice.ts";

function App() {
    const [collapsed, setCollapsed] = useState(false);
    const user = useSelector(selectUser);

    useEffect(() => {
        if (typeof user === "undefined") {
            window.location.href = import.meta.env.VITE_PEOPLE_FRONTEND_URL;
        }
    }, [])

    if (typeof user === "undefined") {
        return <></>
    } else {
        return (
            <>
                <ErrorMessagePopup/>
                <BrowserRouter>
                    <div className="min-h-screen flex" style={{fontFamily: "'DM Sans', sans-serif"}}>
                        {collapsed ?
                            <CollapsedMenu expand={() => setCollapsed(false)}/>
                            :
                            <FullMenu shrink={() => setCollapsed(true)}/>
                        }
                        {/* Page content */}
                        <main
                            className={"flex-1 flex flex-col min-w-0 bg-background overflow-y-auto" + (collapsed ? " pl-15" : " pl-60")}>
                            {/* Routes */}
                            <Routes>
                                <Route path="/invoices/" element={<Invoicelist/>}/>
                                <Route path="/invoices/invoices" element={<Invoicelist/>}/>
                                <Route path="/invoices/invoices/generate" element={<GenerateInvoice/>}/>
                                <Route path="/invoices/invoices/:invoiceId/edit" element={<GenerateInvoice/>}/>
                                <Route path="/invoices/payslips" element={<Paysliplist/>}/>
                                <Route path="/invoices/payslips/generate" element={<GeneratePayslip/>}/>
                            </Routes>
                        </main>
                    </div>
                </BrowserRouter>
            </>
        )
    }
}

export default App
