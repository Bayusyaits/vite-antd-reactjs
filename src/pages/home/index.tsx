import HomeView from './Main'
import HomeModalView from '../../components/home/Modal'
import { useCallbackPrompt } from '../../hooks/useCallbackPrompt';
import { useState } from 'react';

const HomeContainer = () => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showPrompt, confirmNavigation, cancelNavigation] =
  useCallbackPrompt(showDialog);
  const data = {
    content: [
      {
        id: 1,
        name: 'John Sr',
        age: 60,
        address: 'Sudirman No 1, Jakarta Selatan',
      },
      {
        id: 2,
        name: 'Lennon Jr',
        age: 32,
        address: 'Kemanggisan No 3, Jakarta Barat',
      },
    ]
  };
  return (
    <>
    <HomeView
      data={data}
    />
    <HomeModalView
      open={showPrompt}
      handleConfirm={confirmNavigation}
      handleCancel={cancelNavigation}
    />
    </>
  )
}

export default HomeContainer
