import { db } from "./db";
import { urls } from "./db/schema";


export async function getMyUrls() {
    //const user = auth();
    //if (!user.userId) throw new Error("Unauthorized");

    const urls = await db.query.urls.findMany();

    return urls;
}

//export async function addUrl() {
//    await db.insert(urls).values({
//        name: file.name,
//        originalUrl: file.url,
//
//      });
//}