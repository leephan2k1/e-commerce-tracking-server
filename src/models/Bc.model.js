import { getAxiosClient, handlePriceNumber } from '../utils/index.js';
import { BC_URL, BC_API } from '../configs/index.js';
import { MARKET_MAPPING } from '../constants/index.js';

const axiosClient = getAxiosClient(BC_URL, BC_URL, BC_API);

export async function getProductDetails(market, url) {
    try {
        const { data } = await axiosClient.get(`/search/product`, {
            params: {
                product_url: `${MARKET_MAPPING[market]}/${url}`,
            },
        });

        if (!data?.data && !data?.data?.product_base) throw new Error();

        const {
            name,
            price,
            price_before_discount,
            brand,
            description,
            url_images,
            historical_sold,
            product_base_id,
            // eslint-disable-next-line no-unsafe-optional-chaining
        } = data.data?.product_base;

        return {
            name: name ? name : '',
            price: handlePriceNumber(price),
            priceBeforeDiscount: price_before_discount
                ? handlePriceNumber(price_before_discount)
                : null,
            link: `${MARKET_MAPPING[market]}/${
                market === 'lazada' ? 'products/' : ''
            }${url}`,
            brand: brand?.name ? brand?.name : '',
            description: description ? description : '',
            images: url_images ? url_images : [],
            totalSales: historical_sold,
            market: market,
            product_base_id,
        };
    } catch (error) {
        console.error('BC GET DETAILS ERROR:: ', error);

        return null;
    }
}
