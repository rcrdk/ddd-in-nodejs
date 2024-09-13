import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

// eslint-disable-next-line prettier/prettier
export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository
{
	public items: QuestionComment[] = []

	async findById(id: string) {
		const questionComment = this.items.find(
			(comment) => comment.id.toString() === id,
		)

		return questionComment ?? null
	}

	async findManyByQuestionId(id: string, { page }: PaginationParams) {
		const ITEMS_PER_PAGE = 20
		const ITEMS_OFFSET_START = (page - 1) * ITEMS_PER_PAGE
		const ITEMS_OFFSET_END = page * ITEMS_PER_PAGE

		const questionComments = this.items
			.filter((item) => item.questionId.toString() === id)
			.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END)

		return questionComments
	}

	async create(questionComment: QuestionComment) {
		this.items.push(questionComment)
	}

	async delete(questionComment: QuestionComment) {
		const itemIndex = this.items.findIndex(
			(item) => item.id === questionComment.id,
		)

		this.items.splice(itemIndex, 1)
	}
}
