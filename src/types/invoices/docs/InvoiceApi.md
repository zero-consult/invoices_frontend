# InvoiceApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteInvoice**](#deleteinvoice) | **DELETE** /invoice/{id} | Delete an invoice|
|[**editInvoice**](#editinvoice) | **PUT** /invoice/{id} | Edit an invoice|
|[**generateInvoice**](#generateinvoice) | **POST** /invoice | Add a new invoice|
|[**getCustomersWithConceptInvoices**](#getcustomerswithconceptinvoices) | **GET** /invoice/concept/customers | Get the customers with an invoice concept|
|[**getInvoice**](#getinvoice) | **GET** /invoice/{id} | Get an invoice|
|[**getInvoiceDateOfCustomer**](#getinvoicedateofcustomer) | **GET** /invoicingMonth/customer/{id} | Get the latest invoice date of a customer|
|[**getInvoiceFile**](#getinvoicefile) | **GET** /invoice/{id}/file | Get the invoice file|
|[**invoiceList**](#invoicelist) | **GET** /invoice | Get the list of invoices for a given period|

# **deleteInvoice**
> deleteInvoice()


### Example

```typescript
import {
    InvoiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvoiceApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.deleteInvoice(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Invoice deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **editInvoice**
> Invoice editInvoice(invoice)


### Example

```typescript
import {
    InvoiceApi,
    Configuration,
    Invoice
} from './api';

const configuration = new Configuration();
const apiInstance = new InvoiceApi(configuration);

let id: string; // (default to undefined)
let invoice: Invoice; //

const { status, data } = await apiInstance.editInvoice(
    id,
    invoice
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **invoice** | **Invoice**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Invoice**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, text/plain


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Invoice created |  -  |
|**404** | Entity not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **generateInvoice**
> Invoice generateInvoice(invoice)


### Example

```typescript
import {
    InvoiceApi,
    Configuration,
    Invoice
} from './api';

const configuration = new Configuration();
const apiInstance = new InvoiceApi(configuration);

let invoice: Invoice; //

const { status, data } = await apiInstance.generateInvoice(
    invoice
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **invoice** | **Invoice**|  | |


### Return type

**Invoice**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, text/plain


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Invoice created |  -  |
|**404** | Entity not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCustomersWithConceptInvoices**
> Array<string> getCustomersWithConceptInvoices()


### Example

```typescript
import {
    InvoiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvoiceApi(configuration);

const { status, data } = await apiInstance.getCustomersWithConceptInvoices();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<string>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Customers found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getInvoice**
> Invoice getInvoice()


### Example

```typescript
import {
    InvoiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvoiceApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getInvoice(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Invoice**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, text/plain


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Invoice found |  -  |
|**404** | Entity not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getInvoiceDateOfCustomer**
> string getInvoiceDateOfCustomer()


### Example

```typescript
import {
    InvoiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvoiceApi(configuration);

let id: string; // (default to undefined)
let invoiceId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getInvoiceDateOfCustomer(
    id,
    invoiceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|
| **invoiceId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Invoicing month for found |  -  |
|**204** | No invoicing month for this customer |  -  |
|**404** | Entity not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getInvoiceFile**
> File getInvoiceFile()


### Example

```typescript
import {
    InvoiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvoiceApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getInvoiceFile(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**File**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/pdf, text/plain


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Invoice file found |  -  |
|**404** | Entity not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **invoiceList**
> Array<Invoice> invoiceList()


### Example

```typescript
import {
    InvoiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvoiceApi(configuration);

let from: string; // (default to undefined)
let until: string; // (default to undefined)
let customerId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.invoiceList(
    from,
    until,
    customerId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **from** | [**string**] |  | defaults to undefined|
| **until** | [**string**] |  | defaults to undefined|
| **customerId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**Array<Invoice>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of invoices |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

