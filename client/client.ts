const { prompt } = require('enquirer');
import { BookService } from '../src/service/book.service';
import { Repository } from '../src/repository/repo';
import Book from '../src/models/Book';
import { FileDatabase, IDatabase } from '../src/database/database';
const bookFileDB = new FileDatabase(Book) as IDatabase<Book>;
const bookRepo = new Repository(bookFileDB);
const bookService = new BookService(bookRepo)

export class Client {
    public isInHome: Boolean;
    constructor() {
        this.isInHome = false
    }

    private showBookDetailsPrompt () {
        return prompt({
            type: 'input',
            name: 'bookId',
            message: '\n\nTo view details, enter the book ID. To return, press <Enter>. \n Book ID:',
        }) as any;
    }

    private showSearchPrompt () {
        return prompt({
            type: 'input',
            name: 'searchString',
            message: '\n\n Type in one or more keywords to search for \n Search',
        }) as any;
    }


    private showChooseEditBookPrompt () {
        return prompt({
            type: 'input',
            name: 'bookId',
            message: '\n\nEnter the book ID of the book you want to edit; to return press <Enter>. \n Book ID:',
        }) as any;
    }

    private showAddBookPrompt () {
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
        ]) as any;
    }


    async showAllBooks () {
        console.log("\n==== View Books ==== \n");
        bookService.getAll().map(({ id, title }) => {
            console.log(`[${id}]  ${title} `)
        })
        let isInViewBook = true;
        while (isInViewBook) {
            const response = await this.showBookDetailsPrompt()
            if (response?.bookId) {
                this.showBookDetails(response?.bookId)
            } else {
                isInViewBook = false
                break
            };
        }

        this.isInHome = true
    }

    async showBookDetails (id: number, filteredBooks?: Book[]): Promise<any> {
        const books = bookService.getAll()
        const bookDetails = books.find(book => book.id == id)
        if (!bookDetails) {
            console.log("invalid id , please enter a valid one");
            this.showAllBooks()
        }
        for (const key in bookDetails) {
            console.log(` ${key} : ${(bookDetails as any)[key]}`)
        }
    }


    async showAddBook () {
        console.log("\n ==== Add a Book ==== \n Please enter the following information: ")
        const response = await this.showAddBookPrompt();

        const bookDetails = {
            title: response.title,
            author: response.author,
            description: response.description,
        };
        const { id } = bookService.createOne(bookDetails)
        console.log(`\n Book [${id}] Saved \n`)
        this.isInHome = true;

    }

    async showEditBook () {
        console.log("\n==== Edit a Book ==== \n");
        bookService.getAll().map(({ id, title }) => {
            console.log(`[${id}]  ${title} `)
        })
        let isInEdit = true;
        while (isInEdit) {
            const response = await this.showChooseEditBookPrompt()
            if (response?.bookId && response?.bookId.length) {
                const bookToEdit = bookService.getOneById(response?.bookId)
                if (!bookToEdit) return console.log('Book not found.');
                console.log("Input the following information. To leave a field unchanged, hit <Enter>")
                const updatedInfo = (await prompt([
                    { type: 'input', name: 'title', message: `Title [${bookToEdit.title}]:` },
                    { type: 'input', name: 'author', message: `Author [${bookToEdit.author}]:` },
                    { type: 'input', name: 'description', message: `Description [${bookToEdit.description}]:` },
                ])) as Book;
                bookService.updateOneById(response?.bookId, updatedInfo);
                console.log('\n Book saved. \n');

            } else {
                isInEdit = false;
                break
            }
        }
        this.isInHome = true;
    }


    async showSearchForBook () {
        let isInSearch = true;
        console.log("\n ==== Search ==== \n")

        const { searchString } = await this.showSearchPrompt()
        const regex = new RegExp(searchString, 'i'); // 'i' for case-insensitive search

        const matchedBooks = bookService.getAll().filter(({ title }) => title.match(regex))
        if (!matchedBooks?.length) {
            console.log("no books found matched your search")
        }
        console.log("The following books matched your query.")
        matchedBooks.map(({ id, title }) => {
            console.log(`[${id}]  ${title} `)
        })

        while (isInSearch) {
            const { bookId } = await this.showBookDetailsPrompt()
            if (!bookId) {
                isInSearch = false;
                break;
            }
            await this.showBookDetails(bookId)
        }
        this.isInHome = true;
    }


}