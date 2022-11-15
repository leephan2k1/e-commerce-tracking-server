const supertest = require('supertest');
const { baseURL } = require('./helper.js');
const { checkPreviewProductSchema } = require('./helper.js');

describe('GET /products/search', () => {
    test('(lazada search) should return 200', async () => {
        const response = await supertest(baseURL).get(
            '/products/search?keyword=Logitech',
        );

        expect(Array.isArray(response.body.products)).toBe(true);
        if (Array.isArray(response.body.products)) {
            response.body.products.forEach((prod) => {
                expect(checkPreviewProductSchema(prod)).toBe(true);
            });
        }

        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(undefined);
    }, 30000);

    test('(tiki search) should return 200', async () => {
        const response = await supertest(baseURL).get(
            '/products/search?keyword=Logitech&market=tiki',
        );

        expect(Array.isArray(response.body.products)).toBe(true);
        if (Array.isArray(response.body.products)) {
            response.body.products.forEach((prod) => {
                expect(checkPreviewProductSchema(prod)).toBe(true);
            });
        }

        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(undefined);
    }, 30000);

    test('(shopee search) should return 200', async () => {
        const response = await supertest(baseURL).get(
            '/products/search?keyword=Logitech&market=tiki',
        );
        if (Array.isArray(response.body.products)) {
            response.body.products.forEach((prod) => {
                expect(checkPreviewProductSchema(prod)).toBe(true);
            });
        }

        expect(Array.isArray(response.body.products)).toBe(true);
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(undefined);
    }, 30000);

    test('(tiki,shopee,lazada search) should return 200', async () => {
        const response = await supertest(baseURL).get(
            '/products/search?keyword=Logitech&market=all',
        );

        expect(
            typeof response.body.products === 'object' &&
                !Array.isArray(response.body.products) &&
                response.body.products !== null,
        ).toBe(true);

        for (const key of Object.keys(response.body.products)) {
            const value = response.body.products[key];

            expect(Array.isArray(value)).toBe(true);

            if (Array.isArray(value)) {
                value.forEach((prod) => {
                    expect(checkPreviewProductSchema(prod)).toBe(true);
                });
            }
        }

        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(undefined);
    }, 50000);
});

describe('GET /products/votes', () => {
    beforeAll(async () => {
        // set up the voting
        await supertest(baseURL)
            .post('/users/633cd9ff626bd08f8675ae2c/votes?voteType=up')
            .send({
                name: 'Kính đeo Y Tế Face Shield ,Chắn Giọt Bắn, Chống Văng Dầu, Kính Siêu Nhẹ',
                link: 'https://tiki.vn/kinh-deo-y-te-face-shield-chan-giot-ban-chong-vang-dau-ki-nh-sieu-nhe-p108465011.html',
                market: 'tiki',
                img: 'https://salt.tikicdn.com/cache/w300/ts/product/d2/28/d2/0fede47fbfc64d65b7f2c91b4b37a0c7.jpg',
                price: '2.000 đ',
                totalSales: 126,
            });
    });

    afterAll(async () => {
        await supertest(baseURL)
            .delete('/users/633cd9ff626bd08f8675ae2c/votes?voteType=up')
            .send({
                name: 'Kính đeo Y Tế Face Shield ,Chắn Giọt Bắn, Chống Văng Dầu, Kính Siêu Nhẹ',
                link: 'https://tiki.vn/kinh-deo-y-te-face-shield-chan-giot-ban-chong-vang-dau-ki-nh-sieu-nhe-p108465011.html',
                market: 'tiki',
                img: 'https://salt.tikicdn.com/cache/w300/ts/product/d2/28/d2/0fede47fbfc64d65b7f2c91b4b37a0c7.jpg',
                price: '2.000 đ',
                totalSales: 126,
            });
    });

    test('(dummy string) should return 404', async () => {
        const response = await supertest(baseURL).get(
            '/products/votes?link=___dummyString___',
        );

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('product not found');
    });

    test('(existed string) should return 200', async () => {
        const response = await supertest(baseURL).get(
            '/products/votes?link=https://tiki.vn/kinh-deo-y-te-face-shield-chan-giot-ban-chong-vang-dau-ki-nh-sieu-nhe-p108465011.html',
        );

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.upVotes)).toBe(true);
        expect(Array.isArray(response.body.upVotes)).toBe(true);
    });
});

describe('GET /products/recently-vote', () => {
    test('(get recently voted products) should return 200', async () => {
        const response = await supertest(baseURL).get(
            '/products/recently-vote',
        );

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.products)).toBe(true);

        if (Array.isArray(response.body.products)) {
            response.body.products.forEach((prod) => {
                expect(checkPreviewProductSchema(prod)).toBe(true);
            });
        }
    });
});
