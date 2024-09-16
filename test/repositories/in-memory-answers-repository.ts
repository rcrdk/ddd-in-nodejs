import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
	public items: Answer[] = []

	constructor(
		private answerAttachmentsRepository: AnswerAttachmentsRepository,
	) {}

	async findById(id: string) {
		const answer = this.items.find((answer) => answer.id.toString() === id)

		return answer ?? null
	}

	async findManyByQuestionId(id: string, { page }: PaginationParams) {
		const ITEMS_PER_PAGE = 20
		const ITEMS_OFFSET_START = (page - 1) * ITEMS_PER_PAGE
		const ITEMS_OFFSET_END = page * ITEMS_PER_PAGE

		const answers = this.items
			.filter((item) => item.questionId.toString() === id)
			.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END)

		return answers
	}

	async create(answer: Answer) {
		this.items.push(answer)

		DomainEvents.dispatchEventsForAggregate(answer.id)
	}

	async save(answer: Answer) {
		const itemIndex = this.items.findIndex((item) => item.id === answer.id)

		this.items[itemIndex] = answer

		DomainEvents.dispatchEventsForAggregate(answer.id)

		return this.items[itemIndex]
	}

	async delete(answer: Answer) {
		const itemIndex = this.items.findIndex((item) => item.id === answer.id)

		this.items.splice(itemIndex, 1)
		this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
	}
}
