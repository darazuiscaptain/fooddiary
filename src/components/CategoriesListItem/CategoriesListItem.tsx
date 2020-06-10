import React from 'react';
import './CategoriesListItem.scss';
import {
  SidebarListItem,
  SidebarListItemLink,
  SidebarListItemControls,
  useActiveLinkClassName,
} from '../SidebarBlocks';
import { CategoryItem } from '../../models';
import {
  CategoriesListItemStateToPropsMapResult,
  CategoriesListItemDispatchToPropsMapResult,
} from './CategoriesListItemConnected';
import { DropdownMenu, DropdownItem } from '../Controls';
import { Icon } from '../__ui__';
import { CategoriesOperationsActionTypes } from '../../action-types';
import { useHistory } from 'react-router-dom';
import CategoriesListItemEditableConnected from './CategoriesListItemEditableConnected';
import { getWordWithCount } from '../../utils';
import { Container, Badge } from '../__ui__';

interface CategoriesListItemProps
  extends CategoriesListItemStateToPropsMapResult,
    CategoriesListItemDispatchToPropsMapResult {
  category: CategoryItem;
}

const CategoriesListItem: React.FC<CategoriesListItemProps> = ({
  category,
  categoryOperationStatus,
  productOperationStatus,
  productItemsFetchState,
  editableCategoriesIds,
  setEditableForCategories,
  deleteCategory,
  getCategories,
  openConfirmationModal,
}: CategoriesListItemProps) => {
  const activeLinkClassName = useActiveLinkClassName();
  const history = useHistory();

  const { performing: isCategoryOperationInProcess } = categoryOperationStatus;
  const { performing: isProductOperationInProcess } = productOperationStatus;
  const { loading: areProductsLoading } = productItemsFetchState;

  const isEditable = editableCategoriesIds.some(id => category.id === id);
  const isAnySideEffectHappening = isCategoryOperationInProcess || isProductOperationInProcess || areProductsLoading;

  const categoryProductsBadgeLabel = getWordWithCount(category.countProducts, 'product', 'products');

  const runDeleteCategoryAsync = async (): Promise<void> => {
    const { type: deleteCategoryActionType } = await deleteCategory(category.id);

    if (deleteCategoryActionType === CategoriesOperationsActionTypes.DeleteSuccess) {
      await getCategories();
      history.push('/categories');
    }
  };

  const handleEditItemClick = (): void => {
    setEditableForCategories([category.id], true);
  };

  const handleDeleteItemClick = (): void => {
    openConfirmationModal(
      'Delete category',
      `Do you want to delete category "${category.name}" and all its products?`,
      () => {
        runDeleteCategoryAsync();
      },
    );
  };

  if (isEditable) {
    return <CategoriesListItemEditableConnected category={category}></CategoriesListItemEditableConnected>;
  }

  return (
    <SidebarListItem>
      <SidebarListItemLink to={`/categories/${category.id}`} activeClassName={activeLinkClassName} selected={false}>
        <div>{category.name}</div>
        <Container spaceBetweenChildren="small">
          <Badge label={categoryProductsBadgeLabel} selected={false}></Badge>
        </Container>
      </SidebarListItemLink>
      <SidebarListItemControls>
        <DropdownMenu
          toggler={<Icon type="three-dots"></Icon>}
          contentAlignment="right"
          contentWidth={150}
          disabled={isAnySideEffectHappening}
        >
          <DropdownItem onClick={handleEditItemClick}>Edit category</DropdownItem>
          <DropdownItem onClick={handleDeleteItemClick}>Delete category</DropdownItem>
        </DropdownMenu>
      </SidebarListItemControls>
    </SidebarListItem>
  );
};

export default CategoriesListItem;
