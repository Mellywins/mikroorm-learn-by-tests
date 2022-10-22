import { EntityManager, MikroORM, NotFoundError, wrap } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Author } from './entities/author.entity';
import { Book } from './entities/book.entity';

describe('AppController', () => {
  let em: EntityManager;
  let orm: MikroORM;
  let app: TestingModule;
  beforeEach(async () => {
    app = await Test.createTestingModule({
      controllers: [],
      providers: [],
      imports: [
        MikroOrmModule.forRoot({
          entities: [__dirname + '/**/*.entity.ts'],
          dbName: 'local',
          user: 'root',
          type: 'postgresql',
        }),
      ],
    }).compile();

    em = app.get<EntityManager>(EntityManager);
    orm = app.get<MikroORM>(MikroORM);
  });

  beforeAll((done) => {
    done();
  });
  afterAll(async () => {
    await orm.close(true);
    await em.getConnection().close(true);
    await app.close();
  });
  describe('root', () => {
    it('Should return empty array or error of null is passed as argument to id', async () => {
      const forkedEm = em.fork();
      const result = await forkedEm.find(Author, { id: null });
      try {
        await forkedEm.findOneOrFail(Author, { id: null });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundError);
      }
      expect(result).toEqual([]);
    });
    it('Should not have loaded the relation yet, but can acquire properties after loading it', async () => {
      const forkedEm = em.fork();
      const bookRepository = forkedEm.getRepository(Book);
      const book1 = await bookRepository.findOne({ title: 'Book 1' });
      expect(book1.author.isInitialized()).toBe(false);
      expect(book1.author.unwrap().name).toBe(undefined);
      expect((await book1.author.load()).name).toBe('Author 1');
    });

    it('should showcase how to assign an entity to another one that references it', async () => {
      const forkedEm = em.fork();
      const bookRepository = forkedEm.getRepository(Book);
      const authorRepository = forkedEm.getRepository(Author);
      const book1 = await bookRepository.findOne({ id: 3 });
      // Get the old book's author ID for test comparison
      const oldAuthorId = await book1.author.load('id');
      // uopdate the author of the book to a different author
      book1.author = authorRepository.getReference(oldAuthorId == 1 ? 2 : 1, {
        wrapped: true,
      });
      // flush the changes
      forkedEm.flush();
      // reload the book1 author. It shouldn't be necessary to reload due to the identity map,
      // but for the sake of the test we'll requerry the database
      const newAuthorId = await book1.author.load('id');
      expect(oldAuthorId).not.toBe(newAuthorId);
    });
    it('should showcase how to interact with collections', async () => {
      const forkedEm = em.fork();
      const authorRepository = forkedEm.getRepository(Author);
      const author1 = await authorRepository.findOne({ id: 1 });
      // Make sure the collection is  not loaded yet
      expect(author1.books.isInitialized()).toBe(false);
      // If it's not loaded yet, then serializing it to array should return an empty one.
      expect(author1.books.toArray()).toEqual([]);
      // Attempt to load the collection from the database:
      console.log(await author1.books.loadItems());
      // Now the collection is loaded, so we can access it's items:
      expect(author1.books.toArray().length).not.toEqual(0);
    });
    it('should showcase how to add items to collections or remove from them', async () => {
      const forkedEm = em.fork();
      const authorRepository = forkedEm.getRepository(Author);
      const author1 = await authorRepository.findOne({ id: 1 });
      // Create new book object
      const newBook = new Book();

      // add the new book to the IdenttiyMap and fill it with data
      wrap(newBook).assign({
        title: `Book ${(await author1.books.loadCount()) + 1}`,
      });
      // Load the  books of the author
      await author1.books.init();
      // Add the new book to the collection
      author1.books.add(newBook);
      // flush to the database
      await forkedEm.flush();
      expect(
        await forkedEm.findOneOrFail(Book, { title: newBook.title }),
      ).toBeDefined();
      // to remove item, you can use collection.remove() instead of add. They work similarly
    });
    it('should showcase a working example of transactions', async () => {
      const forkedEm = em.fork();
      // An example of a transaction that would fail
      const willError = async () =>
        forkedEm.transactional((em) => {
          em.nativeInsert(Author, { name: 'Errored Author' });
          return Promise.reject(new Error('Explicit transaction failure'));
        });

      try {
        await willError();
      } catch (e: any) {
        expect(e.message).toBe('Explicit transaction failure');
        // must not find the author that was supposed to be created
        expect(await forkedEm.findOne(Author, { name: 'Errored Author' })).toBe(
          null,
        );
      }
    });
  });
});
