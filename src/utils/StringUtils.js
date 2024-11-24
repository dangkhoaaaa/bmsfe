export const GetMessageError = (body) => {
    if (body.detail) {
        return body.detail;
    } else {
        if (body.messages && body.messages.length > 0) {
            return body.messages[0].content;
        }
    }
    return "Unknow Error";
}

export const GetImagePackage = (packageName) => {
    const name = packageName.toLowerCase();
    if (name.includes("gold")) {
        return "GOLD_PACKAGE.png";
    } else if (name.includes("premium")) {
        return "PREMIUM_PACKAGE.png";
    } else if (name.includes("basic")) {
        return "BASIC_PACKAGE.jpg";
    }
    return "DEFAULT_PACKAGE.png"; // Fallback if no match is found
};