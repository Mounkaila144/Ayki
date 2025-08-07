import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('bookmarks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  create(@Body() createBookmarkDto: any) {
    return this.bookmarksService.create(createBookmarkDto);
  }

  @Get()
  findAll() {
    return this.bookmarksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookmarksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookmarkDto: any) {
    return this.bookmarksService.update(id, updateBookmarkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookmarksService.remove(id);
  }
}