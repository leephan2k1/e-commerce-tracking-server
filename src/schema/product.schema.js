export const productBodySchema = {
    $id: 'productBodySchema',
    type: 'object',
    required: ['name', 'link', 'img', 'price', 'market'],
    properties: {
        name: { type: 'string' },
        link: { type: 'string' },
        market: { type: 'string' },
        img: { type: 'string' },
        price: { type: 'string' },
        totalSales: { type: 'string' },
    },
};
