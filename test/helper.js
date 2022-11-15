module.exports = {
    baseURL: 'http://localhost:5555/api/v1',
    checkPreviewProductSchema: (prod) => {
        if (!prod?.name || typeof prod?.name !== 'string') {
            return false;
        }

        if (!prod?.img || typeof prod?.img !== 'string') {
            return false;
        }

        if (!prod?.price || typeof prod?.price !== 'string') {
            return false;
        }

        if (
            (!prod?.totalSales || typeof prod?.totalSales !== 'string') &&
            typeof prod?.totalSales !== 'number'
        ) {
            return false;
        }

        if (!prod?.link || typeof prod?.link !== 'string') {
            return false;
        }

        return true;
    },
};
