import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface DeleteQuestionCommentUseCaseRequest {
	authorId: string
	questionCommentId: string
}

type DeleteQuestionCommentUseCaseResponse = Either<
	ResourceNotFoundError | UnauthorizedError,
	object
>

export class DeleteQuestionCommentUseCase {
	constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

	async execute({
		authorId,
		questionCommentId,
	}: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
		const questionComment =
			await this.questionCommentsRepository.findById(questionCommentId)

		if (!questionComment) {
			return left(new ResourceNotFoundError())
		}

		if (questionComment.authorId.toString() !== authorId) {
			return left(new UnauthorizedError())
		}

		await this.questionCommentsRepository.delete(questionComment)

		return right({})
	}
}
