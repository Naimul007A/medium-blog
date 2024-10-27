import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { DataBase_Url } from '../../config'
const prisma = new PrismaClient({
    datasourceUrl: DataBase_Url,
}).$extends(withAccelerate())

export default prisma
