import { createContext } from 'react'


//import {  VidCounter }    from '../Classes/User';

// useContext tutorial: https://www.youtube.com/watch?v=lhMKvyLRWo0
export const UserContext = createContext(null);

export const UserSettingsContext = createContext(null);

export const IsLoggedContext = createContext(null)

export const IsInitFinishedContext = createContext(false)
  