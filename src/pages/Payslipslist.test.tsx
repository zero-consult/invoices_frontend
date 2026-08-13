import {expect, type MockedFunction, test, vi} from "vitest";
import axios from "axios";
import {fireEvent, render, type RenderResult, waitFor} from "@testing-library/react";
import Payslipslist from "./Payslipslist.tsx";
import store from "../redux/store.ts";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router";
import {EMP_1, PAY_1} from "../testutils/testData.ts";
import type {Employee} from "../types/people";
import type {Payslip} from "../types/invoices";

vi.mock('axios', async (importOriginal) => {
    const actual = await importOriginal<typeof import('axios')>();

    return {
        ...actual,
        default: {
            defaults: {baseURL: 'http://localhost:8080'},
            post: vi.fn(),
            get: vi.fn(),
            delete: vi.fn(),
            put: vi.fn(),
            create: vi.fn().mockReturnThis(),
            request: vi.fn(),
            interceptors: {
                request: {
                    use: vi.fn(),
                    eject: vi.fn(),
                },
                response: {
                    use: vi.fn(),
                    eject: vi.fn(),
                },
            },
        },
    };
});

vi.mock('react-i18next', async (importOriginal) => {

    const actual = await importOriginal<typeof import('react-i18next')>();

    return {
        ...actual,
        useTranslation: () => {
            return {
                t: vi.fn((key) => key),
                i18n: {
                    resolvedLanguage: 'en',
                    changeLanguage: vi.fn(),
                }
            }
        },
    }
});

vi.mock('moment', async () => {
    const actual = await vi.importActual('moment');
    return {
        ...actual,
        // @ts-expect-error default exists
        default: vi.fn((input) => typeof input !== "undefined" ? actual.default(input) : actual.default('2026-07-20T12:00:00.000Z'))
    };
});

async function waitForDataToBeLoaded(renderResult: RenderResult) {
    await waitFor(async () => {
        const tableItem = await renderResult.findAllByText("John Doe");
        expect(tableItem.length).toEqual(1);
    }, {timeout: 3000})
}

test('renders empty payslip list', async () => {
    const axiosCalls = axios.request as MockedFunction<typeof axios.request>;
    axiosCalls.mockResolvedValueOnce(
        {data: [] as Employee[]}
    )
    axiosCalls.mockResolvedValueOnce(
        {data: "2026-06-01"}
    )
    axiosCalls.mockResolvedValueOnce(
        {data: [] as Payslip[]}
    )
    const renderResult = render(<Provider store={store.store}><BrowserRouter><Payslipslist/></BrowserRouter></Provider>);
    await waitFor(async () => {
        const tableItem = await renderResult.findAllByText("payslipslist.table.empty");
        expect(tableItem.length).toEqual(1);
    }, {timeout: 3000})
    expect(renderResult).toMatchSnapshot();
})

test('renders payslip list', async () => {
    const axiosCalls = axios.request as MockedFunction<typeof axios.request>;
    axiosCalls.mockResolvedValueOnce(
        {data: [EMP_1] as Employee[]}
    )
    axiosCalls.mockResolvedValueOnce(
        {data: "2026-06-01"}
    )
    axiosCalls.mockResolvedValueOnce(
        {data: [PAY_1] as Payslip[]}
    )
    const renderResult = render(<Provider store={store.store}><BrowserRouter><Payslipslist/></BrowserRouter></Provider>);
    await waitForDataToBeLoaded(renderResult);
    expect(renderResult).toMatchSnapshot();
});

test('can search payslips', async () => {
    const axiosCalls = axios.request as MockedFunction<typeof axios.request>;
    axiosCalls.mockResolvedValueOnce(
        {data: [EMP_1] as Employee[]}
    )
    axiosCalls.mockResolvedValueOnce(
        {data: "2026-06-01"}
    )
    axiosCalls.mockResolvedValueOnce(
        {data: [PAY_1] as Payslip[]}
    )
    const renderResult = render(<Provider store={store.store}><BrowserRouter><Payslipslist/></BrowserRouter></Provider>);

    await waitForDataToBeLoaded(renderResult);

    const querySelector = renderResult.container.querySelector('#search');
    expect(querySelector).not.toBeNull()
    if (querySelector !== null) {
        fireEvent.change(querySelector, {target: {value: 'John'}})
        const findByText = await renderResult.findAllByText("John Doe");
        expect(findByText.length).toEqual(1);
        fireEvent.change(querySelector, {target: {value: 'foe'}})
        expect(() => {
            renderResult.getAllByText("John Doe");
        }).toThrow()
    }
})

test('sort on employee', async () => {
    const axiosCalls = axios.request as MockedFunction<typeof axios.request>;
    axiosCalls.mockResolvedValueOnce(
        {data: [EMP_1, {...EMP_1, id: "2", firstName: "Jane"}] as Employee[]}
    )
    axiosCalls.mockResolvedValueOnce(
        {data: "2026-06-01"}
    )
    axiosCalls.mockResolvedValueOnce(
        {data: [PAY_1, {...PAY_1, id: '2', employeeId: '2'}] as Payslip[]}
    )
    const renderResult = render(<Provider store={store.store}><BrowserRouter><Payslipslist/></BrowserRouter></Provider>);
    await waitFor(async () => {
        const tableItem = await renderResult.findAllByText("John Doe");
        expect(tableItem.length).toEqual(1);
    });

    const customerHeader = await renderResult.findByText('payslipslist.table.headers.employee');
    fireEvent.click(customerHeader);
    expect(renderResult).toMatchSnapshot();
    fireEvent.click(customerHeader);
    expect(renderResult).toMatchSnapshot();
})

test('delete payslip', async () => {
    const axiosCalls = axios.request as MockedFunction<typeof axios.request>;
    axiosCalls.mockResolvedValueOnce(
        {data: [EMP_1] as Employee[]}
    )
    axiosCalls.mockResolvedValueOnce(
        {data: "2026-06-01"}
    )
    axiosCalls.mockResolvedValueOnce(
        {data: [PAY_1] as Payslip[]}
    )
    const renderResult = render(<Provider store={store.store}><BrowserRouter><Payslipslist/></BrowserRouter></Provider>);
    await waitForDataToBeLoaded(renderResult);

    const deleteButton = renderResult.container.querySelector("#delete-1");
    expect(deleteButton).not.toBeNull();
    fireEvent.click(deleteButton!);
    expect(renderResult).toMatchSnapshot();
})

test('close payslip month', async () => {
    const axiosCalls = axios.request as MockedFunction<typeof axios.request>;
    axiosCalls.mockResolvedValueOnce(
        {data: [EMP_1] as Employee[]}
    )
    axiosCalls.mockResolvedValueOnce(
        {data: "2026-06-01"}
    )
    axiosCalls.mockResolvedValueOnce(
        {data: [PAY_1] as Payslip[]}
    )
    const renderResult = render(<Provider store={store.store}><BrowserRouter><Payslipslist/></BrowserRouter></Provider>);
    await waitForDataToBeLoaded(renderResult);

    let deleteButton = renderResult.container.querySelector("#delete-1");
    expect(deleteButton).not.toBeNull();

    const closeMonthButton = await renderResult.findByText("payslipslist.close_month");
    axiosCalls.mockResolvedValueOnce(
        {data: "2026-07-01"}
    )
    fireEvent.click(closeMonthButton);
    await waitFor(async () => {
        deleteButton = renderResult.container.querySelector("#delete-1");
        expect(deleteButton).toBeNull();
    }, { timeout: 3000 });
})
