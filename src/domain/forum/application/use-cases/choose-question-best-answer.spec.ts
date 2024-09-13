import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { UnauthorizedError } from './errors/unauthorized-error'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('choose answer best answer', () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository()

		sut = new ChooseQuestionBestAnswerUseCase(
			inMemoryQuestionsRepository,
			inMemoryAnswersRepository,
		)
	})

	it('should be able to choose question best answer', async () => {
		const question = makeQuestion()
		const answer = makeAnswer({
			questionId: question.id,
		})

		await inMemoryQuestionsRepository.create(question)
		await inMemoryAnswersRepository.create(answer)

		await sut.execute({
			answerId: answer.id.toString(),
			authorId: question.authorId.toString(),
		})

		expect(inMemoryQuestionsRepository.items.at(0)?.bestAnswerId).toEqual(
			answer.id,
		)
	})

	it('should not be able to choose another user question best answer', async () => {
		const question = makeQuestion({
			authorId: new UniqueEntityId('author-01'),
		})
		const answer = makeAnswer({
			questionId: question.id,
		})

		await inMemoryQuestionsRepository.create(question)
		await inMemoryAnswersRepository.create(answer)

		const result = await sut.execute({
			answerId: answer.id.toString(),
			authorId: 'author-02',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UnauthorizedError)
	})
})
