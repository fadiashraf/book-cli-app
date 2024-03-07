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
const enquirer_1 = require("enquirer");
const client_1 = require("./client/client");
const client = new client_1.Client();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let isInHome = true;
        while (isInHome) {
            const { option } = (yield (0, enquirer_1.prompt)({
                type: 'input',
                name: 'option',
                message: 'Book Manager\n1) View all books\n2) Add a book\n3) Edit a book\n4) Search for a book\n5) Save and exit\nChoose [1-5]:',
            }));
            switch (option) {
                case '1':
                    yield client.showAllBooks();
                    isInHome = client.isInHome;
                    break;
                case '2':
                    yield client.showAddBook();
                    isInHome = client.isInHome;
                    break;
                case '3':
                    yield client.showEditBook();
                    break;
                case '4':
                    yield client.showSearchForBook();
                    break;
                case '5':
                    console.log("saved! ... see you later!");
                    process.exit();
                default:
                    console.log('Invalid choice. Please choose a number between 1 and 5.');
            }
        }
    });
}
// Run the application
main().then().catch((err) => {
    console.log(err);
    process.exit();
});
