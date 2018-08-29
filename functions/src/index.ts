import * as functions from 'firebase-functions';
import * as webpush from 'web-push';

const vapidKeys = {
    publicKey:'BN76KlJXP9kl_ErTCnoGbG9Z9qjV4ZIT5PNU0Jd90y7Rb704LrnCoiWg413_PWOPdtLlogaYfRNiR_80AQyZJqo',
    privateKey:'IuWJBnK3LOQHL4RAFB_9JDHJYUFGd9DjpCeZEQ9bgDU'
}
webpush.setVapidDetails(
    'mailto:tgross@skyroad.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

export const notificationTest = functions.https.onRequest(async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Max-Age', '3600');

    const notificationPayload = {
        notification: {
            title: 'Push Notification Featuring Homer Simpson',
            body: request.body.message,
            icon: 'https://upload.wikimedia.org/wikipedia/en/0/02/Homer_Simpson_2006.png',
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            }
        }
    };

    if (request.method === 'OPTIONS') {
      return response.status(204).send();
    } else {
        try {
            const push = await webpush.sendNotification(request.body.token, JSON.stringify(notificationPayload));
            console.log(push);
            return response.status(200).send();
        } catch (e) {
            console.error(e);
            return response.status(400).send();
        }
    }
});