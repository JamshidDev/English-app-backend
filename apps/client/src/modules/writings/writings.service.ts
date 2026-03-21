import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { WritingsRepository } from './repository/writings.repository';
import { ScoresService } from '../scores/scores.service';
import { WritingQuestion } from '@shared/database/schema/writings.schema';

@Injectable()
export class WritingsService {
  constructor(
    private readonly writingsRepository: WritingsRepository,
    private readonly scoresService: ScoresService,
  ) {}

  private shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  async start(clientId: string, collectionId: string) {
    const active = await this.writingsRepository.findActiveByClientAndCollection(clientId, collectionId);
    if (active) {
      return active;
    }

    const wordsList = await this.writingsRepository.findWordsByCollectionId(collectionId);
    if (wordsList.length < 4) {
      throw new BadRequestException("Collectionda kamida 4 ta so'z bo'lishi kerak");
    }

    const shuffled = this.shuffle(wordsList);
    const questions: WritingQuestion[] = shuffled.map((w) => ({
      wordId: w.id,
      wordTranslate: w.wordTranslate as { uz: string; ru: string },
      correctWord: w.word,
    }));

    return this.writingsRepository.create({
      clientId,
      collectionId,
      questions,
      totalQuestions: questions.length,
    });
  }

  async findByCollectionId(clientId: string, collectionId: string) {
    return this.writingsRepository.findActiveByClientAndCollection(clientId, collectionId);
  }

  async submitAnswer(clientId: string, writingId: string, wordId: string, answer: string) {
    const writing = await this.writingsRepository.findByIdAndClient(writingId, clientId);
    if (!writing) throw new NotFoundException('Writing topilmadi');
    if (writing.completedAt) throw new BadRequestException('Writing allaqachon yakunlangan');

    const questions = writing.questions as WritingQuestion[];
    const questionIndex = questions.findIndex((q) => q.wordId === wordId);
    if (questionIndex === -1) throw new NotFoundException('Savol topilmadi');
    if (questions[questionIndex].answer !== undefined && questions[questionIndex].answer !== null) {
      throw new BadRequestException('Bu savolga allaqachon javob berilgan');
    }

    const isCorrect = answer.trim().toLowerCase() === questions[questionIndex].correctWord.trim().toLowerCase();
    questions[questionIndex].answer = answer;
    questions[questionIndex].isCorrect = isCorrect;

    const answeredCount = questions.filter((q) => q.answer !== undefined && q.answer !== null).length;
    const correctCount = questions.filter((q) => q.isCorrect === true).length;
    const allAnswered = answeredCount === writing.totalQuestions;

    if (allAnswered) {
      await this.writingsRepository.updateQuestions(writingId, questions);
      await this.writingsRepository.completeWriting(writingId, correctCount);
      await this.scoresService.saveScore(clientId, writing.collectionId, 'writing', correctCount, writing.totalQuestions);
    } else {
      await this.writingsRepository.updateQuestions(writingId, questions);
    }

    return {
      correct: isCorrect,
      correctWord: questions[questionIndex].correctWord,
      answer,
      completed: allAnswered,
      totalQuestions: writing.totalQuestions,
      answeredQuestions: answeredCount,
      correctAnswers: correctCount,
    };
  }

  async complete(clientId: string, writingId: string) {
    const writing = await this.writingsRepository.findByIdAndClient(writingId, clientId);
    if (!writing) throw new NotFoundException('Writing topilmadi');
    if (writing.completedAt) throw new BadRequestException('Writing allaqachon yakunlangan');

    const questions = writing.questions as WritingQuestion[];
    const correctCount = questions.filter((q) => q.isCorrect === true).length;

    await this.writingsRepository.completeWriting(writingId, correctCount);
    await this.scoresService.saveScore(clientId, writing.collectionId, 'writing', correctCount, writing.totalQuestions);

    return {
      totalQuestions: writing.totalQuestions,
      answeredQuestions: questions.filter((q) => q.answer !== undefined && q.answer !== null).length,
      correctAnswers: correctCount,
    };
  }
}
