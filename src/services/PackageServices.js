import * as Constant from "../constants/Constant"

export const ApiGetPackages = async (search, isDesc, pageIndex, pageSize, token) => {
    const url = `${Constant.API_GET_PACKAGES}?search=${encodeURIComponent(search)}&isDesc=${isDesc}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
    const response = await fetch(url, {
        headers: Constant.HEADER_TOKEN(token)
    });
    return Constant.ResponseData(response);
}

export const ApiGetPackageForShopInUse = async (shopId, token) => {
    const url = `${Constant.API_GET_PACKAGE_FOR_SHOP_IN_USE}${shopId}?isDesc=true&pageIndex=1&pageSize=10`;
    const response = await fetch(url, {
        headers: Constant.HEADER_TOKEN(token)
    });
    return Constant.ResponseData(response);
}

export const ApiGetPackageById = async (packageId, token) => {
    const url = `${Constant.API_GET_PACKAGE_BY_ID}/${packageId}`;
    const response = await fetch(url, {
        headers: Constant.HEADER_TOKEN(token)
    });
    return Constant.ResponseData(response);
}

export const ApiBuyPackage = async (shopId, packageId, token) => {
    const formData = new FormData();
    formData.append("shopId", shopId);
    formData.append("packageId", packageId);
    const response = await fetch(Constant.API_BUY_PACKAGE, {
        method: "POST",
        headers: Constant.HEADER_TOKEN(token),
        body: formData,
    });
    return Constant.ResponseData(response);
}

export const ApiCreatePaymentVNPayURL = async (shopId, packageId, fullName, packageName, packagePrice, token) => {
    const formData = new FormData();
    formData.append("shopId", shopId);
    formData.append("packageId", packageId);
    const response = await fetch(Constant.API_VNPAY_BUY_PACKAGE, {
        method: "POST",
        headers: Constant.HTTP_HEADER_TOKEN(token),
        body: JSON.stringify({
            shopId,
            packageId,
            fullName,
            orderType: "Package",
            description: packageName,
            amount: packagePrice,
            returnUrl: `http://localhost:3000/shop/package/payment/return?packageId=${packageId}`,
        }),
    });
    return Constant.ResponseData(response);
}