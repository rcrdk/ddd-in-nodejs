import { Either, left, right } from '@/core/either'

import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface DeleteQuestionUseCaseRequest {
	questionId: string
	authorId: string
}

type DeleteQuestionUseCaseResponse = Either<
	ResourceNotFoundError | UnauthorizedError,
	object
>

export class DeleteQuestionUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({
		questionId,
		authorId,
	}: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId)

		if (!question) {
			return left(new ResourceNotFoundError())
		}

		if (authorId !== question.authorId.toString()) {
			return left(new UnauthorizedError())
		}

		await this.questionsRepository.delete(question)

		return right({})
	}
}
