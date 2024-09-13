import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { EditAnswerUseCase } from './edit-answer'
import { UnauthorizedError } from './errors/unauthorized-error'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('edit answer by id', () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository()
		sut = new EditAnswerUseCase(inMemoryAnswersRepository)
	})

	it('should be able to edit a answer', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId('author-01'),
			},
			new UniqueEntityId('answer-01'),
		)

		await inMemoryAnswersRepository.create(newAnswer)

		await sut.execute({
			answerId: newAnswer.id.toValue(),
			authorId: 'author-01',
			content: 'Update content',
		})

		expect(inMemoryAnswersRepository.items.at(0)).toMatchObject({
			content: 'Update content',
		})
	})

	it('should not be able to edit a answer from another user', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId('author-02'),
			},
			new UniqueEntityId('answer-02'),
		)

		await inMemoryAnswersRepository.create(newAnswer)

		const result = await sut.execute({
			answerId: newAnswer.id.toValue(),
			authorId: 'author-01',
			content: 'Update content',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UnauthorizedError)
	})
})
