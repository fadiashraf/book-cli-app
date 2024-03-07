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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const { prompt } = require('enquirer');
const book_service_1 = require("../src/service/book.service");
const repo_1 = require("../src/repository/repo");
const Book_1 = __importDefault(require("../src/models/Book"));
const database_1 = require("../src/database/database");
const bookFileDB = new database_1.FileDatabase(Book_1.default);
const bookRepo = new repo_1.Repository(bookFileDB);
const bookService = new book_service_1.BookService(bookRepo);
class Client {
    constructor() {
        this.isInHome = false;
    }
    showBookDetailsPrompt() {
        return prompt({
            type: 'input',
            name: 'bookId',
            message: '\n\nTo view details, enter the book ID. To return, press <Enter>. \n Book ID:',
        });
    }
    showSearchPrompt() {
        return prompt({
            type: 'input',
            name: 'searchString',
            message: '\n\n Type in one or more keywords to search for \n Search',
        });
    }
    showChooseEditBookPrompt() {
        return prompt({
            type: 'input',
            name: 'bookId',
            message: '\n\nEnter the book ID of the book you want to edit; to return press <Enter>. \n Book ID:',
        });
    }
    showAddBookPrompt() {
        return prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Title: ',
            },
            {
                type: 'input',
                name: 'author',
                message: 'Author: ',
            },
            {
                type: 'input',
                name: 'description',
                message: 'Description: ',
            },
        ]);
    }
    showAllBooks() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("\n==== View Books ==== \n");
            bookService.getAll().map(({ id, title }) => {
                console.log(`[${id}]  ${title} `);
            });
            let isInViewBook = true;
            while (isInViewBook) {
                const response = yield this.showBookDetailsPrompt();
                if (response === null || response === void 0 ? void 0 : response.bookId) {
                    this.showBookDetails(response === null || response === void 0 ? void 0 : response.bookId);
                }
                else {
                    isInViewBook = false;
                    break;
                }
                ;
            }
            this.isInHome = true;
        });
    }
    showBookDetails(id, filteredBooks) {
        return __awaiter(this, void 0, void 0, function* () {
            const books = bookService.getAll();
            const bookDetails = books.find(book => book.id == id);
            if (!bookDetails) {
                console.log("invalid id , please enter a valid one");
                this.showAllBooks();
            }
            for (const key in bookDetails) {
                console.log(` ${key} : ${bookDetails[key]}`);
            }
        });
    }
    showAddBook() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("\n ==== Add a Book ==== \n Please enter the following information: ");
            const response = yield this.showAddBookPrompt();
            const bookDetails = {
                title: response.title,
                author: response.author,
                description: response.description,
            };
            const { id } = bookService.createOne(bookDetails);
            console.log(`\n Book [${id}] Saved \n`);
            this.isInHome = true;
        });
    }
    showEditBook() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("\n==== Edit a Book ==== \n");
            bookService.getAll().map(({ id, title }) => {
                console.log(`[${id}]  ${title} `);
            });
            let isInEdit = true;
            while (isInEdit) {
                const response = yield this.showChooseEditBookPrompt();
                if ((response === null || response === void 0 ? void 0 : response.bookId) && (response === null || response === void 0 ? void 0 : response.bookId.length)) {
                    const bookToEdit = bookService.getOneById(response === null || response === void 0 ? void 0 : response.bookId);
                    if (!bookToEdit)
                        return console.log('Book not found.');
                    console.log("Input the following information. To leave a field unchanged, hit <Enter>");
                    const updatedInfo = (yield prompt([
                        { type: 'input', name: 'title', message: `Title [${bookToEdit.title}]:` },
                        { type: 'input', name: 'author', message: `Author [${bookToEdit.author}]:` },
                        { type: 'input', name: 'description', message: `Description [${bookToEdit.description}]:` },
                    ]));
                    bookService.updateOneById(response === null || response === void 0 ? void 0 : response.bookId, updatedInfo);
                    console.log('\n Book saved. \n');
                }
                else {
                    isInEdit = false;
                    break;
                }
            }
            this.isInHome = true;
        });
    }
    showSearchForBook() {
        return __awaiter(this, void 0, void 0, function* () {
            let isInSearch = true;
            console.log("\n ==== Search ==== \n");
            const { searchString } = yield this.showSearchPrompt();
            const regex = new RegExp(searchString, 'i'); // 'i' for case-insensitive search
            const matchedBooks = bookService.getAll().filter(({ title }) => title.match(regex));
            if (!(matchedBooks === null || matchedBooks === void 0 ? void 0 : matchedBooks.length)) {
                console.log("no books found matched your search");
            }
            console.log("The following books matched your query.");
            matchedBooks.map(({ id, title }) => {
                console.log(`[${id}]  ${title} `);
            });
            while (isInSearch) {
                const { bookId } = yield this.showBookDetailsPrompt();
                if (!bookId) {
                    isInSearch = false;
                    break;
                }
                yield this.showBookDetails(bookId);
            }
            this.isInHome = true;
        });
    }
}
exports.Client = Client;
