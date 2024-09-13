import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

// eslint-disable-next-line prettier/prettier
export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository
{
	public items: AnswerComment[] = []

	async findById(id: string) {
		const answerComment = this.items.find(
			(comment) => comment.id.toString() === id,
		)

		return answerComment ?? null
	}

	async findManyByAnswerId(id: string, { page }: PaginationParams) {
		const ITEMS_PER_PAGE = 20
		const ITEMS_OFFSET_START = (page - 1) * ITEMS_PER_PAGE
		const ITEMS_OFFSET_END = page * ITEMS_PER_PAGE

		const answerComments = this.items
			.filter((item) => item.answerId.toString() === id)
			.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END)

		return answerComments
	}

	async create(answerComment: AnswerComment) {
		this.items.push(answerComment)
	}

	async delete(answerComment: AnswerComment) {
		const itemIndex = this.items.findIndex(
			(item) => item.id === answerComment.id,
		)

		this.items.splice(itemIndex, 1)
	}
}
