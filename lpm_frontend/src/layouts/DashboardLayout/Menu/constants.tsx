import { ROUTER_PATH } from '@/utils/router';
import SettingsIcon from '@/components/svgs/SettingsIcon';
import UserIcon from '@/components/svgs/UserIcon';
import UploadIcon from '@/components/svgs/UploadIcon';
import TrainingIcon from '@/components/svgs/TrainingIcon';
import PlaygroundIcon from '@/components/svgs/PlaygroundIcon';
import ChatIcon from '@/components/svgs/ChatIcon';
import BridgeIcon from '@/components/svgs/BridgeIcon';
import AppsIcon from '@/components/svgs/AppsIcon';
import RoleplayIcon from '@/components/svgs/RoleplayIcon';
import NetworkIcon from '@/components/svgs/NetworkIcon';
import GlobeIcon from '@/components/svgs/GlobeIcon';

export const tabs = [
  {
    name: 'Create Second Me',
    path: ROUTER_PATH.TRAIN,
    icon: <SettingsIcon className="w-5 h-5" />,
    subTabs: [
      {
        name: 'Define Your Identity',
        path: ROUTER_PATH.TRAIN_IDENTITY,
        icon: <UserIcon className="w-4 h-4" />
      },
      {
        name: 'Upload Your Memory',
        path: ROUTER_PATH.TRAIN_MEMORIES,
        icon: <UploadIcon className="w-4 h-4" />
      },
      {
        name: 'Train Second Me',
        path: ROUTER_PATH.TRAIN_TRAINING,
        icon: <TrainingIcon className="w-4 h-4" />
      }
    ]
  },
  {
    name: 'Playground',
    path: ROUTER_PATH.PLAYGROUND,
    icon: <PlaygroundIcon className="w-5 h-5" />,
    subTabs: [
      {
        name: 'Chat Mode',
        path: ROUTER_PATH.PLAYGROUND_CHAT,
        icon: <ChatIcon className="w-4 h-4" />
      },
      {
        name: 'Bridge Mode',
        path: ROUTER_PATH.PLAYGROUND_BRIDGE,
        icon: <BridgeIcon className="w-4 h-4" />
      }
    ]
  },
  {
    name: 'Second Me Apps',
    path: ROUTER_PATH.APPLICATIONS,
    icon: <AppsIcon className="w-5 h-5" />,
    subTabs: [
      {
        name: 'Roleplay Apps',
        path: ROUTER_PATH.APPLICATIONS_ROLEPLAY,
        icon: <RoleplayIcon className="w-4 h-4" />
      },
      {
        name: 'Network Apps',
        path: ROUTER_PATH.APPLICATIONS_NETWORK,
        icon: <NetworkIcon className="w-4 h-4" />
      },
      {
        name: 'Second X Apps',
        path: ROUTER_PATH.APPLICATIONS_SECOND_X,
        icon: <GlobeIcon className="w-4 h-4" />
      }
    ]
  }
];
