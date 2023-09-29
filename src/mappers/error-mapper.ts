import { HttpErrorCode } from '../@types/http-error-code';
import { HttpErrorResponse } from '../@types/http-error-response';

export class ErrorMapper {
  static httpErrorCodeToString(code: HttpErrorCode): string {
    switch (code) {
      case HttpErrorCode.HTTP_100_Continue:
        return 'HTTP_100_Continue';
      case HttpErrorCode.HTTP_101_Switchingprotocols:
        return 'HTTP_101_Switchingprotocols';
      case HttpErrorCode.HTTP_102_Processing:
        return 'HTTP_102_Processing';
      case HttpErrorCode.HTTP_103_EarlyHints:
        return 'HTTP_103_EarlyHints';
      case HttpErrorCode.HTTP_200_OK:
        return 'HTTP_200_OK';
      case HttpErrorCode.HTTP_201_Created:
        return 'HTTP_201_Created';
      case HttpErrorCode.HTTP_202_Accepted:
        return 'HTTP_202_Accepted';
      case HttpErrorCode.HTTP_203_NonAuthoritativeInformation:
        return 'HTTP_203_NonAuthoritativeInformation';
      case HttpErrorCode.HTTP_204_NoContent:
        return 'HTTP_204_NoContent';
      case HttpErrorCode.HTTP_205_ResetContent:
        return 'HTTP_205_ResetContent';
      case HttpErrorCode.HTTP_206_PartialContent:
        return 'HTTP_206_PartialContent';
      case HttpErrorCode.HTTP_207_MultiStatus:
        return 'HTTP_207_MultiStatus';
      case HttpErrorCode.HTTP_208_AlreadyReported:
        return 'HTTP_208_AlreadyReported';
      case HttpErrorCode.HTTP_226_IMUsed:
        return 'HTTP_226_IMUsed';
      case HttpErrorCode.HTTP_300_MultipleChoices:
        return 'HTTP_300_MultipleChoices';
      case HttpErrorCode.HTTP_301_MovedPermanently:
        return 'HTTP_301_MovedPermanently';
      case HttpErrorCode.HTTP_302_Found:
        return 'HTTP_302_Found';
      case HttpErrorCode.HTTP_303_SeeOther:
        return 'HTTP_303_SeeOther';
      case HttpErrorCode.HTTP_304_NotModified:
        return 'HTTP_304_NotModified';
      case HttpErrorCode.HTTP_305_UseProxy:
        return 'HTTP_305_UseProxy';
      case HttpErrorCode.HTTP_306_SwitchProxy:
        return 'HTTP_306_SwitchProxy';
      case HttpErrorCode.HTTP_307_TemporaryRedirect:
        return 'HTTP_307_TemporaryRedirect';
      case HttpErrorCode.HTTP_308_PermanentRedirect:
        return 'HTTP_308_PermanentRedirect';
      case HttpErrorCode.HTTP_400_BadRequest:
        return 'HTTP_400_BadRequest';
      case HttpErrorCode.HTTP_401_Unauthorized:
        return 'HTTP_401_Unauthorized';
      case HttpErrorCode.HTTP_402_PaymentRequired:
        return 'HTTP_402_PaymentRequired';
      case HttpErrorCode.HTTP_403_Forbidden:
        return 'HTTP_403_Forbidden';
      case HttpErrorCode.HTTP_404_NotFound:
        return 'HTTP_404_NotFound';
      case HttpErrorCode.HTTP_405_MethodNotAllowed:
        return 'HTTP_405_MethodNotAllowed';
      case HttpErrorCode.HTTP_406_NotAcceptable:
        return 'HTTP_406_NotAcceptable';
      case HttpErrorCode.HTTP_407_ProxyAuthenticationRequired:
        return 'HTTP_407_ProxyAuthenticationRequired';
      case HttpErrorCode.HTTP_408_RequestTimeout:
        return 'HTTP_408_RequestTimeout';
      case HttpErrorCode.HTTP_409_Conflict:
        return 'HTTP_409_Conflict';
      case HttpErrorCode.HTTP_410_Gone:
        return 'HTTP_410_Gone';
      case HttpErrorCode.HTTP_411_LengthRequired:
        return 'HTTP_411_LengthRequired';
      case HttpErrorCode.HTTP_412_PreconditionFailed:
        return 'HTTP_412_PreconditionFailed';
      case HttpErrorCode.HTTP_413_PayloadTooLarge:
        return 'HTTP_413_PayloadTooLarge';
      case HttpErrorCode.HTTP_414_URITooLong:
        return 'HTTP_414_URITooLong';
      case HttpErrorCode.HTTP_415_UnsupportedMediaType:
        return 'HTTP_415_UnsupportedMediaType';
      case HttpErrorCode.HTTP_416_RangeNotSatisfiable:
        return 'HTTP_416_RangeNotSatisfiable';
      case HttpErrorCode.HTTP_417_ExpectationFailed:
        return 'HTTP_417_ExpectationFailed';
      case HttpErrorCode.HTTP_421_MisdirectedRequest:
        return 'HTTP_421_MisdirectedRequest';
      case HttpErrorCode.HTTP_422_UnprocessableEntity:
        return 'HTTP_422_UnprocessableEntity';
      case HttpErrorCode.HTTP_423_Locked:
        return 'HTTP_423_Locked';
      case HttpErrorCode.HTTP_424_FailedDependency:
        return 'HTTP_424_FailedDependency';
      case HttpErrorCode.HTTP_425_TooEarly:
        return 'HTTP_425_TooEarly';
      case HttpErrorCode.HTTP_426_UpgradeRequired:
        return 'HTTP_426_UpgradeRequired';
      case HttpErrorCode.HTTP_428_PreconditionRequired:
        return 'HTTP_428_PreconditionRequired';
      case HttpErrorCode.HTTP_429_TooManyRequests:
        return 'HTTP_429_TooManyRequests';
      case HttpErrorCode.HTTP_431_RequestHeaderFieldsTooLarge:
        return 'HTTP_431_RequestHeaderFieldsTooLarge';
      case HttpErrorCode.HTTP_451_UnavailableForLegalReasons:
        return 'HTTP_451_UnavailableForLegalReasons';
      case HttpErrorCode.HTTP_500_InternalServerError:
        return 'HTTP_500_InternalServerError';
      case HttpErrorCode.HTTP_501_NotImplemented:
        return 'HTTP_501_NotImplemented';
      case HttpErrorCode.HTTP_502_BadGateway:
        return 'HTTP_502_BadGateway';
      case HttpErrorCode.HTTP_503_ServiceUnavailable:
        return 'HTTP_503_ServiceUnavailable';
      case HttpErrorCode.HTTP_504_GatewayTimeout:
        return 'HTTP_504_GatewayTimeout';
      case HttpErrorCode.HTTP_505_HTTPVersionNotSupported:
        return 'HTTP_505_HTTPVersionNotSupported';
      case HttpErrorCode.HTTP_506_VariantAlsoNegotiates:
        return 'HTTP_506_VariantAlsoNegotiates';
      case HttpErrorCode.HTTP_507_InsufficientStorage:
        return 'HTTP_507_InsufficientStorage';
      case HttpErrorCode.HTTP_508_LoopDetected:
        return 'HTTP_508_LoopDetected';
      case HttpErrorCode.HTTP_510_NotExtended:
        return 'HTTP_510_NotExtended';
      case HttpErrorCode.HTTP_511_NetworkAuthenticationRequired:
        return 'HTTP_511_NetworkAuthenticationRequired';
      default:
        return 'UNKNOWN_HttpErrorCode';
    }
  }

  static toHttpErrorResponse(
    requestId: string,
    httpErrorCode: HttpErrorCode,
    applicationErrorCode?: string,
    applicationErrorMessage?: string,
  ): HttpErrorResponse {
    return {
      requestId,
      httpErrorCode,
      httpErrorMessage: this.httpErrorCodeToString(httpErrorCode),
      applicationErrorCode,
      applicationErrorMessage,
    };
  }
}
