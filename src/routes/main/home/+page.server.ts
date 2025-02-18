import { collection } from "$db/collection";

export const load = async () => {
    const kiteList = await collection('Test').find({}).toArray();
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
