import { prompt } from 'enquirer'
import { Client } from './client/client';
const client = new Client()

async function main () {
  let isInHome = true;
  while (isInHome) {
    const { option } = (await prompt({
      type: 'input',
      name: 'option',
      message: 'Book Manager\n1) View all books\n2) Add a book\n3) Edit a book\n4) Search for a book\n5) Save and exit\nChoose [1-5]:',
    })) as any;

    switch (option) {
      case '1':
        await client.showAllBooks()
        isInHome = client.isInHome as boolean;
        break;
      case '2':
        await client.showAddBook();
        isInHome = client.isInHome as boolean;
        break;
      case '3':
        await client.showEditBook();
        break;
      case '4':
        await client.showSearchForBook();
        break;
      case '5':
        console.log("saved! ... see you later!")
        process.exit();
      default:
        console.log('Invalid choice. Please choose a number between 1 and 5.');
    }


  }

}

// Run the application
main().then().catch((err) => {
  console.log(err)
  process.exit();
});
