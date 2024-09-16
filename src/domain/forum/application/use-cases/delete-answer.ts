import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { AnswersRepository } from '../repositories/answers-repository'

interface DeleteAnswerUseCaseRequest {
	answerId: string
	authorId: string
}

type DeleteAnswerUseCaseResponse = Either<
	ResourceNotFoundError | UnauthorizedError,
	object
>

export class DeleteAnswerUseCase {
	constructor(private answerRepository: AnswersRepository) {}

	async execute({
		answerId,
		authorId,
	}: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
		const answer = await this.answerRepository.findById(answerId)

		if (!answer) {
			return left(new ResourceNotFoundError())
		}

		if (authorId !== answer.authorId.toString()) {
			return left(new UnauthorizedError())
		}

		await this.answerRepository.delete(answer)

		return right({})
	}
}
