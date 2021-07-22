import {Button, DoobooTheme, useTheme} from 'dooboo-ui';
import {Platform, SectionList, SectionListData} from 'react-native';
import React, {FC, ReactElement} from 'react';
import {SvgApple, SvgFacebook, SvgGoogle} from '../../utils/Icons';
import {UseMutationConfig, useMutation} from 'react-relay';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesome} from '@expo/vector-icons';
import {MainStackNavigationProps} from '../navigations/MainStackNavigator';
import type {NotificationDeleteNotificationMutation} from '../../__generated__/NotificationDeleteNotificationMutation.graphql';
import {deleteNotification} from '../../relay/queries/Notification';
import {getString} from '../../../STRINGS';
import styled from '@emotion/native';
import {useAuthContext} from '../../providers/AuthProvider';
import {useNavigation} from '@react-navigation/core';

const Container = styled.SafeAreaView`
  flex: 1;
  padding-top: 10px;
  background-color: ${({theme}) => theme.background};
`;

const HeaderContainer = styled.View`
  background-color: ${({theme}) => theme.background};
  border-bottom-color: ${({theme}) => theme.lineColor};
  height: 40px;
  justify-content: center;
  margin-left: 12px;
  border-bottom-width: 1px;
`;

const SectionHeader = styled.Text`
  color: ${({theme}) => theme.textSecondaryColor};
  margin-left: 2px;
`;

const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  padding-left: 15px;
  padding-right: 15px;
  width: 100%;
  height: 52px;
  align-items: center;
`;

const ItemLabel = styled.Text`
  color: ${({theme}) => theme.text};
  font-size: 16px;
  flex: 1;
`;

interface SettingsOption {
  label: string;
  icon?: ReactElement;
  onPress(): void;
  testID: string;
}

const Settings: FC = () => {
  let signInInfoOption: SettingsOption;

  const {user, signOutAsync} = useAuthContext();
  const {theme} = useTheme();

  const navigation = useNavigation<MainStackNavigationProps<'Settings'>>();

  const [commitNotification] =
    useMutation<NotificationDeleteNotificationMutation>(deleteNotification);

  const renderSectionItem = (
    option: SettingsOption,
    themeProps: DoobooTheme,
  ): React.ReactElement => {
    const isEmailUser = (user?.profile?.authType || 'email') === 'email';

    return (
      <ItemContainer
        onPress={isEmailUser ? option.onPress : undefined}
        testID={option.testID}>
        {option.icon || null}
        <ItemLabel style={{marginLeft: 8, marginTop: 2}}>
          {option.label}
        </ItemLabel>
        {isEmailUser ? (
          <FontAwesome name="angle-right" size={24} color={themeProps.text} />
        ) : null}
      </ItemContainer>
    );
  };

  const logout = async (): Promise<void> => {
    if (navigation) {
      if (Platform.OS === 'web') history.go(0);

      AsyncStorage.removeItem('token');

      const pushToken = await AsyncStorage.getItem('push_token');

      if (pushToken) {
        const deleteNotificationMutationConfig: UseMutationConfig<NotificationDeleteNotificationMutation> =
          {
            variables: {
              token: pushToken,
            },
          };

        commitNotification(deleteNotificationMutationConfig);
      }

      signOutAsync();
    }
  };

  switch (user?.profile?.authType) {
    case 'google':
      signInInfoOption = {
        icon: <SvgGoogle width={24} fill={theme.text} />,
        label: getString('SIGNED_IN_WITH_GOOGLE'),
        onPress: (): void => {
          navigation.navigate('ChangePw');
        },
        testID: 'change-pw-item',
      };

      break;
    case 'facebook':
      signInInfoOption = {
        icon: <SvgFacebook width={24} fill={theme.text} />,
        label: getString('SIGNED_IN_WITH_FACEBOOK'),
        onPress: () => {
          navigation.navigate('ChangePw');
        },
        testID: 'change-pw-item',
      };

      break;
    case 'apple':
      signInInfoOption = {
        icon: <SvgApple width={24} fill={theme.text} />,
        label: getString('SIGNED_IN_WITH_APPLE'),
        onPress: () => {
          navigation.navigate('ChangePw');
        },
        testID: 'change-pw-item',
      };

      break;
    case 'email':
    default:
      signInInfoOption = {
        label: getString('SIGNED_IN_WITH_EMAIL'),
        onPress: () => {
          navigation.navigate('ChangePw');
        },
        testID: 'change-pw-item',
      };

      break;
  }

  const settings: SectionListData<SettingsOption>[] = [
    {
      title: getString('LOGIN_INFORMATION'),
      data: [signInInfoOption],
    },
  ];

  return (
    <Container>
      <SectionList
        testID="test-section-list"
        sections={settings}
        renderItem={({item}): React.ReactElement =>
          renderSectionItem(item, theme)
        }
        keyExtractor={(item: SettingsOption): string => item.label}
        renderSectionHeader={({section: {title}}): React.ReactElement => (
          <HeaderContainer>
            <SectionHeader>{title}</SectionHeader>
          </HeaderContainer>
        )}
      />
      <Button
        testID="button-logout"
        style={{
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}
        styles={{
          container: {
            width: '100%',
            height: 48,
            backgroundColor: theme.btnPrimaryLight,
            borderColor: theme.btnPrimary,
            borderWidth: 0.3,
          },
          text: {
            color: theme.btnPrimary,
            fontSize: 14,
            fontWeight: 'bold',
          },
        }}
        onPress={logout}
        text={getString('LOGOUT')}
      />
    </Container>
  );
};

export default Settings;
