import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LearnService } from './learn.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateLessonsDto } from './dto/create-lessons.dto';
import { LessonToSend } from './interface/lessonToSend.interface';
import { UserToSend } from '../auth/interface/user.interface';
import { AddWordDto } from './dto/add-word.dto';
import { Level } from '../auth/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Learn')
@Controller('learn')
export class LearnController {
  constructor(private readonly learnService: LearnService) {}

  @Post('create-lessons')
  createLessons(
    @Body() lessons: CreateLessonsDto[],
  ): Promise<{ success: boolean; message: string }> {
    return this.learnService.createLessons(lessons);
  }

  @Delete('delete-lessons')
  deleteLessons(): Promise<{ success: boolean; message: string }> {
    return this.learnService.deleteLessons();
  }

  @Get('all-lessons')
  getAllLessons(): Promise<any[]> {
    return this.learnService.getAllLessons();
  }

  @Get('words-by-title/:lessonTitle')
  getWordsByTitle(@Param('lessonTitle') lessonTitle: string): Promise<any[]> {
    return this.learnService.getWordsByTitle(lessonTitle);
  }

  @Get('find-word/:word')
  findWordByName(@Param('word') word: string): Promise<any> {
    return this.learnService.findWordByName(word);
  }

  @Patch('lesson/:id')
  updateLesson(
    @Param('id') id: string,
    @Body() data: any,
  ): Promise<{ success: boolean; message: string }> {
    return this.learnService.updateLesson(id, data);
  }

  @Delete('lesson/:id')
  deleteOneLesson(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.learnService.deleteOneLesson(id);
  }

  @Patch('word/:id')
  updateWord(
    @Param('id') id: string,
    @Body() data: any,
  ): Promise<{ success: boolean; message: string }> {
    return this.learnService.updateWord(id, data);
  }

  @Delete('word/:id')
  deleteOneWord(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.learnService.deleteOneWord(id);
  }

  @UseGuards(AuthGuard())
  @Get('get-lessons')
  getLessons(@Req() req): Promise<LessonToSend[]> {
    return this.learnService.getLessons(req.user._id);
  }

  @UseGuards(AuthGuard())
  @Post('start')
  startLearning(
    @Req() req,
  ): Promise<{ user: UserToSend } | { message: string }> {
    return this.learnService.startLearning(req.user._id, req.user.level);
  }

  @Post('add-words')
  async createWords(
    @Body() words: AddWordDto | AddWordDto[],
  ): Promise<{ success: boolean; message: string }> {
    if (Array.isArray(words)) {
      return this.learnService.addWords(words);
    } else {
      return this.learnService.addWord(words);
    }
  }

  @Delete('delete-words')
  deleteWords(): Promise<{ success: boolean; message: string }> {
    return this.learnService.deleteWords();
  }

  @UseGuards(AuthGuard())
  @Post('start-lesson')
  async startLesson(
    @Req() req,
    @Body() body: { lessonId: string },
  ): Promise<LessonToSend[] | { success: boolean; message: string }> {
    return this.learnService.startLesson(
      req.user._id,
      body.lessonId,
      req.user.level,
    );
  }

  @UseGuards(AuthGuard())
  @Get('get-words/:lessonTitle')
  async getWordsByLessonTitle(
    @Param('lessonTitle') lessonTitle: string,
    @Req() req,
  ): Promise<any> {
    return this.learnService.getWordsByLessonTitle(lessonTitle, req.user._id);
  }

  @UseGuards(AuthGuard())
  @Post('word-learned')
  async markWordAsLearned(
    @Req() req,
    @Body()
    body: {
      wordId: string;
      lessonTitle: string;
      isLearned: boolean;
      level: Level;
    },
  ): Promise<{ success: boolean; message: string }> {
    return this.learnService.markWordAsLearned(
      req.user._id,
      body.wordId,
      body.lessonTitle,
      body.isLearned,
      body.level,
    );
  }

  @UseGuards(AuthGuard())
  @Post('lesson-completed/:lessonId/:lessonNumber')
  async markLessonAsCompleted(
    @Param('lessonId') lessonId: string,
    @Param('lessonNumber') lessonNumber: string,
    @Req() req,
  ): Promise<LessonToSend[] | { success: boolean; message: string }> {
    return this.learnService.markLessonAsCompleted(
      req.user._id,
      lessonId,
      lessonNumber,
    );
  }
}
