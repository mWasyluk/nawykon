import { storeService } from "./storeService";

export async function getCurrentUid() {
    const uid = await storeService.getItem('uid', true);

    if (!uid) {
        throw new Error('Ta akcja wymaga zalogowania się.');
    }
    return uid;
}
