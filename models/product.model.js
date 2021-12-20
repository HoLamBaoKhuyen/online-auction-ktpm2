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
        const sql = `select t.category, p.*, 
                     from producttype t
                            left join products p on t.typeID = p.prodID
                     group by t.category`;
        const raw = await db.raw(sql);
        return raw[0];
    },


    async countByProdType(typeID) {
        const sql = `select t.category, count(p.prodID) as ProductCount, 
                    from producttype t
                    left join products p on t.typeID = p.prodID
                    group by t.category`;
        const raw = await db.raw(sql);
        const num = raw[0].ProductCount;
        return num;
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

    async findByProdID(prodID){
        const sql = `select p.*,d.*,pt.*, concat(u.lastname,' ',u.firstname) AS nameofUser, concat(u2.lastname,' ',u2.firstname) AS nameofSeller
                    from products p
                    left join proddes d on p.prodID = d.prodID
                    left join producttype pt on p.prodType = pt.typeID
                    left join users u on p.highestBID = u.UID
                    left join users u2 on p.sellID = u2.UID`;
        const raw = await db.raw(sql);
        return raw[0];
    },

    getDescription(prodID){
        return db('proddes').where('prodID',prodID).orderBy('time',asc);
    },

    async getSimilarProduct(prodID){
        const sql = `select p.*,d.*,pt.*, concat(u.lastname,' ',u.firstname) AS nameofUser, concat(u2.lastname,' ',u2.firstname) AS nameofSeller
                    from products p
                    left join proddes d on p.prodID = d.prodID
                    left join producttype pt on p.prodType = pt.typeID
                    left join users u on p.highestBID = u.UID
                    left join users u2 on p.sellID = u2.UID
                    order by random() LIMIT 3`;
        const raw = await db.raw(sql);
        return raw[0];
    },


    async getTop5HighestPrice() {
        const sql = `select p.*,d.*, concat(u.lastname,' ',u.firstname) as nameofUser, count(par.prodID) as CountBids
                    from products p
                    left join proddes d on p.prodID = d.prodID
                    left join users u on p.highestBID = u.UID
                    left join participate par on par.prodID = p.prodID
                    group by par.prodID
                    order by p.curPrice DESC
                    limit 5 offset 0`;
        const raw = await db.raw(sql);
        return raw[0];
    },

    async getTop5HighestBids() {
        const sql = `select p.*,d.*, concat(u.lastname,' ',u.firstname) AS nameofUser, count(par.prodID) as CountBids
                    from products p
                    left join proddes d on p.prodID = d.prodID
                    left join users u on p.highestBID = u.UID
                    left join participate par on par.prodID = p.prodID
                    group by par.prodID
                    order by count(p.prodID) DESC
                    limit 5 offset 0`;
        const raw = await db.raw(sql);
        return raw[0];
    },

    async getTop5End() {
        const sql = `select p.*,d.*, concat(u.lastname,' ',u.firstname) AS nameofUser, count(par.prodID) as CountBids
                    from products p
                    left join proddes d on p.prodID = d.prodID
                    left join users u on p.highestBID = u.UID
                    left join participate par on par.prodID = p.prodID
                    group by par.prodID
                    order by getDate()-p.timeEnd ASC
                    limit 5 offset 0`;
        const raw = await db.raw(sql);
        return raw[0];
    },
}