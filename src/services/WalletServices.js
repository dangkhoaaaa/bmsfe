import * as Constant from "../constants/Constant"
export const ApiGetWalletByUser = async (token) => {
    const response = await fetch(`${Constant.API_GET_WALLET_BY_TOKEN}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}