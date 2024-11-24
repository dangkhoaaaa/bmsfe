import * as Constant from "../constants/Constant"
export const ApiGetAddressAutoComplete = async (textInput) => {
    const url = `${Constant.URL_MAP_AUTOCOMPLETE}?input=${textInput}&key=${Constant.API_KEY}`;
    const response = await fetch(url);
    return Constant.ResponseData(response, true);
}