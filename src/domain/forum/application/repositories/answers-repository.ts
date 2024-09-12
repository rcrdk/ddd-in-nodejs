import { Answer } from '../../enterprise/entities/answer'

export interface AnswersRepository {
	findById(id: string): Promise<Answer | null>
	create(answer: Answer): Promise<void>
	delete(question: Answer): Promise<void>
}
