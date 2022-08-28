import { getAxiosClient, SHOPEE_URL } from '../configs/index.js';
import { handlePriceShopee } from '../utils/index.js';

const axiosClient = getAxiosClient(SHOPEE_URL, SHOPEE_URL);

export async function search(keyword, pageParam) {
    const paginate = --pageParam * 60;

    try {
        const { data } = await axiosClient.get(
            `https://shopee.vn/api/v4/search/search_items?by=relevancy&keyword=${encodeURIComponent(
                keyword,
            )}&limit=60&newest=${
                paginate !== 0 ? paginate : ''
            }&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`,
        );

        if (Array.isArray(data?.items)) {
            const products = data?.items.reduce((result, product) => {
                const name = product?.item_basic.name;

                const img = `https://cf.shopee.vn/file/${product?.item_basic.image}_tn`;

                let price;

                if (
                    !isNaN(product?.item_basic.price_min) &&
                    !isNaN(product?.item_basic.price_max)
                ) {
                    const minPrice = handlePriceShopee(
                        product?.item_basic.price_min,
                    );

                    const maxPrice = handlePriceShopee(
                        product?.item_basic.price_max,
                    );

                    price =
                        minPrice === maxPrice
                            ? minPrice
                            : `${minPrice} - ${maxPrice}`;
                }

                const totalSales = product?.item_basic.historical_sold
                    ? `Đã bán ${product?.item_basic.historical_sold}`
                    : null;

                if (name && product?.item_basic.image && totalSales) {
                    result.push({ name, img, price, totalSales });
                }

                return result;
            }, []);

            return products ? products : [];
        }
    } catch (error) {
        console.error('error:: ', error);
        return null;
    }

    // try {
    //     const browser = await puppeteer.launch({ headless: true });
    //     const page = await browser.newPage();
    //     await page.goto(
    //         `${SHOPEE_URL}/search?keyword=${encodeURI(keyword)}${pageNumber}`,
    //         {
    //             waitUntil: 'load',
    //         },
    //     );

    //     await page.setViewport({
    //         width: 1200,
    //         height: 800,
    //     });

    //     await autoScroll(page);

    //     const products = await page.$$eval(
    //         '.shopee-search-item-result__item',
    //         (dom) => {
    //             const productList = dom.map((aTag) => {
    //                 const name = aTag
    //                     .querySelector('.Cve6sh')
    //                     ?.textContent.trim();

    //                 const price = aTag
    //                     .querySelector('.ZEgDH9')
    //                     ?.textContent.trim();

    //                 const img = aTag
    //                     .querySelector('._7DTxhh.vc8g9F')
    //                     ?.getAttribute('src');

    //                 const salesTotal = aTag
    //                     .querySelector('.r6HknA.uEPGHT')
    //                     ?.textContent.trim();

    //                 return { name, price, img, salesTotal };
    //             });

    //             if (productList) return productList;
    //             return [];
    //         },
    //     );

    //     if (products) return products;

    //     return null;
    // } catch (error) {
    //     console.error('error::: ', error);
    //     return null;
    // }
}
