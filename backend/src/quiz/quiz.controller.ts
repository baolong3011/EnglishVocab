import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { SubmitQuizAnswerDto } from './dto/submit-quiz-answer.dto';
import { QuizQuestionDto } from './dto/quiz-question.dto';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { AuthGuard } from '@nestjs/passport';
import { QuizResult } from './interface/quiz.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('add-questions')
  async createQuizQuestions(
    @Body() quizQuestionData: QuizQuestionDto | QuizQuestionDto[],
  ) {
    if (Array.isArray(quizQuestionData)) {
      return await this.quizService.addQuestions(quizQuestionData);
    } else {
      return await this.quizService.addQuestion(quizQuestionData);
    }
  }

  @Get('get-all')
  async getAllQuiz() {
    return await this.quizService.getAllQuiz();
  }

  @Get(':id/details')
  async getQuizDetails(@Param('id') id: string) {
    return await this.quizService.getQuizDetails(id);
  }

  @Delete('question/:id')
  async deleteQuizQuestion(@Param('id') id: string) {
    return await this.quizService.deleteQuizQuestion(id);
  }

  @Patch('question/:id')
  async updateQuizQuestion(@Param('id') id: string, @Body() data: any) {
    return await this.quizService.updateQuizQuestion(id, data);
  }
  @Post('create')
  async createQuiz(@Body() createQuizDto: CreateQuizDto) {
    return await this.quizService.createQuiz(createQuizDto);
  }

  @Delete('delete-all')
  async deleteAllQuiz() {
    return await this.quizService.deleteAllQuiz();
  }

  @Patch(':id')
  async updateQuiz(@Param('id') id: string, @Body() data: any) {
    return await this.quizService.updateQuiz(id, data);
  }

  @Delete(':id')
  async deleteOneQuiz(@Param('id') id: string) {
    return await this.quizService.deleteOneQuiz(id);
  }

  @UseGuards(AuthGuard())
  @Get()
  async getUnattemptedQuiz(
    @Query('level') level: string,
    @Query('lessonTitle') lessonTitle: string,
    @Req() req,
  ) {
    const userId = req.user._id;
    return await this.quizService.getUnattemptedQuiz(
      level,
      lessonTitle,
      userId,
    );
  }

  @UseGuards(AuthGuard())
  @Post('start/:quizId')
  async startQuiz(
    @Param('quizId') quizId: string,
    @Req() req,
  ): Promise<{ success: boolean; message: string }> {
    const userId = req.user._id;
    const level = req.user.level;
    return await this.quizService.startQuiz(quizId, userId, level);
  }

  @UseGuards(AuthGuard())
  @Post('end')
  async endQuiz(
    @Body()
    submitQuizAnswerDto: SubmitQuizAnswerDto,
    @Req() req,
  ): Promise<{ success: boolean; message: string }> {
    const { quizId, userAnswers } = submitQuizAnswerDto;
    return await this.quizService.endQuiz(req.user._id, quizId, userAnswers);
  }

  @UseGuards(AuthGuard())
  @Get('result/:lessonTitle')
  async getQuizResult(
    @Param('lessonTitle') lessonTitle: string,
    @Req() req,
  ): Promise<QuizResult> {
    const userId = req.user._id;
    const level = req.user.level;
    return await this.quizService.getQuizResult(userId, level, lessonTitle);
  }

  @UseGuards(AuthGuard())
  @Get('status/:lessonTitle')
  async getQuizStatus(
    @Param('lessonTitle') lessonTitle: string,
    @Req() req,
  ): Promise<{ message: string; isCompleted: boolean }> {
    const userId = req.user._id;
    const level = req.user.level;
    return await this.quizService.getQuizStatus(userId, level, lessonTitle);
  }
}
