import 'react-native';

import React, { ReactElement } from 'react';
import { RenderResult, act, fireEvent, render } from '@testing-library/react-native';
import { createTestElement, createTestProps } from '../../../../test/testUtils';

import Screen from '../ChannelCreate';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let props: any;
let component: ReactElement;
let testingLib: RenderResult;

describe('Rendering', () => {
  beforeEach(() => {
    props = createTestProps();
    component = createTestElement(<Screen {...props} />);
    testingLib = render(component);
  });

  it('renders without crashing', () => {
    const { baseElement } = testingLib;
    expect(baseElement).toMatchSnapshot();
    expect(baseElement).toBeTruthy();
  });
});

describe('Interaction', () => {
  beforeEach(() => {
    props = createTestProps();
    component = createTestElement(<Screen {...props} />);
    testingLib = render(component);
  });

  it('should change search text', () => {
    const searchInput = testingLib.getByTestId('text-input');
    act(() => {
      fireEvent.changeText(searchInput, 'test search');
    });
    expect(searchInput.props.value).toEqual('test search');
  });
});
