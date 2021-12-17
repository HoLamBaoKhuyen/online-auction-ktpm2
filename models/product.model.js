import db from "../utils/db.js"

export default {
    findAll() {
        return db('products')
    },

    findPageAll(limit, offset) {
        return db('products').limit(limit).offset(offset);
    },

    async countAll() {
        const list = await db('products').count({ amount: 'prodID' });
        return list[0].amount;
    },

    async findPageByCatID(catID) {
        const sql = `select c.*, count(p.ProID) as ProductCount
                     from categories c
                            left join products p on c.CatID = p.CatID
                     group by c.CatID, c.CatName`;
        const raw = await db.raw(sql);
        return raw[0];
    },


    async countByProdType(typeID) {
        const list = await db('products').where('prodType', typeID).count({ amount: 'prodID' });
        return list[0].amount;
    },

    findPageByProdType(typeID, limit, offset) {
        return db('products').where('prodType', typeID).limit(limit).offset(offset);
    },

    findPageByProdTypeSortDate(typeID, limit, offset) {
        return db('products').where('prodType', typeID).orderBy('timeEnd', desc).limit(limit).offset(offset);
    },

    findPageByProdTypeSortPrice(typeID, limit, offset) {
        return db('products').where('proType', typeID).orderBy('curPrice', asc).limit(limit).offset(offset);
    },
}