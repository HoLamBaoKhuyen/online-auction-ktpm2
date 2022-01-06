import db from '../utils/db.js'

export default{
    async findBySelID(id){
        const sql =`select p.*,concat('***** ',u.firstname) AS nameofUser, count(pa.prodID) AS CountBids
        from products p left join users u on p.highestBidID = u.uID
        left join participate pa on p.prodID = pa.prodID
        where p.selID=`+id+`
        group by p.prodID;`

        const ret = await db.raw(sql);
        return ret[0];
    },
}