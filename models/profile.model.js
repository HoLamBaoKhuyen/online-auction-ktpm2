import db from "../utils/db.js"

export default {



    getInforByID(id) {
        return db('users').where('uID', id);
    },

    async getIDseller(prodID){
        const list = await db.select('selID').from('products').where('prodID',prodID);
        return list[0].selID;
    },

    async checkUserType(id) {
        const role = await db.select('userType').from('users').where('UID', id);
        // console.log(role);
        if (role.length == 0)
            return null;
        return role[0].userType;
    },

    async getFavoriteProd(id) {
        const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join users u on p.highestBidID = u.UID
                        left join participate par on par.prodID = p.prodID
                        left join favoriteproducts fp on fp.prodID = p.prodID 
                        where fp.bidID= `+id+`
                        group by p.prodID`;
                        
        const raw = await db.raw(sql);
        return raw[0];
    },

    async getParticipatingProd(id) {
        const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, par.*
                    from products p
                    left join users u on p.highestBidID = u.UID
                    left join participate par on par.prodID = p.prodID
                    where par.bidID = `+id+
                    ` group by p.prodID`;
        const raw = await db.raw(sql);
        return raw[0];
    },

    async countBids(prodID){
        const sql = `select count(par.prodID) AS CountBids
                        from products p
                        left join participate par on par.prodID = p.prodID
                        where par.prodID= `+prodID+`
                        group by p.prodID`;
                        
        const raw = await db.raw(sql);
        return raw[0][0].CountBids;
    },

    async getWinProd(id) {
        const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from products p
                    left join users u on p.highestBidID = u.UID
                    left join participate par on par.prodID = p.prodID
                    where p.highestBidID= `+id+` and p.timeEnd < curdate()
                    group by p.prodID;`
        const raw = await db.raw(sql);
        return raw[0];
    },

    // changeName(id,name){
    //     const nameString=name.split(' ');
    //     var firstname = name.split(' ').slice(0, -1).join(' ');
    //     var lastname = name.split(' ').slice(-1).join(' ');
    //     return db('users')
    //     .where('UID', id)
    //     .update({
    //         firstName: firstname,
    //         lastName: lastname
    //     });
    // },

    // changePass(id,pass){
    //     const newPass = pass;
    //     return db('users')
    //     .where('UID', id)
    //     .update({
    //         password: pass
    //     });
    // },

    // changeDOB(id,dob){
    //     return db('users')
    //     .where('UID', id)
    //     .update({
    //         DOB: dob
    //     });
    // },

    // changeEmail(id,email){
    //     return db('users')
    //     .where('UID', id)
    //     .update({
    //         email: email
    //     });
    // },

    async getComment(id){
        const sql = `select r.*, concat(u.lastname,' ',u.firstname) AS nameofSeller
                    from rating r
                    left join users u on r.selID = u.UID 
                    where r.rateToBidder = true and r.bidID = `+ id;
        const raw = await db.raw(sql);
        
        if(raw.length===0)
            return null;
        return raw[0];
    },

    async getCommentToSeller(id){
        const sql = `select r.*, concat(u.lastname,' ',u.firstname) AS nameofSeller
                    from rating r
                    left join users u on r.bidID = u.UID 
                    where r.rateToBidder = false and r.selID = `+ id;
        const raw = await db.raw(sql);
        
        if(raw.length===0)
            return null;
        return raw[0];
    },

    async getLikeOfBidder(id){
        const sql = `select count(liked) as likerate
                    from rating r
                    where r.liked = TRUE and r.rateToBidder = TRUE and r.bidID=`+id;
        const raw = await db.raw(sql);
        return raw[0][0].likerate;
    },

    async getDislikeOfBidder(id){
        const sql = `select count(liked) as dislikerate
                    from rating r
                    where r.liked = FALSE and r.rateToBidder = TRUE and r.bidID=`+id;
        const raw = await db.raw(sql);
        return raw[0][0].dislikerate;
    },


    async getLikeOfSeller(id){
        const sql = `select count(liked) as likerate
                    from rating r
                    where r.liked = TRUE and r.rateToBidder = FALSE and r.selID=`+id;
        const raw = await db.raw(sql);
        return raw[0][0].likerate;
    },

    async getDislikeOfSeller(id){
        const sql = `select count(liked) as dislikerate
                    from rating r
                    where r.liked = FALSE and r.rateToBidder = FALSE and r.selID=`+id;
        const raw = await db.raw(sql);
        return raw[0][0].dislikerate;
    },

    async checkExistRating(uid,prodID){
        const list = await db('rating').where('bidID',uid).andWhere('prodID',prodID);
        if (list.length === 0)
            return null;
        return list[0];

    },

    async bidderAddGoodRate(uid, idseller , prodID, comment){
        const sql=`insert into rating values (`+uid+`,`+idseller+`,`+prodID +`, true, false,'`+comment+`')`;
        const raw = await db.raw(sql);
    },

    async bidderAddBadRate(uid, idseller , prodID, comment){
        const sql=`insert into rating values (`+uid+`,`+idseller+`,`+prodID +`, false, false,'`+comment+`')`;
        const raw = await db.raw(sql);
    },
    async sellerAddGoodRate(uid, idseller , prodID, comment){
        const sql=`insert into rating values (`+uid+`,`+idseller+`,`+prodID +`, true, true,'`+comment+`')`;
        const raw = await db.raw(sql);
    },

    async sellerAddBadRate(uid, idseller , prodID, comment){
        const sql=`insert into rating values (`+uid+`,`+idseller+`,`+prodID +`, false, true,'`+comment+`')`;
        const raw = await db.raw(sql);
    },
    async deleteFavoriteProd(uid, prodID){
        const sql=`delete from favoriteproducts where bidID=${uid} and prodID = ${prodID}`;
        const raw = await db.raw(sql);
    },
    
}