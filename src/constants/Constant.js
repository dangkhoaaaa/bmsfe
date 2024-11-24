import { GetMessageError } from "../utils/StringUtils";

/*
 ** HTTP CONFIG
 */
export const HTTP_SERVER = "https://bms-fs-api.azurewebsites.net";

/*
 ** REQUEST CONFIG
 */
export const HTTP_HEADER_JSON = {
    'Content-Type': 'application/json'
}
export const HTTP_MULTIPART_FORM_DATA = {
    'accept': '*/*',
}
export const HTTP_HEADER_TOKEN = (token) => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }
};
export const HEADER_TOKEN = (token) => {
    return {
        'Authorization': `Bearer ${token}`,
    }
};


/*
 ** GOOGLE API KEY
 */
export const API_KEY = "AlzaSyGpCG5SrSCk-n1TWzoyTLa1Wt891BhXWBO";
export const URL_MAP_AUTOCOMPLETE = "https://maps.gomaps.pro/maps/api/place/autocomplete/json";

/*
 ** RESPONSE CONFIG
 */
export const ResponseData = async (res, onlyOk = false) => {
    try {
        const body = await res.json();
        if ((res.ok && body.isSuccess) || (res.ok && onlyOk)) {
            return {
                ok: true,
                message: "Data transaction success",
                body
            };
        } else {
            return {
                ok: false,
                message: GetMessageError(body),
                body
            };
        }
    } catch (e) {
        console.log("ERROR: " + e);
        return {
            ok: false,
            message: "Unknow Server Error",
            body: []
        };
    }
};

/*
 ** CONFIG VARIABLES
 */
export const DIGIT_CODE_EXPIRED = 60;
export const ENABLE_DEBUG_CHANGE_PASSWORD = true;
export const ENABLE_DEBUG_DIGIT_CODE = false;
export const DIGIT_CODE_DEFAULT = "123456";

/*
 ** USER ROLE
 */
export const SHOP_ADMIN = 1;
export const SHOP_ROLE = 2;
export const SHOP_STAFF = 3;

/*
 ** USER ACCOUNT STATUS
 */
export const USER_STATUS_PENDING = 1;
export const USER_STATUS_ACCEPTED = 2;
export const USER_STATUS_DENIED = 3;
export const USER_STATUS_CLOSED = 4;

/*
 ** API USER
 */
 export const API_GET_TOTAL_NEW_USER = HTTP_SERVER + "/api/User/CountNewUser";

/*
 ** API AUTH
 */
export const API_REGISTER_ACCOUNT = HTTP_SERVER + "/api/Auth/register";
export const API_LOGIN_ACCOUNT = HTTP_SERVER + "/api/Auth/login";
export const API_SEND_DIGIT_CODE = HTTP_SERVER + "/api/Auth/sendOTP";
export const API_CONFIRM_DIGIT_CODE = HTTP_SERVER + "/api/Auth/checkOTP";
export const API_CHANGE_PASSWORD = HTTP_SERVER + "/api/Auth/change-password";
export const API_RESET_PASSWORD = HTTP_SERVER + "/api/Account/ResetPassword";

/*
 ** API ACCOUNT
 */
export const API_GET_MY_PROFILE = HTTP_SERVER + "/api/Account/my-profile";

/*
 ** API COUPON
 */
export const API_CREATE_COUPON = HTTP_SERVER + "/api/Coupon";
export const API_UPDATE_COUPON = HTTP_SERVER + "/api/Coupon/";

/*
 ** API PRODUCT
 */
export const AIP_UPDATE_PRODUCT = HTTP_SERVER + "/api/Product/";
export const AIP_GET_PRODUCT_BY_ID = HTTP_SERVER + "/api/Product/";
export const AIP_CREATE_PRODUCT = HTTP_SERVER + "/api/Product";
export const API_GET_PRODUCTS_BY_SHOP_ID = HTTP_SERVER + "/api/Product/all-product-by-shop-id";

/*
** API SHOP
*/
export const AIP_CREATE_SHOP = HTTP_SERVER + "/api/ShopApplication";
export const AIP_UPDATE_SHOP = HTTP_SERVER + "/api/Shop/";
export const API_GET_SHOP_BY_ID = HTTP_SERVER + "/api/Shop/";

/*
** API PACKAGE
*/
export const API_GET_PACKAGES = HTTP_SERVER + "/api/Package/";
export const API_GET_PACKAGE_FOR_SHOP_IN_USE = HTTP_SERVER + "/api/Package/GetPackageForShopInUse/";
export const API_GET_PACKAGE_BY_ID = HTTP_SERVER + "/api/Package/";
export const API_BUY_PACKAGE = HTTP_SERVER + "/api/Package/BuyPackageByShop";
export const API_VNPAY_BUY_PACKAGE = HTTP_SERVER + "/api/Payment/create-payment-url-forbuypackage";

/*
** API ORDER
*/
export const API_GET_ORDER_BY_SHOP_ID = HTTP_SERVER + "/api/Order/GetOrderByShop";
export const API_GET_ORDER_BY_ID = HTTP_SERVER + "/api/Order/GetOrderById/";
export const API_UPDATE_ORDER_STATUS = HTTP_SERVER + "/api/Order/";
export const API_GET_TOTAL_ORDERS = HTTP_SERVER + "/api/Order/GetTotalOrder";


/*
 ** API TRANSACTION
 */
 export const API_GET_ALL_TRANSACTION = HTTP_SERVER + "/api/Transaction/GetListTransactions";
 export const API_GET_TOTAL_REVENUE = HTTP_SERVER + "/api/Transaction/GetTotalRevenue";
 export const API_GET_TOP_5_USER_PURCHARSE = HTTP_SERVER + "/api/Transaction/GetTopUserHaveHighTransaction";