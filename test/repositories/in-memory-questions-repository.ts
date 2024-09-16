import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = []

	constructor(
		private questionAttachmentsRepository: QuestionAttachmentsRepository,
	) {}

	async findById(id: string) {
		const question = this.items.find(
			(question) => question.id.toString() === id,
		)

		return question ?? null
	}

	async findBySlug(slug: string) {
		const question = this.items.find((question) => question.slug.value === slug)

		return question ?? null
	}

	async findManyRecent({ page }: PaginationParams) {
		const ITEMS_PER_PAGE = 20
		const ITEMS_OFFSET_START = (page - 1) * ITEMS_PER_PAGE
		const ITEMS_OFFSET_END = page * ITEMS_PER_PAGE

		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END)

		return questions
	}

	async create(question: Question) {
		this.items.push(question)

		DomainEvents.dispatchEventsForAggregate(question.id)
	}

	async save(question: Question) {
		const itemIndex = this.items.findIndex((item) => item.id === question.id)

		this.items[itemIndex] = question

		DomainEvents.dispatchEventsForAggregate(question.id)

		return this.items[itemIndex]
	}

	async delete(question: Question) {
		const itemIndex = this.items.findIndex((item) => item.id === question.id)

		this.items.splice(itemIndex, 1)
		this.questionAttachmentsRepository.deleteManyByQuestionId(
			question.id.toString(),
		)
	}
}
