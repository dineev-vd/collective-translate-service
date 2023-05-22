import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController],
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [OrderService],
  exports: [],
})
export class OrderModule {}
