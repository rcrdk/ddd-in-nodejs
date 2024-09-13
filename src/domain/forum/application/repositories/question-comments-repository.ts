/* eslint-disable prettier/prettier */
import { PaginationParams } from '@/core/repositories/pagination-params'

import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionCommentsRepository {
	findById(id: string): Promise<QuestionComment | null>
	findManyByQuestionId(id: string, params: PaginationParams): Promise<QuestionComment[]>
	create(questionComment: QuestionComment): Promise<void>
	delete(questionComment: QuestionComment): Promise<void>
}
