import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modalbox';
import { User } from '../../types';
import { getString } from '../../../STRINGS';
import styled from 'styled-components/native';
import { useFriendContext } from '../../providers/FriendProvider';
import { useThemeContext } from '@dooboo-ui/native-theme';

const StyledView = styled.View`
  margin-top: 40px;
`;
const StyledImage = styled.Image`
  width: 80px;
  height: 80px;
`;

const StyledViewBtns = styled.View`
  height: 48px;
  align-self: stretch;
  background-color: ${({ theme }): string => theme.modalBtnBackground};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledViewBtnDivider = styled.View`
  width: 0.5px;
  height: 48px;
  background-color: ${({ theme }): string => theme.placeholder};
`;

const StyledTextDisplayName = styled.Text`
  font-size: 24px;
  color: white;
  font-weight: bold;
  margin-top: 16px;
  align-self: center;
`;

const StyledTextStatusMsg = styled.Text`
  font-size: 12px;
  color: white;
  margin-top: 8px;
  align-self: center;
`;

const StyledTextBtn = styled.Text`
  color: ${({ theme }): string => theme.modalBtnFont};
  font-size: 16px;
`;

const StyledTextFriendAdded = styled.Text`
  color: ${({ theme }): string => theme.tintColor};
  font-size: 12px;
  background-color: ${({ theme }): string => theme.background};
  padding: 4px;
`;

const StyledTextFriendAlreadyAdded = styled.Text`
  color: red;
  font-size: 12px;
  background-color: ${({ theme }): string => theme.background};
  padding: 4px;
`;

interface Props {
  testID?: string;
  ref?: React.MutableRefObject<Modal | null>;
  onChatPressed?: () => void;
}

interface Ref {
  open: () => void;
  close: () => void;
  setUser: (user: User) => void;
  showAddBtn: (show: boolean) => void;
  setIsFriendAdded: (isFriendAdded: boolean) => void;
  setIsFriendAlreadyAdded: (isFriendAlreadyAdded: boolean) => void;
  setOnDeleteFriend: (callback?: () => void) => void;
  setOnAddFriend: (callback?: () => void) => void;
}

interface Styles {
  wrapper: ViewStyle;
  viewBtn: ViewStyle;
}

const styles: Styles = {
  wrapper: {
    backgroundColor: 'transparent',
    alignSelf: 'stretch',
    height: 320,
    width: '90%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBtn: {
    width: '50%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const Shared = forwardRef<Ref, Props>((props, ref) => {
  let modal: Modal | null;
  const [showAddBtn, setShowAddBtn] = useState(true);
  const [isFriendAdded, setIsFriendAdded] = useState(false);
  const [isFriendAlreadyAdded, setIsFriendAlreadyAdded] = useState(false);
  const [user, setUser] = useState<User>({
    displayName: '',
    uid: '',
    thumbURL: '',
    photoURL: '',
    statusMsg: '',
    online: false,
  });
  const [onDeleteFriend, setOnDeleteFriend] = useState();
  const [onAddFriend, setOnAddFriend] = useState();

  const {
    friendState: { friends },
    addFriend: ctxAddFriend,
    deleteFriend: ctxDeleteFriend,
  } = useFriendContext();

  const open = (): void => {
    setIsFriendAdded(false);
    if (modal) {
      modal.open();
    }
  };

  const close = (): void => {
    if (modal) {
      modal.close();
    }
  };

  const addFriend = (): void => {
    ctxAddFriend(user);
    if (onAddFriend) {
      onAddFriend();
    }
  };

  const deleteFriend = (): void => {
    ctxDeleteFriend(user);
    if (onDeleteFriend) {
      onDeleteFriend();
    }
  };

  useImperativeHandle(ref, () => ({
    open,
    close,
    setUser,
    showAddBtn: (flag: boolean): void => {
      setShowAddBtn(flag);
    },
    setIsFriendAdded,
    setIsFriendAlreadyAdded,
    setOnDeleteFriend,
    setOnAddFriend,
  }));
  const { photoURL, displayName, statusMsg } = user;
  const {
    theme: { primary, primaryLight, modalBtnPrimaryFont },
  } = useThemeContext();
  const imageURL = typeof photoURL === 'string' ? { uri: photoURL } : photoURL;
  return (
    <Modal
      ref={(v): Modal | null => (modal = v)}
      backdropOpacity={0.075}
      entry={'top'}
      position={'center'}
      style={styles.wrapper}
    >
      <View
        style={{
          height: 300,
          marginHorizontal: 20,
          alignSelf: 'stretch',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: primary,
        }}
      >
        <StyledView>
          <TouchableOpacity
            activeOpacity={0.5}
          // onPress={goToProfile}
          >
            {photoURL ? (
              <StyledImage style={{ alignSelf: 'center' }} source={imageURL} />
            ) : (
              <View
                style={{
                  width: 80,
                  height: 80,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="ios-person" size={80} color="white" />
              </View>
            )}
          </TouchableOpacity>
          <StyledTextDisplayName>{displayName}</StyledTextDisplayName>
          <StyledTextStatusMsg>{statusMsg}</StyledTextStatusMsg>
        </StyledView>
        {isFriendAdded ? (
          <StyledTextFriendAdded testID="added-message">
            {getString('FRIEND_ADDED')}
          </StyledTextFriendAdded>
        ) : isFriendAlreadyAdded ? (
          <StyledTextFriendAlreadyAdded testID="already-added-message">
            {getString('FRIEND_ALREADY_ADDED')}
          </StyledTextFriendAlreadyAdded>
        ) : null}
        <StyledViewBtns>
          <TouchableOpacity
            testID="btn-ad-friend"
            activeOpacity={0.5}
            onPress={showAddBtn ? addFriend : deleteFriend}
            style={styles.viewBtn}
          >
            <View style={styles.viewBtn}>
              <StyledTextBtn testID="btn-ad-title">
                {showAddBtn
                  ? getString('ADD_FRIEND')
                  : getString('DELETE_FRIEND')}
              </StyledTextBtn>
            </View>
          </TouchableOpacity>
          <StyledViewBtnDivider />
          <TouchableOpacity
            testID="btn-chat"
            activeOpacity={0.5}
            onPress={props.onChatPressed}
            style={styles.viewBtn}
          >
            <View style={styles.viewBtn}>
              <StyledTextBtn style={{
                color: modalBtnPrimaryFont,
              }}>{getString('CHAT')}</StyledTextBtn>
            </View>
          </TouchableOpacity>
        </StyledViewBtns>
      </View>
    </Modal>
  );
});

export default Shared;
