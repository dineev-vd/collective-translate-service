import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard, OptionalJwtAuthGuard } from 'guards/simple-guards.guard';
import { ExtendedRequest } from 'util/ExtendedRequest';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async getAllOrders(
    @Query('query') query: string,
    @Query('tags', { transform: (v) => (v ? v.split(',') : []) })
    tags: string[],
    @Req()
    { user }: ExtendedRequest,
  ) {
    if (user) {
      return (await this.orderService.getAllOrders(true, query, tags)).map(
        ({ applicants, ...order }) => ({
          ...order,
          applied: !!applicants?.some((u) => u.id === user.id),
        }),
      );
    }

    return this.orderService.getAllOrders(false, query, tags);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/apply')
  async apllyForOrder(
    @Param('id') id: string,
    @Req() { user }: ExtendedRequest,
  ) {
    return this.orderService.apply(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/revoke')
  async revokeApplication(
    @Param('id') id: string,
    @Req() { user }: ExtendedRequest,
  ) {
    return this.orderService.revoke(id, user.id);
  }

  @Post(':id/accept/:userId')
  async approveApplication(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.orderService.approve(id, userId);
  }

  @Post(':id/deny/:userId/')
  async denyApplication(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.orderService.revoke(id, userId);
  }
}
