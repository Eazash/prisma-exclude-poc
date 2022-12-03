"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = new client_1.PrismaClient().$extends({
            // query: {
            //   user: {
            //     $allOperations(args){
            //       return
            //     }
            //   }
            // }
            result: {
                user: {
                    password: {
                        needs: {
                            id: true,
                        },
                        compute: () => {
                            return undefined;
                        },
                    },
                },
            },
        });
        const user = yield prisma.user.upsert({
            where: {
                id: 1,
            },
            create: {
                username: "johnny",
                email: "johnny@test.com",
                password: yield (0, bcrypt_1.hash)("somePassword", 10),
            },
            update: {
                password: yield (0, bcrypt_1.hash)("somePassword", 10),
            },
        });
        console.log(user);
    });
}
main();
