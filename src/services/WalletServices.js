import * as Constant from "../constants/Constant"
export const ApiGetWalletByUser = async (token) => {
    const response = await fetch(`${Constant.API_GET_WALLET_BY_TOKEN}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}

export const ApiGetAllTransactionWallet = async (pageIndex, pageSize, token) => {
    const params = new URLSearchParams({pageIndex, pageSize});
    const response = await fetch(`${Constant.API_GET_ALL_TRANSACTION_WALLET_OF_USER}?${params.toString()}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}
