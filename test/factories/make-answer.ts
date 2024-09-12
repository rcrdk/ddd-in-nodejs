import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'

export function makeAnswer(override: Partial<AnswerProps> = {}) {
	const answer = Answer.create({
		content: 'Que dia é hoje?',
		authorId: new UniqueEntityId('instructor-01'),
		questionId: new UniqueEntityId('question-01'),
		...override,
	})

	return answer
}
