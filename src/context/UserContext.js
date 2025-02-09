import { User } from '@models/user/User';
import { auth, isAuth } from '@services/authService';
import { getAllDocuments } from '@services/firestoreService';
import { getIdToken } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';

const email = 'test@test.com';
const password = 'testtt';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {


        // Obserwator stanu autentykacji
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Pobranie tokena i zapisanie w SecureStore
                    // const token = await getIdToken(firebaseUser);
                    // await SecureStore.setItemAsync('userToken', token);

                    // Utworzenie instancji użytkownika
                    // console.log('firebaseUser:', firebaseUser);
                    const uid = firebaseUser.uid;
                    const email = firebaseUser.email;
                    const password = await getIdToken(firebaseUser);

                    // pobiera dane z bazy danych z kolekcji userDetails na podstawie uid
                    const udetails = await getAllDocuments('userDetails')
                        .then((data) => data[0]);

                    const userInstance = new User({ ...udetails, uid, email, password });
                    setUser(userInstance);
                    setError(null);
                } catch (tokenError) {
                    setError(tokenError);
                    setUser(null);
                }
            } else {
                // Jeśli brak zalogowanego użytkownika, wykonujemy logowanie
                // TODO: Redirect to login screen which will call the signInWithEmailAndPassword method 
                //       passing provided email and password
                //       setUser(null);
                try {
                    const userCredential = await auth.signInWithEmailAndPassword(auth, email, password);
                    const firebaseUser = userCredential.user;

                    const userInstance = new User(firebaseUser);
                    setUser(userInstance);
                    setError(null);
                } catch (loginError) {
                    // console.error('Błąd logowania:', loginError);
                    setError(loginError);
                    setUser(null);
                }
            }
            setIsLoading(false);
        });
        if (!isAuth()) {
            return;
        }

        return () => unsubscribe();
    }, [auth]);

    return (
        <UserContext.Provider value={{ user, error, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
