# InvoicingMonthApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**closeCurrentPayslipMonth**](#closecurrentpayslipmonth) | **GET** /invoicingMonth/payslip/close | Close the current invoicingMonth|
|[**getCurrentPayslipMonth**](#getcurrentpayslipmonth) | **GET** /invoicingMonth/payslip | Get the current payslipMonth|

# **closeCurrentPayslipMonth**
> string closeCurrentPayslipMonth()


### Example

```typescript
import {
    InvoicingMonthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvoicingMonthApi(configuration);

const { status, data } = await apiInstance.closeCurrentPayslipMonth();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**string**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | New payslip month |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCurrentPayslipMonth**
> string getCurrentPayslipMonth()


### Example

```typescript
import {
    InvoicingMonthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvoicingMonthApi(configuration);

const { status, data } = await apiInstance.getCurrentPayslipMonth();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**string**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Current payslip month |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

