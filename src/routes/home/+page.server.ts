import { kites } from "$db/kites";

export const load = async () => {
    const kiteList = await kites.find({}).toArray();
    console.log(kiteList);

    const serializableKites = kiteList.map((kite) => ({
        _id: kite._id.toString(),
        name: kite.name,
        age: kite.age,
        email: kite.email,
        city: kite.city
      }));
    
    return {
        kites: serializableKites
    };
}
