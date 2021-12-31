import e from "express";
import db from "../utils/db.js";

export default {
    findAll() {
        return db('products')
    },

    getTimeRemain(list){
        for (let i = 0; i < list.length; i++) {
            const oneDay = 24 * 60 * 60 * 1000;
            const timeleft = Math.abs(new Date(list[i].timeEnd) - new Date());
            const dayleft = Math.floor(timeleft / oneDay);
    
            var minuteleft = Math.floor(((timeleft % oneDay) % 3600000) / 60000) + Math.floor(timeleft / oneDay) * 24 * 60 + Math.floor((timeleft % oneDay) / 3600000) * 60;
            var hourleft = Math.floor(minuteleft / 60);
    
            var currentleft = (new Date() - new Date(list[i].timePosted));
            var postedMinute = Math.round(((currentleft % oneDay) % 3600000) / 60000) + Math.floor(currentleft / oneDay) * 24 * 60 + Math.floor((currentleft % oneDay) / 3600000) * 60;
    
            if(postedMinute < 60)
                list[i].newpost = 1;
    
            if (dayleft >= 1 && dayleft <= 3) {
                console.log("Day: " + dayleft);
                list[i].remain = dayleft + " ngày";
            }
            else if (dayleft == 0) {
                if (hourleft > 0){
                    console.log("Hour: " + hourleft);
                    list[i].remain = hourleft + " giờ";
                }
                else {
                    console.log("minute:" + minuteleft);
                    list[i].remain = minuteleft + " phút";
                }
            }
            else{
                console.log((list[i].timeEnd));
            }
        }
        return list;
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

    countTime(list){
        const oneDay = 24 * 60 * 60 * 1000; 
        for(var i = 0; i < list.length ; i++){
            const timeleft = Math.abs(new Date(list[i].timeEnd) - new Date());
            const dayleft = Math.floor(timeleft/oneDay); 
            
            var minuteleft = Math.floor(((timeleft % oneDay) % 3600000) / 60000) + Math.floor(timeleft / oneDay) * 24 * 60 + Math.floor((timeleft % oneDay) / 3600000) * 60;
            var hourleft = Math.floor(minuteleft / 60);
            
            var currentleft2 = (new Date() - new Date(list[i].timePosted));
            var new_minute = Math.round(((currentleft2 % oneDay) % 3600000) / 60000) + Math.floor(currentleft2 / oneDay) * 24 * 60 + Math.floor((currentleft2 % oneDay) / 3600000) * 60;
            if (dayleft >= 1 && dayleft <= 3) {
                    console.log("Day "+dayleft);
            }
            else if (dayleft == 0) {
                    if (hourleft > 0)
                            console.log("Hour "+hourleft);
                    else {
                            console.log("minute" +minuteleft);
                    }
            }
            else
                    console.log(timeleft);
            
            if(new_minute < 60 )
                    console.log(new_minute);
        }
    },


    
    //----------------------------------------------------------------------

    async findPageByCatID(catID, limit, offset) {
        const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from products p
                    left join users u on p.highestBidID = u.UID
                    left join participate par on par.prodID = p.prodID
                    left join producttype pt on p.prodtype = pt.typeID 
                    where pt.category = `+catID+`
                    group by p.prodID
                    limit ` + limit + ` offset `+ offset;
        const raw = await db.raw(sql);
        return raw[0];
    },

    async countByCatID(catID){
        const sql =`select count(p.prodID) as amount
                    from products p
                    left join producttype pt on p.prodType = pt.category
                    where pt.category = `+catID;
        const raw = await db.raw(sql);
        return raw[0][0].amount;
    },

    async findPageByCatIDSortDate(catID, limit, offset) {
        const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from products p
                    left join users u on p.highestBidID = u.UID
                    left join participate par on par.prodID = p.prodID
                    left join producttype pt on p.prodtype = pt.typeID 
                    where pt.category = `+catID+`
                    group by p.prodID
                    order by p.timeEnd desc
                    limit ` + limit + ` offset `+ offset;
        const raw = await db.raw(sql);
        return raw[0];
    },

    async findPageByCatIDSortPrice(catID, limit, offset) {
        const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from products p
                    left join users u on p.highestBidID = u.UID
                    left join participate par on par.prodID = p.prodID
                    left join producttype pt on p.prodtype = pt.typeID 
                    where pt.category = `+catID+`
                    group by p.prodID
                    order by p.curPrice asc
                    limit ` + limit + ` offset `+ offset;
        const raw = await db.raw(sql);
        return raw[0];
    },


    //----------------------------------------------------------------------



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


    getCategoryName(catID){
        return db('categories').where('catID',catID);
    },

    getProductName(typeID){
        return db('producttype').where('typeID',typeID);
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

    async getHistoryBid(prodID){
        const sql = `select pt.*, concat('***** ',u.firstname) as userName
                    from participate pt
                    left join users u on u.uID = pt.bidID
                    where pt.prodID = `+prodID+
                    ` order by ptime asc`;
        const raw = await db.raw(sql);
        return raw[0];
    },



//----------------------------------------------------------------------


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



    async searchProd(text,category_search,limit,offset){
        let sql="";
        if(category_search == "0"){
            sql =`select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join participate par on par.prodID = p.prodID
                        left join users u on p.highestBidID = u.UID
                        left join proddes pd on pd.prodID = p.prodID
                        where
                            match(p.prodName) AGAINST('`+text+`')
                        group by p.prodID
                        limit `+limit+` offset `+offset;
        }
        else{
            sql =`select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join participate par on par.prodID = p.prodID
                        left join users u on p.highestBidID = u.UID
                        left join proddes pd on pd.prodID = p.prodID
                        where
                            match(p.prodName) AGAINST('`+text+`') AND p.prodtype=`+category_search+` 
                        group by p.prodID
                        limit `+limit+` offset `+offset;
        }              
        const raw = await db.raw(sql);
        return raw[0];
    },

    async countsearchProd(text,category_search){
        let sql="";
        if(category_search=="0"){
            sql = `select count(p.prodID) as amount
                            from products p
                            left join proddes pd on pd.prodID = p.prodID
                            where
                                match(p.prodName) AGAINST('`+text+`')`
        }
        else{
            sql = `select count(p.prodID) as amount
                        from products p
                        left join proddes pd on pd.prodID = p.prodID
                        where
                            match(p.prodName) AGAINST('`+text+`') and prodtype=`+category_search;
        }
        const raw = await db.raw(sql);
        return raw[0][0].amount;
    },

    async searchProdSortPrice(text,category_search,limit,offset){
        let sql="";
        if(category_search == "0"){
            sql =`select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join participate par on par.prodID = p.prodID
                        left join users u on p.highestBidID = u.UID
                        left join proddes pd on pd.prodID = p.prodID
                        where
                            match(p.prodName) AGAINST('`+text+`')
                        group by p.prodID
                        order by p.curPrice asc
                        limit `+limit+` offset `+offset;
        }
        else{
            sql =`select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join participate par on par.prodID = p.prodID
                        left join users u on p.highestBidID = u.UID
                        left join proddes pd on pd.prodID = p.prodID
                        where
                            match(p.prodName) AGAINST('`+text+`') AND p.prodtype=`+category_search+` 
                        group by p.prodID
                        order by p.curPrice asc
                        limit `+limit+` offset `+offset;
        }              
        const raw = await db.raw(sql);
        return raw[0];
    },

    async searchProdSortDate(text,category_search,limit,offset){
        let sql="";
        if(category_search == "0"){
            sql =`select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join participate par on par.prodID = p.prodID
                        left join users u on p.highestBidID = u.UID
                        left join proddes pd on pd.prodID = p.prodID
                        where
                            match(p.prodName) AGAINST('`+text+`')
                        group by p.prodID
                        order by p.timeEnd desc
                        limit `+limit+` offset `+offset;
        }
        else{
            sql =`select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join participate par on par.prodID = p.prodID
                        left join users u on p.highestBidID = u.UID
                        left join proddes pd on pd.prodID = p.prodID
                        where
                            match(p.prodName) AGAINST('`+text+`') AND p.prodtype=`+category_search+` 
                        group by p.prodID
                        order by p.timeEnd desc
                        limit `+limit+` offset `+offset;
        }              
        const raw = await db.raw(sql);
        return raw[0];
    },

    
}