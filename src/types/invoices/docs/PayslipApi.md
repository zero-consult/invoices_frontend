# PayslipApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deletePayslip**](#deletepayslip) | **DELETE** /payslips/{id} | Delete a payslip|
|[**generatePayslip**](#generatepayslip) | **POST** /payslips | Add a new payslip entry|
|[**getPayslip**](#getpayslip) | **GET** /payslips/{id} | Get a payslip|
|[**getPayslipFile**](#getpayslipfile) | **GET** /payslips/{id}/file | Get the payslip file|
|[**getPayslipMonth**](#getpayslipmonth) | **GET** /payslips/month | Get the current payslip month|
|[**payslipsList**](#payslipslist) | **GET** /payslips | Get the list of payslips for a given period|
|[**updatePayslip**](#updatepayslip) | **PUT** /payslips/{id} | Update a payslip|

# **deletePayslip**
> deletePayslip()


### Example

```typescript
import {
    PayslipApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PayslipApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.deletePayslip(
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
|**204** | Payslip deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **generatePayslip**
> Payslip generatePayslip(payslip)


### Example

```typescript
import {
    PayslipApi,
    Configuration,
    Payslip
} from './api';

const configuration = new Configuration();
const apiInstance = new PayslipApi(configuration);

let payslip: Payslip; //

const { status, data } = await apiInstance.generatePayslip(
    payslip
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **payslip** | **Payslip**|  | |


### Return type

**Payslip**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, text/plain


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Payslip created |  -  |
|**404** | Entity not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPayslip**
> Payslip getPayslip()


### Example

```typescript
import {
    PayslipApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PayslipApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getPayslip(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Payslip**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, text/plain


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Payslip found |  -  |
|**404** | Entity not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPayslipFile**
> File getPayslipFile()


### Example

```typescript
import {
    PayslipApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PayslipApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getPayslipFile(
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
|**200** | Payslip file found |  -  |
|**404** | Entity not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPayslipMonth**
> string getPayslipMonth()


### Example

```typescript
import {
    PayslipApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PayslipApi(configuration);

const { status, data } = await apiInstance.getPayslipMonth();
```

### Parameters
This endpoint does not have any parameters.


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
|**200** | Current payslip month |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **payslipsList**
> Array<Payslip> payslipsList()


### Example

```typescript
import {
    PayslipApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PayslipApi(configuration);

let from: string; // (default to undefined)
let until: string; // (default to undefined)
let employeeId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.payslipsList(
    from,
    until,
    employeeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **from** | [**string**] |  | defaults to undefined|
| **until** | [**string**] |  | defaults to undefined|
| **employeeId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**Array<Payslip>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of timesheet entries |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updatePayslip**
> Payslip updatePayslip(payslip)


### Example

```typescript
import {
    PayslipApi,
    Configuration,
    Payslip
} from './api';

const configuration = new Configuration();
const apiInstance = new PayslipApi(configuration);

let id: string; // (default to undefined)
let payslip: Payslip; //

const { status, data } = await apiInstance.updatePayslip(
    id,
    payslip
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **payslip** | **Payslip**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Payslip**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, text/plain


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Payslip updated |  -  |
|**404** | Entity not found |  -  |
|**406** | Month of payslip is already closed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

