import { Dispatch, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import {
  GetNotesForPageSuccessAction,
  GetNotesForPageErrorAction,
  GetNotesForPageRequestAction,
  NotesListActionTypes,
  GetNotesForMealSuccessAction,
  GetNotesForMealErrorAction,
  GetNotesForMealRequestAction,
  SetEditableForNoteAction,
} from '../../action-types';
import { getNotesAsync } from '../../services';
import { NoteItem, MealType, NotesForMealSearchRequest, NotesSearchRequest } from '../../models';

const getNotesForPageRequest = (): GetNotesForPageRequestAction => {
  return {
    type: NotesListActionTypes.RequestForPage,
  };
};

const getNotesForPageSuccess = (noteItems: NoteItem[]): GetNotesForPageSuccessAction => {
  return {
    type: NotesListActionTypes.SuccessForPage,
    noteItems,
  };
};

const getNotesForPageError = (errorMessage: string): GetNotesForPageErrorAction => {
  return {
    type: NotesListActionTypes.ErrorForPage,
    errorMessage,
  };
};

const getNotesForMealRequest = (mealType: MealType): GetNotesForMealRequestAction => {
  return {
    type: NotesListActionTypes.RequestForMeal,
    mealType,
  };
};

const getNotesForMealSuccess = (mealType: MealType, noteItems: NoteItem[]): GetNotesForMealSuccessAction => {
  return {
    type: NotesListActionTypes.SuccessForMeal,
    mealType,
    noteItems,
  };
};

const getNotesForMealError = (mealType: MealType, errorMessage: string): GetNotesForMealErrorAction => {
  return {
    type: NotesListActionTypes.ErrorForMeal,
    mealType,
    errorMessage,
  };
};

enum NotesListBaseErrorMessages {
  NotesForPage = 'Failed to get notes for page',
  NotesForMeal = 'Failed to get notes for meal',
}

export const getNotesForPage: ActionCreator<ThunkAction<
  Promise<GetNotesForPageSuccessAction | GetNotesForPageErrorAction>,
  NoteItem[],
  NotesSearchRequest,
  GetNotesForPageSuccessAction | GetNotesForPageErrorAction
>> = (request: NotesSearchRequest) => {
  return async (dispatch: Dispatch): Promise<GetNotesForPageSuccessAction | GetNotesForPageErrorAction> => {
    dispatch(getNotesForPageRequest());
    try {
      const response = await getNotesAsync(request);

      if (response.ok) {
        const noteItems = await response.json();
        return dispatch(getNotesForPageSuccess(noteItems));
      }

      switch (response.status) {
        case 400:
          return dispatch(getNotesForPageError(`${NotesListBaseErrorMessages.NotesForPage}: wrong request data`));
        case 404:
          return dispatch(getNotesForPageError(`${NotesListBaseErrorMessages.NotesForPage}: page not found`));
        case 500:
          return dispatch(getNotesForPageError(`${NotesListBaseErrorMessages.NotesForPage}: server error`));
        default:
          return dispatch(getNotesForPageError(`${NotesListBaseErrorMessages.NotesForPage}: unknown response code`));
      }
    } catch (error) {
      console.error(error);
      return dispatch(getNotesForPageError(NotesListBaseErrorMessages.NotesForPage));
    }
  };
};

export const getNotesForMeal: ActionCreator<ThunkAction<
  Promise<GetNotesForMealSuccessAction | GetNotesForMealErrorAction>,
  NoteItem[],
  NotesForMealSearchRequest,
  GetNotesForMealSuccessAction | GetNotesForMealErrorAction
>> = ({ pageId, mealType }: NotesForMealSearchRequest) => {
  return async (dispatch: Dispatch): Promise<GetNotesForMealSuccessAction | GetNotesForMealErrorAction> => {
    dispatch(getNotesForMealRequest(mealType));
    try {
      const response = await getNotesAsync({
        pageId,
        mealType,
      });

      if (response.ok) {
        const noteItems = await response.json();
        return dispatch(getNotesForMealSuccess(mealType, noteItems));
      }

      switch (response.status) {
        case 400:
          return dispatch(
            getNotesForMealError(mealType, `${NotesListBaseErrorMessages.NotesForMeal}: wrong request data`),
          );
        case 500:
          return dispatch(getNotesForMealError(mealType, `${NotesListBaseErrorMessages.NotesForMeal}: server error`));
        default:
          return dispatch(
            getNotesForMealError(mealType, `${NotesListBaseErrorMessages.NotesForMeal}: unknown response code`),
          );
      }
    } catch (error) {
      console.error(error);
      return dispatch(getNotesForMealError(mealType, NotesListBaseErrorMessages.NotesForMeal));
    }
  };
};

export const setEditableForNote = (noteId: number, editable: boolean): SetEditableForNoteAction => {
  return {
    type: NotesListActionTypes.SetEditable,
    noteId,
    editable,
  };
};
