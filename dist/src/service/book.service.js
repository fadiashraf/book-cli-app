"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
class BookService {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }
    getAll() {
        return this.bookRepository.getAll();
    }
    getOneByIndex(index) {
        return this.bookRepository.getAll()[index];
    }
    getOneById(id) {
        const books = this.bookRepository.getAll();
        const book = books.find(book => book.id == id);
        return book;
    }
    createOne(book) {
        const { title, author, description } = book;
        const newBook = { title, author, description };
        return this.bookRepository.createOne(newBook);
    }
    updateOneById(id, newBookData) {
        return this.bookRepository.updateOneById(id, newBookData);
    }
}
exports.BookService = BookService;
