import 'react-native-get-random-values'
import { customAlphabet } from 'nanoid';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateId = (length = 20) => {
    const nanoid = customAlphabet(alphabet, length);
    return nanoid();
}
