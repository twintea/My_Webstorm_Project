declare namespace API {
  type bannedAccountUsingGETParams = {
    id?: number;
  };

  type BaseResponse = {
    code?: number;
    data?: Record<string, any>;
    message?: string;
  };

  type BaseResponseboolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseCaptchaVO = {
    code?: number;
    data?: CaptchaVO;
    message?: string;
  };

  type BaseResponseInterfaceInfoVO = {
    code?: number;
    data?: InterfaceInfoVO;
    message?: string;
  };

  type BaseResponseListInterfaceInfo = {
    code?: number;
    data?: InterfaceInfo[];
    message?: string;
  };

  type BaseResponseListPopInterfaceInfoVO = {
    code?: number;
    data?: PopInterfaceInfoVO[];
    message?: string;
  };

  type BaseResponseListUserInterfaceInfo = {
    code?: number;
    data?: UserInterfaceInfo[];
    message?: string;
  };

  type BaseResponseListUserManageVO = {
    code?: number;
    data?: UserManageVO[];
    message?: string;
  };

  type BaseResponselong = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseMapstringobject = {
    code?: number;
    data?: Record<string, any>;
    message?: string;
  };

  type BaseResponseobject = {
    code?: number;
    data?: Record<string, any>;
    message?: string;
  };

  type BaseResponsePageInterfaceInfoVO = {
    code?: number;
    data?: PageInterfaceInfoVO;
    message?: string;
  };

  type BaseResponsePageShopInterfaceInfoVO = {
    code?: number;
    data?: PageShopInterfaceInfoVO;
    message?: string;
  };

  type BaseResponsePageUserInterfaceInfo = {
    code?: number;
    data?: PageUserInterfaceInfo;
    message?: string;
  };

  type BaseResponsePageUserManageVO = {
    code?: number;
    data?: PageUserManageVO;
    message?: string;
  };

  type BaseResponseUserInterfaceInfo = {
    code?: number;
    data?: UserInterfaceInfo;
    message?: string;
  };

  type BaseResponseUserManageDetailVO = {
    code?: number;
    data?: UserManageDetailVO;
    message?: string;
  };

  type BaseResponseUserManageVO = {
    code?: number;
    data?: UserManageVO;
    message?: string;
  };

  type BaseResponseUserSecretKeyVO = {
    code?: number;
    data?: UserSecretKeyVO;
    message?: string;
  };

  type BaseResponseUserVO = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type CaptchaVO = {
    base64Img?: string;
    captchaKey?: string;
  };

  type DeleteRequest = {
    id?: number;
  };

  type getInterfaceInfoVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserInterfaceInfoByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserManageDetailUsingGETParams = {
    id?: number;
  };

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type IdRequest = {
    id?: number;
  };

  type InterfaceInfo = {
    createTime?: string;
    deleted?: number;
    description?: string;
    id?: number;
    method?: string;
    name?: string;
    requestHeader?: string;
    requestParam?: string;
    requestParamRemark?: string;
    responseHeader?: string;
    responseParamRemark?: string;
    status?: number;
    updateTime?: string;
    url?: string;
    userId?: number;
  };

  type InterfaceInfoAddRequest = {
    description?: string;
    method?: string;
    name?: string;
    requestHeader?: string;
    requestParam?: string;
    requestParamRemark?: RequestParamRemarkVO[];
    responseHeader?: string;
    responseParamRemark?: ResponseParamRemarkVO[];
    url?: string;
  };

  type InterfaceInfoInvokeRequest = {
    id?: number;
    requestParam?: string;
  };

  type InterfaceInfoQueryRequest = {
    createTimeRange?: string[];
    current?: number;
    description?: string;
    id?: number;
    method?: string;
    name?: string;
    pageSize?: number;
    requestHeader?: string;
    requestParam?: string;
    responseHeader?: string;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    status?: number;
    updateTimeRange?: string[];
    url?: string;
    userId?: number;
  };

  type InterfaceInfoUpdateRequest = {
    description?: string;
    id?: number;
    method?: string;
    name?: string;
    requestHeader?: string;
    requestParam?: string;
    requestParamRemark?: RequestParamRemarkVO[];
    responseHeader?: string;
    responseParamRemark?: ResponseParamRemarkVO[];
    sataus?: number;
    url?: string;
  };

  type InterfaceInfoVO = {
    createTime?: string;
    description?: string;
    id?: number;
    isOwnerByCurrentUser?: boolean;
    leftNum?: number;
    method?: string;
    name?: string;
    requestHeader?: string;
    requestParam?: string;
    requestParamRemark?: RequestParamRemarkVO[];
    responseHeader?: string;
    responseParamRemark?: ResponseParamRemarkVO[];
    status?: number;
    totalNum?: number;
    updateTime?: string;
    url?: string;
    userId?: number;
  };

  type listInterfaceInfoUsingGETParams = {
    createTimeRange?: string[];
    current?: number;
    description?: string;
    id?: number;
    method?: string;
    name?: string;
    pageSize?: number;
    requestHeader?: string;
    requestParam?: string;
    responseHeader?: string;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    status?: number;
    updateTimeRange?: string[];
    url?: string;
    userId?: number;
  };

  type listUserInterfaceInfoByPageUsingGETParams = {
    current?: number;
    id?: number;
    interfaceInfoId?: number;
    invokeStatus?: number;
    leftNum?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    totalNum?: number;
    userId?: number;
  };

  type listUserInterfaceInfoUsingGETParams = {
    current?: number;
    id?: number;
    interfaceInfoId?: number;
    invokeStatus?: number;
    leftNum?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    totalNum?: number;
    userId?: number;
  };

  type listUserManageVOUsingGETParams = {
    createTimeRange?: string[];
    current?: number;
    gender?: number;
    id?: number;
    interfaceName?: string;
    ip?: string;
    ipAttribution?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    updateTimeRange?: string[];
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
    userStatus?: number;
  };

  type ModelAndView = {
    empty?: boolean;
    model?: Record<string, any>;
    modelMap?: Record<string, any>;
    reference?: boolean;
    status?:
      | 'ACCEPTED'
      | 'ALREADY_REPORTED'
      | 'BAD_GATEWAY'
      | 'BAD_REQUEST'
      | 'BANDWIDTH_LIMIT_EXCEEDED'
      | 'CHECKPOINT'
      | 'CONFLICT'
      | 'CONTINUE'
      | 'CREATED'
      | 'DESTINATION_LOCKED'
      | 'EXPECTATION_FAILED'
      | 'FAILED_DEPENDENCY'
      | 'FORBIDDEN'
      | 'FOUND'
      | 'GATEWAY_TIMEOUT'
      | 'GONE'
      | 'HTTP_VERSION_NOT_SUPPORTED'
      | 'IM_USED'
      | 'INSUFFICIENT_SPACE_ON_RESOURCE'
      | 'INSUFFICIENT_STORAGE'
      | 'INTERNAL_SERVER_ERROR'
      | 'I_AM_A_TEAPOT'
      | 'LENGTH_REQUIRED'
      | 'LOCKED'
      | 'LOOP_DETECTED'
      | 'METHOD_FAILURE'
      | 'METHOD_NOT_ALLOWED'
      | 'MOVED_PERMANENTLY'
      | 'MOVED_TEMPORARILY'
      | 'MULTIPLE_CHOICES'
      | 'MULTI_STATUS'
      | 'NETWORK_AUTHENTICATION_REQUIRED'
      | 'NON_AUTHORITATIVE_INFORMATION'
      | 'NOT_ACCEPTABLE'
      | 'NOT_EXTENDED'
      | 'NOT_FOUND'
      | 'NOT_IMPLEMENTED'
      | 'NOT_MODIFIED'
      | 'NO_CONTENT'
      | 'OK'
      | 'PARTIAL_CONTENT'
      | 'PAYLOAD_TOO_LARGE'
      | 'PAYMENT_REQUIRED'
      | 'PERMANENT_REDIRECT'
      | 'PRECONDITION_FAILED'
      | 'PRECONDITION_REQUIRED'
      | 'PROCESSING'
      | 'PROXY_AUTHENTICATION_REQUIRED'
      | 'REQUESTED_RANGE_NOT_SATISFIABLE'
      | 'REQUEST_ENTITY_TOO_LARGE'
      | 'REQUEST_HEADER_FIELDS_TOO_LARGE'
      | 'REQUEST_TIMEOUT'
      | 'REQUEST_URI_TOO_LONG'
      | 'RESET_CONTENT'
      | 'SEE_OTHER'
      | 'SERVICE_UNAVAILABLE'
      | 'SWITCHING_PROTOCOLS'
      | 'TEMPORARY_REDIRECT'
      | 'TOO_EARLY'
      | 'TOO_MANY_REQUESTS'
      | 'UNAUTHORIZED'
      | 'UNAVAILABLE_FOR_LEGAL_REASONS'
      | 'UNPROCESSABLE_ENTITY'
      | 'UNSUPPORTED_MEDIA_TYPE'
      | 'UPGRADE_REQUIRED'
      | 'URI_TOO_LONG'
      | 'USE_PROXY'
      | 'VARIANT_ALSO_NEGOTIATES';
    view?: View;
    viewName?: string;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageInterfaceInfoVO = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: InterfaceInfoVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageShopInterfaceInfoVO = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: ShopInterfaceInfoVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserInterfaceInfo = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserInterfaceInfo[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserManageVO = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserManageVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PopInterfaceInfoVO = {
    name?: string;
    totalNum?: number;
  };

  type RequestParamRemarkVO = {
    id?: number;
    isRequired?: string;
    name?: string;
    remark?: string;
    type?: string;
  };

  type resetAkSkCaptchaUsingGETParams = {
    id?: number;
  };

  type ResponseParamRemarkVO = {
    id?: number;
    name?: string;
    remark?: string;
    type?: string;
  };

  type restoredAccountUsingGETParams = {
    id?: number;
  };

  type SearchTextRequest = {
    current?: number;
    pageSize?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
  };

  type ShopInterfaceInfoVO = {
    createTime?: string;
    description?: string;
    id?: number;
    isOwnerByCurrentUser?: boolean;
    method?: string;
    name?: string;
    status?: number;
    userId?: number;
  };

  type ShowAndUpdateSecretKeyRequest = {
    captchaCode?: string;
    captchaKey?: string;
    password?: string;
    userId?: string;
  };

  type UpdatePwdRequest = {
    checkNewPassword?: string;
    id?: number;
    newPassword?: string;
    oldPassword?: string;
  };

  type UserAddRequest = {
    gender?: number;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userRole?: string;
  };

  type UserInterfaceInfo = {
    createTime?: string;
    deleted?: number;
    id?: number;
    interfaceInfoId?: number;
    invokeStatus?: number;
    leftNum?: number;
    totalNum?: number;
    updateTime?: string;
    userId?: number;
  };

  type UserInterfaceInfoAddRequest = {
    id?: number;
    interfaceInfoId?: number;
    leftNum?: number;
    totalNum?: number;
    userId?: number;
  };

  type UserInterfaceInfoUpdateRequest = {
    id?: number;
    invokeStatus?: number;
    leftNum?: number;
    totalNum?: number;
  };

  type UserInterfaceInfoUsageVO = {
    createTime?: string;
    interfaceInfoId?: number;
    interfaceInfoStatus?: number;
    interfaceName?: string;
    invokeStatus?: number;
    leftNum?: number;
    totalNum?: number;
    updateTime?: string;
  };

  type UserLoginAndRegisterRequest = {
    captchaCode?: string;
    captchaKey?: string;
    checkPassword?: string;
    isRemember?: boolean;
    userAccount?: string;
    userId?: string;
    userPassword?: string;
  };

  type UserManageDetailVO = {
    userAccount?: string;
    userId?: number;
    userInterfaceInfoUsageVO?: UserInterfaceInfoUsageVO[];
    userName?: string;
  };

  type UserManageVO = {
    createTime?: string;
    gender?: number;
    id?: number;
    ip?: string;
    ipAttribution?: string;
    owedInterface?: string[];
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
    userStatus?: number;
  };

  type UserQueryRequest = {
    createTimeRange?: string[];
    current?: number;
    gender?: number;
    id?: number;
    interfaceName?: string;
    ip?: string;
    ipAttribution?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    updateTimeRange?: string[];
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
    userStatus?: number;
  };

  type UserSecretKeyVO = {
    accessKey?: string;
    secretKey?: string;
  };

  type UserUpdateRequest = {
    gender?: number;
    id?: number;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userRole?: string;
  };

  type UserVO = {
    createTime?: string;
    gender?: number;
    id?: number;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type View = {
    contentType?: string;
  };
}
