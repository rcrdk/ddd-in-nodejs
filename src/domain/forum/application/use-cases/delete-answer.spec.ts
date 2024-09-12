import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeleteAnswerUseCase } from './delete-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('delete answer by id', () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository()
		sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
	})

	it('should be able to delete a answer', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId('author-01'),
			},
			new UniqueEntityId('answer-01'),
		)

		await inMemoryAnswersRepository.create(newAnswer)

		await sut.execute({
			answerId: 'answer-01',
			authorId: 'author-01',
		})

		expect(inMemoryAnswersRepository.items).toHaveLength(0)
	})

	it('should not be able to delete a answer from another user', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId('author-02'),
			},
			new UniqueEntityId('answer-02'),
		)

		await inMemoryAnswersRepository.create(newAnswer)

		await expect(() => {
			return sut.execute({
				answerId: 'answer-02',
				authorId: 'author-01',
			})
		}).rejects.toBeInstanceOf(Error)
	})
})
