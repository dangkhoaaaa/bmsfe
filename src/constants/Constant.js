import { GetMessageError } from "../utils/StringUtils";

/*
 ** HTTP CONFIG
 */
export const HTTP_SERVER = "https://bms-fs-api.azurewebsites.net";
export const HTTP_SOCKET_SERVER = "https://bms-socket.onrender.com";

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
export const API_KEY = "AlzaSydapZiNthTw3F10s6HOw1m0g4IK5hF687x";
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
 ** API NOTIFICATION
 */
export const API_GET_NOTI_FOR_SHOP = HTTP_SERVER + "/api/Notification/GetNotificationForShop";
export const API_READ_ALL_NOTI_FOR_SHOP = HTTP_SERVER + "/api/Notification/ReadAllNotificationForShop";
export const API_COUNT_UNREAD_FOR_SHO = HTTP_SERVER + "/api/Notification/CountNotificationForShop";
export const API_GET_CATEGORIES_BY_PRODUCT_ID = HTTP_SERVER + "/api/RegisterCategory/GetAllCategorybyProductId";

/*
 ** API CATEGORY
 */
export const API_GET_CATEGORIES = HTTP_SERVER + "/api/Category";
export const API_REGISTER_PRODUCT_TO_CATEGORY = HTTP_SERVER + "/api/RegisterCategory";
export const API_REMOVE_PRODUCT_FROM_CATEGORY = HTTP_SERVER + "/api/RegisterCategory";

/*
 ** API USER
 */
export const API_GET_TOTAL_NEW_USER = HTTP_SERVER + "/api/User/CountNewUser";

/*
 ** API UNIVERSITY
 */
export const API_GET_ALL_UNIVERSITY = HTTP_SERVER + "/api/University";

/*
** API OPERATION HOURS
*/
export const API_GET_OPERATION_HOURS_FOR_SHOP = HTTP_SERVER + "/api/OpeningHour/GetOpeningHoursForShop";
export const API_UPDATE_OPERATION_HOURS_FOR_SHOP = HTTP_SERVER + "/api/OpeningHour/UpdateOpeningHoursForShop";

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
export const API_UPDATE_ACCOUNT = HTTP_SERVER + "/api/Account";
export const API_UPDATE_AVATAR = HTTP_SERVER + "/api/Account/update-avatar";

/*
 ** API COUPON
 */
export const API_CREATE_COUPON = HTTP_SERVER + "/api/Coupon";
export const API_UPDATE_COUPON = HTTP_SERVER + "/api/Coupon/";

/*
 ** API PRODUCT
 */
export const API_DELETE_PRODUCT = HTTP_SERVER + "/api/Product";
export const API_CHANGE_STOCK_OUT = HTTP_SERVER + "/api/Product/ChangeOutOfStock";
export const AIP_UPDATE_PRODUCT = HTTP_SERVER + "/api/Product/";
export const AIP_GET_PRODUCT_BY_ID = HTTP_SERVER + "/api/Product/";
export const AIP_CREATE_PRODUCT = HTTP_SERVER + "/api/Product";
export const AIP_CREATE_PRODUCT_FOR_STAFF = HTTP_SERVER + "/api/Product/AddProductToStaff";
export const API_GET_PRODUCTS_BY_SHOP_ID = HTTP_SERVER + "/api/Product/all-product-by-shop-id";
export const API_GET_TOP_5_DISHES = HTTP_SERVER + "/api/Product/GetProductBestSellerInShop";

/*
** API SHOP
*/
export const AIP_CREATE_SHOP = HTTP_SERVER + "/api/ShopApplication";
export const AIP_UPDATE_SHOP = HTTP_SERVER + "/api/Shop/";
export const API_GET_SHOP_BY_ID = HTTP_SERVER + "/api/Shop/";

/*
** API PACKAGE
*/
export const API_GET_PACKAGES = HTTP_SERVER + "/api/Package";
export const API_ADD_PACKAGE = HTTP_SERVER + "/api/Package";
export const API_UPDATE_PACKAGE = HTTP_SERVER + "/api/Package/";
export const API_DELETE_PACKAGE = HTTP_SERVER + "/api/Package/";
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
export const API_CHANGE_ORDER_STATUS = HTTP_SERVER + "/api/Order/ChangeOrderStatus";
export const API_GET_TOTAL_ORDERS = HTTP_SERVER + "/api/Order/GetTotalOrder";
export const API_GET_LIST_ORDERS = HTTP_SERVER + "/api/Order/GetListOrders";
export const API_GET_TOTAL_ORDERS_IN_SHOP = HTTP_SERVER + "/api/Order/GetTotalOrderInShop/";
export const API_CANCEL_LIST_ORDERS = HTTP_SERVER + "/api/Order/CancelListOrder";
export const API_GET_ORDERS_IN_TIME_FOR_SHOP = HTTP_SERVER + "/api/Order/GetOrdersInTimeForShop/";

/*
 ** API TRANSACTION
 */
export const API_GET_ALL_TRANSACTION = HTTP_SERVER + "/api/Transaction/GetListTransactions";
export const API_GET_TOTAL_REVENUE = HTTP_SERVER + "/api/Transaction/GetTotalRevenue";
export const API_GET_TOTAL_REVENUE_IN_SHOP = HTTP_SERVER + "/api/Transaction/GetTotalRevenueForShop/";
export const API_GET_TOP_5_USER_PURCHARSE = HTTP_SERVER + "/api/Transaction/GetTopUserHaveHighTransaction";

/*
 ** API WALLET
 */
export const API_GET_WALLET_BY_TOKEN = HTTP_SERVER + "/api/Wallet/GetWalletByUserId";
export const API_GET_ALL_TRANSACTION_WALLET_OF_USER = HTTP_SERVER + "/api/Wallet/GetAllTransactionOfUserWallet";

/*
 ** API STUDENT
 */
 export const API_GET_STUDENT_CONFIRM_LIST = HTTP_SERVER + "/api/StudentApplication";
 export const API_CHANGE_STATUS_STUDENT = HTTP_SERVER + "/api/StudentApplication/";

