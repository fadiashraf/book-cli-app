import Book from '../models/Book';
import { IRepository } from '../repository/repo';

interface IBookService {
    getOneById (id: number): Book | undefined,
    getOneByIndex (index: number): Book | undefined,
    getAll (): Book[] | [],
    createOne (book: Book): Book
    updateOneById (id: number, book: Book): Book
}

export class BookService implements IBookService {

    constructor(private bookRepository: IRepository<Book>) { }

    getAll (): Book[] | [] {
        return this.bookRepository.getAll();
    }


    getOneByIndex (index: number): Book | undefined {
        return this.bookRepository.getAll()[index];
    }

    getOneById (id: number): Book | undefined {
        const books = this.bookRepository.getAll();
        const book = books.find(book => book.id == id)
        return book;
    }

    createOne (book: Book): Book {
        const { title, author, description } = book;
        const newBook: Book = { title, author, description }
        return this.bookRepository.createOne(newBook);
    }

    updateOneById (id: number, newBookData: Book): Book {
        return this.bookRepository.updateOneById(id, newBookData);
    }


}
