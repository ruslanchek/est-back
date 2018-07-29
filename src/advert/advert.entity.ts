import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, JoinTable } from 'typeorm';
import { Agent } from '../agent/agent.entity';
import { AdvertImage } from '../advert-image/advert-image.entity';

@Entity()
export class Advert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column()
  contractType: string;

  @Column({
    type: 'decimal',
    default: 0,
  })
  constructionDate: number;

  @Column({
    type: 'decimal',
    default: 0,
  })
  price: number;

  @ManyToOne(type => Agent, agent => agent.adverts)
  agent: Agent;

  @OneToMany(type => AdvertImage, image => image.advert)
  @JoinTable()
  images: AdvertImage[];
}
