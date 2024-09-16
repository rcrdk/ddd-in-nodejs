import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'

interface ReadNotificationUseCaseRequest {
	recipientId: string
	notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
	ResourceNotFoundError | UnauthorizedError,
	{
		notification: Notification
	}
>

export class ReadNotificationUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async execute({
		recipientId,
		notificationId,
	}: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
		const notification =
			await this.notificationsRepository.findById(notificationId)

		if (!notification) {
			return left(new ResourceNotFoundError())
		}

		if (recipientId !== notification.recipientId.toString()) {
			return left(new UnauthorizedError())
		}

		notification.read()

		await this.notificationsRepository.save(notification)

		return right({ notification })
	}
}
