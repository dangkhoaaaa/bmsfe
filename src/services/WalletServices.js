import * as Constant from "../constants/Constant"
export const ApiGetWalletByUser = async (token) => {
    const response = await fetch(`${Constant.API_GET_WALLET_BY_TOKEN}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}

export const ApiGetAllTransactionWallet = async (pageIndex, pageSize, token) => {
    const params = new URLSearchParams({ pageIndex, pageSize });
    const response = await fetch(`${Constant.API_GET_ALL_TRANSACTION_WALLET_OF_USER}?${params.toString()}`, {
        headers: Constant.HEADER_TOKEN(token),
    });
    return Constant.ResponseData(response);
}

export const ApiUpdateBalance = async (amount, status, token) => {
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("status", status);
    const response = await fetch(`${Constant.API_UPDATE_BALANCE}`, {
        method: "PUT",
        headers: Constant.HEADER_TOKEN(token),
        body: formData
    });
    return Constant.ResponseData(response);
}

export const ApiCreateLinkUserDeposit = async (userId, amount, token) => {
    const jsonBody = {
        userId,
        orderType: "Deposit",
        amount,
        returnUrl: `${Constant.HTTP_WED_DOMAIN}/shop/package/payment/return?amountSuccess=${amount}`,
    };
    const response = await fetch(`${Constant.API_USER_DEPOSIT}`, {
        method: "POST",
        headers: Constant.HTTP_HEADER_TOKEN(token),
        body: JSON.stringify(jsonBody)
    });
    return Constant.ResponseData(response);
}
