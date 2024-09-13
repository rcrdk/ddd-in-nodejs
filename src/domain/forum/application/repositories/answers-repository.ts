import { PaginationParams } from '@/core/repositories/pagination-params'

import { Answer } from '../../enterprise/entities/answer'

export interface AnswersRepository {
	findById(id: string): Promise<Answer | null>
	findManyByQuestionId(id: string, params: PaginationParams): Promise<Answer[]>
	create(answer: Answer): Promise<void>
	save(question: Answer): Promise<Answer>
	delete(question: Answer): Promise<void>
}
