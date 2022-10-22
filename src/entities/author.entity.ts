// simple author entity

import {
  Collection,
  Entity,
  IdentifiedReference,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Book } from './book.entity';

// Create simple Author entity
@Entity()
export class Author {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property()
  name: string;

  @OneToMany(() => Book, (book) => book.author)
  books: Collection<Book> = new Collection<Book>(this);
}
