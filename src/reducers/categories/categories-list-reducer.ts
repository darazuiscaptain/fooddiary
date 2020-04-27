import { CategoriesListState } from '../../store';
import { CategoriesListActions, CategoriesListActionTypes } from '../../action-types';

const initialState: CategoriesListState = {
  categoryItems: [],
  categoryItemsFetchState: {
    loading: false,
    loaded: false,
  },
  currentDraftCategoryId: 0,
  editableCategoriesIds: [],
};

const categoriesListReducer = (
  state: CategoriesListState = initialState,
  action: CategoriesListActions,
): CategoriesListState => {
  switch (action.type) {
    case CategoriesListActionTypes.Request:
      return {
        ...state,
        categoryItemsFetchState: {
          ...state.categoryItemsFetchState,
          loading: true,
          loaded: false,
        },
      };
    case CategoriesListActionTypes.Success:
      return {
        ...state,
        categoryItemsFetchState: {
          ...state.categoryItemsFetchState,
          loading: false,
          loaded: true,
        },
        categoryItems: [...state.categoryItems.filter(p => p.id < 1), ...action.categories],
      };
    case CategoriesListActionTypes.Error:
      return {
        ...state,
        categoryItemsFetchState: {
          ...state.categoryItemsFetchState,
          loading: false,
          loaded: false,
          error: action.errorMessage,
        },
      };
    case CategoriesListActionTypes.CreateDraftCategory:
      return {
        ...state,
        editableCategoriesIds: [...state.editableCategoriesIds, state.currentDraftCategoryId],
        categoryItems: [
          {
            ...action.draftCategory,
            id: state.currentDraftCategoryId,
          },
          ...state.categoryItems,
        ],
        currentDraftCategoryId: state.currentDraftCategoryId - 1,
      };
    case CategoriesListActionTypes.DeleteDraftCategory:
      return {
        ...state,
        categoryItems: [...state.categoryItems.filter(c => c.id !== action.draftCategoryId)],
        editableCategoriesIds: [...state.editableCategoriesIds.filter(id => id !== action.draftCategoryId)],
      };
    case CategoriesListActionTypes.SetEditable:
      return {
        ...state,
        editableCategoriesIds: action.editable
          ? [...state.editableCategoriesIds, ...action.categoriesIds]
          : [...state.editableCategoriesIds.filter(id => !action.categoriesIds.some(aId => aId === id))],
      };
    default:
      return state;
  }
};

export default categoriesListReducer;
