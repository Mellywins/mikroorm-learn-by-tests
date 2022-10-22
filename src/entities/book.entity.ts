import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  IdentifiedReference,
} from '@mikro-orm/core';
import { Author } from './author.entity';

// Create simple Book entity that has relation to author
@Entity()
export class Book {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property()
  title!: string;

  @ManyToOne(() => Author, { wrappedReference: true })
  author!: IdentifiedReference<Author>;
}
