import db from "../utils/db.js"

export default {


    getInforByID(id) {
        return db('users').where('UID', id);
    },

    async checkUserType(id) {
        const role = await select('userType').from('users').where('UID', id);
        if (role.length == 0)
            return null;
        return role[0];
    },

    getFavoriteProd(id) {
        const sql = `select p.*,d.*,pt.*, concat(u.lastname,' ',u.firstname) AS nameofUser, concat(u2.lastname,' ',u2.firstname) AS nameofSeller
                    from products p
                    left join proddes d on p.prodID = d.prodID
                    left join producttype pt on p.prodType = pt.typeID
                    left join users u on p.highestBID = u.UID
                    left join users u2 on p.sellID = u2.UID
                    left join favoriteproducts fp on fp.prodID=p.prodID and fp.bidID =`+ id;
        const raw = await db.raw(sql);
        return raw[0];
    },

    getParticipatingProd(id) {
        const sql = `select p.*,d.*,pt.*, concat(u.lastname,' ',u.firstname) AS nameofUser, concat(u2.lastname,' ',u2.firstname) AS nameofSeller
                    from products p
                    left join proddes d on p.prodID = d.prodID
                    left join producttype pt on p.prodType = pt.typeID
                    left join users u on p.highestBID = u.UID
                    left join users u2 on p.sellID = u2.UID
                    left join participate ptp on ptp.prodID=p.prodID and ptp.bidID =`+ id;
        const raw = await db.raw(sql);
        return raw[0];
    },

    changeName(id,name){
        const nameString=name.split(' ');
        var firstname = name.split(' ').slice(0, -1).join(' ');
        var lastname = name.split(' ').slice(-1).join(' ');
        return db('users')
        .where('UID', id)
        .update({
            firstName: firstname,
            lastName: lastname
        });
    },

    changePass(id,pass){
        const newPass = pass;
        return db('users')
        .where('UID', id)
        .update({
            password: pass
        });
    },

    changeDOB(id,dob){
        return db('users')
        .where('UID', id)
        .update({
            DOB: dob
        });
    },

    changeEmail(id,email){
        return db('users')
        .where('UID', id)
        .update({
            email: email
        });
    },

    async getComment(id){
        const sql = `select r.*, concat(u.lastname,' ',u.firstname) AS nameofUser
                    from rating r
                    left join users u on r.bidID = u.UID 
                    where r.sellID=`+ id;
        const raw = await db.raw(sql);
        return raw[0];
    },

    getLikeOfBidder(id){
        const sql = `select count(liked) as like
                    from rating r
                    where r.liked = TRUE and r.rateToBidder = TRUE`;
        const raw = await db.raw(sql);
        return raw[0];
    },

    getDislikeOfBidder(id){
        const sql = `select count(liked) as dislike
                    from rating r
                    where r.liked = FALSE and r.rateToBidder = TRUE`;
        const raw = await db.raw(sql);
        return raw[0];
    }
}