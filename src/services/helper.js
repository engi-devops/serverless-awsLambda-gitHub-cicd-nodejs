exports.removenull = (data) => {
    return JSON.parse(
        JSON.stringify(data, function (key, value) {
            return value === null ? '' : value;
        }),
    );
};