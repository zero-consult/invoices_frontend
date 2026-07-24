import './App.css'
import {BrowserRouter, Route, Routes} from "react-router";
import {Provider} from "react-redux";
import store from "./redux/store.ts";
import ErrorMessagePopup from "./components/ErrorMessagePopup.tsx";

import './i18n';
import {useState} from "react";
import CollapsedMenu from "./components/CollapsedMenu.tsx";
import FullMenu from "./components/FullMenu.tsx";
import Invoicelist from "./pages/Invoicelist.tsx";
import Paysliplist from "./pages/Payslipslist.tsx";

function App() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Provider store={store}>
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
                            <Route path="/" element={<Invoicelist/>}/>
                            <Route path="/invoices" element={<Invoicelist/>}/>
                            <Route path="/payslips" element={<Paysliplist/>}/>
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </Provider>
    )
}

export default App
