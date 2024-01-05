import { Pressable, PressableProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  interpolateColor,
} from "react-native-reanimated";

const PressableAnimated = Animated.createAnimatedComponent(Pressable);

import { THEME } from "../../styles/theme";
import { styles } from "./styles";
import { useEffect } from "react";

const TYPE_COLORS = {
  EASY: THEME.COLORS.BRAND_LIGHT,
  HARD: THEME.COLORS.DANGER_LIGHT,
  MEDIUM: THEME.COLORS.WARNING_LIGHT,
};

type Props = PressableProps & {
  title: string;
  isChecked?: boolean;
  type?: keyof typeof TYPE_COLORS;
};

export function Level({
  title,
  type = "EASY",
  isChecked = false,
  ...rest
}: Props) {
  const COLOR = TYPE_COLORS[type];
  const scale = useSharedValue(1);
  const checked = useSharedValue(1);
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: interpolateColor(
        checked.value,
        [0, 1],
        ["rgba(0,0,0,0)", COLOR]
      ),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        checked.value,
        [0, 1],
        [COLOR, THEME.COLORS.GREY_100]
      ),
    };
  });

  function onPressIn() {
    // quando estiver precionado
    scale.value = withTiming(1.1);
  }

  function onPressOut() {
    // quando soltar
    scale.value = withTiming(1);
  }

  useEffect(() => {
    checked.value = withTiming(isChecked ? 1 : 0);
  }, [isChecked]);

  return (
    <PressableAnimated
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      {...rest}
      style={[
        styles.container,
        animatedContainerStyle,
        {
          borderColor: COLOR,
        },
      ]}
    >
      <Animated.Text style={[styles.title, animatedTextStyle]}>
        {title}
      </Animated.Text>
    </PressableAnimated>
  );
}
