import db from '../utils/db.js'
export default {
    add(entity){
       return db('favoriteproducts').insert(entity);
    }  ,
     async findByUid(uid){
        const list = await db("favoriteproducts").where("bidID", uid);
        if (list.length === 0) return null;
        return list[0];
    },
    async findByUidProID(uid, prodid){
        const list = await db("favoriteproducts").where("bidID", uid).andWhere('prodID', prodid);
        if (list.length === 0) return null;
        return list[0];
    },
    remove(uid, prodid){
        return db('favoriteproducts').where("bidID", uid).andWhere('prodID', prodid).del();
    },
    async findPageAll(limit, offset,uid) {
        
        // const sql =
        //   `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
        //                     from products p
        //                     left join users u on p.highestBidID = u.UID
        //                     left join participate par on par.prodID = p.prodID
        //                     group by p.prodID
        //                     order by p.timePosted desc
        //                     limit ` +
        //   limit +
        //   ` offset ` +
        //   offset;
          const sql =`select p.*,  concat('***** ',u.firstname) AS nameofUser, count(pa.prodID) as CountBids
          from products p right join favoriteproducts f on p.prodID = f.prodID
                  left join users u on p.highestBidID = u.uID
                  left join participate pa on p.prodID = pa.prodID
          where f.bidID= `+uid+`  
          group by p.prodID
          limit `+limit+`
           offset `+offset+``;
        const raw = await db.raw(sql);
        return raw[0];
      },
    
      async countAll(id) {
        const list = await db("favoriteproducts").count({ amount: "prodID" }).where('bidID',id);
        return list[0].amount;
      },
    
    
}