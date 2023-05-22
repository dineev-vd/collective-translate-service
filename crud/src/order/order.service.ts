import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'entities/order.entity';
import Project from 'entities/project.entity';
import { And, Equal, ILike, Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getAllOrders(withUsers: boolean, query?: string, tags?: string[]) {
    if (withUsers) {
      return this.orderRepository.find({
        relations: { applicants: true, project: { tags: true } },
        where: {
          description: query && ILike(`%${query}%`),
          project: { tags: { id: tags && And(...tags.map((t) => Equal(t))) } },
        },
      });
    }

    return this.orderRepository.find({
      where: {
        description: query && ILike(`%${query}%`),
        project: { tags: { id: tags && And(...tags.map((t) => Equal(t))) } },
      },
      relations: { project: { tags: true } },
    });
  }

  async apply(orderId: string, userId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    return this.orderRepository
      .createQueryBuilder()
      .relation(Order, 'applicants')
      .of(order)
      .add(userId);
  }

  async revoke(orderId: string, userId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    return this.orderRepository
      .createQueryBuilder()
      .relation(Order, 'applicants')
      .of(order)
      .remove(userId);
  }

  async approve(orderId: string, userId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: { project: { editors: true } },
    });

    return this.orderRepository
      .createQueryBuilder()
      .relation(Project, 'editors')
      .of(order.project)
      .add(userId);
  }
}
