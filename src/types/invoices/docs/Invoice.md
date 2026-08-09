# Invoice


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**customerId** | **string** |  | [default to undefined]
**expireDate** | **string** |  | [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**invoiceDate** | **string** |  | [default to undefined]
**invoiceFile** | **string** |  | [optional] [default to undefined]
**invoiceNumber** | **number** |  | [optional] [default to undefined]
**invoiceUntil** | **string** |  | [default to undefined]
**notes** | **string** |  | [default to undefined]
**status** | [**InvoiceStatus**](InvoiceStatus.md) |  | [default to undefined]
**totalWithoutVat** | **number** |  | [default to undefined]
**vatPercent** | **number** |  | [default to undefined]

## Example

```typescript
import { Invoice } from './api';

const instance: Invoice = {
    customerId,
    expireDate,
    id,
    invoiceDate,
    invoiceFile,
    invoiceNumber,
    invoiceUntil,
    notes,
    status,
    totalWithoutVat,
    vatPercent,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
