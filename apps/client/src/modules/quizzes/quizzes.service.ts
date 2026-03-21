import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { QuizzesRepository } from './repository/quizzes.repository';
import { ScoresService } from '../scores/scores.service';
import { GenerateQuizDto } from './dto/generate-quiz.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { QuizQuestion, QuizOption } from '@shared/database/schema/quizzes.schema';

@Injectable()
export class QuizzesService {
  constructor(
    private readonly repo: QuizzesRepository,
    private readonly scoresService: ScoresService,
  ) {}

  async generate(clientId: string, dto: GenerateQuizDto) {
    // Tugatilmagan quiz bormi tekshirish
    const existingQuiz = await this.repo.findActiveByClientAndCollection(
      clientId,
      dto.collectionId,
    );

    if (existingQuiz) {
      throw new BadRequestException(
        "Bu collection uchun tugatilmagan quiz mavjud. Avval uni yakunlang.",
      );
    }

    const allWords = await this.repo.findWordsByCollectionId(dto.collectionId);

    if (allWords.length < 4) {
      throw new BadRequestException(
        "Collectionda kamida 4 ta so'z bo'lishi kerak quiz generatsiya qilish uchun",
      );
    }

    // Savollar tartibini aralashtirish
    const shuffledWords = this.shuffle([...allWords]);

    const questions: QuizQuestion[] = shuffledWords.map((word) => {
      // Noto'g'ri javoblar uchun boshqa so'zlarni tanlaymiz
      const otherWords = allWords.filter((w) => w.id !== word.id);
      const wrongWords = this.shuffle([...otherWords]).slice(0, 3);

      // To'g'ri javob
      const correctOption: QuizOption = {
        wordId: word.id,
        wordTranslate: word.wordTranslate,
      };

      // Noto'g'ri javoblar
      const wrongOptions: QuizOption[] = wrongWords.map((w) => ({
        wordId: w.id,
        wordTranslate: w.wordTranslate,
      }));

      // Barcha variantlarni aralashtirish
      const allOptions = this.shuffle([correctOption, ...wrongOptions]);

      // To'g'ri javob indeksini aniqlash
      const correctIndex = allOptions.findIndex(
        (opt) => opt.wordId === word.id,
      );

      return {
        wordId: word.id,
        word: word.word,
        transcription: word.transcription,
        options: allOptions,
        correctIndex,
      };
    });

    // Bazaga saqlash
    const quiz = await this.repo.create({
      clientId,
      collectionId: dto.collectionId,
      questions,
      totalQuestions: questions.length,
    });

    return quiz;
  }

  async findByCollectionId(clientId: string, collectionId: string) {
    return this.repo.findActiveByClientAndCollection(clientId, collectionId);
  }

  async submitAnswer(clientId: string, quizId: string, dto: SubmitAnswerDto) {
    const quiz = await this.repo.findByIdAndClient(quizId, clientId);

    if (!quiz) {
      throw new NotFoundException('Quiz topilmadi');
    }

    if (quiz.completedAt) {
      throw new BadRequestException('Bu quiz allaqachon yakunlangan');
    }

    // Savolni topish
    const questionIndex = quiz.questions.findIndex(
      (q) => q.wordId === dto.wordId,
    );

    if (questionIndex === -1) {
      throw new BadRequestException('Savol topilmadi');
    }

    const question = quiz.questions[questionIndex];

    if (question.selectedIndex !== undefined && question.selectedIndex !== null) {
      throw new BadRequestException('Bu savolga allaqachon javob berilgan');
    }

    // Javobni yozish
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex] = {
      ...question,
      selectedIndex: dto.selectedIndex,
    };

    const correct = dto.selectedIndex === question.correctIndex;

    // Javob berilgan va to'g'ri javoblar sonini hisoblash
    const answeredQuestions = updatedQuestions.filter(
      (q) => q.selectedIndex !== undefined && q.selectedIndex !== null,
    ).length;

    const correctAnswers = updatedQuestions.filter(
      (q) =>
        q.selectedIndex !== undefined &&
        q.selectedIndex !== null &&
        q.selectedIndex === q.correctIndex,
    ).length;

    const completed = answeredQuestions === quiz.totalQuestions;

    if (completed) {
      // Barcha savollarga javob berildi — quizni yakunlash
      updatedQuestions.forEach((q, i) => {
        quiz.questions[i] = q;
      });
      await this.repo.completeQuiz(quizId, correctAnswers);
      await this.repo.updateQuestions(quizId, updatedQuestions);
      await this.scoresService.saveScore(clientId, quiz.collectionId, 'quiz', correctAnswers, quiz.totalQuestions);
    } else {
      await this.repo.updateQuestions(quizId, updatedQuestions);
    }

    return {
      correct,
      correctIndex: question.correctIndex,
      selectedIndex: dto.selectedIndex,
      completed,
      totalQuestions: quiz.totalQuestions,
      answeredQuestions,
      correctAnswers,
    };
  }

  async complete(clientId: string, quizId: string) {
    const quiz = await this.repo.findByIdAndClient(quizId, clientId);

    if (!quiz) {
      throw new NotFoundException('Quiz topilmadi');
    }

    if (quiz.completedAt) {
      throw new BadRequestException('Bu quiz allaqachon yakunlangan');
    }

    const answeredQuestions = quiz.questions.filter(
      (q) => q.selectedIndex !== undefined && q.selectedIndex !== null,
    ).length;

    const correctAnswers = quiz.questions.filter(
      (q) =>
        q.selectedIndex !== undefined &&
        q.selectedIndex !== null &&
        q.selectedIndex === q.correctIndex,
    ).length;

    await this.repo.completeQuiz(quizId, correctAnswers);
    await this.scoresService.saveScore(clientId, quiz.collectionId, 'quiz', correctAnswers, quiz.totalQuestions);

    return {
      id: quiz.id,
      collectionId: quiz.collectionId,
      totalQuestions: quiz.totalQuestions,
      answeredQuestions,
      correctAnswers,
      completedAt: new Date(),
    };
  }

  /** Fisher-Yates shuffle */
  private shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
