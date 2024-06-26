import {v1} from 'uuid';
import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {Dispatch} from "redux";
import {addTaskAC} from "./tasks-reducer";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    title: string
    todolistId: string
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}

type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodosActionType

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{
                id: action.todolistId,
                title: action.title,
                filter: 'all',
                addedDate: '',
                order: 0
            }, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.filter = action.filter;
            }
            return [...state]
        }
        case "SET_TODOLISTS": {
            return action.todos.map((tl)=> ({...tl, filter:'all'}))
        }
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (title: string): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', title: title, todolistId: v1()}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}
}

export type SetTodosActionType = {
    type: 'SET_TODOLISTS',
    todos: TodolistType[]
}

export const setTodosAC = (todos: TodolistType[]): SetTodosActionType => {
    return {type: 'SET_TODOLISTS', todos}
}

export const getTodosThunkTC = () => {
    return (dispatch:Dispatch, getState:any) => {
        todolistsAPI.getTodolists().then(res => {
            // и диспатчить экшены (action) или другие санки (thunk)
            dispatch(setTodosAC(res.data))
        })
    }
    // внутри санки можно делать побочные эффекты (запросы на сервер)
}

export const addTodosThunkTC = (title:string) => {
    return (dispatch:Dispatch, getState:any) => {
        todolistsAPI.createTodolist(title).then(res => {
            // и диспатчить экшены (action) или другие санки (thunk)
            // dispatch(addTaskAC)
            dispatch(addTodolistAC(title))
        })
    }
    // внутри санки можно делать побочные эффекты (запросы на сервер)
}

// todo:1. Правильно ли говорить, что санка принимает те же параметры что и action creator.
// todo:2. Tasks 500 ошибка


export const deleteTodosThunkTC = (todoId:string) => {

    return (dispatch:Dispatch, getState:any) => {
        todolistsAPI.deleteTodolist(todoId)
            .then(res => {
                dispatch(removeTodolistAC(todoId))
            })
    }
}
