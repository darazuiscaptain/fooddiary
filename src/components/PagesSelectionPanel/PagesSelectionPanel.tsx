import React from 'react';
import './PagesSelectionPanel.scss';
import { SidebarSelectionPanel, SidebarSelectionPanelOptions } from '../SidebarBlocks';
import { Checkbox, DropdownMenu, DropdownItem } from '../Controls';
import Icon from '../Icon';
import { StateToPropsMapResult, DispatchToPropsMapResult } from './PagesSelectionPanelConnected';
import Loader from '../Loader';

interface PagesSelectionPanelProps extends StateToPropsMapResult, DispatchToPropsMapResult {}

const PagesSelectionPanel: React.FC<PagesSelectionPanelProps> = ({
  visiblePagesCount,
  selectedPagesCount,
  setSelectedForAllPages,
  selectedPagesIds,
  isOperationInProcess,
  operationMessage,
  deletePages,
  getPages,
  pagesFilter,
}: PagesSelectionPanelProps) => {
  const selectAllChecked = visiblePagesCount === selectedPagesCount;

  const handleSelectAllClick = (): void => {
    setSelectedForAllPages(!selectAllChecked);
  };

  const handleEditOptionClick = (): void => {
    return;
  };

  const handleDeleteOptionClick = async (): Promise<void> => {
    // TODO: modal
    const isDeleteConfirmed = window.confirm('Do you want to delete all selected pages?');
    if (isDeleteConfirmed) {
      await deletePages(selectedPagesIds);
      await getPages(pagesFilter);
    }
  };

  const selectionOptionsToggler = <Icon type="three-dots"></Icon>;

  return (
    <SidebarSelectionPanel>
      <Checkbox checked={selectAllChecked} onCheck={handleSelectAllClick} label="Select all"></Checkbox>
      {selectedPagesCount > 0 ? (
        <SidebarSelectionPanelOptions>
          {isOperationInProcess ? (
            <Loader label={operationMessage} size="small"></Loader>
          ) : (
            <React.Fragment>
              <div>Selected: {selectedPagesCount}</div>
              <DropdownMenu toggler={selectionOptionsToggler} contentWidth={150}>
                <DropdownItem onClick={handleEditOptionClick}>Edit</DropdownItem>
                <DropdownItem onClick={handleDeleteOptionClick}>Delete</DropdownItem>
              </DropdownMenu>
            </React.Fragment>
          )}
        </SidebarSelectionPanelOptions>
      ) : (
        <SidebarSelectionPanelOptions withoutSelection>No pages selected</SidebarSelectionPanelOptions>
      )}
    </SidebarSelectionPanel>
  );
};

export default PagesSelectionPanel;
