const supertest = require('supertest');
const { baseURL } = require('./helper.js');

describe('GET /users/:userId/favorite', () => {
    beforeAll(async () => {
        // set up the favorite
        await supertest(baseURL)
            .post('/users/633cd9ff626bd08f8675ae2c/favorite')
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
            .delete('/users/633cd9ff626bd08f8675ae2c/favorite')
            .send({
                link: 'https://tiki.vn/kinh-deo-y-te-face-shield-chan-giot-ban-chong-vang-dau-ki-nh-sieu-nhe-p108465011.html',
            });
    });

    test(`(get the user's favorite product) should return 200`, async () => {
        const response = await supertest(baseURL).get(
            '/users/633cd9ff626bd08f8675ae2c/favorite',
        );

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.user?.favorite_products)).toBe(true);
        expect(
            typeof response.body.user === 'object' &&
                !Array.isArray(response.body.user) &&
                response.body.user !== null,
        ).toBe(true);
    });
});
