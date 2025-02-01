import { User } from '@models/user/User';
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(
        new User({
            id: 1,
            username: 'mwasyluk_test',
            email: 'test@test.com',
            password: 'test'
        })
    );

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
