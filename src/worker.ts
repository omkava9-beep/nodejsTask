import {worker, notificationWorker} from './queues'

async function startWorker() {
    await worker.run()
    await notificationWorker.run()
}

startWorker()