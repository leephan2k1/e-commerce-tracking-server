import puppeteer from 'puppeteer';
import { TIKI_URL } from '../configs/index.js';
import { handlePriceNumber } from '../utils/index.js';

export async function search(keyword, pageNumber) {
    try {
        const browser = await puppeteer.launch({
            headless: true,
        });

        const page = await browser.newPage();

        await page.goto(
            `https://tiki.vn/api/v2/products?limit=48&aggregations=2&q=${encodeURIComponent(
                keyword,
            )}&page=${pageNumber}`,
        );

        await page.content();

        const jsonData = await page.evaluate(() => {
            return JSON.parse(document.querySelector('body').innerText);
        });

        if (Array.isArray(jsonData?.data)) {
            const products = jsonData?.data.reduce((result, product) => {
                const name = product?.name;

                const img = product?.thumbnail_url;

                const price = handlePriceNumber(product?.price);

                const totalSales = product?.quantity_sold?.text;

                const link = `${TIKI_URL}/${product?.url_path}`;

                if (
                    name &&
                    img &&
                    product?.price &&
                    totalSales &&
                    product?.url_path
                ) {
                    result.push({ name, img, price, totalSales, link });
                }

                return result;
            }, []);

            return products ? products : [];
        }

        await browser.close();

        // const { data } = await axios.get(`${TIKI_URL}/search`, {
        //     params: {
        //         q: keyword,
        //         page: page ? page : undefined,
        //     },
        // });

        // const document = parse(data);

        // const productsContainer = document.querySelectorAll('.product-item');

        // const products = productsContainer.map((e) => {
        //     const name = e.querySelector('.info .name h3')?.textContent.trim();

        //     const img = e
        //         .querySelector('.webpimg-container img')
        //         ?.getAttribute('src');

        //     const price = e
        //         .querySelector('.price-discount > div')
        //         ?.textContent.trim();

        //     const salesTotal = e.querySelector('.fCfYNm')?.textContent.trim();

        //     const link = e?.getAttribute('href');

        //     return {
        //         name,
        //         link,
        //         img,
        //         price,
        //         salesTotal,
        //     };
        // });

        // if (products) return products;

        return null;
    } catch (error) {
        return null;
    }
}
