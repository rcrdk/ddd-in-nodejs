import { Answer } from '../entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

const fakeAnswersRepository: AnswersRepository = {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	create: async (answer: Answer) => {
		// eslint-disable-next-line no-useless-return
		return
	},
}

test('create an answer', async () => {
	const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository)

	const answer = await answerQuestion.execute({
		content: 'Nova resposta',
		instructorId: '1',
		questionId: '2',
	})

	expect(answer.content).toEqual('Nova resposta')
})
