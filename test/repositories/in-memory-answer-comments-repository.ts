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
