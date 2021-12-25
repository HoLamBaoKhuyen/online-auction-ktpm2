import db from "../utils/db.js";

export default {
    findAll() {
        return db('products')
    },

    async findPageAll(limit, offset) {
        const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join users u on p.highestBidID = u.UID
                        left join participate par on par.prodID = p.prodID
                        group by p.prodID
                        limit `+limit +` offset `+offset;
        const raw = await db.raw(sql);
        return raw[0];
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


    async countByTypeID(typeID) {
        const list = await db('products').where('prodType',typeID).count({ amount: 'prodID' });
        return list[0].amount;
    },

    async findPageByTypeID(typeID, limit, offset) {
        const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join users u on p.highestBidID = u.UID
                        left join participate par on par.prodID = p.prodID
                        where p.prodType = `+typeID+`
                        group by p.prodID
                        limit ` + limit + ` offset `+ offset;
        const raw = await db.raw(sql);
        return raw[0];
    },

    getCategoryName(typeID){
        return db('producttype').where('typeID',typeID);
    },


    async findPageByTypeIDSortDate(typeID, limit, offset) {
        const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join users u on p.highestBidID = u.UID
                        left join participate par on par.prodID = p.prodID
                        where p.prodType = `+typeID+`
                        group by p.prodID
                        order by p.timeEnd desc
                        limit ` + limit + ` offset `+ offset;
        const raw = await db.raw(sql);
        return raw[0];
    },

    async findPageByTypeIDSortPrice(typeID, limit, offset) {
        const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join users u on p.highestBidID = u.UID
                        left join participate par on par.prodID = p.prodID
                        where p.prodType = `+typeID+`
                        group by p.prodID
                        order by p.curPrice asc
                        limit ` + limit + ` offset `+ offset;
        const raw = await db.raw(sql);
        return raw[0];
    },


    async findByProdID(prodID){
        const sql = `select p.*,pt.*, concat('***** ',u.firstname) AS nameofUser, concat('***** ',u2.firstname) AS nameofSeller
                    from products p
                    left join producttype pt on p.prodType = pt.typeID
                    left join users u on p.highestBidID = u.UID
                    left join users u2 on p.selID = u2.UID
                    where p.prodID=`+prodID;
        const raw = await db.raw(sql);
        return raw[0];
    },

    getDescription(prodID){
        return db('proddes').where('prodID',prodID).orderBy('modifyTime','asc');
    },

    async getSimilarProduct(prodID){
        const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, concat('***** ',u2.firstname) AS nameofSeller, count(par.prodID) AS CountBids
                    from products p
                    left join participate par on par.prodID = p.prodID
                    left join users u on p.highestBidID = u.UID
                    left join users u2 on p.selID = u2.UID
                    
                    where p.prodID != `+prodID+` and p.prodType = (SELECT p2.prodType
                                                        from products p2 
                                                        where p2.prodID = `+prodID+`) 
                    group by p.prodID
                    order by RAND() limit 3`;
        const raw = await db.raw(sql);
        return raw[0];
    },


    async getTop5HighestPrice() {
        const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from participate par
                        left join products p on par.prodID = p.prodID
                        left join users u on p.highestBidID = u.UID
                        group by par.prodID
                        order by p.curPrice DESC
                        limit 5 offset 0`;
        const raw = await db.raw(sql);
        return raw[0];
    },

    async getTop5HighestBids() {
        const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from participate par
                    left join products p on par.prodID = p.prodID
                    left join users u on p.highestBidID = u.UID
                    group by par.prodID
                    order by count(par.prodID)
                    limit 5 offset 0`;
        
        const raw = await db.raw(sql);
        return raw[0];
    },

    async getTop5End() {
        const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from participate par
                    left join products p on par.prodID = p.prodID
                    left join users u on p.highestBidID = u.UID
                    group by par.prodID
                    order by p.timeEnd ASC
                    limit 5 offset 0`;
        const raw = await db.raw(sql);
        return raw[0];
    },
}