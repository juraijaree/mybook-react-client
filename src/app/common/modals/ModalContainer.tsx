import React, { useContext } from 'react';
import { Modal } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

import { RootStoreContext } from '../../stores/rootStore';

const ModalContainer = () => {
  const {
    modal: { open, body },
    closeModal
  } = useContext(RootStoreContext).modalStore;

  return (
    <Modal open={open} onClose={closeModal} size='mini'>
      <Modal.Content>{body}</Modal.Content>
    </Modal>
  );
};

export default observer(ModalContainer);
